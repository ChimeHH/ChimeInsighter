import hashlib
import psutil
import crypt
import uuid
import traceback
from datetime import datetime, timedelta


from pymongo import UpdateOne, InsertOne, DeleteOne, UpdateMany, DeleteMany, ASCENDING, DESCENDING

from exlib.utils.hashex import sha1sum
from .core.database import DatabaseClass
from .core.errors import *

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class TableCacheMissingCollectionName(Exception):
    pass

class FileNotCached(Exception):
    pass



class DatabaseCache(DatabaseClass):
    def __init__(self, client, collection, database):
        if not database:
            database = self.config().cache
        super().__init__(client, collection, database)

    
class TableCacheFiles(DatabaseCache):
    CHECKSUM = 'checksum'        
    METADATA = 'metadata'
    UPDATED_TIME = 'updated_time'

    def __init__(self, client, collection='files', database=None):
        super().__init__(client, collection, database)

    def create_table(self):        
        self.coll.create_index([(self.CHECKSUM, ASCENDING), ], unique=True, background=True)        

    def update(self, checksum, metadata, mem_threshold=0):
        self._requests.append(UpdateOne({self.CHECKSUM: checksum}, 
                            {'$set': {self.METADATA: metadata, self.UPDATED_TIME: datetime.utcnow()}}, upsert=True))        
        self.commit(mem_threshold=mem_threshold)

    def update_many(self, records, mem_threshold=0):
        for record in records:
            self._requests.append(UpdateOne({self.CHECKSUM: record['checksum'], },
                                {'$set': {self.METADATA: record.get('metadata', {}), self.UPDATED_TIME: datetime.utcnow(), }}, upsert=True))
        self.commit(mem_threshold=mem_threshold)

    def get(self, checksum):
        projection = {self.CHECKSUM: 1, self.METADATA: 1, self.UPDATED_TIME: 1}        
        return self.coll.find({self.CHECKSUM: checksum, }, projection=projection)
                
    def delete(self, *checksums, mem_threshold=0):
        self._requests.append(DeleteMany({self.CHECKSUM: {'$in': checksums}}))
        self.commit(mem_threshold=mem_threshold)
    
    def delete_old(self, days, mem_threshold=0):
        self._requests.append(DeleteMany({self.UPDATED_TIME: {'$lt': datetime.utcnow() - timedelta(days=days)}}))
        self.commit(mem_threshold=mem_threshold)

class TableCachePackages(DatabaseCache):
    CHECKSUM = 'checksum'
    FULLNAME = 'fullname'
    VERSION = 'version'
    METADATA = 'metadata'
    UPDATED_TIME = 'updated_time'

    def __init__(self, client, collection='packages', database=None):
        super().__init__(client, collection, database)

    def create_table(self):
        self.coll.create_index([(self.CHECKSUM, ASCENDING)], unique=False, background=True)        
        self.coll.create_index([(self.FULLNAME, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.FULLNAME, ASCENDING), (self.VERSION, ASCENDING)], unique=False, background=True)

    def update(self, checksum, fullname, version, metadata, mem_threshold=0):
        self._requests.append(UpdateOne({self.CHECKSUM: checksum, self.FULLNAME: fullname, self.VERSION: version}, 
                            {'$set': {self.METADATA: metadata, self.UPDATED_TIME: datetime.utcnow()}}, upsert=True))
        self.commit(mem_threshold=mem_threshold)

    def update_many(self, records, mem_threshold=0):
        for record in records:
            self._requests.append(UpdateOne({self.CHECKSUM: record['checksum'], self.FULLNAME: record['fullname'], self.VERSION: record['version']},
                                {'$set': {self.METADATA: record.get('metadata', {}), 
                                          self.UPDATED_TIME: datetime.utcnow(), }}, upsert=True))
        self.commit(mem_threshold=mem_threshold)

    def get(self, checksum, fullname=None, version=None):
        projection = {self.CHECKSUM: 1, self.FULLNAME: 1, self.VERSION: 1, self.METADATA: 1, self.UPDATED_TIME: 1}
        query = {self.CHECKSUM: checksum}
        if fullname:
            query[self.FULLNAME] = fullname
        if version:
            query[self.VERSION] = version
        return self.coll.find(query, projection=projection)
    
    def delete(self, *checksums, fullname=None, version=None, mem_threshold=0):
        query = {self.CHECKSUM: {'$in': checksums}}
        if fullname:
            query[self.FULLNAME] = fullname
        if version:
            query[self.VERSION] = version
        self._requests.append(DeleteMany(query))
        self.commit(mem_threshold=mem_threshold)    

    def delete_old(self, days, mem_threshold=0):
        self._requests.append(DeleteMany({self.UPDATED_TIME: {'$lt': datetime.utcnow() - timedelta(days=days)}}))
        self.commit(mem_threshold=mem_threshold)


    
class TableCacheThreats(DatabaseCache):
    CHECKSUM = 'checksum'
    FILEPATH = 'filepath'
    THREAT_TYPE = 'type'
    THREAT_SUBTYPE = 'sub_type'
    METADATA = 'metadata'    
    UPDATED_TIME = 'updated_time'

    def __init__(self, client, collection='threats', database=None):
        super().__init__(client, collection, database)

    def create_table(self):
        self.coll.create_index([(self.CHECKSUM, ASCENDING)], unique=False, background=True)
        self.coll.create_index([(self.CHECKSUM, ASCENDING), (self.THREAT_TYPE, ASCENDING), (self.THREAT_SUBTYPE, ASCENDING)], unique=True, background=True)

    def update(self, checksum, filepath, threat_type, threat_sub_type, metadata, mem_threshold=0):
        try:
            self._requests.append(UpdateOne({self.CHECKSUM: checksum, self.THREAT_TYPE: threat_type, self.THREAT_SUBTYPE: threat_sub_type}, 
                                {'$set': {self.FILEPATH: filepath, self.METADATA: metadata, self.UPDATED_TIME: datetime.utcnow()}}, upsert=True))
            self.commit(mem_threshold=mem_threshold)
        except:
            # if metadata > 16MB,  exception will be raised here and then we just ignore it
            log.exception(f"failed to commit {checksum}, {filepath}, {threat_type}/{threat_sub_type}, {len(metadata)} records")

    def update_many(self, records, mem_threshold=0):
        for record in records:
            self._requests.append(UpdateOne({self.CHECKSUM: record['checksum'], self.THREAT_TYPE: record['type'], self.THREAT_SUBTYPE: record['sub_type']},
                                {'$set': {self.FILEPATH: str(record.get('filepath', None)), self.METADATA: record.get('metadata', None), 
                                          self.UPDATED_TIME: datetime.utcnow(), }}, upsert=True))
        self.commit(mem_threshold=mem_threshold)

    def get(self, checksum, threat_type=None, threat_sub_type=None):
        projection = {self.CHECKSUM: 1, self.FILEPATH: 1, self.THREAT_TYPE: 1, self.THREAT_SUBTYPE: 1, self.METADATA: 1, self.UPDATED_TIME: 1}
        query = {self.CHECKSUM: checksum}
        if threat_type:
            query[self.THREAT_TYPE] = threat_type
        if threat_sub_type:
            query[self.THREAT_SUBTYPE] = threat_sub_type
        return self.coll.find(query, projection=projection)
    
    def delete(self, *checksums, threat_type=None, threat_sub_type=None, mem_threshold=0):
        query = {self.CHECKSUM: {'$in': checksums}}
        if threat_type:
            query[self.THREAT_TYPE] = threat_type
        if threat_sub_type:
            query[self.THREAT_SUBTYPE] = threat_sub_type
        self._requests.append(DeleteMany(query))
        self.commit(mem_threshold=mem_threshold)    

    def delete_old(self, days, mem_threshold=0):
        self._requests.append(DeleteMany({self.UPDATED_TIME: {'$lt': datetime.utcnow() - timedelta(days=days)}}))
        self.commit(mem_threshold=mem_threshold)

    
class TableSbomUrls(DatabaseCache):
    ''' Table 1.5 '''
    URL = 'url'
    METATYPE = 'metatype'
    METADATA = 'metadata'
    STATUS_CODE = 'status_code'
    UPDATED_TIME = 'updated_time'

    def __init__(self, client, collection='urls', database=None):
        super().__init__(client, collection, database)

    def create_table(self):
        self.coll.create_index([(self.URL, ASCENDING), ], unique=True, background=True)

    def update(self, url, metatype, metadata=None, status_code=None, mem_threshold=0):
        update_fields = {self.UPDATED_TIME: datetime.utcnow()}
        if status_code:
            update_fields[self.STATUS_CODE] = status_code
        
        update_fields[self.METADATA] = JsonObject.dumps(dict(data=metadata))

        self.coll.update_one({self.URL: url, self.METATYPE: metatype}, {'$set': update_fields,}, upsert=True)

    def getMetadata(self, url, metatype, projection=None):
        if not projection:
            projection = {self.URL: 1, self.METADATA: 1, self.STATUS_CODE: 1, self.UPDATED_TIME: 1, }

        for r in self.coll.find({self.URL: url, self.METATYPE: metatype}, projection=projection):
            if r.get(self.STATUS_CODE) in (404, ):
                return None
            try:
                return JsonObject.loads(r.get(self.METADATA)).get('data')
            except:
                return r.get(self.METADATA)

        return None

    def is_rejected(self, url, metatype):
        for r in self.coll.find({self.URL: url, self.METATYPE: metatype}, projection={self.STATUS_CODE: 1}):
            return r.get(self.STATUS_CODE) in (404, )

        return None   