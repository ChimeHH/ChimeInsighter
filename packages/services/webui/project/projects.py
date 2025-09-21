from flask import request
from marshmallow import Schema, fields, ValidationError
from flask_jwt_extended import (jwt_required, get_current_user)

from exlib.settings import osenv
from exlib.utils import filesystemex
from exlib.http.http_webargs_ex import GeneralMetaSchema, NullableString, NullableNested, NullableList, NullableInt, NullableBool, Json
from exlib.http.http_server_api_ex import *

from database.core.mongo_db import mongo_client
from database.master_database import TableUsers, TableProjects, ScanOptions, ScanTypes

from services.webui.interfaces.application_api import ApplicationAPIDefinition
from services.webui.core.general_api_service import GeneralAPIService
from database.core.roles import SystemRoles, SystemPermissions, ProjectRoles, ProjectPermissions

from pprint import pprint
from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class UserRole:
    USERNAME = 'username'
    ROLE = 'role'  # ProjectRole

class ProjectsService(GeneralAPIService):
    @staticmethod
    def validate_product_role(role):
        valid_roles = ProjectRoles.get_product_roles()
        if not ProjectRoles.role_valid(role):
            raise ValidationError('The product role is invalid')

    class ScanOptionsValidation:
        SCAN_OPTIONS = type('SCAN_OPTIONS', (GeneralMetaSchema, Schema), {
            ScanOptions.SCAN_TYPES: fields.Dict(keys=fields.Str(), values=fields.Bool()),            
            ScanOptions.RAW_BINARY: fields.Bool(missing=False),
        })

    @staticmethod
    def is_vendor_legit(vendors):
        if any(val == '' for val in vendors):
            raise ValidationError('Vendor values must not be empty')

    PROJECT_ROLE_USER = type('ROLE_USER', (GeneralMetaSchema, Schema), {
        UserRole.ROLE: fields.Str(required=True),
        UserRole.USERNAME: fields.Str(required=True),
    })

    CREATE_PROJECT = type('CREATE_PROJECT', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.CreateProject.Params.PROJECT_NAME: fields.Str(required=True),
        ApplicationAPIDefinition.CreateProject.Params.DESCRIPTION: NullableString(allow_none=False, missing=None),
        ApplicationAPIDefinition.CreateProject.Params.VENDORS: NullableList(fields.Str(), validate=is_vendor_legit),
        ApplicationAPIDefinition.CreateProject.Params.DEPARTMENT: fields.Str(missing=None),
        ApplicationAPIDefinition.CreateProject.Params.SCAN_OPTIONS: fields.Nested(ScanOptionsValidation.SCAN_OPTIONS, missing=None),
        ApplicationAPIDefinition.CreateProject.Params.CUSTOMERIZED_DATA: Json(missing=None),
        ApplicationAPIDefinition.CreateProject.Params.USERS: NullableList(fields.Nested(PROJECT_ROLE_USER)),
    })

    UPDATE_PROJECT = type('UPDATE_PROJECT', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.UpdateProject.Params.PROJECT_ID: fields.Str(required=True),
        ApplicationAPIDefinition.UpdateProject.Params.UPDATES: fields.Nested(type('UPDATE_PROJECT_UPDATES', (GeneralMetaSchema, Schema), {
            ApplicationAPIDefinition.UpdateProject.Params.Updates.PROJECT_NAME: NullableString(allow_none=True, missing=None),
            ApplicationAPIDefinition.UpdateProject.Params.Updates.DESCRIPTION: NullableString(allow_none=True, missing=None),
            ApplicationAPIDefinition.UpdateProject.Params.Updates.VENDORS: NullableList(fields.Str(), validate=is_vendor_legit),
            ApplicationAPIDefinition.UpdateProject.Params.Updates.DEPARTMENT: NullableString(allow_none=True, missing=None),
            ApplicationAPIDefinition.UpdateProject.Params.Updates.CUSTOMERIZED_DATA: Json(allow_none=True, missing=None),
            ApplicationAPIDefinition.UpdateProject.Params.Updates.USERS: NullableList(fields.Nested(PROJECT_ROLE_USER)), }))
    })

    REMOVE_PROJECTS = type('REMOVE_PROJECTS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.RemoveProjects.Params.PROJECT_IDS: fields.List(fields.Str(), required=True)
    })

    GET_PROJECTS = type('GET_PROJECTS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetProjects.Params.PROJECT_NAMES: fields.List(fields.Str(), missing=[])
    })

    GET_PROJECT_SUMMARY = type('GET_PROJECT_SUMMARY', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetProjectSummary.Params.PROJECT_ID: fields.Str(required=True)
    })

    def init_apis(self):
        self.engine.app.add_url_rule(ApplicationAPIDefinition.CreateProject.URI,
                              ApplicationAPIDefinition.CreateProject.NAME,
                              view_func=self.api_create_project,
                              methods=[ApplicationAPIDefinition.CreateProject.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.UpdateProject.URI,
                              ApplicationAPIDefinition.UpdateProject.NAME,
                              view_func=self.api_update_project,
                              methods=[ApplicationAPIDefinition.UpdateProject.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.RemoveProjects.URI,
                              ApplicationAPIDefinition.RemoveProjects.NAME,
                              view_func=self.api_remove_projects,
                              methods=[ApplicationAPIDefinition.RemoveProjects.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetProjects.URI,
                              ApplicationAPIDefinition.GetProjects.NAME,
                              view_func=self.api_get_projects,
                              methods=[ApplicationAPIDefinition.GetProjects.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetProjectSummary.URI,
                              ApplicationAPIDefinition.GetProjectSummary.NAME,
                              view_func=self.api_get_project_sumary,
                              methods=[ApplicationAPIDefinition.GetProjectSummary.METHOD])

    @jwt_required()
    def api_create_project(self):
        args = parse_webargs(self.CREATE_PROJECT, request)        
        current_user = get_current_user()

        errmsg = self.__validate__()
        if errmsg:
            raise AuthenticationException(errmsg[0], errmsg[1])
    
        if current_user.role not in SystemRoles.get_permission_roles(SystemPermissions.MANAGE_PROJECTS):
            raise AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')
        
        params = ApplicationAPIDefinition.CreateProject.Params
        
        with mongo_client() as client:
            tableProjects = TableProjects(client)
            
            project_name = args[params.PROJECT_NAME]
            description = args.get(params.DESCRIPTION, None)
            vendors = args.get(params.VENDORS, None)
            department = args.get(params.DEPARTMENT, None)
            scan_options = args.get(params.SCAN_OPTIONS, None)
            customerized_data = args.get(params.CUSTOMERIZED_DATA, None)
            users = args.get(params.USERS, None)

            project_id = tableProjects.addProject(current_user.username, project_name, description=description, vendors=vendors, 
                                   department=department, scan_options=scan_options, customerized_data=customerized_data, users=users)

            return SuccessResponse({"project_id": project_id}).generate_response()

    @jwt_required()
    def api_update_project(self):
        args = parse_webargs(self.UPDATE_PROJECT, request)        
        current_user = get_current_user()

        errmsg = self.__validate__()
        if errmsg:
            raise AuthenticationException(errmsg[0], errmsg[1])

        params = ApplicationAPIDefinition.UpdateProject.Params
        
        pprint(f"args: {args}")
        with mongo_client() as client:
            tableProjects = TableProjects(client)

            project_id = args[params.PROJECT_ID]

            self.__assert_manage__(tableProjects, project_id, current_user)

            updates = args.get(params.UPDATES)
            if updates:
                project_name = updates.get(params.Updates.PROJECT_NAME, None)
                description = updates.get(params.Updates.DESCRIPTION, None)
                vendors = updates.get(params.Updates.VENDORS, None)
                department = updates.get(params.Updates.DEPARTMENT, None)
                customerized_data = updates.get(params.Updates.CUSTOMERIZED_DATA, None)
                users = updates.get(params.Updates.USERS, None)
                if users is not None:
                    users = { r[UserRole.USERNAME]: r[UserRole.ROLE] for r in users }

                tableProjects.updateProject(project_id, project_name=project_name, description=description, 
                                            vendors=vendors, department=department, 
                                            customerized_data=customerized_data, users=users)
                
            project = tableProjects.getProject(project_id)
        return SuccessResponse({"project": project}).generate_response()

    @jwt_required()
    def api_remove_projects(self):
        args = parse_webargs(self.REMOVE_PROJECTS, request)        
        current_user = get_current_user()

        if current_user.role not in SystemRoles.get_permission_roles(SystemPermissions.MANAGE_PROJECTS):
            raise AuthenticationException(self.ErrorCodes.NO_PERMISSION, 'no permission to do this')

        params = ApplicationAPIDefinition.RemoveProjects.Params
        project_ids = args[params.PROJECT_IDS]

        with mongo_client() as client:
            tableProjects = TableProjects(client)

            projects = [ project for project in tableProjects.getProjects(*project_ids) if self.__assert_manage__(tableProjects, project[tableProjects.PROJECT_ID], current_user, raise_exception=False) ]

            tableProjects.deleteProject(*project_ids)

        return SuccessResponse({"result": "OK"}).generate_response()

    @jwt_required()
    def api_get_projects(self):
        args = parse_webargs(self.GET_PROJECTS, request)        
        current_user = get_current_user()
        
        params = ApplicationAPIDefinition.GetProjects.Params
        project_names = args[params.PROJECT_NAMES]

        with mongo_client() as client:
            tableProjects = TableProjects(client)

            projects = [ project for project in tableProjects.findProjects(*project_names) if self.__assert_view__(tableProjects, project[tableProjects.PROJECT_ID], current_user, raise_exception=False) ]
                    
            return SuccessResponse({"projects": projects}).generate_response()

    @jwt_required()
    def api_get_project_sumary(self):
        args = parse_webargs(self.GET_PROJECT_SUMMARY, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.GetProjectSummary.Params
        project_id = args[params.PROJECT_ID]

        with mongo_client() as client:
            tableProjects = TableProjects(client)
            tableUsers = TableUsers(client)

            self.__assert_view__(tableProjects, project_id, current_user)
            
            project = tableProjects.getProject(project_id)
            project['users'] = [{UserRole.USERNAME: username, UserRole.ROLE: role} for username, role in project.pop('users', {}).items()]
            project['candidates'] = [{UserRole.USERNAME: r[tableUsers.USERNAME], UserRole.ROLE: r[tableUsers.ROLE]} for r in tableUsers.getUsers(active=True)]

            return SuccessResponse(project).generate_response()
