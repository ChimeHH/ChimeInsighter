class ApplicationAPIDefinition:   
    ###########################################################################################################
    # system, authenticated by token or logining
    class GetVendorInfo:
        NAME = 'get_vendor_info'
        URI = '/license/vendor'  # 这里指定请求的 URL
        METHOD = 'GET'

        class Params:            
            pass

    class GetServerId:
        NAME = 'get_server_id'
        URI = '/server_id'
        METHOD = 'GET'

        class Params:            
            pass
            
    class InstallLicense:
        NAME = 'install_license'
        URI = '/install_license'
        METHOD = 'POST'

        class Params:            
            FILE_UPLOAD = 'file'

    class GetLicenseDetail:
        NAME = 'get_license_detail'
        URI = '/license'
        METHOD = 'GET'

        class Params:
            pass

    class DumpDatabase:
        NAME = 'dump_database'
        URI = '/database/dump'
        METHOD = 'GET'

        class Params:
            pass

    class RestoreDatabase:
        NAME = 'restore_database'
        URI = '/database/restore'
        METHOD = 'POST'

        class Params:
            pass

    class DownloadLogs:
        NAME = 'download_logs'
        URI = '/logs/download'
        METHOD = 'GET'

        class Params:
            DATE_FROM = 'date_from'
            DATE_TO = 'date_to'
    
    class GetSystemInfo:
        NAME = 'get_system_info'
        URI = '/system_info'
        METHOD = 'GET'

        class Params:            
            pass

    class GetQueuesInfo:
        NAME = 'get_queues_info'
        URI = '/queues_info'
        METHOD = 'GET'

        class Params:            
            pass

    class GetEnginesInfo:
        NAME = 'get_engines_info'
        URI = '/engines_info'
        METHOD = 'GET'

        class Params:            
            pass
    
    class GetActiveVersionList:
        NAME = 'get_active_version_list'
        URI = '/active_versions'
        METHOD = 'GET'

        class Params:
            pass

    class GetActiveVersionStatus:
        NAME = 'get_active_version_status'
        URI = '/active_versions/status'
        METHOD = 'GET'

        class Params:
            VERSION_ID ='version_id'
    
    class UpdateActiveVersionBlacklist:
        NAME = 'update_active_version_status'
        URI = '/active_versions/update'
        METHOD = 'POST'

        class Params:
            VERSION_ID ='version_id'
            BLACKLIST = 'blacklist'

    class GetActiveJobList:
        NAME = 'get_active_job_list'
        URI = '/active_jobs'
        METHOD = 'GET'

        class Params:
            VERSION_ID ='version_id'

    class RemoveActiveJobs:
        NAME = 'remove_active_jobs'
        URI = '/active_jobs/remove'
        METHOD = 'DELETE'

        class Params:
            JOB_IDS = 'job_ids'  # 允许多个 job_id
    
    class GetCachedVersionList:
        NAME = 'get_cached_version_list'
        URI = '/cached_versions'
        METHOD = 'GET'

        class Params:
            pass
    
    class RemoveCachedVersions:
        NAME = 'remove_cached_version'
        URI = '/cached_versions/remove'
        METHOD = 'DELETE'

        class Params:
            VERSION_IDS = 'version_ids'  # 允许多个 version_id

    ###########################################################################################################
    # help center
    #
    class GetThreatTypes:
        NAME = 'get_threat_types'
        URI = '/help/threat_types'
        METHOD = 'GET'

        class Params:
            pass   

    class GetThreatSubtypes:
        NAME = 'get_threat_subtypes'
        URI = '/help/threat_subtypes'
        METHOD = 'GET'

        class Params:
            THREAT_TYPE = 'threat_type'
    
    class GetThreatStatuses:
        NAME = 'get_threat_statuses'
        URI = '/help/threat_statuses'
        METHOD = 'GET'

        class Params:
            pass   

    class GetScanSettings:
        NAME = 'get_scan_settings'
        URI = '/help/scan_settings'
        METHOD = 'GET'

        class Params:         
            pass


    # cve of an open source package (cpe)
    class GetPackageVulnerabilities:
        NAME = 'get_package_vulnerabilities'
        URI = '/help/package/vulnerabilities'
        METHOD = 'GET'

        class Params:
            PACKAGE_NAME = 'package'
            VERSION_NAME = 'version'
            VENDOR_NAME = 'vendor'
            FUZZY_FLAG = 'fuzzy'
    
    class GetVulnerabilityList:
        NAME = 'get_vulnerability_list'
        URI = '/help/vulnerabilities'
        METHOD = 'GET'

        class Params:
            TYPE = 'type'            
            YEAR = 'year'    

    class GetVulnerabilityDetail:
        NAME = 'get_vulnerability_detail'
        URI = '/help/vulnerability'
        METHOD = 'GET'

        class Params:
            ID = 'id'
    
    class GetExploitList:
        NAME = 'get_exploit_list'
        URI = '/help/exploits'
        METHOD = 'GET'

        class Params:
            TYPE = 'type'            
            YEAR = 'year'

    class GetExploitDetail:
        NAME = 'get_exploit_detail'
        URI = '/help/exploit'
        METHOD = 'GET'

        class Params:
            ID = 'id'
    
    class GetCweList:
        NAME = 'get_cwe_list'
        URI = '/help/cwes'
        METHOD = 'GET'

        class Params:
            pass
        
    class GetCweDetail:
        NAME = 'get_cwe_detail'
        URI = '/help/cwe'
        METHOD = 'GET'

        class Params:
            CWE_ID = 'id'
    
    class GetComplianceLicenseList:
        NAME = 'get_compliance_license_list'
        URI = '/help/licenses'
        METHOD = 'GET'

        class Params:
            pass
        
    class GetComplianceLicenseDetail:
        NAME = 'get_compliance_license_detail'
        URI = '/help/license'
        METHOD = 'GET'

        class Params:
            LICENSE_ID = 'id'

    class AskAI:
        NAME = 'ask_ai'
        URI  = '/help/ask_ai'
        METHOD = 'GET'

        QUESTION_TEMPLATE = "请用{}语言回答问题:{}"

        class Params:
            LANGUAGE = 'language'
            QUESTION = 'question'


    ###########################################################################################################
    # user management
    #
    class CreateUser:
        NAME = 'create_user'
        URI = '/users/create_user'
        METHOD = 'POST'

        class Params:
            USERNAME = 'username'
            PASSWORD = 'password'
            ROLE = 'role'
            TOTAL_UPLOADS = 'total_uploads'    
            TOTAL_UPLOADS_MG = 'total_uploads_mg'
            MAX_FILESIZE_MG = 'max_filesize_mg'
            ACTIVE = 'active'

    class UpdateUser:
        NAME = 'update_user'
        URI = '/users/update_user'
        METHOD = 'POST'

        class Params:
            USERNAME = 'username'            
            ROLE = 'role'
            TOTAL_UPLOADS = 'total_uploads'    
            TOTAL_UPLOADS_MG = 'total_uploads_mg'
            MAX_FILESIZE_MG = 'max_filesize_mg'
            ACTIVE = 'active'

    class RemoveUser:
        NAME = 'remove_user'
        URI = '/users/remove'
        METHOD = 'DELETE'

        class Params:
            USERNAMES = 'usernames'
            
    class GetUsers:
        NAME = 'get_users'
        URI = '/users'
        METHOD = 'GET'

        class Params:
            pass

    class ChangePassword:
        NAME = 'change_password'
        URI = '/users/change_password'
        METHOD = 'POST'

        class Params:
            CURRENT_PASSWORD = 'current_password'
            NEW_PASSWORD = 'new_password'
            
    class ResetUserPassword:
        NAME = 'reset_password_user'
        URI = '/users/reset_password'
        METHOD = 'POST'

        class Params:
            USERNAME = 'username'
            NEW_PASSWORD = 'new_password'

    class Login:
        NAME = 'login'
        URI = '/login'
        METHOD = 'POST'

        class Params:
            USERNAME = 'username'
            PASSWORD = 'password'

    class Logout:
        NAME = 'logout'
        URI = '/logout'
        METHOD = 'POST'

    class RefreshToken:
        NAME = 'refresh_token'
        URI = '/refresh_token'
        METHOD = 'POST'

    ###########################################################################################################
    # reports
    class ExportReport:
        NAME = 'export_report'
        URI = '/export'
        METHOD = 'GET'

        class Params:
            UID = 'uid'
            FILETYPE = 'filetype'
            LANGUAGE = 'language'
            MAXROWS = 'maxrows'

        class FileTypes:
            PDF = 'pdf'
            XLSX = 'xlsx'
            JSON = 'json'
            YAML = 'yaml'
            SPDX = 'spdx'
            CYCLONEDX = 'cyclonedx'
                        
        class Languages:
            CN = 'zh-CN'
            EN = 'en-US'
            FR = 'fr-FR'
            DE = 'de-DE'
            JP = 'ja-JP'
            KR = 'ko-KR'
            RU = 'ru-RU'
            TW = 'zh-TW'

    ###########################################################################################################
    # projects

    class CreateProject:
        NAME = 'create_project'
        URI = '/projects'
        METHOD = 'POST'

        class Params:
            PROJECT_NAME = 'project_name'
            DESCRIPTION = 'description'
            VENDORS = 'vendors'
            DEPARTMENT = 'department'
            LOGO_FILE = 'logo_file'
            SCAN_OPTIONS = 'scan_options' # refer to master_database.ScanTypes, ScanOptions
            CUSTOMERIZED_DATA = 'customerized_data'
            USERS = 'users'

            # class RoleUser:
            #     ROLE = 'role' # ProjectRole
            #     USERNAME = 'username'
            
            # class ScanOptions(EnumClass):            
            # class ScanTypes(EnumClass):  

    class UpdateProject:
        NAME = 'update_project'
        URI = '/projects/update'
        METHOD = 'POST'

        class Params:
            PROJECT_ID = 'project_id'
            UPDATES = 'updates'            

            class Updates:
                PROJECT_NAME = 'project_name'
                DESCRIPTION = 'description'
                VENDORS = 'vendors'
                DEPARTMENT = 'department'
                CUSTOMERIZED_DATA = 'customerized_data'
                USERS = 'users'

            # class RoleUser:
            #     ROLE = 'role' # ProjectRole
            #     USERNAME = 'username'

    class RemoveProjects:
        NAME = 'remove_projects'
        URI = '/projects'
        METHOD = 'DELETE'

        class Params:
            PROJECT_IDS = 'project_ids'

    class GetProjects:
        NAME = 'get_projects'
        URI = '/projects'
        METHOD = 'GET'

        class Params:
            PROJECT_NAMES = 'project_names'

    class GetProjectSummary:
        NAME = 'get_project_summary'
        URI = '/projects/summary'
        METHOD = 'GET'

        class Params:
            PROJECT_ID = 'project_id'

    ###########################################################################################################
    # versions
    #
    class ScanVersion:
        NAME = 'scan_version'
        URI = '/versions/scan'
        METHOD = 'POST'

        class Params:
            PROJECT_ID = 'project_id'
            VERSION_ID = 'version_id'
            VERSION_NAME = 'version_name'
            VERSION_DATE = 'version_date'
            DESCRIPTION = 'description'
            CUSTOMERIZED_DATA = 'customerized_data'
            PRIORITY = 'priority'
            STRATEGY = 'strategy'
            ALLOW_CACHE = 'allow_cache'
            ALLOW_BLACKLIST = 'allow_blacklist'
            AUTO_CLEANUP = 'auto_cleanup'
            EXTRACTED_PATH = 'path'
            UPLOAD_FILE = 'file'
            
    class UpdateVersion:
        NAME = 'update_version'
        URI = '/versions/update'
        METHOD = 'POST'

        class Params:
            VERSION_ID = 'version_id'            
            UPDATES = 'updates'

            class Updates:
                VERSION_NAME = 'version_name'
                VERSION_DATE = 'version_date'
                DESCRIPTION = 'description'
                CUSTOMERIZED_DATA = 'customerized_data'

    class CancelVersions:
        NAME = 'cancel_versions'
        URI = '/versions/cancel'
        METHOD = 'POST'

        class Params:            
            VERSION_IDS = 'version_ids'

    class GetVersions:
        NAME = 'get_versions'
        URI = '/versions'
        METHOD = 'GET'

        class Params:
            PROJECT_ID = 'project_id'
            VERSION_NAMES = 'version_names'

    class GetVersionSummary:
        NAME = 'get_version_summary'
        URI = '/versions/summary'
        METHOD = 'GET'

        class Params:
            VERSION_ID = 'version_id'

    class GetVersionStats:
        NAME = 'get_version_stats'
        URI = '/versions/stats'
        METHOD = 'GET'

        class Params:
            VERSION_ID = 'version_id'
            FILTERS = 'filters'

            class Filters:
                THREAT_TYPE = 'threat_type'
                THREAT_SUBTYPES = 'threat_subtypes'

    class GetVersionThreats:
        NAME = 'get_version_threats'
        URI = '/versions/threats'
        METHOD = 'GET'

        class Params:
            VERSION_ID = 'version_id'
            FILTERS = 'filters'

            class Filters:
                THREAT_TYPE = 'threat_type'
                THREAT_SUBTYPES = 'threat_subtypes'          

    class GetThreatDetail:
        NAME = 'get_threat'
        URI = '/versions/threat'
        METHOD = 'GET'

        class Params:
            THREAT_ID = 'threat_id'


    class GetVersionLicenses:
        NAME = 'get_version_licenses'
        URI = '/versions/licenses'
        METHOD = 'GET'

        class Params:
            VERSION_ID = 'version_id'

    class GetVersionPackages:
        NAME = 'get_version_packages'
        URI = '/versions/packages'
        METHOD = 'GET'

        class Params:
            VERSION_ID = 'version_id'
    
    class GetVersionFiles:
        NAME = 'get_version_files'
        URI = '/versions/files'
        METHOD = 'GET'

        class Params:
            VERSION_ID = 'version_id'
            FILE_TYPES = 'file_types'
    
    class GetPackageDetail:
        NAME = 'get_package'
        URI = '/versions/package'
        METHOD = 'GET'

        class Params:
            UID = 'uid'

    class GetFileDetail:
        NAME = 'get_file'
        URI = '/versions/file'
        METHOD = 'GET'

        class Params:
            UID = 'uid'

    class GetVersionInterfaces:
        NAME = 'get_version_interfaces'
        URI = '/versions/interfaces'
        METHOD = 'GET'

        class Params:
            VERSION_ID = 'version_id'
            INTERFACE_IDS = 'interface_ids'

    class RemoveVersions:
        NAME = 'remove_versions'
        URI = '/versions'
        METHOD = 'DELETE'

        class Params:
            VERSION_IDS = 'version_ids'

    class AddSymbols:
        NAME = 'add_symbols'
        URI = '/versions/add_symbols'
        METHOD = 'POST'

        class Params:
            THREAT_ID = 'threat_id'
            UPLOAD_FILE = 'file'

    class UpdateThreatStatus:
        NAME = 'update_threat_status'
        URI = '/versions/update_threat_status'
        METHOD = 'POST'

        class Params:
            THREAT_ID = 'threat_id'
            WORK_STATUS = 'work_status'

    class UpdateThreatsStatus:
        NAME = 'update_threats_status'
        URI = '/versions/update_threats_status'
        METHOD = 'POST'

        class Params:
            THREATS = 'threats'

    ###########################################################################################################
    # monitor
    #
    class GetMonitorVersionEvents:
        NAME = 'get_monitor_version_events'
        URI = '/monitor/version_events'
        METHOD = 'GET'

        class Params:
            VERSION_ID = 'version_id'

    # events of all used components
    class GetMonitorEvents:
        NAME = 'get_monitor_events'
        URI = '/monitor/events'
        METHOD = 'GET'

        class Params:
            DATE_FROM = 'from_datetime'
            DATE_TO = 'to_datetime'
    
    # generate a report of monitor events
    class ExportMonitorEvents:
        NAME = 'export_monitor_events'
        URI = '/monitor/export'
        METHOD = 'GET'

        class Params:
            DATE_FROM = 'date_from'
            DATE_TO = 'date_to'


    ###########################################################################################################
    # Domain
    #
    # class GetProjectDepartment:
    #     NAME = 'get_project_department'
    #     URI = '/project_department'
    #     METHOD = 'GET'

    #     class Params:
    #         DEPARTMENT_ID = 'department_id'

    # class GetProjectDomain:
    #     NAME = 'get_project_domain'
    #     URI = '/project_domain'
    #     METHOD = 'GET'

    #     class Params:
    #         DOMAIN_ID = 'domain_id'

    ###########################################################################################################
    # Model
    #
    # class CreateModel:
    #     NAME = 'create_model'
    #     URI = '/models'
    #     METHOD = 'POST'

    #     class Params:
    #         MODEL_NAME = 'model_name'

    # class GetModels:
    #     NAME = 'get_models'
    #     URI = '/models'
    #     METHOD = 'GET'

    #     class Params:
    #         ADDITIONAL_INFO = 'additional_info'

    # class RemoveModel:
    #     NAME = 'remove_model'
    #     URI = '/models'
    #     METHOD = 'DELETE'

    #     class Params:
    #         MODEL_ID = 'model_id'

    # class AttachProjectsToModel:
    #     NAME = 'attach_projects_to_model'
    #     URI = '/models/attach_projects'
    #     METHOD = 'POST'

    #     class Params:
    #         MODEL_ID = 'model_id'
    #         PROJECT_IDS = 'project_ids'

    # class DetachProjectsFromModel:
    #     NAME = 'detach_projects_from_model'
    #     URI = '/models/detach_projects'
    #     METHOD = 'POST'

    #     class Params:
    #         MODEL_ID = 'model_id'
    #         PROJECT_IDS = 'project_ids'

    # class GetModelInformation:
    #     NAME = 'get_model_information'
    #     URI = '/models/info'
    #     METHOD = 'GET'

    #     class Params:
    #         MODEL_ID = 'model_id'



    

