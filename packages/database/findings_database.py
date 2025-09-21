import hashlib
import psutil
import crypt
import uuid
import traceback
import pickle
from datetime import datetime

from pymongo import UpdateOne,InsertOne,DeleteOne,UpdateMany,DeleteMany,ASCENDING, DESCENDING

from datetime import datetime
from exlib.classes.base import EnumClass
from amq.config import AmqConfig
from .core.database import DatabaseClass
from .core.errors import *

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


class DatabaseFindings(DatabaseClass):    
    @property
    def _uid(self):
        return uuid.uuid1().hex

    def __init__(self, client, collection, database):
        if not database:
            database = self.config().findings
        super().__init__(client, collection, database)

class TableFiles(DatabaseFindings):
    UID = 'uid'
    VERSION_ID = 'version_id'
    CHECKSUM = 'checksum'    
    FILEPATH = 'filepath'    
    FILETYPE = 'filetype'
    FILEINFO = 'fileinfo'
    FILEMIME = 'filemime'
    FILEPATH_R = 'filepath_r'
    SIZE = 'size'
    LABELS = 'labels'
    HASHES = 'hashes'
    HASHES_MD5 = 'hashes.md5'
    HASHES_SHA1 = 'hashes.sha1'
    HASHES_SHA256 = 'hashes.sha256'
    ARCH = 'arch'
    NUM_FUNCTIONS = 'num_functions'
    OSS_PERCENT = 'oss_percent'
    UPDATED_TIME = 'updated_time'

    def __init__(self, client, collection='files', database=None):
        super().__init__(client, collection, database)

    def create_table(self):    
        self.coll.create_index([(self.UID, ASCENDING), ], unique=True, background=True)
        self.coll.create_index([(self.CHECKSUM, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.VERSION_ID, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.VERSION_ID, ASCENDING), (self.CHECKSUM, ASCENDING), ], unique=True, background=True)

        self.smooth_upgrade()

    def smooth_upgrade(self):
        pass

    def add(self, version_id, checksum, filepath, filepath_r, filetype, fileinfo, filemime, size, labels, oss_percent, hashes={}, mem_threshold=50):
        uid = self._uid

        self._requests.append(UpdateOne({self.VERSION_ID: version_id, self.CHECKSUM: checksum, }, 
                             {'$set': {self.FILEPATH: filepath, self.FILEPATH_R: [str(p) for p in filepath_r], 
                                    self.FILETYPE: filetype, self.FILEINFO: fileinfo, self.FILEMIME: filemime, self.SIZE: size, 
                                    self.LABELS: labels, self.OSS_PERCENT: oss_percent, self.HASHES: hashes, self.UPDATED_TIME: datetime.utcnow(), },
                               "$setOnInsert": {self.UID: uid,}}, upsert=True))
        
        self.commit(mem_threshold=mem_threshold)

        return uid

    def add_many(self, version_id, file_list, mem_threshold=50):
        uids = []
        for checksum, filedata in file_list.items():
            uid = self._uid
            uids.append(uid)
            self._requests.append(UpdateOne({self.VERSION_ID: version_id, self.CHECKSUM: checksum, }, 
                             {'$set': {self.FILEPATH: str(filedata.filepath),
                                       self.FILEPATH_R: [str(p) for p in filedata.filepath_r],
                                       self.FILETYPE: filedata.filetype,  
                                       self.FILEINFO: filedata.fileinfo,
                                       self.FILEMIME: filedata.filemime,  
                                       self.SIZE: filedata.size,
                                       self.LABELS: filedata.labels, 
                                       self.OSS_PERCENT: filedata.oss_percent,
                                       self.HASHES: filedata.hashes, self.UPDATED_TIME: datetime.utcnow()},  
                              "$setOnInsert": {self.UID: uid,}}, upsert=True))
        self.commit(mem_threshold=mem_threshold)
        return uids
    
    def update_arch(self, version_id, checksum, arch, mem_threshold=50):
        self._requests.append(UpdateOne({self.VERSION_ID: version_id, self.CHECKSUM: checksum, }, 
                             {'$set': {self.ARCH: arch, self.UPDATED_TIME: datetime.utcnow(), },}, upsert=False))
        self.commit(mem_threshold=mem_threshold)
    
    def update_num_functions(self, version_id, checksum, num_functions, mem_threshold=50):
        self._requests.append(UpdateOne({self.VERSION_ID: version_id, self.CHECKSUM: checksum, }, 
                             {'$set': {self.NUM_FUNCTIONS: num_functions, self.UPDATED_TIME: datetime.utcnow(),},}, upsert=False))
        self.commit(mem_threshold=mem_threshold)

    def get(self, version_id, checksum=None, projection=None):
        if not projection:
            projection = {self.UID: 1, self.VERSION_ID: 1, self.CHECKSUM: 1, self.FILEPATH: 1, self.FILEPATH_R: 1, 
                        self.FILETYPE: 1, self.FILEINFO: 1, self.FILEMIME: 1, self.SIZE: 1, self.LABELS: 1, self.OSS_PERCENT: 1, self.HASHES: 1,}
        if checksum:
            query = dict(version_id=version_id, checksum=checksum)
        else:
            query = dict(version_id=version_id)            

        return self.coll.find(query, projection=projection)

    def gets(self, *uids, projection=None):
        if not projection:
            projection = {self.UID: 1, self.VERSION_ID: 1, self.CHECKSUM: 1, self.FILEPATH: 1, self.FILEPATH_R: 1, 
                        self.FILETYPE: 1, self.FILEINFO: 1, self.FILEMIME: 1, self.SIZE: 1, self.LABELS: 1, self.OSS_PERCENT: 1, self.HASHES: 1,}
        if not uids:
            return self.coll.find({self.UID: {"$in": uids}}, projection=projection)
        else:
            return self.coll.find({}, projection=projection)
         
    def delete(self, *version_ids, mem_threshold=50):
        self._requests.append(DeleteMany({self.VERSION_ID: {"$in": version_ids}}))
        self.commit(mem_threshold=mem_threshold)

    def addFile(self, version_id, checksum, filepath, filepath_r, filetype, fileinfo, filemime, size, labels, oss_percent, hashes={}, mem_threshold=0):
        self.add(version_id, checksum, filepath, filepath_r, filetype, fileinfo, filemime, size, labels, oss_percent, hashes=hashes, mem_threshold=mem_threshold)

    def addFiles(self, version_id, records, mem_threshold=0):
        self.add_many(version_id, records, mem_threshold=mem_threshold)

    def deleteVersion(self, version_id, mem_threshold=0):
        self.delete(version_id, mem_threshold=mem_threshold)

    def getVersionFile(self, version_id, checksum):    
        try:
            files = list(self.get(version_id, checksum))
            return files[0]
        except Exception as e:
            raise VersionFileNotFound(f"{version_id}/{checksum} not found, reason: {e}")

    def getVersionFiles(self, version_id):
        return list(self.get(version_id))

    def findFiles(self, checksum):
        return list(self.coll.find({self.CHECKSUM: checksum}))

    def getFile(self, uid):
        files = list(self.gets(uid))
        if not files:
            raise FileNotFound(f"invalid file id: {uid}")
        return files[0]

    def getFiletypesStats(self, files):        
        stats = {}

        for record in files:
            filetype = record.get('filetype', "") or ""
            if filetype in stats:
                stats[filetype] += 1
            else:
                stats[filetype] = 1
        
        return stats



class TablePackages(DatabaseFindings):
    UID = 'uid'
    VERSION_ID = 'version_id'
    CHECKSUM = 'checksum'
    FULLNAME = 'fullname'
    VERSION = 'version'
    SCORE = 'score'
    SCALE = 'scale'
    CLONE = 'clone'
    INTEGRITY = 'integrity'
    SUMMARY = 'summary'
    
    # summary items
    DOWNLOADURL = 'downloadurl'    
    LICENSES = 'licenses'
    DOCUMENT = 'document'
    COPYRIGHTS = 'copyrights'
    RELEASE_TIME = 'release_time'
    DEPENDS = 'depends'
    LANGUAGES = 'languages'
    # end summary items

    UPDATED_TIME = 'updated_time'

    def __init__(self, client, collection='packages', database=None):
        super().__init__(client, collection, database)

    def create_table(self):        
        self.coll.create_index([(self.UID, ASCENDING), ], unique=True, background=True)
        self.coll.create_index([(self.VERSION_ID, ASCENDING), ], unique=False, background=True)        
        self.coll.create_index([(self.CHECKSUM, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.VERSION_ID, ASCENDING), (self.CHECKSUM, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.FULLNAME, ASCENDING), ], unique=False, background=True)        
        self.coll.create_index([(self.VERSION_ID, ASCENDING), (self.CHECKSUM, ASCENDING), (self.FULLNAME, ASCENDING), ], unique=True, background=True)

        self.smooth_upgrade()

    def smooth_upgrade(self):
        pass

    def update(self, version_id, checksum, fullname, version, score, scale, integrity, clone=None, summary=None, mem_threshold=50):
        uid = self._uid
        self._requests.append(UpdateOne({self.VERSION_ID: version_id, self.CHECKSUM: checksum, self.FULLNAME: fullname, }, 
                            {'$set': {self.VERSION: version, self.SCORE: score, self.SCALE: scale, self.INTEGRITY: integrity, self.CLONE: clone, self.SUMMARY: summary, self.UPDATED_TIME: datetime.utcnow(),},
                            "$setOnInsert": {self.UID: uid,}}, upsert=True))
        
        self.commit(mem_threshold=mem_threshold)
        return uid

    def get(self, version_id, *checksums, fullnames=None, projection=None):
        if not projection:
            projection = {self.UID: 1, self.VERSION_ID: 1, self.CHECKSUM: 1, self.FULLNAME: 1, self.VERSION: 1, self.SCORE: 1, self.SCALE: 1, self.CLONE: 1, self.INTEGRITY: 1, self.SUMMARY: 1, }
        query = dict({self.VERSION_ID: version_id})
        if checksums:
            query.update({self.CHECKSUM: {"$in": checksums}})
        if fullnames:
            query.update({self.FULLNAME: {"$in": fullnames}})

        return self.coll.find(query, projection=projection)

    def gets(self, *uids, projection=None):
        if not projection:
            projection = {self.UID: 1, self.VERSION_ID: 1, self.CHECKSUM: 1, self.FULLNAME: 1, self.VERSION: 1, self.SCORE: 1, self.SCALE: 1,  self.CLONE: 1, self.INTEGRITY: 1, self.SUMMARY: 1, }
        if uids:
            return self.coll.find({self.UID: {"$in": uids}}, projection=projection)
        else:
            return self.coll.find({}, projection=projection)
        
    def delete(self, *version_ids, mem_threshold=50):
        self._requests.append(DeleteMany({self.VERSION_ID: {"$in": version_ids}}))
        self.commit(mem_threshold=mem_threshold)

    def updatePackage(self, version_id, checksum, fullname, version, score, scale, integrity, summary=None, clone=None, mem_threshold=0):
        return self.update(version_id, checksum, fullname, version, score, scale, integrity, summary=summary, clone=clone, mem_threshold=mem_threshold)

    def deleteVersion(self, version_id, mem_threshold=0):
        self.delete(version_id, mem_threshold=mem_threshold)

    def getVersionPackages(self, version_id, projection=None):
        return list(self.get(version_id))

    def getVersionFilesPackages(self, version_id, *checksums, fullnames=None, projection=None):
        return list(self.get(version_id, *checksums, fullnames=fullnames))  

    def getVersionFilePackage(self, version_id, checksum, fullname):
        packages = list(self.get(version_id, checksum, fullnames=[fullname,]))
        if not packages:
            return None
        return packages[0]

    def getPackage(self, uid):
        packages = list(self.gets(uid))
        if not packages:
            raise PackageNotFound(f"invalid package id: {uid}")
        return packages[0]

    @classmethod
    def getComponentsStats(cls, packages):
        stats = {}

        for record in packages:
            summary = record.get("summary", None) or {}

            component_name = summary.get('name', None) or record['fullname'].split('@')[0]
            version = record['version']
            
            stats.setdefault(component_name, {})                
            stats[component_name].setdefault(version, 0)
            
            stats[component_name][version] += 1

        return stats

    @classmethod
    def getLicensesStats(self, packages):
        stats = {}
        for record in packages:        
            summary = record.get("summary", None) or {}
            temp_licenses = summary.get('licenses') or []
            for lic in temp_licenses:
                if lic not in stats:
                    stats[lic] = 1
                else:
                    stats[lic] += 1
                            
        return stats  


class TableThreats(DatabaseFindings):
    class ThreatTypes(EnumClass):
        PUBLIC = 'public'
        ZERODAY = 'zeroday'
        MOBILE = 'mobile'
        INFOLEAK = 'infoleak'
        PASSWORD = 'password'
        MISCONFIGURATION = "misconfiguration"
        MALWARE = 'malware'
        SECURITY = "security"
        COMPLIANCE = "compliance"

    class ThreatWorkStatuses(EnumClass):
        NOSTATUS = "NoStatus"
        IGNORED = 'Ignored'
        INVESTIGATING = 'Investigating'
        INPROGRESS = 'InProgress'
        FIXED = 'Fixed'
        MITIGATED = "Mitigated"
        FALSEPOSITIVE = "FalsePositive"
        

    class ThreatSeverities(EnumClass):
        '''
        CVSS v2.0 Ratings                           CVSS v3.x Ratings
        Severity    Severity Score Range            Severity     Severity Score Range
                                                    None*   0.0
        Low         0.0-3.9                         Low 0.1-3.9
        Medium      4.0-6.9                         Medium  4.0-6.9
        High        7.0-10.0                        High    7.0-8.9
                                                    Critical    9.0-10.0
        '''
        NONE = "none"
        CRITICAL = "critical"       
        HIGH = "high"
        MEDIUM = "medium"
        LOW = "low"
        ADVICE = "advice"


    class PublicTypes(EnumClass):
        CVE = 'cve'

    class ZerodayTypes(EnumClass):
        COPY_TO_STATIC = "copy_to_static" 
        DEADLOCK = "deadlock" 
        DOUBLE_FREE = "double_free" 
        FORBIDDEN_FUNCTION = "forbidden_function" 
        FREE_NON_HEAP = "free_non_heap"
        INFINITE_LOOP = "infinite_loop"
        INPUT_ANALYSIS = "input_analysis"
        INVALID_ARGUMENT = "invalid_argument"
        INVALID_BUFFER = "invalid_buffer"
        INVALID_STRING = "invalid_string"
        NULL_DEREFERENCE = "null_dereference"
        RANDOM_ACCESS = "random_access"
        RETURN_OF_STACK = "return_of_stack"
        SCAN_FORMAT = "scan_format"
        SIGNED_UNSIGNED = "signed_unsigned"
        UNSIGNED_OVERFLOW = "unsigned_overflow"
        TOC_TOU = "toc_tou"
        UNCHECKED_RETURN_VALUE = "unchecked_return_value"
        USE_AFTER_FREE = "use_after_free"
        WRONG_SIZE_MEMSET = "wrong_size_memset"

    class InfoLeakTypes(EnumClass):
        BASE_64 = "base_64"
        CID = "cid"
        CRYPTO = "crypto"
        DOMAIN = "domain"
        EMAIL = "email"
        GPS = "gps"
        IP = "ip"
        PATH = "path"
        PHONE = "phone"
        SSL = "ssl"
        URL = "url"

    class SecurityTypes(EnumClass):
        HARDENING = "hardening"
        FUNCTIONS = "functions"
        VARNAMES = "varnames"
        EXFUNCTIONS = "external functions"
        EXVARNAMES = "external varnames"
        EXLIBS = 'linked libs'
        ENTRIES = "entries"

    UID = 'uid'        
    VERSION_ID = 'version_id'
    CHECKSUM = 'checksum'
    THREAT_TYPE = 'type'
    THREAT_SUBTYPE = 'sub_type'
    METADATA = 'metadata'
    WORK_STATUS = 'work_status'
    SEVERITY = 'severity'
    UPDATED_TIME = 'updated_time'

    CVE_ID = 'metadata.cve_id'
    CNNVD_ID = 'metadata.cnnvd_id'
    CNVD_ID = 'metadata.cnvd_id'
    JVN_ID = 'metadata.jvn_id'

    _config = AmqConfig()


        
    def __init__(self, client, collection='threats', database=None):
        super().__init__(client, collection, database)
        
    def create_table(self): 
        self.coll.create_index([(self.UID, ASCENDING), ], unique=True, background=True)        
        self.coll.create_index([(self.VERSION_ID, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.CHECKSUM, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.THREAT_TYPE, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.CVE_ID, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.CNNVD_ID, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.CNVD_ID, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.JVN_ID, ASCENDING), ], unique=False, background=True)
        
        self.coll.create_index([(self.VERSION_ID, ASCENDING), (self.THREAT_TYPE, ASCENDING),], unique=False, background=True)

        self.smooth_upgrade()

    def smooth_upgrade(self):
        self._requests.append(UpdateMany({self.THREAT_TYPE: 'zeroday', self.THREAT_SUBTYPE: {"$in": ["qscan", "sscan", "mscan"]}}, {'$set': {self.THREAT_TYPE: 'mobile'}}, upsert=False))
        self.commit()

    def add(self, version_id, checksum, threat_type, threat_subtype, metadata, severity = None, mem_threshold=50):
        uid = self._uid

        if not severity:
            if threat_type  == self.ThreatTypes.PUBLIC:            
                metrics = metadata.get('metrics', {})            
                severity = metrics.get("baseMetricV3", {}).get("cvssV3", {}).get("baseSeverity", None)
                if not severity:
                    severity = metrics.get("baseMetricV2", {}).get("severity", None)

            elif threat_type != self.ThreatTypes.SECURITY:
                severity = metadata.get('severity', None)

                if not severity:
                    severity = self._config.threat_severity(threat_type, metadata.get('routine', threat_subtype))
        
        severity = severity.upper() if severity else self.ThreatSeverities.NONE
        
        self._requests.append(InsertOne({self.VERSION_ID: version_id, self.CHECKSUM: checksum,
                                self.THREAT_TYPE: threat_type, self.THREAT_SUBTYPE: threat_subtype, self.SEVERITY: severity,
                                 self.METADATA: metadata, self.UID: uid, self.UPDATED_TIME: datetime.utcnow(),}))
        
        self.commit(mem_threshold=mem_threshold)
        return uid
    
    def get(self, version_id, *threat_types, threat_subtypes=None, checksum=None, projection=None):
        if not projection:
            projection = {self.UID: 1, self.THREAT_TYPE: 1, self.THREAT_SUBTYPE: 1, self.SEVERITY: 1, self.CHECKSUM: 1, self.METADATA:1, self.WORK_STATUS: 1,}

        query = {self.VERSION_ID: version_id}
        if checksum:
            query.update({self.CHECKSUM: checksum})
        if threat_types:
            query.update({self.THREAT_TYPE: {"$in": threat_types}})
        if threat_subtypes:
            query.update({self.THREAT_SUBTYPE: {"$in": threat_subtypes}})

        return self.coll.find(query, projection=projection)

    def update(self, uid, metadata, mem_threshold=0):
        self._requests.append(UpdateOne({self.UID: uid}, {'$set': {self.METADATA: metadata, self.UPDATED_TIME: datetime.utcnow(),}}, upsert=False))
        self.commit(mem_threshold=mem_threshold)

    def gets(self, *uids, threat_types=None, threat_subtypes=None, projection=None):
        query = {}
        if threat_types:
            query.update({self.THREAT_TYPE: {"$in": threat_types}})

        if threat_subtypes:
            query.update({self.THREAT_SUBTYPE: {"$in": threat_subtypes}})

        if uids:
            query.update({self.UID: {"$in": uids}})

        if not projection:
            projection = {self.UID: 1, self.VERSION_ID: 1, self.THREAT_TYPE: 1, self.THREAT_SUBTYPE: 1, self.SEVERITY: 1, self.CHECKSUM: 1, self.METADATA: 1, self.WORK_STATUS: 1,}

        return self.coll.find(query, projection=projection)

    def sets(self, uid_status_dict, mem_threshold=50):
        for uid, status in uid_status_dict.items():
            self._requests.append(UpdateOne({self.UID: uid}, {'$set': {self.WORK_STATUS: status, self.UPDATED_TIME: datetime.utcnow(),}}, upsert=False))
        self.commit(mem_threshold=mem_threshold)
        
    def delete(self, *version_ids, mem_threshold=50):
        for version_id in version_ids:
            self._requests.append(DeleteMany({self.VERSION_ID: {"$in": version_ids}}))

        self.commit(mem_threshold=mem_threshold)

    def addThreat(self, version_id, checksum, threat_type, threat_subtype, metadata, mem_threshold=0):
        self.add(version_id, checksum, threat_type, threat_subtype, metadata, mem_threshold=mem_threshold)

    def deleteVersion(self, version_id, mem_threshold=0):
        self.delete(version_id, mem_threshold=mem_threshold)

    def getVersionAllThreats(self, version_id):
        return list(self.get(version_id))

    def getVersionThreats(self, version_id, *threat_types, threat_subtypes=None, projection=None):
        return list(self.get(version_id, *threat_types, threat_subtypes=threat_subtypes))

    def getVersionFileThreats(self, version_id, checksum, *threat_types, threat_subtypes=None, projection=None):
        return list(self.get(version_id, *threat_types, threat_subtypes=threat_subtypes, checksum=checksum))

    
    def getThreat(self, uid):
        threats = list(self.gets(uid))
        if not threats:
            raise ThreatNotFound(f"invalid threat id: {uid}")
        return threats[0]

    def updateThreatStatus(self, uid, status, mem_threshold=0):
        self.sets({uid: status}, mem_threshold=mem_threshold)

    def updateThreatsStatus(self, uid_status_dict, mem_threshold=0):
        self.sets(uid_status_dict, mem_threshold=mem_threshold)

    @classmethod
    def getThreatsStats(cls, threats, dime="severity"):
        stats = {}

        for threat in threats:
            try:
                threat_type = threat.get('type', None)
                threat_subtype = threat.get('sub_type', None)

                if not threat_type:
                    continue

                if dime == "type":                
                    stats.setdefault(threat_type, 0)
                    stats[threat_type] += 1
                    continue
                
                if not threat_subtype:
                    continue

                if dime in ["sub_type", "subtype"]:
                    stats.setdefault(threat_type, {})
                    stats[threat_type].setdefault(threat_subtype, 0)
                    stats[threat_type][threat_subtype] += 1
                    continue
                    
                if dime == "severity" or dime is None:
                    severity = cls.getThreatSeverity(threat)
                    if severity:
                        stats.setdefault(threat_type, {})
                        stats[threat_type].setdefault(threat_subtype, {})
                        stats[threat_type][threat_subtype].setdefault(severity, 0)
                        stats[threat_type][threat_subtype][severity] += 1
                    continue
            except:
                log.exception(f"threat: {threat}")
            
        return stats

    @classmethod
    def sumThreatStats(cls, stats):
        count = 0

        for _, v in stats.items():
            if isinstance(v, (int, float)):
                count += v
            elif isinstance(v, (dict, )):
                count += cls.sumThreatStats(v)

        return count


    @classmethod    
    def getThreatSeverity(cls, threat):
        threat_type = threat.get(cls.THREAT_TYPE, None) 
        threat_subtype = threat.get(cls.THREAT_SUBTYPE, None)

        severity = threat.get(cls.SEVERITY, None)
        if severity:
            return threat[cls.SEVERITY].lower()

        if threat_type in (cls.ThreatTypes.PUBLIC, ):
            metrics = threat.get('metadata', {}).get('metrics', {})
            
            severity = metrics.get("baseMetricV3", {}).get("cvssV3", {}).get("baseSeverity", None)
            if not severity:
                severity = metrics.get("baseMetricV2", {}).get("severity", None)
        else:
            severity = cls._config.threat_severity(threat_type, threat_subtype)

        if severity:
            return severity.lower()

        return cls.ThreatSeverities.NONE


    def getVersionThreatsSimple(self, version_id, *threat_types, threat_subtypes=None, projection=None):
        threats = []
        
        for threat in self.get(version_id, *threat_types, threat_subtypes=threat_subtypes):
            self.simplify_threat(threat)        
            threats.append(threat)

        return threats

    @staticmethod
    def simplifyZerodayThreat(threat):
        metadata = threat.pop(TableThreats.METADATA)
        threat[TableThreats.METADATA] = dict(function_name=metadata.get('function_name', ""), rva=metadata.get('rva', 0))

    @staticmethod
    def simplifyPublicThreat(threat):
        metadata = threat.pop(TableThreats.METADATA)
        threat[TableThreats.METADATA] = dict(cve_id=metadata.get('cve_id', ""), description=metadata.get('description', ""))

    @staticmethod
    def simplifyMalwareThreat(threat):
        metadata = threat.pop(TableThreats.METADATA)
        threat[TableThreats.METADATA] = dict(data=metadata.get('data', ""), offset=metadata.get('offset', 0), description=metadata.get('description', ""))


    @staticmethod
    def simplifyPasswordThreat(threat):
        metadata = threat.pop(TableThreats.METADATA)
        threat[TableThreats.METADATA] = dict(alg=metadata.get('type', ""), offset=metadata.get('offset', 0), password=metadata.get('password', ""))


    @staticmethod
    def simplifyMisconfigurationThreat(threat):
        metadata = threat.pop(TableThreats.METADATA)
        threat[TableThreats.METADATA] = dict(category=metadata.get('category', ""), prop=metadata.get('prop', 0), configured=metadata.get('configured', ""), suggested=metadata.get('suggested', ""))

    @staticmethod
    def simplifyComplianceThreat(threat):
        metadata = threat.pop(TableThreats.METADATA)
        threat[TableThreats.METADATA] = dict(linked_name=metadata.get('linked_name', ""), name=metadata.get('name', ""), state=metadata.get('state', ""), description=metadata.get('description', ""))

    @staticmethod
    def simplifyInfoleakThreat(threat):
        metadata = threat.pop(TableThreats.METADATA)
        threat[TableThreats.METADATA] = dict(text=metadata.get('text', ""), length=metadata.get('length', 0), offset=metadata.get('offset', 0))

    @classmethod
    def simplify_threat(cls, threat):
        _simplify_methods = {
            cls.ThreatTypes.ZERODAY : cls.simplifyZerodayThreat,
            cls.ThreatTypes.PUBLIC : cls.simplifyPublicThreat,
            cls.ThreatTypes.MALWARE : cls.simplifyMalwareThreat,
            cls.ThreatTypes.PASSWORD : cls.simplifyPasswordThreat,
            cls.ThreatTypes.MISCONFIGURATION : cls.simplifyMisconfigurationThreat,
            cls.ThreatTypes.COMPLIANCE : cls.simplifyComplianceThreat,
            cls.ThreatTypes.INFOLEAK : cls.simplifyInfoleakThreat,
        }
        method = _simplify_methods.get(threat[cls.THREAT_TYPE], None)
        if method:
            method(threat)