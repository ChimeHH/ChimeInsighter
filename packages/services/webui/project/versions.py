from uuid import uuid1
from flask import request
from pprint import pprint
import pathlib
import json

from exlib.utils import hashex

from marshmallow import Schema, fields, validate, ValidationError
from flask_jwt_extended import (jwt_required, get_current_user)

from exlib.settings import osenv
from exlib.utils import filesystem,filesystemex
from exlib.http.http_webargs_ex import GeneralMetaSchema, NullableString, NullableNested, NullableList, NullableInt, NullableBool, Json, ISODateTime
from exlib.http.http_server_api_ex import *
from database.core import errors

from database.core.mongo_db import mongo_client
from database.master_database import TableUsers,TableProjects,ScanOptions,ScanTypes,ScanModes,TableVersions
from database.findings_database import TableFiles,TablePackages,TableThreats
from database.compliance_database import TableComplianceLicenses

from amq.general import AmqQueue
from services.core.message import AstRequest
from services.core.cvss_calc import calculate_security_scores
from services.webui.interfaces.application_api import ApplicationAPIDefinition
from services.webui.core.general_api_service import GeneralAPIService
from services.webui.core.data_manager import DataManager

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

def _zeroday_format(metadata):
    from services.iast.zeroday.exploits.vulnerabilities.zeroday_vulnerability import ZerodayVulnerability

    return ZerodayVulnerability.format(metadata)

def _zeroday_addr2line(filepath):
    from services.iast.symbol.resolver import Addr2line

    return Addr2line(str(filepath))

    

class VersionNotFound(Exception):
    pass

class VersionsService(GeneralAPIService):
    SCAN_VERSION = type('SCAN_VERSION', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.ScanVersion.Params.PROJECT_ID: fields.Str(allow_none=True, missing=None),
        ApplicationAPIDefinition.ScanVersion.Params.VERSION_ID: fields.Str(allow_none=True, missing=None),
        ApplicationAPIDefinition.ScanVersion.Params.VERSION_NAME: fields.Str(allow_none=True, missing=None),
        ApplicationAPIDefinition.ScanVersion.Params.VERSION_DATE: ISODateTime(missing=None, deserialize=date_deserialization),
        ApplicationAPIDefinition.ScanVersion.Params.DESCRIPTION: NullableString(allow_none=True, missing=None),
        ApplicationAPIDefinition.ScanVersion.Params.CUSTOMERIZED_DATA: Json(missing=None),
        ApplicationAPIDefinition.ScanVersion.Params.PRIORITY: fields.Integer(missing=1, validate=validate.Range(min=0, max=2, error="priority must be 0 high, 1 middle, 2 low.")),
        ApplicationAPIDefinition.ScanVersion.Params.STRATEGY: NullableString(allow_none=True, missing='fast'),
        ApplicationAPIDefinition.ScanVersion.Params.ALLOW_CACHE: fields.Bool(missing=True),
        ApplicationAPIDefinition.ScanVersion.Params.ALLOW_BLACKLIST: fields.Bool(missing=True),
        ApplicationAPIDefinition.ScanVersion.Params.AUTO_CLEANUP: fields.Bool(missing=False),
        ApplicationAPIDefinition.ScanVersion.Params.EXTRACTED_PATH: NullableString(allow_none=True, missing=None),
    })

    UPDATE_VERSION = type('UPDATE_VERSION', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.UpdateVersion.Params.VERSION_ID: fields.Str(required=True),
        ApplicationAPIDefinition.UpdateVersion.Params.UPDATES: fields.Nested(type('UPDATE_VERSION_UPDATES', (GeneralMetaSchema, Schema), {
            ApplicationAPIDefinition.UpdateVersion.Params.Updates.VERSION_NAME: NullableString(allow_none=False),
            ApplicationAPIDefinition.UpdateVersion.Params.Updates.DESCRIPTION: NullableString(allow_none=True),
            ApplicationAPIDefinition.UpdateVersion.Params.Updates.VERSION_DATE: ISODateTime(allow_none=False),
        }))})

    CANCEL_VERSIONS = type('CANCEL_VERSIONS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.CancelVersions.Params.VERSION_IDS: fields.List(fields.Str(), required=True)
        })

    GET_VERSIONS = type('GET_VERSIONS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetVersions.Params.PROJECT_ID: fields.Str(required=True),
        ApplicationAPIDefinition.GetVersions.Params.VERSION_NAMES: fields.List(fields.Str(), missing=None),
    })

    GET_VERSION_SUMMARY = type('GET_VERSION_SUMMARY', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetVersionSummary.Params.VERSION_ID: fields.Str(required=True),
    })

    GET_VERSION_STATS = type('GET_VERSION_STATS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetVersionStats.Params.VERSION_ID: fields.Str(required=True),
        ApplicationAPIDefinition.GetVersionThreats.Params.FILTERS: fields.List(fields.Nested(type('THREAT_FILTER', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetVersionThreats.Params.Filters.THREAT_TYPE: fields.Str(required=True),
        ApplicationAPIDefinition.GetVersionThreats.Params.Filters.THREAT_SUBTYPES: fields.List(fields.Str(), missing=None),
        }), missing=None)),
    })

    GET_VERSION_THREATS = type('GET_VERSION_THREATS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetVersionThreats.Params.VERSION_ID: fields.Str(required=True),
        ApplicationAPIDefinition.GetVersionThreats.Params.FILTERS: fields.List(fields.Nested(type('THREAT_FILTER', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetVersionThreats.Params.Filters.THREAT_TYPE: fields.Str(required=True),
        ApplicationAPIDefinition.GetVersionThreats.Params.Filters.THREAT_SUBTYPES: fields.List(fields.Str(), missing=None),
        }), missing=None)),
    })

    GET_THREAT_DETAIL = type('GET_THREAT_DETAIL', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetThreatDetail.Params.THREAT_ID: fields.Str(),
    })

    GET_PACKAGE_DETAIL = type('GET_PACKAGE_DETAIL', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetPackageDetail.Params.UID: fields.Str(),
    })

    GET_FILE_DETAIL = type('GET_FILE_DETAIL', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetFileDetail.Params.UID: fields.Str(),
    })

    GET_VERSION_LICENSES = type('GET_VERSION_LICENSES', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetVersionLicenses.Params.VERSION_ID: fields.Str(required=True)
    })

    GET_VERSION_PACKAGES = type('GET_VERSION_PACKAGES', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetVersionPackages.Params.VERSION_ID: fields.Str(required=True),
    })

    GET_VERSION_FILES = type('GET_VERSION_FILES', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetVersionFiles.Params.VERSION_ID: fields.Str(required=True),
        ApplicationAPIDefinition.GetVersionFiles.Params.FILE_TYPES: fields.List(fields.Str(), missing=None)
    })

    GET_VERSION_INTERFACES = type('GET_VERSION_INTERFACES', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetVersionInterfaces.Params.VERSION_ID: fields.Str(required=True),
        ApplicationAPIDefinition.GetVersionInterfaces.Params.INTERFACE_IDS: fields.List(fields.Str(), missing=None)
    })

    REMOVE_VERSIONS = type('REMOVE_VERSIONS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.RemoveVersions.Params.VERSION_IDS: fields.List(fields.Str(), required=True)
    })

    ADD_SYMBOLS = type('ADD_SYMBOLS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.AddSymbols.Params.THREAT_ID: fields.Str(location='form', required=True),
    })

    UPDATE_THREAT_STATUS = type('UPDATE_THREAT_STATUS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.UpdateThreatStatus.Params.THREAT_ID: fields.Str(location='form', required=True),
        ApplicationAPIDefinition.UpdateThreatStatus.Params.WORK_STATUS: fields.Str(location='form', required=True)
    })

    UPDATE_THREATS_STATUS = type('UPDATE_THREATS_STATUS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.UpdateThreatsStatus.Params.THREATS: fields.List(fields.Nested(UPDATE_THREAT_STATUS), required=True),
    })

    def init_apis(self):
        self.engine.app.add_url_rule(ApplicationAPIDefinition.ScanVersion.URI,
                              ApplicationAPIDefinition.ScanVersion.NAME,
                              view_func=self.api_scan_version,
                              methods=[ApplicationAPIDefinition.ScanVersion.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.UpdateVersion.URI,
                              ApplicationAPIDefinition.UpdateVersion.NAME,
                              view_func=self.api_update_version,
                              methods=[ApplicationAPIDefinition.UpdateVersion.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.CancelVersions.URI,
                              ApplicationAPIDefinition.CancelVersions.NAME,
                              view_func=self.api_cancel_versions,
                              methods=[ApplicationAPIDefinition.CancelVersions.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetVersions.URI,
                              ApplicationAPIDefinition.GetVersions.NAME,
                              view_func=self.api_get_versions,
                              methods=[ApplicationAPIDefinition.GetVersions.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetVersionSummary.URI,
                              ApplicationAPIDefinition.GetVersionSummary.NAME,
                              view_func=self.api_get_version_summary,
                              methods=[ApplicationAPIDefinition.GetVersionSummary.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetVersionStats.URI,
                              ApplicationAPIDefinition.GetVersionStats.NAME,
                              view_func=self.api_get_version_stats,
                              methods=[ApplicationAPIDefinition.GetVersionStats.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetVersionThreats.URI,
                              ApplicationAPIDefinition.GetVersionThreats.NAME,
                              view_func=self.api_get_version_threats,
                              methods=[ApplicationAPIDefinition.GetVersionThreats.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetThreatDetail.URI,
                              ApplicationAPIDefinition.GetThreatDetail.NAME,
                              view_func=self.api_get_threat_detail,
                              methods=[ApplicationAPIDefinition.GetThreatDetail.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetPackageDetail.URI,
                              ApplicationAPIDefinition.GetPackageDetail.NAME,
                              view_func=self.api_get_package_detail,
                              methods=[ApplicationAPIDefinition.GetPackageDetail.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetFileDetail.URI,
                              ApplicationAPIDefinition.GetFileDetail.NAME,
                              view_func=self.api_get_file_detail,
                              methods=[ApplicationAPIDefinition.GetFileDetail.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetVersionLicenses.URI,
                              ApplicationAPIDefinition.GetVersionLicenses.NAME,
                              view_func=self.api_get_version_licenses,
                              methods=[ApplicationAPIDefinition.GetVersionLicenses.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetVersionPackages.URI,
                              ApplicationAPIDefinition.GetVersionPackages.NAME,
                              view_func=self.api_get_version_packages,
                              methods=[ApplicationAPIDefinition.GetVersionPackages.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetVersionFiles.URI,
                              ApplicationAPIDefinition.GetVersionFiles.NAME,
                              view_func=self.api_get_version_files,
                              methods=[ApplicationAPIDefinition.GetVersionFiles.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetVersionInterfaces.URI,
                              ApplicationAPIDefinition.GetVersionInterfaces.NAME,
                              view_func=self.api_get_version_interfaces,
                              methods=[ApplicationAPIDefinition.GetVersionInterfaces.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.RemoveVersions.URI,
                              ApplicationAPIDefinition.RemoveVersions.NAME,
                              view_func=self.api_remove_versions,
                              methods=[ApplicationAPIDefinition.RemoveVersions.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.AddSymbols.URI,
                              ApplicationAPIDefinition.AddSymbols.NAME,
                              view_func=self.api_add_symbols,
                              methods=[ApplicationAPIDefinition.AddSymbols.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.UpdateThreatStatus.URI,
                              ApplicationAPIDefinition.UpdateThreatStatus.NAME,
                              view_func=self.api_update_threat_status,
                              methods=[ApplicationAPIDefinition.UpdateThreatStatus.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.UpdateThreatsStatus.URI,
                              ApplicationAPIDefinition.UpdateThreatsStatus.NAME,
                              view_func=self.api_update_threats_status,
                              methods=[ApplicationAPIDefinition.UpdateThreatsStatus.METHOD])

    @jwt_required()
    def api_scan_version(self):
        args = parse_webargs(self.SCAN_VERSION, request)

        current_user = get_current_user()

        errmsg = self.__validate__()
        if errmsg:
            return ErrorResponse(AuthenticationException(errmsg[0], errmsg[1])).generate_response()

        params = ApplicationAPIDefinition.ScanVersion.Params
        version_date = args.get(params.VERSION_DATE, None)
        description = args.get(params.DESCRIPTION, None)

        priority = args.get(params.PRIORITY, AmqQueue.M_PRI_Q)
        strategy = args.get(params.STRATEGY, 'fast').lower()
        allow_cache = args.get(params.ALLOW_CACHE, True)
        allow_blacklist = args.get(params.ALLOW_BLACKLIST, True)
        auto_cleanup = args.get(params.AUTO_CLEANUP, True)

        scan_modes = ScanModes(dict(priority=priority, strategy=strategy, allow_cache=allow_cache, allow_blacklist=allow_blacklist, auto_cleanup=auto_cleanup))
        customerized_data = args.get(params.CUSTOMERIZED_DATA, {})

        version_name = args.get(params.VERSION_NAME, None)
        extracted_path = args.get(params.EXTRACTED_PATH, None)        
        version_id = args.get(params.VERSION_ID, None)

        log.debug(f"start scanning {version_id}/{version_name}")

        try:
            with mongo_client() as client:
                tableUsers = TableUsers(client)
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)

                if not version_id:
                    project_id = args.get(params.PROJECT_ID, None) 
                    if not project_id:
                        log.debug(f"missing project id: {version_id}/{version_name}")
                        raise RequestParametersError({'project_id': 'missing project id'})

                    if not version_name:
                        log.debug(f"missing version_name: {version_id}/{version_name}")
                        raise RequestParametersError({'version_name': 'Invalid null version name'})

                    version_id = self.config.new_version()
                else:
                    version = tableVersions.getVersion(version_id)
                    if not version:
                        log.debug(f"version id not found: {version_id}/{version_name}")
                        raise RequestParametersError({'version_id': 'Invalid version id'})

                    project_id = version[tableVersions.PROJECT_ID]
                    scan_modes.rescan = True

                version_path  = self.config.version_path(project_id, version_id)                    
                version_path.parent.mkdir(parents=True, exist_ok=True) # note, here we shall create directory without "_" part, since bang will create it

                filepath = None            

                if extracted_path:
                    filepath = pathlib.Path(extracted_path)
                    if not filepath.exists():
                        log.debug(f"not existing extracted path {extracted_path}: {version_id}/{version_name}")
                        raise RequestParametersError({'path': 'Invalid extracted path'})
                else:
                    files = request.files
                    file_object = files.get(params.UPLOAD_FILE, None)                    
                    if file_object:
                        filepath = version_path.parent / file_object.filename
                        file_object.save(str(filepath))


                log.debug(f"input scan filepath: {filepath}")
                if not scan_modes.rescan:
                    if not filepath:
                        log.debug(f"not rescan, missing file: {version_id}/{version_name}")
                        raise RequestParametersError({'files': 'Invalid null file'})

                self.__assert_update__(tableProjects, project_id, current_user)

                project = tableProjects.getProject(project_id)

                if not scan_modes.rescan:
                    if not tableUsers.consumeBudget(current_user.username, filepath.stat().st_size/1024**2):
                        raise AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no more budgets to run scans')
                        
                    tableVersions.addVersion(current_user.username, project_id, version_id, version_name, filepath, 
                        version_date=version_date, description=description, customerized_data=customerized_data, scan_modes=scan_modes.to_dict())
                    
                version = tableVersions.getVersion(version_id)    
                if not version:
                    log.debug(f"query version table failed: {version_id}/{version_name}")
                    raise RequestParametersError({'version_id': 'version record not found'})

                if scan_modes.rescan:
                    if filepath:
                        tableVersions.updateVersion(version_id, filepath=filepath, tester=current_user.username, progress=self.om.vesion_idle_progress(), 
                            customerized_data=customerized_data, scan_modes=scan_modes.to_dict(), status=tableVersions.Status.CREATED)

                    else:
                        # only when the previous bang ouputs are available
                        if (version_path / "aggregate.pkl").exists():
                            scan_modes.revise = True
                        else:
                            log.debug(f"no previous extracted files: {version_id}/{version_name}")

                        filepath = pathlib.Path(version[TableVersions.FILEPATH])                    
                        if not filepath.exists():
                            log.debug(f"no file available: {version_id}/{version_name}")
                            raise RequestParametersError({'path': f'Invalid rescan request, {filepath} not exist'})

                        tableVersions.updateVersion(version_id, tester=current_user.username, progress=self.om.vesion_idle_progress(), 
                            customerized_data=customerized_data, scan_modes=scan_modes.to_dict(), status=tableVersions.Status.CREATED)

                    # rescan must also consume budget
                    if not tableUsers.consumeBudget(current_user.username, filepath.stat().st_size/1024**2):
                        raise AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no more budgets to run scans')

                checksum = hashex.sha1sum_file(filepath)      
                sastmsg = AstRequest(self.engine.whoami, AstRequest.UI.scan, version_id=version_id, filepath=filepath, checksum=checksum)
                self.publish_request(sastmsg, priority=scan_modes.priority)

                return SuccessResponse({"version_id": version_id, "scan_modes": scan_modes.to_dict()}).generate_response()

        except errors.VersionNotFound:
            log.exception(f"version not found: {version_id}/{version_name}")
            raise RequestParametersError(self.ErrorCodes.VERSION_NOT_FOUND, 'version id not found')

        except AuthenticationException:
            raise

        except Exception as e:
            log.exception(f"unexpected exception: {version_id}/{version_name}")
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {version_id}, reason: {str(e)}')

    @jwt_required()
    def api_update_version(self):
        args = parse_webargs(self.UPDATE_VERSION, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.UpdateVersion.Params
        version_id = args[params.VERSION_ID]

        updates = args.get(params.UPDATES, {})
        version_name = updates.get(params.Updates.VERSION_NAME, None)
        version_date = updates.get(params.Updates.VERSION_DATE, None)
        description = updates.get(params.Updates.DESCRIPTION, None)
        customerized_data = updates.get(params.Updates.CUSTOMERIZED_DATA, None)

        try:
            with mongo_client() as client:
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)

                version = tableVersions.getVersion(version_id)
                if not version:
                    raise RequestParametersError({'version_id': 'version record not found'})

                self.__assert_update__(tableProjects, version['project_id'], current_user)

                tableVersions.updateVersion(version_id, version_name=version_name, version_date=version_date, description=description, customerized_data=customerized_data)
                version = tableVersions.getVersion(version_id)

                return SuccessResponse({"version": version}).generate_response()

        except AuthenticationException:
            raise

        except errors.VersionNotFound:
            raise RequestParametersError(self.ErrorCodes.VERSION_NOT_FOUND, 'version id not found')

        except Exception as e:
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {version_id}, reason: {str(e)}')

    @jwt_required()
    def api_cancel_versions(self):
        args = parse_webargs(self.CANCEL_VERSIONS, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.CancelVersions.Params
        version_ids = args[params.VERSION_IDS]

        try:
            with mongo_client() as client:
                for version_id in version_ids:
                    version = tableVersions.getVersion(version_id)
                    if version:
                        self.__assert_update__(tableProjects, version['project_id'], current_user)

                    self.om.delete_version(version_id)                
                    TableVersions(client).updateVersion(version_id, finish_time=datetime.utcnow(), status=TableVersions.Status.CANCELLED)

            return SuccessResponse({"result": version_ids}).generate_response()
        except AuthenticationException:
            raise
            
        except errors.VersionNotFound:
            raise RequestParametersError(self.ErrorCodes.VERSION_NOT_FOUND, 'version id not found')

        except Exception as e:
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {version_id}, reason: {str(e)}')

    def _get_version_scores(self, client, version_id):
        tableFiles = TableFiles(client)
        tableThreats = TableThreats(client)

        file_list = {}
                    
        files = tableFiles.getVersionFiles(version_id)
        for file in files:
            checksum = file[TableFiles.CHECKSUM]
            filetype = file[TableFiles.FILETYPE]                        
            filesize = file[TableFiles.SIZE]

            if filetype not in ('javaclass', "shared", "executable", "relocatable", "octet-stream"):                             
                continue

            file_list[checksum] = {'size': filesize, 'type': filetype, 'metrics': []}

        cves = tableThreats.getVersionThreats(version_id, TableThreats.ThreatTypes.PUBLIC, threat_subtypes=[TableThreats.PublicTypes.CVE,])
        for cve in cves:
            checksum = cve[TableThreats.CHECKSUM]
            metadata = cve[TableThreats.METADATA]
            if checksum in file_list:
                file_list[checksum]['metrics'].append(metadata.get('metrics', {}))

        weights = self.config.scores_weight
        cvss_weight = weights.get('cvss', 0.5)
        exploitability_weight = weights.get('exploit', 0.25)
        impact_weight = weights.get('impact', 0.25)

        cvss_weight = cvss_weight / (cvss_weight + exploitability_weight + impact_weight)
        exploitability_weight = exploitability_weight / (cvss_weight + exploitability_weight + impact_weight)
        impact_weight = impact_weight / (cvss_weight + exploitability_weight + impact_weight)

        return calculate_security_scores(file_list, cvss_weight=cvss_weight, exploitability_weight=exploitability_weight, impact_weight=impact_weight)

    @jwt_required()
    def api_get_versions(self):
        args = parse_webargs(self.GET_VERSIONS, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.GetVersions.Params
        project_id = args[params.PROJECT_ID]
        version_names = args[params.VERSION_NAMES] or []


        try:
            with mongo_client() as client:
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)                

                self.__assert_view__(tableProjects, project_id, current_user)
                
                versions = tableVersions.findVersions(*version_names, project_id=project_id)
                for version in versions:
                    version_id = version[tableVersions.VERSION_ID]
                    progress = version.get(tableVersions.PROGRESS, {})
                    finish_time = version.get(tableVersions.FINISH_TIME, None)

                    status = version.get(tableVersions.STATUS, None)
                    queued = progress.get("queued") or 0
                    
                    if not finish_time and self.__assert_update__(tableProjects, project_id, current_user, raise_exception=False):
                        if status in (tableVersions.Status.CANCELLED, tableVersions.Status.COMPLETED):                            
                            version[tableVersions.FINISH_TIME] = datetime.utcnow()
                            tableVersions.updateVersion(version_id, finish_time=version[tableVersions.FINISH_TIME])
                             
                        elif queued > 0 and self.om.is_finalize_version(version_id):
                            version[tableVersions.FINISH_TIME] = datetime.utcnow()
                            version[tableVersions.STATUS] = tableVersions.Status.COMPLETED
                            
                            tableVersions.updateVersion(version_id, finish_time=version[tableVersions.FINISH_TIME], status=version[tableVersions.STATUS])

                    if self.__assert_update__(tableProjects, project_id, current_user, raise_exception=False):
                        progress2 = self.om.get_version_progress(version_id)                        
                        if progress2 and progress.get('percent', 0) < progress2.get('percent', 0):
                            tableVersions.updateVersion(version_id, progress=progress2)                        
                            version[tableVersions.PROGRESS] = progress2
                
                return SuccessResponse({"versions": versions}).generate_response()

        except AuthenticationException:
            raise
            
        except errors.ProjectNotFound:
            raise RequestParametersError(self.ErrorCodes.PROJECT_NOT_FOUND, 'project id not found')

        except Exception as e:
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {project_id}/{version_names}, reason: {str(e)}')

    

    @jwt_required()
    def api_get_version_summary(self):
        args = parse_webargs(self.GET_VERSION_SUMMARY, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.GetVersionSummary.Params
        version_id = args[params.VERSION_ID]

        try:
            with mongo_client() as client:
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)
                                                
                version = tableVersions.getVersion(version_id)
                if not version:
                    raise RequestParametersError({'version_id': 'version record not found'})

                scores = version.get(tableVersions.SCORES) or {}
                if not scores:
                    scores = self._get_version_scores(client, version_id) 
                    tableVersions.updateVersion(version_id, scores=scores)

                self.__assert_view__(tableProjects, version['project_id'], current_user)

                project = tableProjects.getProject(version['project_id'])

                stats = DataManager(client).get_version_stats(version_id)
                
                return SuccessResponse({"project": project, "version": version, 'scores': scores, 
                                    "threats": stats.get('threats', {}), "packages": stats.get('packages', {}), 
                                    "files": stats.get('files', {}), "licenses": stats.get('licenses', {}),}).generate_response()

        except AuthenticationException:
            raise
            
        except errors.VersionNotFound:
            log.exception(f"get version {version_id} summary failed")
            raise RequestParametersError(self.ErrorCodes.VERSION_NOT_FOUND, 'version id not found')

        except Exception as e:
            log.exception(f"get version {version_id} summary failed")
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {version_id}, reason: {str(e)}')

    @jwt_required()
    def api_get_version_stats(self):
        args = parse_webargs(self.GET_VERSION_THREATS, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.GetVersionThreats.Params
        version_id = args[params.VERSION_ID]
        threat_filters = args[params.FILTERS]
        
        try:
            with mongo_client() as client:
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)
                tableThreats = TableThreats(client)

                version = tableVersions.getVersion(version_id)
                if not version:
                    raise RequestParametersError({'version_id': 'version record not found'})

                self.__assert_view__(tableProjects, version['project_id'], current_user)

                project = tableProjects.getProject(version['project_id'])

                if not threat_filters:
                    threats = tableThreats.getVersionThreats(version_id)
                else:
                    threats = []

                    for ft in threat_filters:
                        threat_type = ft.get('threat_type')
                        threat_subtypes = ft.get('threat_subtypes', [])
                        threats += tableThreats.getVersionThreats(version_id, threat_type, threat_subtypes=threat_subtypes)

                stats = tableThreats.getThreatsStats(threats)

                return SuccessResponse({"threats": stats, "project": project, "version": version, "warning": "This API has been deprecated, and replaced by /summary method; please do not use it in your design."}).generate_response()

        except AuthenticationException:
            raise
            
        except errors.VersionNotFound:
            raise RequestParametersError(self.ErrorCodes.VERSION_NOT_FOUND, 'version id not found')

        except Exception as e:
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {version_id}/{threat_types}/{threat_subtypes}, reason: {str(e)}')

    @jwt_required()
    def api_get_version_threats(self):
        args = parse_webargs(self.GET_VERSION_THREATS, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.GetVersionThreats.Params
        version_id = args[params.VERSION_ID]
        threat_filters = args[params.FILTERS]

        try:
            with mongo_client() as client:
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)
                tableThreats = TableThreats(client)
                tableFiles = TableFiles(client)

                version = tableVersions.getVersion(version_id)
                if not version:
                    raise RequestParametersError({'version_id': 'version record not found'})

                self.__assert_view__(tableProjects, version['project_id'], current_user)

                project = tableProjects.getProject(version['project_id'])
                
                files = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
                files = { r['checksum']: r['filepath_r'] for r in files }

                if not threat_filters:
                    threats = tableThreats.getVersionThreats(version_id)
                else:
                    threats = []

                    for ft in threat_filters:
                        threat_type = ft.get('threat_type')
                        threat_subtypes = ft.get('threat_subtypes', [])
                        threats += tableThreats.getVersionThreats(version_id, threat_type, threat_subtypes=threat_subtypes)

                for threat in threats:
                    threat['filepath'] = files.get(threat[TableThreats.CHECKSUM], [])
                    threat['threat_id'] = threat.pop(TableThreats.UID)                    
                    threat['severity'] = threat.pop(TableThreats.SEVERITY, TableThreats.ThreatSeverities.NONE).lower()

                    if threat[TableThreats.THREAT_TYPE] == TableThreats.ThreatTypes.ZERODAY:
                        metadata = _zeroday_format(threat[TableThreats.METADATA])
                        rva = metadata.get('rva', None)
                        source = metadata.get('source', None)
                        if rva and source and rva in source:
                            if not metadata.get('function_name', None):
                                metadata['function_name'] = source[rva].get('func_name', '')
                            metadata['file_line'] = source[rva].get('file_line', '')
                            metadata['file_name'] = source[rva].get('file_path', '')

                        threat[TableThreats.METADATA] = metadata

                return SuccessResponse({"threats": threats, "project": project, "version": version, }).generate_response()

        except AuthenticationException:
            raise
            
        except errors.VersionNotFound:
            raise RequestParametersError({'version_id': 'version id not found'})

        except Exception as e:
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {version_id}/{threat_types}/{threat_subtypes}, reason: {str(e)}')

    @jwt_required()
    def api_get_threat_detail(self):
        args = parse_webargs(self.GET_THREAT_DETAIL, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.GetThreatDetail.Params
        threat_id = args[params.THREAT_ID]

        try:
            with mongo_client() as client:
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)
                tableThreats = TableThreats(client)
                tableFiles = TableFiles(client)

                threat = tableThreats.getThreat(threat_id)
                if threat:
                    threat['threat_id'] = threat.pop(TableThreats.UID)
                    threat['severity'] = threat.pop(TableThreats.SEVERITY, TableThreats.ThreatSeverities.NONE).lower()
                    checksum = threat[TableThreats.CHECKSUM]
                    version_id = threat[TableThreats.VERSION_ID]

                    version = tableVersions.getVersion(version_id)
                    if not version:
                        raise RequestParametersError({'version_id': 'version record not found'})

                    self.__assert_view__(tableProjects, version['project_id'], current_user)

                    project = tableProjects.getProject(version['project_id'])

                    if threat[TableThreats.THREAT_TYPE] == TableThreats.ThreatTypes.ZERODAY:
                        metadata = _zeroday_format(threat[TableThreats.METADATA])
                        rva = metadata.get('rva', None)
                        source = metadata.get('source', None)
                        if rva and source and rva in source:
                            if not metadata.get('function_name', None):
                                metadata['function_name'] = source[rva].get('func_name', '')
                            metadata['file_line'] = source[rva].get('file_line', '')
                            metadata['file_name'] = source[rva].get('file_path', '')

                        threat[TableThreats.METADATA] = metadata
                        
                    file = tableFiles.getVersionFile(version_id, checksum)
                    threat['filepath'] = file['filepath_r']

                    return SuccessResponse({"detail": threat, "project": project, "version": version, }).generate_response()

        except AuthenticationException:
            raise
            
        except errors.ThreatNotFound: 
            log.exception(f"threat not found: {threat_id}")
            raise RequestParametersError(self.ErrorCodes.THREAT_NOT_FOUND, 'threat id not found')

        except Exception as e:
            log.exception(f"failed to run the api, {threat_id}, reason: {str(e)}")
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {threat_id}, reason: {str(e)}')
    
    @jwt_required()
    def api_get_file_detail(self):
        args = parse_webargs(self.GET_FILE_DETAIL, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.GetFileDetail.Params
        uid = args[params.UID]

        try:
            with mongo_client() as client:
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)
                tableFiles = TableFiles(client)

                file = tableFiles.getFile(uid)
                if file:
                    version_id = file[TableFiles.VERSION_ID]

                    version = tableVersions.getVersion(version_id)
                    if not version:
                        raise RequestParametersError({'version_id': 'version record not found'})

                    self.__assert_view__(tableProjects, version['project_id'], current_user)

                    project = tableProjects.getProject(version['project_id'])

                    return SuccessResponse({"file": file, "project": project, "version": version, }).generate_response()

        except AuthenticationException:
            raise
            
        except errors.FileNotFound: 
            log.exception(f"file not found: {uid}")
            raise RequestParametersError(self.ErrorCodes.FILE_NOT_FOUND, 'file id not found')

        except Exception as e:
            log.exception(f"failed to run the api, {uid}, reason: {str(e)}")
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {uid}, reason: {str(e)}')

    @jwt_required()
    def api_get_package_detail(self):
        args = parse_webargs(self.GET_PACKAGE_DETAIL, request)        
        current_user = get_current_user()

        print(args)

        params = ApplicationAPIDefinition.GetPackageDetail.Params
        uid = args[params.UID]

        try:
            with mongo_client() as client:
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)
                tablePackages = TablePackages(client)
                tableFiles = TableFiles(client)
                tableLicenses = TableComplianceLicenses(client)                

                package = tablePackages.getPackage(uid)
                if package:
                    version_id = package[TablePackages.VERSION_ID]

                    version = tableVersions.getVersion(version_id)
                    if not version:
                        raise RequestParametersError({'version_id': 'version record not found'})

                    self.__assert_view__(tableProjects, version['project_id'], current_user)

                    project = tableProjects.getProject(version['project_id'])


                    fullname = package[TablePackages.FULLNAME]
                    version_name = package[TablePackages.VERSION]
                    
                    license_names = set()
                    copyrights = []
                    downloadurl = None
                    release_time = None

                    sr = package.get(TablePackages.SUMMARY, None) or {}
                    if sr:
                        tmp_licenses = sr.get(TablePackages.LICENSES) or []
                        for lic in tmp_licenses:
                            if isinstance(lic, str):
                                license_names.add(lic)
                            else:
                                license_names.add(lic['license'])
                                
                        copyrights = sr.get(TablePackages.COPYRIGHTS, [])
                        downloadurl = sr.get(TablePackages.DOWNLOADURL, None)
                        release_time = sr.get(TablePackages.RELEASE_TIME, None)

                    licenses = []
                    for name in license_names:                        
                        record = tableLicenses.findLicense(name)
                        if not record:
                            licenses.append(dict(license=name[:32], text=name))
                        else:
                            licenses.append(record.to_dict())


                    file = tableFiles.getVersionFile(version_id, package["checksum"])
                    filepath = file['filepath_r']

                    package.update(licenses=licenses, copyrights=copyrights, downloadurl=downloadurl, release_time=release_time, filepath=filepath)

                    return SuccessResponse({"package": package, "project": project, "version": version, }).generate_response()

        except AuthenticationException:
            raise
            
        except errors.PackageNotFound: 
            log.exception(f"package not found: {uid}")
            raise RequestParametersError(self.ErrorCodes.PACKAGE_NOT_FOUND, 'package id not found')

        except Exception as e:
            log.exception(f"failed to run the api, {uid}, reason: {str(e)}")
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {uid}, reason: {str(e)}')

    @jwt_required()
    def api_add_symbols(self):
        args = parse_webargs(self.ADD_SYMBOLS, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.AddSymbols.Params
        threat_id = args[params.THREAT_ID]
        try:
            with mongo_client() as client:
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)
                tableThreats = TableThreats(client)
                tableFiles = TableFiles(client)

                threat = tableThreats.getThreat(threat_id)
                if threat:     
                    checksum = threat[TableThreats.CHECKSUM]
                    version_id = threat[TableThreats.VERSION_ID]
            
                    version = tableVersions.getVersion(version_id)
                    if not version:
                        raise RequestParametersError({'version_id': 'version record not found'})

                    self.__assert_view__(tableProjects, version['project_id'], current_user)

                    project = tableProjects.getProject(version['project_id'])

                    files = request.files
                    file_object = files.get(params.UPLOAD_FILE, None)                    
                    if not file_object:
                        raise RequestParametersError({'upload_file': 'file not found'})
                    
                    filepath =  self.config.temp_root / file_object.filename
                    file_object.save(str(filepath))

                    metadata = _zeroday_format(threat[TableThreats.METADATA])

                    addr2line = _zeroday_addr2line(str(filepath))
                    source = metadata.get('source', {})

                    for addr, line in source.items():
                        file_path, file_line, func_name = addr2line.resolve_line(addr)

                        if file_line:
                            source[addr]['file_line'] = file_line
                        if func_name:
                            source[addr]['func_name'] = func_name
                        if file_path:
                            source[addr]['file_path'] = file_path
                    
                    rva = metadata.get('rva', None)
                    if rva and rva in source:
                        if not metadata.get('function_name', None):
                            metadata['function_name'] = source[rva].get('func_name', None)
                        metadata['file_line'] = file_line
                        metadata['file_name'] = file_path

                    threat[TableThreats.METADATA] = metadata
                    if self.__assert_update__(tableProjects, version['project_id'], current_user, raise_exception=False):
                        tableThreats.update(threat_id, metadata)

                    threat['threat_id'] = threat.pop(TableThreats.UID)
                    threat['severity'] = threat.pop(TableThreats.SEVERITY, TableThreats.ThreatSeverities.NONE).lower()
                    

                    file = tableFiles.getVersionFile(version_id, checksum)
                    threat['filepath'] = file['filepath_r']

                    return SuccessResponse({"detail": threat, "project": project, "version": version, }).generate_response()

        except AuthenticationException:
            raise
            
        except errors.ThreatNotFound: 
            log.exception(f"threat not found: {threat_id}")
            raise RequestParametersError(self.ErrorCodes.THREAT_NOT_FOUND, 'threat id not found')

        except Exception as e:
            log.exception(f"failed to add symbols, {threat_id}, reason: {str(e)}")
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run api_add_symbols, threat_id: {threat_id}, reason: {str(e)}')

    @jwt_required()
    def api_get_version_licenses(self):
        args = parse_webargs(self.GET_VERSION_LICENSES, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.GetVersionLicenses.Params
        version_id = args[params.VERSION_ID]

        try:
            with mongo_client() as client:
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)
                tablePackages = TablePackages(client)
                
                version = tableVersions.getVersion(version_id)
                if not version:
                    raise RequestParametersError({'version_id': 'version record not found'})

                self.__assert_view__(tableProjects, version['project_id'], current_user)

                project = tableProjects.getProject(version['project_id'])

                packages = []
                licenses_set = set()
                copyrights_set = set()
                for pr in tablePackages.getVersionPackages(version_id):
                    fullname = pr[TablePackages.FULLNAME]
                    version_name = pr[TablePackages.VERSION]

                    summary = pr.get(TablePackages.SUMMARY, None) or {}
                    
                    licenses = []
                    for lic in summary.get(TablePackages.LICENSES, []):
                        if isinstance(lic, str):
                            licenses.append(lic)
                        else:
                            licenses.append(lic['license'])
                    copyrights = summary.get(TablePackages.COPYRIGHTS, [])

                    licenses_set.update(licenses)
                    copyrights_set.update(copyrights)

                return SuccessResponse({"licenses": list(licenses_set), "copyrights": list(copyrights_set), "project": project, "version": version, }).generate_response()

        except AuthenticationException:
            raise
            
        except errors.VersionNotFound:
            log.error(f"version not found: {version_id}")
            raise RequestParametersError(self.ErrorCodes.VERSION_NOT_FOUND, 'version id not found')

        except Exception as e:
            log.exception(f"unexpected exception while handling version {version_id}")
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {version_id}, reason: {str(e)}')

    @jwt_required()
    def api_get_version_packages(self):
        args = parse_webargs(self.GET_VERSION_PACKAGES, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.GetVersionLicenses.Params
        version_id = args[params.VERSION_ID]

        try:
            with mongo_client() as client:
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)
                tablePackages = TablePackages(client)
                tableFiles = TableFiles(client)

                version = tableVersions.getVersion(version_id)
                if not version:
                    raise RequestParametersError({'version_id': 'version record not found'})

                self.__assert_view__(tableProjects, version['project_id'], current_user)

                project = tableProjects.getProject(version['project_id'])

                files = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
                files_dict = { r['checksum']: r['filepath_r'] for r in files }

                packages = []
                fullname_set = set()
                for pr in tablePackages.getVersionPackages(version_id):
                    fullname = pr[TablePackages.FULLNAME]
                    version_name = pr[TablePackages.VERSION]
                    
                    licenses = []
                    copyrights = []
                    downloadurl = None
                    release_time = None

                    sr = pr.get(TablePackages.SUMMARY, None) or {}
                    if sr:
                        tmp_licenses = sr.get(TablePackages.LICENSES, None) or []
                        for lic in tmp_licenses:
                            if isinstance(lic, str):
                                licenses.append(lic)
                            else:
                                licenses.append(lic['license'])
                                
                        copyrights = sr.get(TablePackages.COPYRIGHTS, [])
                        downloadurl = sr.get(TablePackages.DOWNLOADURL, None)
                        release_time = sr.get(TablePackages.RELEASE_TIME, None)

                    filepath = files_dict.get(pr[TablePackages.CHECKSUM], [])

                    packages.append({                        
                        TablePackages.UID: pr[TablePackages.UID],
                        TablePackages.CHECKSUM: pr[TablePackages.CHECKSUM], 
                        TablePackages.FULLNAME: fullname, 
                        TablePackages.VERSION: version_name, 
                        TablePackages.CLONE: pr.get(TablePackages.CLONE), 
                        TablePackages.SCALE: pr.get(TablePackages.SCALE),
                        TablePackages.INTEGRITY: pr.get(TablePackages.INTEGRITY), 

                        # summary items
                        TablePackages.LICENSES: licenses, 
                        TablePackages.COPYRIGHTS: copyrights, 
                        TablePackages.DOWNLOADURL: downloadurl,
                        TablePackages.RELEASE_TIME: release_time,

                        'filepath': filepath,
                    })

                return SuccessResponse({"packages": packages, "project": project, "version": version, }).generate_response()

        except AuthenticationException:
            raise
            
        except errors.VersionNotFound:
            log.error(f"version not found: {version_id}")
            raise RequestParametersError(self.ErrorCodes.VERSION_NOT_FOUND, 'version id not found')

        except Exception as e:
            log.exception(f"unexpected exception while handling version {version_id}")
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {version_id}, reason: {str(e)}')

    @jwt_required()
    def api_get_version_files(self):
        args = parse_webargs(self.GET_VERSION_FILES, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.GetVersionLicenses.Params
        version_id = args[params.VERSION_ID]

        try:
            with mongo_client() as client:
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client)
                tableFiles = TableFiles(client)

                version = tableVersions.getVersion(version_id)
                if not version:
                    raise RequestParametersError({'version_id': 'version record not found'})

                self.__assert_view__(tableProjects, version['project_id'], current_user)

                project = tableProjects.getProject(version['project_id'])

                files = []
                for fr in tableFiles.getVersionFiles(version_id):
                    fr['file_id'] = fr.pop(TableFiles.UID)
                    fr.pop('metadata', None)
                    fr['filepath'] = fr.pop(TableFiles.FILEPATH_R, [])
                    files.append(fr)

                return SuccessResponse({"files": files, "project": project, "version": version, }).generate_response()

        except AuthenticationException:
            raise
            
        except errors.VersionNotFound:
            log.exception(f"failed to get version {version_id}")
            raise RequestParametersError(self.ErrorCodes.VERSION_NOT_FOUND, 'version id not found')

        except Exception as e:
            log.exception(f"unexpected exception while handling version {version_id}")
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {version_id}, reason: {str(e)}')

    @jwt_required()
    def api_get_version_interfaces(self):
        args = parse_webargs(self.GET_VERSION_INTERFACES, request)        
        current_user = get_current_user()

        return SuccessResponse({"reason": "under developing"}).generate_response()

    @jwt_required()
    def api_remove_versions(self):
        args = parse_webargs(self.REMOVE_VERSIONS, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.RemoveVersions.Params
        version_ids = args[params.VERSION_IDS]
        
        with mongo_client() as client:
            tableProjects = TableProjects(client)
            tableVersions = TableVersions(client)            

            for version_id in version_ids:
                version = tableVersions.getVersion(version_id)
                if version:                    
                    self.__assert_manage__(tableProjects, version['project_id'], current_user)

            tableVersions.deleteVersion(*version_ids)
            self.om.delete_versions(*version_ids)

        return SuccessResponse({"result": "version records and related files, packages, threats have been removed"}).generate_response()

    
    @jwt_required()
    def api_update_threat_status(self):
        args = parse_webargs(self.UPDATE_THREAT_STATUS, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.UpdateThreatStatus.Params
        threat_id = args[params.THREAT_ID]
        work_status = args[params.WORK_STATUS]

        try:
            with mongo_client() as client:
                tableThreats = TableThreats(client)                
                tableProjects = TableProjects(client)
                tableVersions = TableVersions(client) 

                tableThreats.updateThreatStatus(threat_id, work_status)
                threat = tableThreats.getThreat(threat_id)

                version_id = threat[TableThreats.VERSION_ID]
            
                version = tableVersions.getVersion(version_id)
                if not version:
                    raise RequestParametersError({'version_id': 'version record not found'})

                self.__assert_update__(tableProjects, version['project_id'], current_user)

                if threat:
                    threat['threat_id'] = threat.pop(TableThreats.UID)
                    return SuccessResponse({"result": threat}).generate_response()

        except AuthenticationException:
            raise
            
        except errors.ThreatNotFound:
            raise RequestParametersError(self.ErrorCodes.THREAT_NOT_FOUND, 'threat id not found')

        except Exception as e:
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {threat_id}, reason: {str(e)}')

    @jwt_required()
    def api_update_threats_status(self):
        args = parse_webargs(self.UPDATE_THREAT_STATUS, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.UpdateThreatsStatus.Params
        threats = args[params.THREATS]

        try:
            with mongo_client() as client:
                tableThreats = TableThreats(client)

                result = {}
                for threat in threats:
                    version_id = threat[TableThreats.VERSION_ID]

                    version = tableVersions.getVersion(version_id)
                    if not version:
                        raise RequestParametersError({'version_id': 'version record not found'})

                    self.__assert_update__(tableProjects, version['project_id'], current_user)

                    try:
                        threat_id = threat[params.THREAT_ID]
                        work_status = threat[params.WORK_STATUS]
                        tableThreats.updateThreatStatus(threat_id, work_status)
                        
                        result[threat_id] = work_status
                    except Exception as e:
                        log.exception(f"failed to update {threat}")
                        raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {threat_id}, reason: {str(e)}')

                return SuccessResponse({"result": result, }).generate_response()

        except AuthenticationException:
            raise
            
        except Exception as e:
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to run the api, {threat_id}, reason: {str(e)}')
