from exlib.classes.base import ServiceClass
import exlib.http.http_server_api_ex as server_api_ex
from exlib.http.http_server_api_ex import AuthenticationException

from amq.config import AmqConfig
from database.core.roles import ProjectPermissions

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


class GeneralAPIService(ServiceClass):
    class GeneralAPIServiceNotInstantiatable(Exception):
        pass

    class ErrorCodes(server_api_ex.API_ERROR_CODES):
        UNDER_DEVELOPING = 10000

        UNEXPECTED_ERROR = 1
        INVALID_REPORT_ID = 2
        MISSING_PARAMETERS = 3
        INVALID_PARAMETERS = 4
        REPORT_NOT_FOUND = 5
        REPORT_ALREADY_EXISTS = 6
        REPORT_EXPORT_FAILED = 7
        REPORT_IMPORT_FAILED = 8
        REPORT_DELETE_FAILED = 9

        PROJECT_ALREADY_EXISTS = 10
        PROJECT_NOT_FOUND = 11
        PROJECT_EXPORT_FAILED = 12
        
        VERSION_ALREADY_EXISTS = 20
        VERSION_NOT_FOUND = 21
        VERSION_NOT_VALID = 22
        VERSION_EXPORT_FAILED = 23

        THREAT_NOT_FOUND = 30
        THREAT_TYPE_UNKNOWN = 31
        THREAT_SUBTYPE_UNKNOWN = 32

        FILE_NOT_FOUND = 33,
        PACKAGE_NOT_FOUND = 34,

        NO_PERMISSION = 40
        USER_ALREADY_EXISTS = 41
        WRONG_CREDENTIALS = 42
        AUTHENTICATION_ERROR = 43
        USER_NOT_EXISTS = 44
        GROUP_ALREADY_EXISTS = 45        
        GROUP_DOESNT_EXISTS = 46
        CANNOT_RESET_ADMIN_USER = 47


        EXPIRED_TOKEN_ERROR = 60
        REVOKED_TOKEN_ERROR = 61
        INVALID_TOKEN_ERROR = 62  
        TOKEN_NOT_FOUND_ERROR = 63      

        LICENSE_NOT_FOUND = 70
        EXPIRED_LICENSE = 71
        INVALID_LICENSE = 72
        INVALID_SIGNATURE = 73
        INVALID_SERVER_ID = 74

        RESTORE_DATABASE_FAILED = 80
        RESTORE_DATABASE_NOT_FOUND = 81
        RESTORE_DATABASE_NOT_VALID = 82
        DUMP_DATABASE_FAILED = 83
        DUMP_DATABASE_NOT_FOUND = 84
        DUMP_DATABASE_NOT_VALID = 85

        DOWNLOAD_LOGS_FAILED = 90
        

    def __init__(self, engine, context):
        self.engine = engine
        self.publish_request = engine.publish_request
        self.config = AmqConfig()
                
        super().__init__(context)

        self.init_apis()

    def cleanup(self):
        pass

    @property
    def om(self):
        return self.engine.om
    
    def init_apis(self):
        raise self.GeneralAPIServiceNotInstantiatable("must overwrite this function by a sub class")

    def __validate__(self):
        from services.core.fingerprints import SignedLicense, ExpiredLicense, WrongLicenseFingerprint, WrongSignatureException
        try:
            license = SignedLicense.load_license()        
            license.verify_fingerprint()
            license.verify_not_expired()
            
            return None

        except ExpiredLicense:
            return (self.ErrorCodes.EXPIRED_LICENSE, 'license expired')

        except WrongLicenseFingerprint:
            return (self.ErrorCodes.INVALID_SERVER_ID, 'license server id mis-match')

        except WrongSignatureException:
            return (self.ErrorCodes.INVALID_SIGNATURE, 'license not signed Chime-Lab')

        except Exception as e:
            return (self.ErrorCodes.INVALID_LICENSE, f'Invalid license {str(e)}')


    def __assert_view__(self, tableProjects, project_id, current_user, raise_exception=True):
        if ProjectPermissions.VIEW in tableProjects.userProjectPermissions(project_id, current_user.username, current_user.role):
            return True
        
        if raise_exception:
            raise AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to view project_id: {project_id}')
        
    def __assert_update__(self, tableProjects, project_id, current_user, raise_exception=True):
        if ProjectPermissions.UPDATE in tableProjects.userProjectPermissions(project_id, current_user.username, current_user.role):
            return True
        
        if raise_exception:
            raise AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to update project_id: {project_id}')

    def __assert_manage__(self, tableProjects, project_id, current_user, raise_exception=True):
        if ProjectPermissions.MANAGE in tableProjects.userProjectPermissions(project_id, current_user.username, current_user.role):
            return True
        
        if raise_exception:
            raise AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to manage project_id: {project_id}')
