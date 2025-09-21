import re
import time
import sys
import traceback
from flask import request
from zxcvbn import zxcvbn
from datetime import datetime
from marshmallow import Schema, fields, ValidationError
from flask_jwt_extended import (jwt_required, create_access_token, create_refresh_token,
        set_access_cookies, set_refresh_cookies, unset_jwt_cookies, get_jwt, get_current_user, verify_jwt_in_request)


from exlib.http.http_webargs_ex import GeneralMetaSchema, NullableString, NullableNested, NullableList, NullableInt, NullableBool, Json
from exlib.http.http_server_api_ex import *

from database.core.mongo_db import mongo_client
from database.master_database import TableUsers

from ..interfaces.application_api import ApplicationAPIDefinition
from ..core.general_api_service import GeneralAPIService
from ..core.auth_config import AuthConfig
from database.core.roles import SystemRoles,SystemPermissions,ProjectRoles,ProjectPermissions
from database.core import errors

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class ParametersChecker:
    USERNAME_PATTERN = re.compile('^(?=.{4,40}$)(?![_.])[a-zA-Z0-9._@]+(?<![_.])$')
    GROUP_NAME_PATTERN = re.compile('^(?=.{4,40}$)(?![_.])[a-zA-Z0-9._@]+(?<![_.])$')
    PASSWORD_MIN_SCORE = 2

    @staticmethod
    def is_username_legit(username):
        if ParametersChecker.USERNAME_PATTERN.match(username) is None:
            raise ValidationError('Invalid username. should be an alphanumeric string with 4-32 chars')

    @staticmethod
    def is_group_name_legit(group_name):
        if ParametersChecker.GROUP_NAME_PATTERN.match(group_name) is None:
            raise ValidationError('Invalid group name. should be an alphanumeric string with 4-32 chars')

    @staticmethod
    def is_password_legit(password):
        # Get the password score
        pass_score = 0
        if len(password) > 0:
            try:
                pass_score = zxcvbn(password)['score']
            except Exception as e:
                logging.exception('The password does not match the security policy: {}'.format(password))

        # If the password score
        if pass_score < ParametersChecker.PASSWORD_MIN_SCORE:
            raise ValidationError('Password too weak')

    @staticmethod
    def is_role_legit(role):
        if not SystemRoles.role_valid(role):
            raise ValidationError('Role is not valid')
        pass

class TokenInfo:
    def __init__(self, username, updated_timestamp, role, expiry_timestamp):
        self.username = username
        self.updated_timestamp = updated_timestamp
        self.role = role
        self.expiry_timestamp = expiry_timestamp

    def __str__(self):
        return "TokenInfo({}, {}, {}, {})".format(self.username, self.updated_timestamp, self.role, self.expiry_timestamp)


class CurrentUser:
    def __init__(self, username, role, updated_timestamp, expiry_timestamp):
        self.username = username
        self.role = role
        self.updated_timestamp = updated_timestamp
        self.expiry_timestamp = expiry_timestamp

    def to_dict(self):
        return dict(username=self.username, role=self.role, updated_timestamp=self.updated_timestamp, expiry_timestamp=self.expiry_timestamp)

    @classmethod
    def from_dict(cls, current_user):
        return cls(current_user['username'], current_user['role'], current_user['updated_timestamp'], current_user['expiry_timestamp'])

    def __str__(self):
        return "CurrentUser({}, {}, {}, {})".format(self.username, self.role, datetime.fromtimestamp(self.updated_timestamp), datetime.fromtimestamp(self.expiry_timestamp))

class AuthorizationService(GeneralAPIService):
    LOGIN = type('LOGIN', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.Login.Params.USERNAME: fields.Str(location='form', required=True),
        ApplicationAPIDefinition.Login.Params.PASSWORD: fields.Str(location='form', required=True)
    })

    CREATE_USER = type('CREATE_USER', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.CreateUser.Params.USERNAME: fields.Str(location='form', required=True, validate=ParametersChecker.is_username_legit),
        ApplicationAPIDefinition.CreateUser.Params.PASSWORD: fields.Str(location='form', required=True, validate=ParametersChecker.is_password_legit),
        ApplicationAPIDefinition.CreateUser.Params.ROLE: fields.Str(location='form', required=True, validate=ParametersChecker.is_role_legit),
        ApplicationAPIDefinition.CreateUser.Params.TOTAL_UPLOADS: fields.Int(location='form', required=False, missing=None),
        ApplicationAPIDefinition.CreateUser.Params.TOTAL_UPLOADS_MG: fields.Int(location='form', required=False, missing=None),
        ApplicationAPIDefinition.CreateUser.Params.MAX_FILESIZE_MG: fields.Int(location='form', required=False, missing=None),
        ApplicationAPIDefinition.CreateUser.Params.ACTIVE: fields.Bool(missing=True),
    })
    UPDATE_USER = type('UPDATE_USER', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.UpdateUser.Params.USERNAME: fields.Str(location='form', required=True, validate=ParametersChecker.is_username_legit),
        ApplicationAPIDefinition.UpdateUser.Params.ROLE: fields.Str(location='form', required=False, validate=ParametersChecker.is_role_legit),        
        ApplicationAPIDefinition.UpdateUser.Params.TOTAL_UPLOADS: fields.Int(location='form', required=False, missing=None),
        ApplicationAPIDefinition.UpdateUser.Params.TOTAL_UPLOADS_MG: fields.Int(location='form', required=False, missing=None),
        ApplicationAPIDefinition.UpdateUser.Params.MAX_FILESIZE_MG: fields.Int(location='form', required=False, missing=None),
        ApplicationAPIDefinition.UpdateUser.Params.ACTIVE: fields.Bool(missing=True),
    })
    REMOVE_USER = type('REMOVE_USER', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.RemoveUser.Params.USERNAMES: fields.List(fields.Str(), location='form', required=True)
    })
    GET_USERS = type('GET_USERS', (GeneralMetaSchema, Schema), {
    })
    CHANGE_PASSWORD = type('CHANGE_PASSWORD', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.ChangePassword.Params.CURRENT_PASSWORD: fields.Str(location='form', required=True),
        ApplicationAPIDefinition.ChangePassword.Params.NEW_PASSWORD: fields.Str(location='form', required=True, validate=ParametersChecker.is_password_legit)
    })
    RESET_PASSWORD = type('RESET_PASSWORD', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.ResetUserPassword.Params.USERNAME: fields.Str(location='form', required=True),
        ApplicationAPIDefinition.ResetUserPassword.Params.NEW_PASSWORD: fields.Str(location='form', required=True, validate=ParametersChecker.is_password_legit)
    })

    
    

    def _init_authenticator(self):
        self.jwt_authenticator = AuthConfig.set_jwt_authentication(self.engine.app)
        # Set the token information to token identity converter
        self.jwt_authenticator.user_identity_loader(self._token_info_to_token_identity)
        # Set the token information to token additioanl info (token claims) converter
        self.jwt_authenticator.additional_claims_loader(self._token_info_to_token_additional_info)
        # Set the token to current user converter
        self.jwt_authenticator.user_lookup_loader(self._user_record_from_token)
        # Set the token to current user converter error
        self.jwt_authenticator.user_lookup_error_loader(self._user_record_from_token_error)
        # Set the expired token loader
        self.jwt_authenticator.expired_token_loader(self._expired_token_error)
        # Set the revoked token loader
        self.jwt_authenticator.revoked_token_loader(self._revoked_token_error)
        # Set the Invalid token loader
        self.jwt_authenticator.invalid_token_loader(self._invalid_token_error)
        # Set the not found token loader
        self.jwt_authenticator.unauthorized_loader(self._token_cannot_be_found_error)

    def _token_info_to_token_identity(self, token_info):
        return token_info.username

    def _token_info_to_token_additional_info(self, token_info):        
        if token_info.expiry_timestamp is None:
            session_expiry = 'null'
        else:
            session_expiry = token_info.expiry_timestamp
        
        token_additional_info = {'username': token_info.username, 'updated_timestamp': token_info.updated_timestamp, 'role': token_info.role, 'session_expiry': session_expiry}        
        return token_additional_info

    def _user_record_from_token(self, encryption, token_info):
        try:
            user_info = self._load_user(token_info['username'])            
            if user_info is None:
                return None

            # If have changed the password - the token is invalid
            # updated_timestamp = user_info[TableUsers.UPDATED_TIME]
            # if token_info['updated_timestamp'] != updated_timestamp.timestamp():                
            #     return None
            if token_info['session_expiry'] == 'null':
                session_expiry = None
            else:
                session_expiry = token_info['session_expiry']
            
            return CurrentUser(user_info['username'], user_info['role'], token_info['updated_timestamp'], session_expiry)#.to_dict()
        except Exception:
            log.exception(f"token_info: {token_info}")
            return None

    def _user_record_from_token_error(self, encryption, user_identity):
        return ErrorResponse(AuthenticationException(self.ErrorCodes.AUTHENTICATION_ERROR, 'Please re-authenticate')).generate_response()

    def _expired_token_error(self, *args, **kwargs):
        return ErrorResponse(AuthenticationException(self.ErrorCodes.EXPIRED_TOKEN_ERROR, 'Your token expired')).generate_response()

    def _revoked_token_error(self, *args, **kwargs):
        return ErrorResponse(AuthenticationException(self.ErrorCodes.REVOKED_TOKEN_ERROR, 'Your token revoked')).generate_response()

    def _invalid_token_error(self, reason, *args, **kwargs):
        return ErrorResponse(AuthenticationException(self.ErrorCodes.INVALID_TOKEN_ERROR, 'You token is invalid')).generate_response()

    def _token_cannot_be_found_error(self, reason, *args, **kwargs):
        return ErrorResponse(AuthenticationException(self.ErrorCodes.TOKEN_NOT_FOUND_ERROR, 'Token not found: {}'.format(reason))).generate_response()

    def throw_no_permission_exception(self, error_string='No permission to do this'):
        raise AuthorizationException(self.ErrorCodes.NO_PERMISSION, error_string)

    def _load_user(self, username):
        with mongo_client() as client:
            tableUsers = TableUsers(client)
            return list(tableUsers.get_user(username))[0]
            
    def init_apis(self):
        self._init_authenticator()

        self.engine.app.add_url_rule(ApplicationAPIDefinition.Login.URI,
                                       ApplicationAPIDefinition.Login.NAME,
                                       view_func=self.api_login,
                                       methods=[ApplicationAPIDefinition.Login.METHOD])
        self.engine.app.add_url_rule(ApplicationAPIDefinition.RefreshToken.URI, ApplicationAPIDefinition.RefreshToken.NAME,
                                       view_func=self.api_refresh_token,
                                       methods=[ApplicationAPIDefinition.RefreshToken.METHOD])
        self.engine.app.add_url_rule(ApplicationAPIDefinition.Logout.URI, ApplicationAPIDefinition.Logout.NAME,
                                       view_func=self.api_logout,
                                       methods=[ApplicationAPIDefinition.Logout.METHOD])
        self.engine.app.add_url_rule(ApplicationAPIDefinition.CreateUser.URI,
                                       ApplicationAPIDefinition.CreateUser.NAME,
                                       view_func=self.api_create_user,
                                       methods=[ApplicationAPIDefinition.CreateUser.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.UpdateUser.URI,
                                       ApplicationAPIDefinition.UpdateUser.NAME,
                                       view_func=self.api_update_user,
                                       methods=[ApplicationAPIDefinition.UpdateUser.METHOD])
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetUsers.URI, ApplicationAPIDefinition.GetUsers.NAME,
                                       view_func=self.api_get_users,
                                       methods=[ApplicationAPIDefinition.GetUsers.METHOD])
        self.engine.app.add_url_rule(ApplicationAPIDefinition.ChangePassword.URI, ApplicationAPIDefinition.ChangePassword.NAME,
                                       view_func=self.api_change_password,
                                       methods=[ApplicationAPIDefinition.ChangePassword.METHOD])
        self.engine.app.add_url_rule(ApplicationAPIDefinition.ResetUserPassword.URI, ApplicationAPIDefinition.ResetUserPassword.NAME,
                                       view_func=self.api_reset_password_user,
                                       methods=[ApplicationAPIDefinition.ResetUserPassword.METHOD])
        self.engine.app.add_url_rule(ApplicationAPIDefinition.RemoveUser.URI, ApplicationAPIDefinition.RemoveUser.NAME,
                                       view_func=self.api_remove_user,
                                       methods=[ApplicationAPIDefinition.RemoveUser.METHOD])        
        
        
    
    
    def api_login(self):
        args = parse_webargs(self.LOGIN, request)
        api_params_names = ApplicationAPIDefinition.Login.Params
        
        try:
            with mongo_client() as client:
                tableUsers = TableUsers(client)            
                user_info = tableUsers.getValidateUser(args[api_params_names.USERNAME], args[api_params_names.PASSWORD])

            session_expiry = datetime.utcnow() + AuthConfig.TOKEN_OVERALL_SESSION_TIME
            
            token_info = TokenInfo(user_info[TableUsers.USERNAME], user_info[TableUsers.UPDATED_TIME], user_info[TableUsers.ROLE], session_expiry)
            access_token = create_access_token(identity=token_info)
            refresh_token = create_refresh_token(identity=token_info)
            
            response = SuccessResponse({'access_token': access_token, 'refresh_token': refresh_token}).generate_response()        
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            return response
        except errors.InvalidUserNameOrPassword:
            return ErrorResponse(AuthenticationException(self.ErrorCodes.WRONG_CREDENTIALS, 'invalid user name or password')).generate_response()

        except Exception as e:
            return ErrorResponse(AuthenticationException(self.ErrorCodes.WRONG_CREDENTIALS, 'failed to log in')).generate_response()


    def api_logout(self):
        response = SuccessResponse({'logout': True}).generate_response()
        unset_jwt_cookies(response)
        return response

    @jwt_required(refresh=True)
    def api_refresh_token(self):
        # Get the current user
        current_user = get_current_user()

        # Set the token info
        token_info = TokenInfo(current_user.username, current_user.updated_timestamp,
                               current_user.role, current_user.expiry_timestamp)

        access_token = create_access_token(token_info)
        # if current_user.expiry_timestamp is None or current_user.expiry_timestamp > time.time():
        #     refresh_token = create_refresh_token(identity=token_info)
        #     response = SuccessResponse({'access_token': access_token, 'refresh_token': refresh_token}).generate_response()
        #     set_access_cookies(response, access_token)
        #     set_refresh_cookies(response, refresh_token)
        # else:            
        #     response = SuccessResponse({'access_token': access_token}).generate_response()            
        #     set_access_cookies(response, access_token)

        refresh_token = create_refresh_token(identity=token_info)
        response = SuccessResponse({'access_token': access_token, 'refresh_token': refresh_token}).generate_response()
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        
        return response

    @jwt_required()
    def api_create_user(self):
        args = parse_webargs(self.CREATE_USER, request)
        api_params_names = ApplicationAPIDefinition.CreateUser.Params
        # Load the user accessed the endpoint
        current_user = get_current_user()

        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()

        try:
            with mongo_client() as client:
                tableUsers = TableUsers(client) 
                username = args[api_params_names.USERNAME]
                password = args[api_params_names.PASSWORD]
                role = args[api_params_names.ROLE]       
                total_uploads = args.get(api_params_names.TOTAL_UPLOADS, None)
                total_uploads_mg = args.get(api_params_names.TOTAL_UPLOADS_MG, None)
                max_filesize_mg = args.get(api_params_names.MAX_FILESIZE_MG, None)
                active = args.get(api_params_names.ACTIVE, True) 

                tableUsers.addUser(username, password, role, total_uploads=total_uploads, total_uploads_mg=total_uploads_mg, max_filesize_mg=max_filesize_mg, active=active)

                return SuccessResponse(dict(username=username, role=role)).generate_response()
        except Exception as e:
            return ErrorResponse(AuthenticationException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed due to: {e}')).generate_response()
        

    @jwt_required()
    def api_update_user(self):
        args = parse_webargs(self.UPDATE_USER, request)
        api_params_names = ApplicationAPIDefinition.UpdateUser.Params
        current_user = get_current_user()

        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()
        
        try:
            with mongo_client() as client:
                tableUsers = TableUsers(client) 
                username = args[api_params_names.USERNAME]
                role = args.get(api_params_names.ROLE, None)            
                total_uploads = args.get(api_params_names.TOTAL_UPLOADS, None)
                total_uploads_mg = args.get(api_params_names.TOTAL_UPLOADS_MG, None)
                max_filesize_mg = args.get(api_params_names.MAX_FILESIZE_MG, None)
                active = args.get(api_params_names.ACTIVE, None) 
                
                tableUsers.updateUser(username, role=role, active=active, total_uploads=total_uploads, total_uploads_mg=total_uploads_mg, max_filesize_mg=max_filesize_mg)

                user_info = tableUsers.getUser(username, active=None)

                if user_info:        
                    return SuccessResponse(user_info).generate_response()
                else:
                    return ErrorResponse(AuthenticationException(self.ErrorCodes.USER_NOT_EXISTS, 'required user not exists')).generate_response()

        except Exception as e:
            return ErrorResponse(AuthenticationException(self.ErrorCodes.UNEXPECTED_ERROR, f'failed due to: {e}')).generate_response()        
        
    @jwt_required()
    def api_get_users(self):
        args = parse_webargs(self.GET_USERS, request)        
        current_user = get_current_user()
                   
        with mongo_client() as client:   
            tableUsers = TableUsers(client)    
            
            if SystemRoles.is_admin(current_user.role):           
                user_infos = tableUsers.getUsers(active=None)
                
                return SuccessResponse({"users": user_infos}).generate_response()
            else:
                user_info = tableUsers.getUser(current_user.username, active=None)
                
                return SuccessResponse({"users": [user_info, ]}).generate_response()
            
    @jwt_required()
    def api_change_password(self):
        args = parse_webargs(self.CHANGE_PASSWORD, request)
        api_params_names = ApplicationAPIDefinition.ChangePassword.Params
        current_user = get_current_user()

        with mongo_client() as client:
            tableUsers = TableUsers(client) 
            
            username = current_user.username

            current_password = args[api_params_names.CURRENT_PASSWORD]
            new_password = args[api_params_names.NEW_PASSWORD]
            
            user_info = tableUsers.getValidateUser(username, current_password)            
            tableUsers.updateUser(username, new_password=new_password)
        
            return SuccessResponse({"username": username}).generate_response()
        
    @jwt_required()
    def api_reset_password_user(self):
        args = parse_webargs(self.RESET_PASSWORD, request)
        api_params_names = ApplicationAPIDefinition.ResetUserPassword.Params
        current_user = get_current_user()

        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()

        with mongo_client() as client:
            tableUsers = TableUsers(client) 
            username = args[api_params_names.USERNAME]
            new_password = args[api_params_names.NEW_PASSWORD]

            tableUsers.updateUser(username, new_password=new_password)            

            return SuccessResponse({"username": username}).generate_response()
        
    @jwt_required()
    def api_remove_user(self):
        args = parse_webargs(self.REMOVE_USER, request)
        api_params_names = ApplicationAPIDefinition.RemoveUser.Params
        current_user = get_current_user()

        if not SystemRoles.is_admin(current_user.role):
            return ErrorResponse(AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')).generate_response()

        with mongo_client() as client:
            tableUsers = TableUsers(client) 
            usernames = args[api_params_names.USERNAMES]
            if usernames:
                tableUsers.deleteUser(*usernames)
            return SuccessResponse({"usernames": usernames}).generate_response()
                    
