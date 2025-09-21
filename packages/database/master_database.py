import hashlib
import psutil
import crypt
import re
import sys
import json
from datetime import datetime
import traceback

from exlib.settings import osenv
from exlib.classes.base import EnumClass
from amq.config import AmqConfig
from datetime import datetime
from pymongo import UpdateOne,InsertOne,DeleteOne,UpdateMany,DeleteMany,ASCENDING, DESCENDING
from .core.roles import SystemRoles,SystemPermissions,ProjectRoles,ProjectPermissions
from .core.errors import *
from .core.database import DatabaseClass
from .om_database import OmDatabase
from .findings_database import TableThreats,TableFiles,TablePackages

from pprint import pprint

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class ScanTypes(EnumClass):
    SBOM = 'sbom'
    PUBLIC = 'public'
    ZERODAY = 'zeroday'
    MOBILE = 'mobile'
    INFOLEAK = 'infoleak'
    MALWARE = 'malware'
    PASSWORD = 'password'
    INTERFACE = 'interface'
    MISCONFIGURATION = 'misconfiguration'

    @classmethod
    def all_types(cls, default=True):        
        return { v: default for v in cls.values() }


class ScanOptions(EnumClass):
    SCAN_TYPES = 'scan_types'
    RAW_BINARY = 'raw_binary'
        
    def __init__(self, options, license_scope=None):
        if not options:
            options = {}

        # if any type, that is not provided, to true
        self.scan_types = options.get(self.SCAN_TYPES, None)
        self.raw_binary = options.get(self.RAW_BINARY, False)  

        if not self.scan_types:
            self.scan_types = ScanTypes.all_types(default=True)
        else:
            for k in ScanTypes.all_types():
                if k not in self.scan_types:
                    self.scan_types[k] = True
        
        if license_scope:                      
            if self.raw_binary and not license_scope.get('raw_binary', False):
                self.raw_binary = False
                self.scan_types[ScanTypes.ZERODAY] = False
            
            for k, v in self.scan_types.items():
                if v and not license_scope.get(k, True):
                    self.scan_types[k] = False
            

    def __str__(self):
        return f"ScanOptions(scan_types={self.scan_types}, raw_binary={self.raw_binary})"

    def __repr__(self):
        return self.__str__()

    def is_scan_enabled(self, scan_type, default=True):
        return self.scan_types.get(scan_type, default)

    def to_dict(self):
        return { self.SCAN_TYPES: self.scan_types, self.RAW_BINARY: self.raw_binary}

class ScanModes(EnumClass):
    PRIORITY = 'priority'
    EXTRACTED = 'extracted'
    RESCAN = 'rescan'
    REVISE = 'revise'
    STRATEGY = 'strategy'
    ALLOW_CACHE = 'allow_cache'
    ALLOW_BLACKLIST = 'allow_blacklist'
    AUTO_CLEANUP = 'auto_cleanup'

    class Strategy:
        FAST = 'fast'
        BALANCE = 'balance'
        COVERAGE = 'coverage'

    def __init__(self, modes):
        if not modes:
            modes = {}

        self.priority = modes.get(self.PRIORITY, 1)
        self.extracted = modes.get(self.EXTRACTED, False)
        self.rescan = modes.get(self.RESCAN, False)
        self.revise = modes.get(self.REVISE, False)        
        self.strategy = modes.get(self.STRATEGY, self.Strategy.FAST)
        self.allow_cache = modes.get(self.ALLOW_CACHE, True)
        self.allow_blacklist = modes.get(self.ALLOW_BLACKLIST, True)
        self.auto_cleanup = modes.get(self.AUTO_CLEANUP, True)

    def __str__(self):
        return f"ScanModes(priority={self.priority}, extracted={self.extracted}, rescan={self.rescan}, revise={self.revise}, strategy={self.strategy}, \
                         allow_cache={self.allow_cache}, allow_blacklist={self.allow_blacklist}, auto_cleanup={self.auto_cleanup})"

    def __repr__(self):
        return self.__str__()

    def to_dict(self):
        return { self.PRIORITY: self.priority, self.EXTRACTED: self.extracted, self.RESCAN: self.rescan, self.REVISE: self.revise, self.STRATEGY: self.strategy, 
                self.ALLOW_CACHE: self.allow_cache, self.ALLOW_BLACKLIST: self.allow_blacklist, self.AUTO_CLEANUP: self.auto_cleanup}
    
class TableMasterMissingCollectionName(Exception):
    pass

class DatabaseMaster(DatabaseClass):
    def __init__(self, client, collection, database):
        if not database:
            database = self.config().master
        super().__init__(client, collection, database)

class TableUsers(DatabaseMaster):
    USERNAME = 'username'
    PASSWORD = 'password'
    ROLE = 'role'
    TOTAL_UPLOADS = 'total_uploads'    
    TOTAL_UPLOADS_MG = 'total_uploads_mg'
    MAX_FILESIZE_MG = 'max_filesize_mg'
    ACTIVE = 'active'

    CREATED_TIME = 'created_time'
    UPDATED_TIME = 'updated_time'

    def __init__(self, client, collection='users', database=None):
        super().__init__(client, collection, database)

    @classmethod
    def compute_password(cls, original_password, salt=None):
        if not salt:
            salt = crypt.mksalt(method=crypt.METHOD_SHA512)

        return crypt.crypt(original_password, salt)

    @classmethod
    def check_password(cls, original_password, hashed_password):        
        salt = hashed_password[:hashed_password.rindex('$')+1]
        if crypt.crypt(original_password, salt) != hashed_password:
            raise InvalidPassword()

    def create_table(self):    
        self.coll.create_index([(self.USERNAME, ASCENDING), ], unique=True, background=True)

        self.smooth_upgrade()

    def smooth_upgrade(self):
        pass
        

    def add_user(self, username, password, role, total_uploads=None, total_uploads_mg=None, max_filesize_mg=None, active=True):
        now = datetime.utcnow()
        hashed_password = self.compute_password(password)
        try:
            self._requests.append(UpdateOne({self.USERNAME: username}, {"$set": {self.PASSWORD: hashed_password, self.ROLE: role, 
                                            self.TOTAL_UPLOADS: total_uploads, self.TOTAL_UPLOADS_MG: total_uploads_mg, self.MAX_FILESIZE_MG: max_filesize_mg,
                                            self.ACTIVE: active, self.CREATED_TIME: now, self.UPDATED_TIME: now}}, upsert=True))
            
            self.commit()
        except:
            raise DuplicatedUserName("{} alreay exists".format(username))

    def get_user(self, username, password=None, active=True, projection=None):
        if not projection:
            projection = {self.USERNAME: 1, self.PASSWORD: 1, self.ROLE: 1, self.CREATED_TIME: 1, 
                        self.TOTAL_UPLOADS: 1, self.TOTAL_UPLOADS_MG: 1, self.MAX_FILESIZE_MG: 1, self.UPDATED_TIME: 1, }

        try:
            records = self.coll.find({self.USERNAME: username, self.ACTIVE: active, }, projection=projection)
            if password:
                self.check_password(password, records[0][self.PASSWORD])

            return records
        except:
            raise InvalidUserNameOrPassword(username) from None

    def update_user(self, username, new_password=None, role=None, total_uploads=None, total_uploads_mg=None, max_filesize_mg=None, active=None):        
        record = {}
        if new_password:
            record[self.PASSWORD] = self.compute_password(new_password)
        if role:
            record[self.ROLE] = role

        if total_uploads != None:
            record[self.TOTAL_UPLOADS] = total_uploads
        if total_uploads_mg != None:
            record[self.TOTAL_UPLOADS_MG] = total_uploads_mg
        if max_filesize_mg != None:
            record[self.MAX_FILESIZE_MG] = max_filesize_mg

        if active != None:
            record[self.ACTIVE] = active

        if record:
            record[self.UPDATED_TIME] = datetime.utcnow()
            self._requests.append(UpdateOne({self.USERNAME: username}, 
                                 {'$set': record}, upsert=False))
        
        self.commit()

    def get(self, *usernames, active=True, projection=None):
        if not projection:
            projection = {self.USERNAME: 1, self.ROLE: 1, self.ACTIVE: 1, self.CREATED_TIME: 1, 
                        self.TOTAL_UPLOADS: 1, self.TOTAL_UPLOADS_MG: 1, self.MAX_FILESIZE_MG: 1, self.UPDATED_TIME: 1, }

        query = dict()
        if usernames:
            query[self.USERNAME] = {"$in": usernames}

        if active != None:
            query[self.ACTIVE] = active
        return self.coll.find(query, projection=projection)

    def delete_user(self, *usernames):
        if usernames:
            self._requests.append(DeleteMany({self.USERNAME: {"$in": usernames}}))
            self.commit()

    def addUser(self, username, password, role, total_uploads=None, total_uploads_mg=None, max_filesize_mg=None, active=True):
        self.add_user(username, password, role, total_uploads=total_uploads, total_uploads_mg=total_uploads_mg, max_filesize_mg=max_filesize_mg, active=active)

    def getValidateUser(self, username, password, projection=None):
        if not password:
            raise InvalidUserNameOrPassword(f"Auth failed: {username}")

        return list(self.get_user(username, password, active=True, projection=projection))[0]

    def getUser(self, username, active=True):
        users = list(self.get(username, active=active))
        if users:
            return users[0]

        return None

    def getUsers(self, *usernames, active=None):
        users = list(self.get(*usernames, active=active))
        return users

    def deleteUser(self, *usernames):
        self.delete_user(*usernames)

    def updateUser(self, username, new_password=None, role=None, total_uploads=None, total_uploads_mg=None, max_filesize_mg=None, active=None):
        self.update_user(username, new_password=new_password, role=role, total_uploads=total_uploads, total_uploads_mg=total_uploads_mg, max_filesize_mg=max_filesize_mg, active=active)

    def userRole(self, username):
        users = list(self.get_user(username, active=True))
        if not users:
            return None

        return users[0][self.ROLE]


    def consumeBudget(self, username, filesize, count=1):
        user = self.getUser(username, active=True)
        if not user:
            return None

        total_uploads = user.get(self.TOTAL_UPLOADS)
        total_uploads_mg = user.get(self.TOTAL_UPLOADS_MG)
        max_filesize_mg = user.get(self.MAX_FILESIZE_MG)

        if total_uploads is not None:
            if total_uploads < count:
                return None
            total_uploads -= count

        if total_uploads_mg is not None:
            if total_uploads_mg < filesize:
                return None
            total_uploads_mg -= filesize

        if max_filesize_mg is not None:
            if max_filesize_mg < filesize:
                return None
            max_filesize_mg -= filesize
        
        budget = dict(total_uploads=total_uploads, total_uploads_mg=total_uploads_mg, max_filesize_mg=max_filesize_mg)
        self.update_user(username, **budget)
        
        return budget


class TableProjects(DatabaseMaster):    
    PROJECT_ID = 'project_id'
    PROJECT_NAME = 'project_name'
    
    VENDORS = 'vendors'
    DESCRIPTION = 'description' 
    DEPARTMENT = 'department'   
    CREATED_TIME = 'created_time'
    UPDATED_TIME = 'updated_time'
    CUSTOMERIZED_DATA = 'customerized_data'

    SCAN_OPTIONS = 'scan_options'
    CREATER = 'creater'

    USERS = 'users'

    def __init__(self, client, collection='projects', database=None):
        super().__init__(client, collection, database)

    def create_table(self):    
        self.coll.create_index([(self.PROJECT_ID, ASCENDING), ], unique=True, background=True)
        self.coll.create_index([(self.PROJECT_NAME, ASCENDING), ], unique=True, background=True)

        self.smooth_upgrade()

    def smooth_upgrade(self):
        pass

    def add(self, creater, project_id, project_name, vendors=None, description=None, department=None, customerized_data={}, scan_options=None, users={}):        
        now = datetime.utcnow()
        if not project_name:
            project_name = project_id

        if not users:
            users = {creater: ProjectRoles.ADMIN}

        self._requests.append(InsertOne({self.PROJECT_ID: project_id, self.PROJECT_NAME: project_name,
                                         self.VENDORS: vendors, self.DESCRIPTION: description, 
                                         self.DEPARTMENT: department, self.CUSTOMERIZED_DATA: customerized_data, self.CREATER: creater,
                                         self.USERS: users, self.SCAN_OPTIONS: scan_options, self.CREATED_TIME: now, self.UPDATED_TIME: now}))
        
        self.commit()

    def get(self, *project_ids, projection=None):
        if not projection:
            projection = {self.PROJECT_ID: 1, self.PROJECT_NAME: 1, 
                      self.VENDORS: 1, self.DESCRIPTION: 1, 
                      self.DEPARTMENT: 1, self.CUSTOMERIZED_DATA: 1, 
                      self.SCAN_OPTIONS: 1, self.CREATER: 1,
                      self.USERS: 1,
                      self.CREATED_TIME: 1, self.UPDATED_TIME: 1, }
        try:
            if project_ids:
                return self.coll.find({self.PROJECT_ID: {"$in": project_ids}, }, projection=projection)
            else:
                return self.coll.find({}, projection=projection)
        except:
            raise InvalidProjectId(project_ids) 

    def find(self, *project_names, projection=None):
        if not projection:
            projection = {self.PROJECT_ID: 1, self.PROJECT_NAME: 1,
                      self.VENDORS: 1, self.DESCRIPTION: 1, 
                      self.DEPARTMENT: 1, self.CUSTOMERIZED_DATA: 1,  
                      self.SCAN_OPTIONS: 1, self.CREATER: 1,
                      self.USERS: 1,
                      self.CREATED_TIME: 1, self.UPDATED_TIME: 1, }

        if project_names:
            return self.coll.find({self.PROJECT_NAME: {"$in": project_names}, }, projection=projection)
        else:
            return self.coll.find({}, projection=projection)
    
    def update(self, project_id, project_name=None, vendors=None, description=None, department=None, customerized_data=None, scan_options=None, users=None):
        record = dict()

        if project_name:
            record[self.PROJECT_NAME] = project_name
        
        if vendors != None:
            record[self.VENDORS] = vendors
        
        if description != None:
            record[self.DESCRIPTION] = description
        
        if department != None:
            record[self.DEPARTMENT] = department

        if customerized_data != None:
            record[self.CUSTOMERIZED_DATA] = customerized_data

        if scan_options != None:
            record[self.SCAN_OPTIONS] = scan_options
        
        if users != None:
            record[self.USERS] = users
        
        if record:
            record[self.UPDATED_TIME] = datetime.utcnow()
            self._requests.append(UpdateOne({self.PROJECT_ID: project_id}, 
                                 {'$set': record}, upsert=False))            
            self.commit()    

    def delete(self, *project_ids):
        if project_ids:
            self._requests.append(DeleteMany({self.PROJECT_ID: {"$in": project_ids}}))

            tableVersions = TableVersions(self._client)
            tableVersions.delete(project_ids=project_ids)
            
            self.commit()
    
    def addProject(self, creater, project_name, project_id=None, description=None, vendors=[], department=None, scan_options=None, customerized_data={}, users=None):
        projects = list(self.find(project_name))
        if projects:
            raise ProjectAlreayExists("Project {} alreay exists".format(project_name))

        try:
            if not project_id:
                project_id = AmqConfig.new_project()
            self.add(creater, project_id, project_name, vendors=vendors, description=description, department=department, customerized_data=customerized_data, scan_options=scan_options)
            return project_id
        except Exception as e:
            raise ProjectAddFailed(f"Project {project_name}, reason: {e}")  from None

    
    def getProject(self, project_id):
        projects = list(self.get(project_id))
        if not projects:
            raise ProjectNotFound("Project {}".format(project_id))
        
        return projects[0]

    def getProjects(self, *project_ids):
        return list(self.find(*project_ids))

    def findProject(self, project_name):
        projects = list(self.find(project_name))
        if not projects:
            raise ProjectNotFound("Project {}".format(project_name))

        return projects[0]

    def findProjects(self, *project_names):
        projects = list(self.find(*project_names))        
        return projects        

    def deleteProject(self, *project_ids):
        tableVersions = TableVersions(self._client)
        for project_id in project_ids:
            tableVersions.deleteVersions(project_id)

        self.delete(*project_ids)

    def updateProject(self, project_id, project_name=None, vendors=None, description=None, department=None, customerized_data=None, scan_options=None, users=None):
        try:
            self.update(project_id, project_name=project_name, vendors=vendors, 
                        description=description, department=department, customerized_data=customerized_data, 
                        scan_options=scan_options, users=users)            

            return self.getProject(project_id)
        except Exception as e:
            raise ProjectUpdateFailed(f"Project {project_id}, reason: {e}") from None


    def userProjectRole(self, project_id, username, role):
        if SystemRoles.is_admin(role):
            return ProjectRoles.ADMIN

        project = self.getProject(project_id)
        if project:
            return project[self.USERS].get(username, None)
        return None

    def userProjectPermissions(self, project_id, username, role):
        role = self.userProjectRole(project_id, username, role)
        if not role:
            return []
        return ProjectRoles.get_role_permissions(role)




class TableVersions(DatabaseMaster):
    PROJECT_ID = 'project_id'
    VERSION_ID = 'version_id'
    VERSION_NAME = 'version_name'
    FILEPATH = 'filepath'
    VERSION_DATE = 'version_date'
    PRIORITY = 'priority'
    DESCRIPTION = 'description'
    SCAN_MODES = 'scan_modes' # a copy from project, to issue changes in the project after the scanning; and more flags to the flags
    PROGRESS = 'progress'
    STATUS = 'status'
    CUSTOMERIZED_DATA = 'customerized_data'  
    CREATED_TIME = 'created_time'
    UPDATED_TIME = 'updated_time'

    SCORES = 'scores'
    STATS = 'stats'

    CREATER = 'creater'
    TESTER = 'tester'
    START_TIME = 'start_time'
    FINISH_TIME = 'finish_time'

    class Status(EnumClass):
        CREATED = 'created'
        EXTRACTING = 'extracting'
        EXTRACTED = 'extracted'
        SCANNING = 'scanning'
        COMPLETED = 'completed'
        CANCELLED = 'cancelled'

    def __init__(self, client, collection='versions', database=None):
        super().__init__(client, collection, database)

    def create_table(self):    
        self.coll.create_index([(self.VERSION_ID, ASCENDING), ], unique=True, background=True)
        self.coll.create_index([(self.PROJECT_ID, ASCENDING), (self.VERSION_NAME, ASCENDING), ], unique=True, background=True)
        self.coll.create_index([(self.PROJECT_ID, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.VERSION_NAME, ASCENDING), ], unique=False, background=True)

        self.smooth_upgrade()

    def smooth_upgrade(self):
        for r in self.coll.find({}, projection={self.VERSION_ID: 1, self.STATS: 1, }):
            version_id = r[self.VERSION_ID]
            stats = r.get(self.STATS, None)
            if stats and not isinstance(stats, dict):
                try:
                    self._requests.append(UpdateOne({self.VERSION_ID: version_id}, {'$set': {self.STATS: json.loads(stats), }}, upsert=False))
                except:
                   self._requests.append(UpdateOne({self.VERSION_ID: version_id}, {'$set': {self.STATS: None, }}, upsert=False))
                
        self.commit()

    def add(self, creater, project_id, version_id, version_name, filepath, version_date=None, description='', customerized_data={}, scan_modes={}):
        now = datetime.utcnow()
        if not version_name:
            version_name = version_id
        self._requests.append(InsertOne({self.PROJECT_ID: project_id, self.VERSION_ID: version_id, self.VERSION_NAME: version_name,
                                         self.FILEPATH: str(filepath), self.VERSION_DATE: version_date, self.DESCRIPTION: description, 
                                         self.CUSTOMERIZED_DATA: customerized_data, self.SCAN_MODES: scan_modes, self.PROGRESS: OmDatabase.vesion_idle_progress(),
                                         self.CREATED_TIME: now, self.UPDATED_TIME: now, self.START_TIME: None, self.FINISH_TIME: None, 
                                         self.CREATER: creater, self.TESTER: creater, self.STATUS: self.Status.CREATED}))
        
        self.commit()


    def get(self, version_id=None, projection=None):
        if not projection:
            projection = {self.PROJECT_ID: 1, self.VERSION_ID: 1, self.VERSION_NAME: 1,
                      self.FILEPATH: 1, self.VERSION_DATE: 1, self.DESCRIPTION: 1, self.CUSTOMERIZED_DATA: 1, 
                      self.SCAN_MODES: 1, self.PROGRESS: 1, self.SCORES:1, self.STATS: 1, self.STATUS: 1,
                      self.CREATER: 1, self.TESTER: 1, self.CREATED_TIME: 1, self.UPDATED_TIME: 1, self.START_TIME: 1, self.FINISH_TIME: 1}
        
        if version_id:
            return self.coll.find({self.VERSION_ID: version_id}, projection=projection)
        else:
            return self.coll.find({}, projection=projection)
        

    def find(self, *version_names, project_id=None, projection=None, fuzzy=True):
        if not projection:
            projection = {self.PROJECT_ID: 1, self.VERSION_ID: 1, self.VERSION_NAME: 1,
                      self.FILEPATH: 1, self.VERSION_DATE: 1, self.DESCRIPTION: 1, self.CUSTOMERIZED_DATA: 1, 
                      self.SCAN_MODES: 1, self.PROGRESS: 1, self.SCORES:1, self.STATS: 1, self.STATUS: 1,
                      self.CREATER: 1, self.TESTER: 1, 
                      self.CREATED_TIME: 1, self.UPDATED_TIME: 1, self.START_TIME: 1, self.FINISH_TIME: 1}

        query = {}
        if project_id:
            query[self.PROJECT_ID] = project_id            
        if version_names:
            if fuzzy:            
                escaped_terms = [re.escape(term) for term in version_names]   
                regex_pattern = '|'.join(escaped_terms)  
                query[self.VERSION_NAME] = {"$regex": regex_pattern, '$options': 'i'}
            else:
                query[self.VERSION_NAME] = {"$in": version_names}

        return self.coll.find(query, projection=projection)
        

    def update(self, version_id, tester=None, filepath=None, version_name=None, version_date=None, 
                    description=None, customerized_data=None, scan_modes=None, progress=None, 
                    scores=None, stats=None, start_time=None, finish_time=None, status=None):
        record = dict()
        now = datetime.utcnow()

        if version_name:
            record[self.VERSION_NAME] = version_name

        if filepath:
            record[self.FILEPATH] = str(filepath)
            record[self.START_TIME] = now
            record[self.FINISH_TIME] = None
        
        if description:
            record[self.DESCRIPTION] = description

        if version_date:
            record[self.VERSION_DATE] = version_date

        if customerized_data:
            if not record.get(self.CUSTOMERIZED_DATA, None):
                record[self.CUSTOMERIZED_DATA] = customerized_data
            else:
                record[self.CUSTOMERIZED_DATA].update(customerized_data)

        if progress:
            record[self.PROGRESS] = progress

            # reset security scores, and threat stats, as progress is updated
            record[self.SCORES] = None
            record[self.STATS] = None
            
        if scores:
            record[self.SCORES] = scores

        if stats:
            record[self.STATS] = self.format_obj(stats)

        if start_time:
            record[self.START_TIME] = start_time

        if finish_time:
            record[self.FINISH_TIME] = finish_time

        if status:
            record[self.STATUS] = status
            if status in (self.Status.CREATED,):
                record[self.START_TIME] = None

            if status in [self.Status.CANCELLED, self.Status.COMPLETED]:
                record[self.FINISH_TIME] = now
            else:
                record[self.FINISH_TIME] = None
        
        if scan_modes:
            record[self.SCAN_MODES] = scan_modes

        if tester:
            record[self.TESTER] = tester

        if record:
            record[self.UPDATED_TIME] = now

            self._requests.append(UpdateOne({self.VERSION_ID: version_id}, 
                                 {'$set': record}, upsert=False))
            
            self.commit()


    def delete(self, *version_ids, project_ids=None):
        if version_ids:
            self._requests.append(DeleteMany({self.VERSION_ID: {"$in": version_ids}}))

        if project_ids:
            self._requests.append(DeleteMany({self.PROJECT_ID: {"$in": project_ids}}))

        self.commit()

    def addVersion(self, creater, project_id, version_id, version_name, filepath, version_date=None, description='', customerized_data={}, scan_modes={}):
        versions = list(self.find(version_name, project_id=project_id, fuzzy=False))
        if versions:
            raise VersionAlreadyExists(f"Version {project_id}/{version_name}")

        try:                
            self.add(creater, project_id, version_id, version_name, filepath, version_date=version_date, description=description, customerized_data=customerized_data, scan_modes=scan_modes)
            return version_id
        except Exception as e:
            raise VersionAddFailed(f"Version {project_id}/{version_name}, reason: {e}")

    def deleteVersion(self, *version_ids):
        try:
            for version_id in version_ids:
                tableFiles = TableFiles(self._client)
                tablePackages = TablePackages(self._client)
                tableThreats = TableThreats(self._client)

                tableFiles.deleteVersion(version_id)
                tablePackages.deleteVersion(version_id)
                tableThreats.deleteVersion(version_id)


            self.delete(*version_ids)
        except Exception as e:
            raise VersionDeleteFailed(f"Delete Versions {version_ids}, projects: {project_ids}, reason: {e}") from None

    def deleteVersions(self, project_id):
        try:
            versions = self.getVersions(project_id)
            version_ids = [ r[self.VERSION_ID] for r in versions ]

            self.deleteVersion(*version_ids)
        except Exception as e:
            raise VersionDeleteFailed(f"Delete versions of projects: {project_ids}, reason: {e}") from None

    def updateVersion(self, version_id, tester=None, filepath=None, version_name=None, version_date=None, 
                    description=None, customerized_data=None, scan_modes=None, progress=None, 
                    scores=None, stats=None, start_time=None, finish_time=None, status=None):
        try:
            self.update(version_id, tester=tester, version_name=version_name, filepath=filepath, version_date=version_date, 
                        description=description, customerized_data=customerized_data, scan_modes=scan_modes, progress=progress,
                        scores=scores, stats=stats, start_time=start_time, finish_time=finish_time, status=status)            
        except Exception as e:
            raise VersionUpdateFailed(f"Version {version_id}, reason: {e}") from None    

    def getVersion(self, version_id):
        if version_id:
            versions = list(self.get(version_id))
            if versions:
                return versions[0]
        
        raise VersionNotFound(f"version not found: {version_id}")

    def findVersion(self, version_name, project_id):
        versions = list(self.find(version_name, project_id=project_id, fuzzy=False))
        if not versions:
            raise ProjectNotFound("Project {}, version: {}".format(project_id, version_name))

        return versions[0]

    def getVersions(self, project_id):
        projection = {self.PROJECT_ID: 1, self.VERSION_ID: 1, self.VERSION_NAME: 1, self.DESCRIPTION: 1, 
                    self.PROGRESS: 1, self.VERSION_DATE: 1, self.SCORES:1, self.STATS: 1, self.STATUS: 1,
                    self.CREATED_TIME: 1, self.UPDATED_TIME: 1, self.START_TIME: 1, self.FINISH_TIME: 1, self.CREATER: 1, self.TESTER: 1, }
        return list(self.find(project_id=project_id, projection=projection))

    def findVersions(self, *version_names, project_id=None):
        projection = {self.PROJECT_ID: 1, self.VERSION_ID: 1, self.VERSION_NAME: 1, self.DESCRIPTION: 1, 
                    self.PROGRESS: 1, self.VERSION_DATE: 1, self.SCORES:1, self.STATS: 1, self.STATUS: 1,
                    self.CREATED_TIME: 1, self.UPDATED_TIME: 1, self.START_TIME: 1, self.FINISH_TIME: 1, self.CREATER: 1, self.TESTER: 1, }        
        versions = list(self.find(*version_names, project_id=project_id, projection=projection))
        return versions
        

if __name__ == "__main__":
    from database.core.mongo_db import mongo_client
    from amq.config import AmqConfig

    with mongo_client() as client:
        tableUsers = TableUsers(client)
        tableProjects = TableProjects(client)
        tableVersions = TableVersions(client)

        tableUsers.create_table()
        tableProjects.create_table()
        tableProjectRole.create_table()
        tableVersions.create_table()

        users = (('sysadmin', 'admin'), ('admin', 'admin'), ('manager', 'manager'), 
                ('member', 'member'), ('viewer', 'viewer'))

        for i in range(0, 3):
            for role, user in users:
                try:
                    tableUsers.addUser(f"{user}{i}", "{}@123".format(user), role)
                except Exception as e:
                    log.debug(f"Failed addUser {user}{i}, reason: {e}")

        i = 1
        for role, user in users:
            try:
                tableUsers.updateUser(f"{user}{i}", "{}@123".format(user), role, active=False)
            except Exception as e:
                log.debug(f"Failed updateUser {user}{i}, reason: {e}")

        i = 2
        for role, user in users:
            try:
                tableUsers.updateUser(f"{user}{i}", "{}@1234".format(user), 'viewer', active=None)
            except Exception as e:
                log.debug(f"Failed updateUser {user}{i}, reason: {e}")

        for i in range(2, 3):
            for role, user in users:
                try:
                    tableUsers.deleteUser(f"{user}{i}")
                except Exception as e:
                    log.debug(f"Failed addUser {user}{i}, reason: {e}")

        for i in range(0, 3):
            for role, user in users:
                try:
                    log.debug(tableUsers.getUser(f"{user}{i}"))
                except Exception as e:
                    log.debug(f"Failed updateUser {user}{i}, reason: {e}")

        
        for i in range(0, 3): 
            project_name = f"project-{i}"
            try: 
                project_id = tableProjects.addProject(project_name)
            except Exception as e:
                log.debug(f"Failed to addProject {project_name}, reason: {e}")
                project = tableProjects.findProject(project_name)
                project_id = project['project_id']

            tableProjectRole.updateUsers(project_id, "admin", "admin0", "manager0")
            tableProjectRole.updateUsers(project_id, "admin", "admin1", "manager1")
            tableProjectRole.updateUsers(project_id, "member", "member0")
            tableProjectRole.updateUsers(project_id, "member", "member1")
            tableProjectRole.updateUsers(project_id, "viewer", "viewer0")
            tableProjectRole.updateUsers(project_id, "viewer", "viewer1")

            log.debug("admin0 / {}: {}, {}".format(project_id, tableProjectRole.userProjectRole(project_id, 'admin0'), tableProjectRole.userPermissions(project_id, 'admin0')))
            log.debug("manager0 / {}: {}, {}".format(project_id, tableProjectRole.userProjectRole(project_id, 'manager0'), tableProjectRole.userPermissions(project_id, 'manager0')))
            log.debug("member0 / {}: {}, {}".format(project_id, tableProjectRole.userProjectRole(project_id, 'member0'), tableProjectRole.userPermissions(project_id, 'member0')))
            log.debug("viewer0 / {}: {}, {}".format(project_id, tableProjectRole.userProjectRole(project_id, 'viewer0'), tableProjectRole.userPermissions(project_id, 'viewer0')))

            log.debug(tableProjectRole.getProjectUsers(project_id))

            for j in range(0, 2):
                version_name = f"version-{j}"
                try:
                    version_id = AmqConfig.new_version()
                    tableVersions.addVersion(project_id, version_id, version_name, "")
                except Exception as e:
                    log.debug(f"Failed to addVersion {version_name}, reason: {e}")
                    version = tableVersions.findVersion(version_name, project_id=project_id)
                    version_id = version['version_id']

                log.debug(tableVersions.getVersion(version_id))
                log.debug(tableVersions.findVersion(version_name, project_id=project_id))
            log.debug(tableVersions.getVersions(project_id))


                





















    


    