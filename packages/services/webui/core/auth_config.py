from datetime import timedelta
from flask_jwt_extended import JWTManager

from exlib.settings import osenv

class AuthConfig:    
    CERTIFICATE = str(osenv.appdata_path() / 'ssl' / 'digitaltwins.crt')
    PRIVATE = str(osenv.appdata_path() / 'ssl' / 'digitaltwins.key')

    DEFAULT_SERVER_PORT = 30080

    TOKEN_ENCRYPTION_KEY = 'f1c3fe7e-4547-11ee-a2ab-d3f8fd6befbc'
    TOKEN_EXPIRY_INTERVAL = timedelta(hours = 12)
    REFRESH_TOKEN_EXPIRY_INTERVAL = timedelta(hours = 2)
    TOKEN_OVERALL_SESSION_TIME = timedelta(hours = 24)

    @classmethod
    def set_jwt_authentication(cls, flask_app):
        flask_app.config['JWT_SECRET_KEY'] = cls.TOKEN_ENCRYPTION_KEY
        flask_app.config['JWT_TOKEN_LOCATION'] = ['cookies', 'headers', 'query_string']
        flask_app.config['JWT_COOKIE_SECURE '] = True
        flask_app.config['JWT_COOKIE_CSRF_PROTECT'] = False
        flask_app.config['JWT_CLAIMS_IN_REFRESH_TOKEN'] = True
        flask_app.config['JWT_ACCESS_TOKEN_EXPIRES'] = cls.TOKEN_EXPIRY_INTERVAL
        flask_app.config['JWT_REFRESH_TOKEN_EXPIRES'] = cls.REFRESH_TOKEN_EXPIRY_INTERVAL
        flask_app.config['JWT_ACCESS_COOKIE_NAME'] = 'accessToken'
        flask_app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
        jwt= JWTManager(flask_app)
        return jwt

    @classmethod
    def ssl_context(cls):
        return (cls.CERTIFICATE, cls.PRIVATE)

    @classmethod
    def server_port(cls):
        return cls.DEFAULT_SERVER_PORT


