from datetime import datetime
from flask import request, send_file 
import pathlib
import os
import shutil
import time

from marshmallow import Schema, fields, ValidationError
from flask_jwt_extended import (jwt_required, get_current_user)

from exlib.settings import osenv
from exlib.utils import subprocessex
from exlib.utils import filesystemex
from exlib.http.http_webargs_ex import GeneralMetaSchema, NullableString, NullableNested, NullableList, NullableInt, NullableBool, Json
from exlib.http.http_server_api_ex import *

from services.webui.interfaces.application_api import ApplicationAPIDefinition
from services.webui.core.general_api_service import GeneralAPIService
from database.core.roles import SystemRoles, SystemPermissions

from database.core.config import MongoConfig

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class SysInfoService(GeneralAPIService):
    GET_VENDOR_INFO = type('GET_VENDOR_INFO', (GeneralMetaSchema, Schema), {
    })

    GET_SERVER_ID = type('GET_SERVER_ID', (GeneralMetaSchema, Schema), {
    })

    INSTALL_LICENSE = type('INSTALL_LICENSE', (GeneralMetaSchema, Schema), {
    })  
      
    GET_LICENSE_DETAIL = type('GET_LICENSE_DETAIL', (GeneralMetaSchema, Schema), {
    })

    DUMP_DATABASE = type('DUMP_DATABASE', (GeneralMetaSchema, Schema), {
    })

    RESTORE_DATABASE = type('RESTORE_DATABASE', (GeneralMetaSchema, Schema), {
    })

    DOWNLOAD_LOGS = type('DOWNLOAD_LOGS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.DownloadLogs.Params.DATE_FROM: fields.Date(required=False, missing=None),
        ApplicationAPIDefinition.DownloadLogs.Params.DATE_TO: fields.Date(required=False, missing=None)
    })

    GET_SYSTEM_INFO = type('GET_SYSTEM_INFO', (GeneralMetaSchema, Schema), {
    })

    GET_QUEUES_INFO = type('GET_QUEUES_INFO', (GeneralMetaSchema, Schema), {
    })

    GET_ENGINES_INFO = type('GET_ENGINES_INFO', (GeneralMetaSchema, Schema), {  
    })

    GET_ACTIVE_VERSION_LIST = type('GET_ACTIVE_VERSION_LIST', (GeneralMetaSchema, Schema), {
    })

    GET_ACTIVE_VERSION_STATUS = type('GET_ACTIVE_VERSION_STATUS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetActiveVersionStatus.Params.VERSION_ID: fields.Str(required=True),
    })

    UPDATE_ACTIVE_VERSION_BLACKLIST = type('UPDATE_ACTIVE_VERSION_BLACKLIST', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.UpdateActiveVersionBlacklist.Params.VERSION_ID: fields.Str(required=True),
        ApplicationAPIDefinition.UpdateActiveVersionBlacklist.Params.BLACKLIST: fields.Str(required=False, missing=""),
    })

    GET_ACTIVE_JOB_LIST = type('GET_ACTIVE_JOB_LIST', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetActiveJobList.Params.VERSION_ID: fields.Str(required=False, missing=None),
    })


    REMOVE_ACTIVE_JOBS = type('REMOVE_ACTIVE_JOBS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.RemoveActiveJobs.Params.JOB_IDS: fields.List(fields.Str(), required=False, missing=[]),
    })

    GET_CACHED_VERSION_LIST = type('GET_CACHED_VERSION_LIST', (GeneralMetaSchema, Schema), {
    })

    REMOVE_CACHED_VERSIONS = type('REMOVE_CACHED_VERSIONS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.RemoveCachedVersions.Params.VERSION_IDS: fields.List(fields.Str(), required=False, missing=[]),
    })

    def init_apis(self):
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetVendorInfo.URI,
                           ApplicationAPIDefinition.GetVendorInfo.NAME,
                           view_func=self.api_get_vendor_info,
                           methods=[ApplicationAPIDefinition.GetVendorInfo.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetServerId.URI,
                                       ApplicationAPIDefinition.GetServerId.NAME,
                                       view_func=self.api_get_server_id,
                                       methods=[ApplicationAPIDefinition.GetServerId.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.InstallLicense.URI,
                                       ApplicationAPIDefinition.InstallLicense.NAME,
                                       view_func=self.api_install_license,
                                       methods=[ApplicationAPIDefinition.InstallLicense.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetLicenseDetail.URI,
                              ApplicationAPIDefinition.GetLicenseDetail.NAME,
                              view_func=self.api_license_detail,
                              methods=[ApplicationAPIDefinition.GetLicenseDetail.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.DumpDatabase.URI,
                                       ApplicationAPIDefinition.DumpDatabase.NAME,
                                       view_func=self.api_dump_database,
                                       methods=[ApplicationAPIDefinition.DumpDatabase.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.RestoreDatabase.URI,
                                       ApplicationAPIDefinition.RestoreDatabase.NAME,
                                       view_func=self.api_restore_database,
                                       methods=[ApplicationAPIDefinition.RestoreDatabase.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.DownloadLogs.URI,
                                       ApplicationAPIDefinition.DownloadLogs.NAME,
                                       view_func=self.api_download_logs,
                                       methods=[ApplicationAPIDefinition.DownloadLogs.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetSystemInfo.URI,
                                       ApplicationAPIDefinition.GetSystemInfo.NAME,
                                       view_func=self.api_get_system_info,
                                       methods=[ApplicationAPIDefinition.GetSystemInfo.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetQueuesInfo.URI,
                                       ApplicationAPIDefinition.GetQueuesInfo.NAME,
                                       view_func=self.api_get_queues_info,
                                       methods=[ApplicationAPIDefinition.GetQueuesInfo.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetEnginesInfo.URI,
                                       ApplicationAPIDefinition.GetEnginesInfo.NAME,
                                       view_func=self.api_get_engines_info,
                                       methods=[ApplicationAPIDefinition.GetEnginesInfo.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetActiveVersionList.URI,
                                    ApplicationAPIDefinition.GetActiveVersionList.NAME,
                                    view_func=self.api_get_active_version_list,
                                    methods=[ApplicationAPIDefinition.GetActiveVersionList.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetActiveVersionStatus.URI,
                                    ApplicationAPIDefinition.GetActiveVersionStatus.NAME,
                                    view_func=self.api_get_active_version_status,
                                    methods=[ApplicationAPIDefinition.GetActiveVersionStatus.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.UpdateActiveVersionBlacklist.URI,
                                    ApplicationAPIDefinition.UpdateActiveVersionBlacklist.NAME,
                                    view_func=self.api_update_active_version_blacklist,
                                    methods=[ApplicationAPIDefinition.UpdateActiveVersionBlacklist.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetActiveJobList.URI,
                            ApplicationAPIDefinition.GetActiveJobList.NAME,
                            view_func=self.api_get_active_job_list,
                            methods=[ApplicationAPIDefinition.GetActiveJobList.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.RemoveActiveJobs.URI,
                            ApplicationAPIDefinition.RemoveActiveJobs.NAME,
                            view_func=self.api_remove_active_jobs,
                            methods=[ApplicationAPIDefinition.RemoveActiveJobs.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetCachedVersionList.URI,
                            ApplicationAPIDefinition.GetCachedVersionList.NAME,
                            view_func=self.api_get_cached_version_list,
                            methods=[ApplicationAPIDefinition.GetCachedVersionList.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.RemoveCachedVersions.URI,
                            ApplicationAPIDefinition.RemoveCachedVersions.NAME,
                            view_func=self.api_remove_cached_versions,
                            methods=[ApplicationAPIDefinition.RemoveCachedVersions.METHOD])
    
    def api_get_vendor_info(self):
        args = parse_webargs(self.GET_VENDOR_INFO, request)        
        
        try:
            from services.core.fingerprints import SignedLicense
            
            license = SignedLicense.load_license()
            license.verify_fingerprint()

            vendor_info = {"to_whom": license.to_whom}
            if license.comments:
                vendor_info.update(license.comments)

            return SuccessResponse(vendor_info).generate_response()

        except Exception as e:
            log.exception(f"failed to load license")
            return SuccessResponse({}).generate_response()            

        
    @jwt_required()
    def api_get_server_id(self):
        from services.core.fingerprints import SignedLicense

        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()

        args = parse_webargs(self.GET_SERVER_ID, request)        
        current_user = get_current_user()
        
        if not SystemRoles.is_admin(current_user.role):
            raise AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')

        server_id = SignedLicense.get_server_id()
        return SuccessResponse({"server_id": server_id}).generate_response()

    @jwt_required()
    def api_install_license(self):
        from services.core.fingerprints import SignedLicense, ExpiredLicense, WrongLicenseFingerprint, WrongSignatureException, NoLicenseFound

        args = parse_webargs(self.INSTALL_LICENSE, request)        
        current_user = get_current_user()

        if not SystemRoles.is_admin(current_user.role):
            raise AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')

        signed_file = request.files

        if signed_file is None or len(signed_file) == 0:
            raise RequestParametersError({'file': 'Invalid license file'})

        try:
            temp_file = filesystemex.get_temp_path()
            signed_file["file"].save(temp_file)

            license = SignedLicense.load_license(temp_file)            
            license.verify_fingerprint()
            license.verify_not_expired()

            with open(temp_file, 'r') as fr:
                contents = fr.read()
                with open(osenv.license_path(), 'w') as fw:
                    fw.write(contents)

        except NoLicenseFound:
            raise AuthenticationException(self.ErrorCodes.LICENSE_NOT_FOUND, 'no license found')

        except ExpiredLicense:
            raise AuthenticationException(self.ErrorCodes.EXPIRED_LICENSE, 'license expired')

        except WrongLicenseFingerprint:
            raise AuthenticationException(self.ErrorCodes.INVALID_SERVER_ID, 'license server id mis-match')

        except WrongSignatureException:
            raise AuthenticationException(self.ErrorCodes.INVALID_SIGNATURE, 'license not signed Chime-Lab')

        except Exception as e:
            raise AuthenticationException(self.ErrorCodes.INVALID_LICENSE, 'Invalid license')

        return SuccessResponse({"install license": "success"}).generate_response()

    @jwt_required()
    def api_license_detail(self):
        from services.core.fingerprints import SignedLicense, ExpiredLicense, WrongLicenseFingerprint, WrongSignatureException

        args = parse_webargs(self.GET_LICENSE_DETAIL, request)   

        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()

        try:
            license = osenv.license_data()
            return SuccessResponse({"license": license, }).generate_response()

        except ExpiredLicense:
            raise AuthenticationException(self.ErrorCodes.EXPIRED_LICENSE, 'license expired')

        except Exception as e:
            log.exception(f"failed to load license")
            raise AuthenticationException(self.ErrorCodes.INVALID_LICENSE, 'no valid license found')
    
    @jwt_required()
    def api_dump_database(self):
        args = parse_webargs(self.DUMP_DATABASE, request)

        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()
        
        original_dir = os.getcwd()
        try:
            tempdir = self.config.downloads_tempdir() 
            filename = f"database"

            subprocessex.run_command(f"mkdir -p {tempdir / filename}", check=True, timeout=60)
            os.chdir(tempdir)

            config = MongoConfig()
            credential = config.credential()

            subprocessex.run_command(f"mongodump -j 32 -d master -o {filename} --username {credential.username} --password {credential.password} --authenticationDatabase {credential.auth_database} --host {credential.host} --port {credential.port}", check=True, timeout=1200)
            subprocessex.run_command(f"mongodump -j 32 -d findings -o {filename} --username {credential.username} --password {credential.password} --authenticationDatabase {credential.auth_database} --host {credential.host} --port {credential.port}", check=True, timeout=1200)
            filename2 = f"{filename}.tar.z"
            subprocessex.run_command(f"tar -zcf {filename2} -P {filename}", check=True, timeout=600)
            
            # 注意，这里需要用绝对路径。相对路径时，会提示找不到，且给出的是home路径下没这个文件。怀疑send file内部有当前路径，而不是前面我们切换后的。
            return send_file(str(tempdir / filename2), as_attachment=True, download_name=filename2)

        except Exception as e:
            reason = log.exception(f'failed to dump database: {e}')
            raise GeneralClientException(self.ErrorCodes.DUMP_DATABASE_FAILED, reason)

        finally:
            os.chdir(original_dir)
            shutil.rmtree(tempdir, ignore_errors=True)
            

    @jwt_required()
    def api_restore_database(self):
        args = parse_webargs(self.RESTORE_DATABASE, request)
          
        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            raise AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')

        tar_file = request.files

        if tar_file is None or len(tar_file) == 0:
            raise RequestParametersError({'file': 'Invalid tar database file'})

        original_dir = os.getcwd()
        try:
            tempdir = self.config.extract_tempdir()

            subprocessex.run_command(f"mkdir -p {tempdir}", check=True, timeout=60)
            os.chdir(tempdir)
            
            filename = f"database.tar.gz"
            tar_file["file"].save(filename)

            config = MongoConfig()
            credential = config.credential()

            subprocessex.run_command(f"tar -zxf {filename}", check=True, timeout=600)
            subprocessex.run_command(
                f"mongosh --username {credential.username} --password {credential.password} --authenticationDatabase {credential.auth_database} --host {credential.host} --port {credential.port} findings --eval \"db.dropDatabase()\"", 
                check=True, timeout=60)
            subprocessex.run_command(
                f"mongosh --username {credential.username} --password {credential.password} --authenticationDatabase {credential.auth_database} --host {credential.host} --port {credential.port} master --eval \"db.dropDatabase()\"", 
                check=True, timeout=60)
            subprocessex.run_command(
                f"mongorestore -j 32 -d master --username {credential.username} --password {credential.password} --authenticationDatabase {credential.auth_database} --host {credential.host} --port {credential.port} database/master",
                check=True, timeout=1200)
            subprocessex.run_command(
                f"mongorestore -j 32 -d findings --username {credential.username} --password {credential.password} --authenticationDatabase {credential.auth_database} --host {credential.host} --port {credential.port} database/findings", 
                check=True, timeout=1200)
        
            return SuccessResponse({"message": "Database restored successfully."}).generate_response()

        except Exception as e:
            reason = log.exception(f'failed to restore database: {e}')
            raise GeneralClientException(self.ErrorCodes.RESTORE_DATABASE_FAILED,reason )

        finally:
            os.chdir(original_dir)
            shutil.rmtree(tempdir, ignore_errors=True)

    @jwt_required()
    def api_download_logs(self):
        args = parse_webargs(self.DOWNLOAD_LOGS, request)
        date_from = args.get(ApplicationAPIDefinition.DownloadLogs.Params.DATE_FROM)
        date_to = args.get(ApplicationAPIDefinition.DownloadLogs.Params.DATE_TO)

        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()

        log_root = self.config.log_root
        tempdir = self.config.downloads_tempdir() 
        original_dir = os.getcwd()
        try:
            os.chdir(tempdir)

            date_from_timestamp = int(datetime.strptime(date_from, "%Y-%m-%d").timestamp()) if date_from else 0
            date_to_timestamp = int(datetime.strptime(date_to, "%Y-%m-%d").timestamp()) if date_to else int(time.time())
            
            log_filename = "logs"
            
            for subdir in log_root.iterdir():
                if subdir.is_dir():
                    for file in subdir.rglob('*.log'):
                        if file.is_file():
                            file_creation_time = int(file.stat().st_ctime)
                            if date_from_timestamp <= file_creation_time <= date_to_timestamp:
                                target_path = tempdir / subdir.name / file.name
                                target_path.parent.mkdir(parents=True, exist_ok=True)
                                shutil.copy2(file, target_path)
            
            shutil.make_archive(log_filename, 'gztar', tempdir)

            filename2 = f"{log_filename}.tar.gz"
            return send_file(str(tempdir / filename2), as_attachment=True, download_name=filename2)

        except Exception as e:
            reason = log.exception(f'failed to download logs: {e}')
            raise GeneralClientException(self.ErrorCodes.DOWNLOAD_LOGS_FAILED, reason)

        finally:
            os.chdir(original_dir)
            shutil.rmtree(tempdir, ignore_errors=True)
    
    @jwt_required()
    def api_get_system_info(self):
        args = parse_webargs(self.GET_SYSTEM_INFO, request)        
        
        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()

        versions = {}
        for name in ('database', 'vuln', 'compliance', 'sbom', 'demo'):
            filepath = pathlib.Path(f'/data/version/{name}.txt')
            if filepath.is_file():
                with filepath.open('r') as f:
                    versions[name] = f.readline().strip()

        for eid, engine in self.om.list_engines().items():
            versions[engine['whoami']] = engine.get('version', "")

        return SuccessResponse({"versions": versions}).generate_response()

    @jwt_required()
    def api_get_queues_info(self):
        args = parse_webargs(self.GET_QUEUES_INFO, request)        
        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()

        queues = self.engine.client.get_queues()

        return SuccessResponse({"queues": queues}).generate_response()

    @jwt_required()
    def api_get_engines_info(self):
        args = parse_webargs(self.GET_ENGINES_INFO, request)        
        current_user = get_current_user()
        
        engines = self.om.list_engines()

        return SuccessResponse({"engines": engines}).generate_response()
    
    @jwt_required()
    def api_get_active_version_list(self):
        args = parse_webargs(self.GET_ACTIVE_VERSION_LIST, request)
        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()

        versions = self.om.list_versions()

        return SuccessResponse({"versions": versions}).generate_response()

    @jwt_required()
    def api_get_active_version_status(self):
        args = parse_webargs(self.GET_ACTIVE_VERSION_STATUS, request)
        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()
        
        version_id = args.get(ApplicationAPIDefinition.GetActiveVersionStatus.Params.VERSION_ID, None)
        
        version_status = self.om.get_version_status(version_id)
        return SuccessResponse(version_status).generate_response()

    @jwt_required()
    def api_update_active_version_blacklist(self):
        args = parse_webargs(self.UPDATE_ACTIVE_VERSION_BLACKLIST, request)
        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()
        
        version_id = args.get(ApplicationAPIDefinition.UpdateActiveVersionBlacklist.Params.VERSION_ID, None)
        blacklist = args.get(ApplicationAPIDefinition.UpdateActiveVersionBlacklist.Params.BLACKLIST, None)

        self.om.update_version_blacklist(version_id, blacklist)

        version_status = self.om.get_version_status(version_id)
        return SuccessResponse(version_status).generate_response()

    @jwt_required()
    def api_get_active_job_list(self):
        args = parse_webargs(self.GET_ACTIVE_JOB_LIST, request)
        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()
        
        version_id = args.get(ApplicationAPIDefinition.GetActiveJobList.Params.VERSION_ID, None)
        jobs = self.om.list_jobs(version_id=version_id)

        return SuccessResponse({"jobs": jobs}).generate_response()

    @jwt_required()
    def api_remove_active_jobs(self):
        args = parse_webargs(self.REMOVE_ACTIVE_JOBS, request)
        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()

        job_ids = args.get(ApplicationAPIDefinition.RemoveActiveJobs.Params.JOB_IDS, [])        
        self.engine.om.delete_job(*job_ids)
        
        return SuccessResponse({"job_ids": job_ids}).generate_response()


    @jwt_required()
    def api_get_cached_version_list(self):
        args = parse_webargs(self.GET_CACHED_VERSION_LIST, request)
        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()

        nfs_root = self.config.nfs_root

        cached_versions = {}

        for project_path in pathlib.Path(nfs_root).iterdir():
            if not project_path.is_dir():
                continue
            
            project_id = project_path.name
            cached_versions[project_id] = {}

            for version_path in project_path.iterdir():
                if not version_path.is_dir():
                    continue

                version_id = version_path.name
                cached_versions[project_id][version_id] = {"path": str(version_path), "timestamp": version_path.stat().st_mtime}

        return SuccessResponse({"versions": cached_versions}).generate_response()

    @jwt_required()
    def api_remove_cached_versions(self):
        args = parse_webargs(self.REMOVE_CACHED_VERSIONS, request)
        current_user = get_current_user()
        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()

        version_ids = args.get(ApplicationAPIDefinition.RemoveCachedVersions.Params.VERSION_IDS, None)
        
        removed_versions = []
        failed_versions = []

        for project_path in pathlib.Path(self.config.nfs_root).iterdir():
            if not project_path.is_dir():
                continue

            if not version_ids:
                # 如果 version_ids 为空，删除所有的 project_path
                try:
                    log.debug(f"removing {project_path}")
                    shutil.rmtree(project_path)
                    removed_versions.append(str(project_path))
                except Exception as e:
                    failed_versions.append(str(project_path))
                    log.exception(f"failed to remove project directory: {project_path}")                    
            else:
                for version_id in version_ids:
                    version_path = project_path / version_id
                    if not version_path.exists():
                        continue

                    try:
                        log.debug(f"removing {version_path}")
                        shutil.rmtree(version_path)
                        removed_versions.append(version_id)
                    except Exception as e:
                        failed_versions.append(version_id)
                        log.exception(f"failed to remove cached version: {version_id}")
                        
                # 检查 project_path 是否为空
                if not any(project_path.iterdir()):
                    try:
                        shutil.rmtree(project_path)
                    except Exception as e:
                        log.exception(f"failed to remove empty project directory: {project_path}")
                        
        return SuccessResponse({"removed": removed_versions, "failed": failed_versions}).generate_response()
