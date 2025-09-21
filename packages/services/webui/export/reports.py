import shutil
from datetime import datetime
import multiprocessing

from marshmallow import Schema, fields, validate, ValidationError
from flask_jwt_extended import jwt_required, get_current_user

from flask import request, send_file, send_from_directory, redirect, abort
from exlib.http.http_server_api_ex import *
from exlib.http.http_webargs_ex import GeneralMetaSchema, NullableString, NullableNested, NullableList, NullableInt, NullableBool, Json

from ..interfaces.application_api import ApplicationAPIDefinition
from ..core.general_api_service import GeneralAPIService

from database.core.errors import *
from database.master_database import TableProjects, TableVersions

from database.core.mongo_db import mongo_client
from ..core.data_manager import DataManager
from . import excel_reporter, pdf_reporter
from . import oss_reporter
from . import raw_reporter

from exlib.log.logger import exception_log

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class ReportRequest:
    def __init__(self, filepath, uid, filetype, lang, maxrows=0):        
        self.filepath = filepath
        self.uid = uid
        self.filetype = filetype
        self.lang = lang
        self.maxrows = maxrows

    def __str__(self):
        return f"{type(self)}({self.filepath}, {self.uid}, {self.filetype}, {self.lang}, {self.maxrows})"

    def __repr__(self):
        return self.__str__()

class ProjectReportRequest(ReportRequest):
    pass
class VersionReportRequest(ReportRequest):
    pass

class ReportsAPIService(GeneralAPIService):
    EXPORT_REPORT = type('EXPORT_REPORT', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.ExportReport.Params.UID: fields.Str(location='query', missing=None),
        ApplicationAPIDefinition.ExportReport.Params.FILETYPE: fields.Str(location='query', allow_none=True, validate=validate.OneOf(["", "*", "pdf", "excel", "json", "yaml", "xlsx", "spdx", "cyclone", "cyclonedx"])),
        ApplicationAPIDefinition.ExportReport.Params.LANGUAGE: fields.Str(location='query', missing="en-US"),
        ApplicationAPIDefinition.ExportReport.Params.MAXROWS: fields.Int(location='query', missing=0),
    })

    PROJECT_REPORTERS = { 
                "pdf": pdf_reporter.generate_project_pdf_report,
            }
    VERSION_REPORTERS = {
            "pdf": pdf_reporter.generate_version_pdf_report,
            "xlsx": excel_reporter.generate_version_excel_report,
            "json": raw_reporter.export_json,
            "yaml": raw_reporter.export_yaml,
            "spdx": oss_reporter.SbomExporter.export_sbom_to_spdx,
            "cyclonedx": oss_reporter.SbomExporter.export_sbom_to_cyclonedx,
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)        
        self.reporter_queue = multiprocessing.Queue()
        self.reporter_job = multiprocessing.Process(target=self.reporter_entry, args=(self.reporter_queue, ))   
        self.reporter_job.start()


    def init_apis(self): 
        self.engine.app.add_url_rule(ApplicationAPIDefinition.ExportReport.URI, ApplicationAPIDefinition.ExportReport.NAME, 
                              view_func=self.api_export_report, methods=[ApplicationAPIDefinition.ExportReport.METHOD])

    @classmethod
    def reporter_entry(cls, reporter_queue):
        while True:
            try:
                request = reporter_queue.get()
                if request.filepath.is_file():
                    log.warning(f"request ignored: report {request.filepath} alreadys exists")
                    continue
                
                log.info(f"generating report {request.filepath}")
                with mongo_client() as client:                    
                    if isinstance(request, ProjectReportRequest):
                        reporter = cls.PROJECT_REPORTERS.get(request.filetype, None)
                    elif isinstance(request, VersionReportRequest):                        
                        reporter = cls.VERSION_REPORTERS.get(request.filetype, None)
                    else:
                        reporter = None

                    if not reporter:
                        log.warning(f"failed to get a proper reporter: {request}")
                        continue

                    request.filepath.parent.mkdir(parents=True, exist_ok=True)
                    reporter(client, request.uid, request.filepath, lang=request.lang, maxrows=request.maxrows)

                    log.info(f"sucessfully generated report {request.filepath}")
                    continue

            except:
                log.exception(f"failed to handle reporter queue")                

    def cleanup(self):        
        self.reporter_job.terminate()
        self.reporter_job.join(timeout=10)

    @jwt_required()
    def api_export_report(self):
        args = parse_webargs(self.EXPORT_REPORT, request)        
        api_params_names = ApplicationAPIDefinition.ExportReport.Params
        uid = args.get(api_params_names.UID, None)
        filetype = args[api_params_names.FILETYPE]
        language = args[api_params_names.LANGUAGE]
        maxrows = args.get(api_params_names.MAXROWS, 0)

        if filetype in ('excel', ):
            filetype = 'xlsx'
        elif filetype in ('cyclone', ):
            filetype = 'cyclonedx'

        if language in ('zh-TW', 'zh-CN', 'TW', 'CN'):
            language = 'cn'
        else:
            language = "en"
            
        if not filetype:
            if uid.startswith(("P", "p")):
                for filetype in ("pdf", ):  
                    filepath = self.config.reports_root / uid / f"{uid}.{language}.{maxrows}.{filetype}"
                    self.reporter_queue.put(ProjectReportRequest(filepath, uid, filetype, language))
                return AcceptResponse(f'project report was successfully dispatched.').generate_response()

            if uid.startswith(("V", "v")):
                for filetype in ("pdf", "xlsx", "json", "yaml", "xlsx", "spdx", "cyclonedx"): 
                    filepath = self.config.reports_root / uid / f"{uid}.{language}.{maxrows}.{filetype}"
                    self.reporter_queue.put(VersionReportRequest(filepath, uid, filetype, language))
                return AcceptResponse(f'version report was successfully dispatched.').generate_response()

            raise GeneralClientException(self.ErrorCodes.INVALID_REPORT_ID, f'failed to generate reports of project or version {uid}, reason: unknown uid')  # 修改为raise

        errmsg = self.__validate__()
        if errmsg:
            raise AuthenticationException(errmsg[0], errmsg[1])  # 修改为raise
        
        try:            
            with mongo_client() as client:
                filepath = self.config.reports_root / uid / f"{uid}.{language}.{maxrows}.{filetype}"

                if uid.startswith(("P", "p")):                    
                    try:
                        if filepath.is_file():
                            creation_datetime = datetime.fromtimestamp(filepath.stat().st_ctime)

                            tableProjects = TableProjects(client)
                            project = tableProjects.getProject(uid)
                            if project[tableProjects.UPDATED_TIME] > creation_datetime:
                                filepath.unlink(missing_ok=True)

                            else:
                                tableVersions = TableVersions(client)

                                versions = tableVersions.getVersions(uid)
                                for version in versions:
                                    if version[tableVersions.UPDATED_TIME] > creation_datetime:
                                        filepath.unlink(missing_ok=True)
                                        break

                        if filepath.is_file():
                            return send_file(str(filepath), as_attachment=True, download_name=filepath.name)
                        else:
                            self.reporter_queue.put(ProjectReportRequest(filepath, uid, filetype, language))
                            return AcceptResponse(f'project report {filepath} not generated yet. Please try later.').generate_response()

                    except GeneralClientException:
                        raise

                    except ProjectNotFound:
                        raise GeneralClientException(self.ErrorCodes.PROJECT_EXPORT_FAILED, f'failed to export {uid}, {filetype} reason: unknown project ID')  # 修改为raise

                    except Exception as e:
                        log.exception('failed to generate report:  {uid}, {filetype} reason: unknown reason to generate {filepath}')
                        raise GeneralClientException(self.ErrorCodes.PROJECT_EXPORT_FAILED, f'failed to export {uid}, {filetype}, reason: {str(e)}')  # 修改为raise

                if uid.startswith(("V", "v")):
                    try:                        
                        if filepath.is_file():
                            tableVersions = TableVersions(client)
                            version = tableVersions.getVersion(uid)                            
                            creation_datetime = datetime.fromtimestamp(filepath.stat().st_ctime)
                            if version[tableVersions.UPDATED_TIME] > creation_datetime:                                
                                filepath.unlink(missing_ok=True)
                                                        
                        if filepath.is_file():
                            return send_file(str(filepath), as_attachment=True, download_name=filepath.name)
                        else:
                            self.reporter_queue.put(VersionReportRequest(filepath, uid, filetype, language))
                            return AcceptResponse(f'version report {filepath} not generated yet. Please try later.').generate_response()

                    except VersionNotFound:
                        raise GeneralClientException(self.ErrorCodes.VERSION_EXPORT_FAILED, f'failed to export {uid}, {filetype}, reason: unknown Version ID')  # 修改为raise 

                    except Exception as e:
                        log.exception(f"failed to generate {filetype} report in lang {language}.")
                        raise GeneralClientException(self.ErrorCodes.VERSION_EXPORT_FAILED, f'failed to export {uid}, {filetype}: reason: {e}')  # 修改为raise

                raise GeneralClientException(self.ErrorCodes.INVALID_REPORT_ID, f'failed to export project or version {uid} to {filetype}, reason: unknown uid')  # 修改为raise
        
        except GeneralClientException:
            raise

        except Exception as e:
            log.exception("Failed to export project or version {} to {}".format(uid, filetype))
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed to export project or version {uid} to {filetype}, reason: {e}')  # 修改为raise

