import os
import hashlib
import psutil
import traceback
import re
import bson
from datetime import datetime
from pprint import pprint

from exlib.classes.base import EnumClass
from .core.database import DatabaseClass
from .core.errors import *
from exlib.utils.serializer import JsonObject
from exlib.utils.hashex import md5sum, sha256sum_file
from exlib.settings import osenv
from pymongo import UpdateOne,InsertOne,DeleteOne,UpdateMany,DeleteMany,ASCENDING, DESCENDING
from database.core.mongo_db import UnauthorizedDataError

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


class TableSbomMissingCollectionName(Exception):
    pass

class SymbolType(EnumClass):
    STRING = 'string'
    FUNCTION = 'function'
    VARNAME = 'varname'
    CLASS = 'class' # class methods, objects
    EXFUNC = 'func'
    EXOBJECT = 'object'
    EXFILE = 'file'
    NEEDED = 'needed'

class DatabaseSbom(DatabaseClass):    
    _ID = '_id'

    MAX_FILENAMES = 128
    MAX_PACKAGES = 128
    
    class Language:
        pyso_strings = """__annotations__, __builtins__, __class__, __closure__, __code__, __defaults__,
                       __dict__, __doc__, __file__, __globals__, __import__, __init__, __kwdefaults__,
                       __loader__, __main__, __metaclass__, __module__, __name__, __package__, __path__,
                       __prepare__, __qualname__, __reduce__, __repr__, __self__, __spec__, __str__, __test__"""

        # warning, don't change below values, otherwise we must rebuild tokens then import a new sbom database
        _languages_ = {"asm": "Assembly",
                    'assembly': 'Assembly',  
                    "c": "C",
                    "cplusplus": "C++",
                    "c++": "C++",
                    "cxx": "C++",
                    "linux": "C",
                    "rust": "Rust",

                    "python": "Python",
                    "go": "Go",
                    "javascript": "JavaScript",
                    "java": "Java",
                    "perl": "Perl",
                    "csharp": "C#",
                    "swift": "Swift",
                    "objectivec": "Objective-C",
                    "objective-c": "Objective-C",

                    # from binary file
                    "elf": "C",
                    "pe": "C",
                    "static": "C",
                    "shared": "C",
                    "relocatable": "C",                    
                }

        @classmethod
        def lang(cls, mimelang, default=None):
            return cls._languages_.get(mimelang.strip().lower(), default) if mimelang else default
        
        @classmethod
        def mimelang(cls):
            return set(cls._languages_.keys())

        @classmethod
        def langs(cls):
            return set(cls._languages_.values())

    class FileType(EnumClass):        
        UNDEF = 'u'
        SOURCE = 's' # source code
        OBJECT = 'o' # binaries like .so, .exe, ...
        CLASS = 'c' # java class

    class ScoreType(EnumClass):
        STRING = 's'
        NAME = 'n'
        CLASS = 'c'
        EXTERNAL = 'e'

        prioritized_categories = (STRING, CLASS, NAME, EXTERNAL)
        symtype2stypes = {SymbolType.STRING: STRING, SymbolType.CLASS: CLASS, SymbolType.FUNCTION: NAME, SymbolType.VARNAME: NAME, 
                        SymbolType.EXFUNC: EXTERNAL, SymbolType.EXOBJECT: EXTERNAL, SymbolType.EXFILE: EXTERNAL, SymbolType.NEEDED: EXTERNAL}

    def __init__(self, client, collection, database):
        if not database:
            database = self.config().sbom

        super().__init__(client, collection, database)
        
        data = osenv.license_data()
        if not data:
            raise UnauthorizedDataError()
        
        count = data.get(f'max_{collection}')
        if count and count < self.coll.estimated_document_count():
            raise UnauthorizedDataError()

    @classmethod
    def token_stype(cls, symtype):
        return cls.ScoreType.symtype2stypes.get(symtype, cls.ScoreType.NAME)

    @classmethod
    def compute_token(cls, string, symtype, mimelang):
        mimelang = mimelang.strip() if mimelang else ""
        lang = cls.Language.lang(mimelang.lower())

        # 因为无法区分dll等文件编译前的语言，这里都采用C计算token
        if lang in ('Assembly', "C++", "Rust", "Go", "C#", "Objective-C"):
            lang = "C"
                    
        md5 = hashlib.md5()
        checksum = "{}:{}:{}".format(string, symtype, lang) # note, here use symtype(string, class, function, varname, ex...), instead of stype(s, f, v, ...)
        md5.update(checksum.encode(encoding='latin-1', errors='ignore'))
        return md5.hexdigest()

    @classmethod
    def compute_checksum(cls, filepath):
        return sha256sum_file(filepath)

    @classmethod
    def to_index(cls, hash_str):
        return bytes.fromhex(hash_str[:24])

class TableSbomTokens(DatabaseSbom):
    ''' Table 1.1 '''
    TOKEN = '_id'
    LENGTH = 'length'
    STYPE = 'stype' # score type

    SCORE = 'score'

    FILENAMES = 'filenames'
    PACKAGES = 'packages'

    ORIGIN = 'origin'


    PROJECTION_FULL = {TOKEN: 1, LENGTH: 1, STYPE: 1, SCORE: 1, FILENAMES: 1, PACKAGES: 1, ORIGIN: 1, }
    PROJECTION_RUN = {TOKEN: 1, LENGTH: 1, STYPE: 1, SCORE: 1, }
    PROJECTION_VERBOSE = {FILENAMES: 1, PACKAGES: 1, ORIGIN: 1,}
    PROJECTION_UNIKEY = { TOKEN: 1, }
    
    def __init__(self, client, collection='tokens', database=None):
        super().__init__(client, collection, database)   

    def create_table(self):
        # self.coll.create_index([(self.TOKEN, ASCENDING), ], unique=True, background=True)
        pass

    def update(self, token, symtype, length, origin=None):
        stype = self.token_stype(symtype)
        self._requests.append(UpdateOne({self.TOKEN: token},
                                {"$set": {self.SCORE: 0, },
                                "$setOnInsert": {self.LENGTH: length, self.STYPE: stype, self.ORIGIN: self.reform_string(origin) }}, upsert=True))

    def add_filename(self, token, *filenames):
        self._requests.append(UpdateOne({self.TOKEN: token},
                             {'$addToSet': {self.FILENAMES: {"$each": filenames}, }}))


    def pull_filename(self, token, *filenames):
        if filenames:
            self._requests.append(UpdateOne({self.TOKEN: token, },
                         {'$pull': {self.FILENAMES: {"$in": filenames, }},}))
        else:
            self._requests.append(UpdateOne({self.TOKEN: token, },
                         {'$pull': {self.FILENAMES: {}},}))


    def find_token(self, *tokens, projection=None):
        if not projection:
            projection = self.PROJECTION_RUN

        for _, chunk in self.divide_chunks(tokens):
            records = self.coll.find({self.TOKEN: {"$in": chunk}, }, projection=projection)
            for r in records:
                yield r

    def remove_token(self, *tokens):
        self._requests.append(DeleteMany({self.TOKEN: {"$in": tokens}}))

    def update_score(self, token, score):
        self._requests.append(UpdateOne({self.TOKEN: token, },
                             {'$set': {self.SCORE: score}}, upsert=False))

    def update_blacklist(self, *tokens, max_filenames=DatabaseSbom.MAX_FILENAMES, max_packages=DatabaseSbom.MAX_PACKAGES):
        or_query = {"$or": [
                    { "$expr": { "$and": [  
                        { "$gt": [{ "$size": "$filenames" }, 128] },  
                        { "$type": "$filenames" }  # 检查是否为数组  
                    ]}},  
                    { "$expr": { "$and": [  
                        { "$gt": [{ "$size": "$packages" }, 128] },  
                        { "$type": "$packages" }  # 检查是否为数组  
                    ]}}  
                ]}

        update_operation = {
            '$push': {
                self.PACKAGES: {"$each": [], "$slice": max_packages},
                self.FILENAMES: {"$each": [], "$slice": max_filenames}
            },
            '$set': {self.SCORE: 0}
        }

        # 如果有 tokens，则分批处理。需要注意，如果tokens为空（***** 部分文件缺失没有tokens，甚至部分组件没tokens）
        if tokens != None:
            for _, chunk in self.divide_chunks(tokens, n=50000):
                self._requests.append(
                    UpdateMany(
                        {self.TOKEN: {"$in": chunk}} | or_query,
                        update_operation
                    )
                )
        else:
            # 如果没有 tokens，则更新所有符合条件的文档
            self._requests.append(
                UpdateMany(
                    or_query,
                    update_operation
                )
            )

    def minimize(self):
        # 不可逆操作，仅在生产pro版本时使用。
        self._requests.append(UpdateMany({},
                         {'$unset': {self.FILENAMES: "", self.PACKAGES: "", self.LENGTH: "", self.ORIGIN: "", self.STYPE: ""}, }))

    def update_all_score(self):
        self._requests.append(UpdateMany({}, 
                            {  
                                "$set": {  
                                    "score": {  
                                        "$divide": [  
                                            "$length",
                                            {  
                                                "$pow": [  
                                                    3,  
                                                    {  
                                                        "$subtract": [  
                                                            {  
                                                                "$cond": [  
                                                                    {"$eq": [{"$size": "$filenames"}, 0]},  # 判断 filenames 长度是否为 0  
                                                                    {"$size": "$packages"},  # 如果为 0，使用 packages 的长度  
                                                                    {"$size": "$filenames"}  # 否则使用 filenames 的长度  
                                                                ]  
                                                            },  
                                                            1  # 减去 1  
                                                        ]  
                                                    }  
                                                ]  
                                            }  
                                        ]  
                                    }  
                                }
                            }))
        self.commit() 

    def reset_score(self, *tokens, rebuild=False, mem_threshold=80):
        if rebuild:
            update_operation = {
                    '$set': {self.SCORE: 0, 
                            self.PACKAGES: [], 
                            self.FILENAMES: []
                        }
                }
        else:
            update_operation = {                    
                    '$set': {self.SCORE: 0}
                }

        if tokens:
            for _, chunk in self.divide_chunks(tokens, n=50000):
                self._requests.append(UpdateMany({self.TOKEN: {"$in": chunk}},
                                 update_operation, upsert=False))
        else:
            self._requests.append(UpdateMany({}, update_operation, upsert=False))


class TableSbomFiles(DatabaseSbom):
    ''' Table 1.2 '''
    CHECKSUM = '_id'
    FILEPATH = 'filepath'

    TOKENS = 'tokens'
    
    PACKAGES = 'packages'
    WEIGHT = 'weight'

    FILETYPE = 'filetype' # note, this is for calculate weight before knowning the fullname
    ARCHTYPE = 'archtype'   
    COPYRIGHTS = 'copyrights'
    LICENSES = 'licenses'
    LANGUAGE = 'language'

    PROJECTION_FULL = {TOKENS: 1, CHECKSUM: 1, FILETYPE: 1, FILEPATH: 1, LANGUAGE: 1, ARCHTYPE: 1, WEIGHT:1, PACKAGES: 1}    
    PROJECTION_RUN = {TOKENS: 1, CHECKSUM: 1, FILETYPE: 1, FILEPATH: 1, LANGUAGE: 1, ARCHTYPE: 1, WEIGHT:1, }
    PROJECTION_VERBOSE = {PACKAGES: 1}
    PROJECTION_UNIKEY = { CHECKSUM: 1, }

    def __init__(self, client, collection='files', database=None):
        super().__init__(client, collection, database)

    def create_table(self):
        # self.coll.create_index([(self.CHECKSUM, ASCENDING), ], unique=True, background=True)
        self.coll.create_index([(self.TOKENS, ASCENDING), ], unique=False, background=True)

    def update(self, checksum, filepath, filetype, token_set, copyrights, licenses, language):        
        self._requests.append(UpdateOne({self.CHECKSUM: checksum,},
                             {"$set": {self.WEIGHT: 0, },
                              '$setOnInsert': { self.FILEPATH: filepath, self.FILETYPE: filetype, self.LANGUAGE: language,
                                        self.COPYRIGHTS: copyrights, self.LICENSES: licenses, self.TOKENS: list(token_set), }}, upsert=True)) # ****注意，这里不要用push，slice操作。push不检查重复项！！！！！！

    def update_score(self, checksum, weight):
        self._requests.append(UpdateOne({self.CHECKSUM: checksum, },
                             {'$set': {self.WEIGHT: weight}}, upsert=False))

    def reset_score(self, *checksums, rebuild=False, mem_threshold=80):
        if rebuild:
            update_operation = {'$set': {
                    self.WEIGHT: 0, 
                    self.PACKAGES: [], 
                }}
        else:
            update_operation = {                    
                    '$set': {self.WEIGHT: 0}
                }

        if checksums:
            query_line = {self.CHECKSUM: {"$in": checksums}}
        else:
            query_line = {}
                
        self._requests.append(UpdateMany(query_line, update_operation, upsert=False))

    def update_all_weight(self):
        self._requests.append(UpdateMany(  
            {},  
            [  
                {  
                    "$set": {  
                        "weight": {  
                            "$cond": {  
                                "if": {  
                                    "$and": [  
                                        {"$ne": ["$packages", None]},  
                                        {"$isArray": "$packages"}  
                                    ]  
                                },  
                                "then": {"$size": "$packages"},  
                                "else": 0  
                            }  
                        }  
                    }  
                },
            ],  
            upsert=False  
        ))  
        
        self.commit()


    def find_token(self, *tokens, projection=None):
        if not projection:
            projection = self.PROJECTION_FULL
        
        for _, chunk in self.divide_chunks(tokens, n=50000):
            records = self.coll.find({self.TOKENS: {"$in": chunk}}, projection=projection)
            for r in records:
                yield r

    def find_checksum(self, *checksums, projection=None):
        if not projection:
            projection = self.PROJECTION_FULL

        for _, chunk in self.divide_chunks(checksums):
            records = self.coll.find({self.CHECKSUM: {"$in": chunk}, }, projection=projection)
            for r in records:
                yield r

    def remove_checksum(self, *checksums, mem_threshold=80):
        self._requests.append(DeleteMany({self.CHECKSUM: {"$in": checksums}, }))
        self.commit(mem_threshold=mem_threshold)

    def update_blacklist(self, *checksums, max_packages=DatabaseSbom.MAX_PACKAGES):
        query_line = {"$expr": {"$gt": [{"$size": "$packages"}, max_packages], }}

        update_operation = {
            '$push': {
                self.PACKAGES: {"$each": [], "$slice": max_packages},
            },
            '$set': {self.WEIGHT: 0}
        }

        # 如果有 tokens，则分批处理 ***这里可能是空数组，出现在某些组件暂时未提供文件，虽然这个组件是非法的
        if checksums != None:
            for _, chunk in self.divide_chunks(checksums, n=50000):
                self._requests.append(
                    UpdateMany(
                        {self.CHECKSUM: {"$in": chunk}} | query_line,
                        update_operation
                    )
                )
        else:
            # 如果没有 checksums，则更新所有符合条件的文档
            self._requests.append(
                UpdateMany(
                    query_line,
                    update_operation
                )
            )

    def minimize(self):
        self._requests.append(UpdateMany({},
                         {'$unset': {self.PACKAGES: "", self.FILETYPE: "", }, }))
        pass

    def get_languages(self):
        pipeline = [
            {"$match": {"language": {"$exists": True, "$ne": None}}},  # 过滤掉无效值
            {"$group": {"_id": "$language"}},  # 按 language 字段分组
            {"$project": {"language": "$_id"}}  # 将 _id 重命名为 language
        ]
        result = self.coll.aggregate(pipeline)
        
        languages = set()
        for doc in result:
            print(doc)
            languages.add(str(doc.get("language")))
        print("languages:")
        pprint(languages)
        return languages

    def fix_languages(self):
        cursor = self.coll.find({"language": {"$exists": True}})
        for doc in cursor:
            language = doc.get("language")
            if isinstance(language, list):
                fixed_language = "".join(language)
                self.coll.update_one(
                    {"_id": doc["_id"]},
                    {"$set": {"language": fixed_language}}
                )
        self.commit()


class TableSbomPackages(DatabaseSbom):
    ''' Table 1.3 '''
    ID = '_id'
    FILES = 'files'
    
    FULLNAME = 'fullname'
    VERSION = 'version'
    
    SCORE = 'score'
    DOWNLOADURL = 'downloadurl'    
    LICENSES = 'licenses'

    FILENAME = 'filename'
    DOCUMENT = 'document'
    COPYRIGHTS = 'copyrights'
    RELEASE_TIME = 'release_time'
    DEPENDS = 'depends'

    LANGUAGES = 'languages'

    PROJECTION_FULL = {FILES: 1, FULLNAME: 1, VERSION: 1, SCORE: 1, LANGUAGES: 1,DOWNLOADURL: 1, LICENSES: 1, DEPENDS: 1, FILENAME: 1, DOCUMENT: 1, COPYRIGHTS: 1, RELEASE_TIME: 1, }    
    PROJECTION_RUN  = {FILES: 1, FULLNAME: 1, VERSION: 1, SCORE: 1, LANGUAGES: 1,DOWNLOADURL: 1, LICENSES: 1, DEPENDS: 1, FILENAME: 1, DOCUMENT: 1, COPYRIGHTS: 1, RELEASE_TIME: 1, }

    PROJECTION_UNIKEY = { DatabaseSbom._ID: 1 }

    def __init__(self, client, collection='packages', database=None):
        super().__init__(client, collection, database)

    @classmethod
    def init_score(cls):
        return {cls.ScoreType.STRING: 0, cls.ScoreType.CLASS: 0, cls.ScoreType.NAME: 0, cls.ScoreType.EXTERNAL: 0, }

    def create_table(self):
        self.coll.create_index([(self.FILES, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.FULLNAME, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.FULLNAME, ASCENDING), (self.VERSION, ASCENDING),], unique=True, background=True)

    def add(self, fullname, version, languages, filename, release_time, files_set, downloadurl=None, licenses=[], document=None, copyrights=None, depends=None):
        self._requests.append(UpdateOne({self.FULLNAME: fullname, self.VERSION: version, },
                             {'$set': {self.LANGUAGES: languages, self.FILENAME: filename, self.RELEASE_TIME: release_time, self.DEPENDS: depends,
                                 self.DOWNLOADURL: downloadurl, self.LICENSES: licenses, 
                                 self.DOCUMENT: document, self.COPYRIGHTS: copyrights,
                                 self.FILES: list(files_set), self.SCORE: self.init_score(),}, }, upsert=True))

    def update(self, fullname, version=None, languages=None, filename=None, release_time=None, downloadurl=None, licenses=None, document=None, copyrights=None, depends=None):
        set_fields = {}
        if languages is not None:
            set_fields[self.LANGUAGES] = languages
        if filename is not None:
            set_fields[self.FILENAME] = filename
        if release_time is not None:
            set_fields[self.RELEASE_TIME] = release_time
        if downloadurl is not None:
            set_fields[self.DOWNLOADURL] = downloadurl
        if licenses is not None:
            set_fields[self.LICENSES] = licenses        
        if document is not None:
            set_fields[self.DOCUMENT] = document
        if copyrights is not None:
            set_fields[self.COPYRIGHTS] = copyrights
        if depends is not None:
            set_fields[self.DEPENDS] = depends

        query = {self.FULLNAME: fullname}
        if version is not None:
            query[self.VERSION] = version
        
        if set_fields:
            self._requests.append(UpdateMany(query, {'$set': set_fields, }, upsert=True))

    def remove(self, fullname, version=None):
        query = {self.FULLNAME: fullname}
        if version is not None:
            query[self.VERSION] = version
        
        self._requests.append(DeleteMany(query))

    def add_files(self, fullname, version, files):
        self._requests.append(UpdateOne({self.FULLNAME: fullname, self.VERSION: version},
                            {'$addToSet': {self.FILES: {'$each': files}}, }, upsert=False))

    def remove_files(self, fullname, version, files):
        self._requests.append(UpdateOne({self.FULLNAME: fullname, self.VERSION: version},
                            {'$pull': {self.FILES: {'$in': files}}, }, upsert=False))

    def find_id(self, *_ids, projection=None):
        if not projection:
            projection = self.PROJECTION_FULL

        for _, chunk in self.divide_chunks(_ids):
            records = self.coll.find({self.ID: {"$in": chunk}, }, projection=projection)
            for r in records:
                yield r

    def remove_id(self, *_ids):
        self._requests.append(DeleteMany({self.ID: {"$in": _ids}}))

    def find_file(self, *file_checksums, projection=None):
        if not projection:
            projection = self.PROJECTION_FULL

        for _, chunk in self.divide_chunks(file_checksums):
            for r in self.coll.find({self.FILES: {"$in": chunk}, }, projection=projection):
                yield r

    def update_score(self, fullname, version, score):
        self._requests.append(UpdateOne({self.FULLNAME: fullname, self.VERSION: version},
                             {'$set': {self.SCORE: score}}, upsert=False))

    def find_package(self, fullname, *versions, projection=None, use_regex=False):
        if not projection:
            projection = self.PROJECTION_FULL
        query = {self.FULLNAME: {"$regex": fullname,}} if use_regex else {self.FULLNAME: fullname,}
        if versions:
            query[self.VERSION] = {"$in": versions}

        return self.coll.find(query, projection=projection)
    

    def find_packages(self, *fullnames, projection=None):
        if not projection:
            projection = self.PROJECTION_FULL

        query = {}
        if fullnames:
            query[self.FULLNAME] = {"$in": fullnames}
            
        records = self.coll.find(query, projection=projection)
        for r in records:
            yield r

    def reset_score(self, *fullnames, mem_threshold=80):
        if fullnames:
            self._requests.append(UpdateMany({self.FULLNAME: {"$in": fullnames}},
                             {'$set': {self.SCORE: self.init_score()},}, upsert=False))
        else:
            self._requests.append(UpdateMany({},
                             {'$set': {self.SCORE: self.init_score()},}, upsert=False))

        self.commit(mem_threshold=mem_threshold)

    def rename(self, fullname, new_fullname):
        self._requests.append(UpdateMany({self.FULLNAME: fullname},
                             {'$set': {self.FULLNAME: new_fullname}}, upsert=False))

    def minimize(self):
        pass

    def getPackage(self, fullname, version, projection=None):
        records = self.find_package(fullname, version, projection=projection)
        for r in records:
            return r
        return {}

    

    
class TableSbomPackagesSummary(DatabaseSbom):
    ''' Table 1.5 '''
    FULLNAME = 'fullname' # unique fullname, might be combined as verdor-name (default), auther-name, or whatever.
    ALIASES = 'aliases'
    AUTHOR = 'author'
    NAME = 'name'
    PRETTY_NAME = 'pretty_name'    
    VENDOR = 'vendor'
    WEBSITE = 'website'
    REQUIRES = 'requires'

    PRODUCT_REGEX = 'product_regex'
    VENDOR_REGEX = 'vendor_regex'

    PROJECTION_UNIKEY = { DatabaseSbom._ID: 1 }
    

    def __init__(self, client, collection='packages_summary', database=None):
        super().__init__(client, collection, database)

    def create_table(self):
        self.coll.create_index([(self.FULLNAME, ASCENDING), ], unique=True, background=True)
        self.coll.create_index([(self.ALIASES, ASCENDING), ], unique=False, background=True)
        self.coll.create_index([(self.NAME, ASCENDING),  ], unique=False, background=True)

    def update(self, fullname, vendor=None, name=None, author=None, website=None, pretty_name=None, aliases=None, product_regex=None, vendor_regex=None):        
        update_fields = {}

        if vendor != None:
            update_fields[self.VENDOR] = vendor
        if name != None:
            update_fields[self.NAME] = name.split('@')[0]        
        if author != None:
            update_fields[self.AUTHOR] = author
        if website != None:
            update_fields[self.WEBSITE] = website
        if pretty_name != None:
            update_fields[self.PRETTY_NAME] = pretty_name.split('@')[0]
        if aliases != None:
            update_fields[self.ALIASES] = aliases
        if product_regex != None:
            update_fields[self.PRODUCT_REGEX] = product_regex
        if vendor_regex != None:
            update_fields[self.VENDOR_REGEX] = vendor_regex

        if update_fields:
            self._requests.append(UpdateOne({self.FULLNAME: fullname, }, {'$set': update_fields}, upsert=True))

    def get_package_summaries(self, name, vendor=None, projection=None):
        if not projection:
            projection = {self.NAME: 1, self.PRETTY_NAME: 1, self.ALIASES: 1, self.VENDOR: 1, self.AUTHOR: 1, self.FULLNAME: 1, self.WEBSITE: 1, self.PRODUCT_REGEX: 1, self.VENDOR_REGEX: 1, self.REQUIRES: 1}

        query = {"$or": [{self.FULLNAME: name}, 
                        {self.NAME: name},
                        {self.PRETTY_NAME: name},
                        {self.ALIASES: name}]}
        
        if vendor:
            query[self.VENDOR] = vendor

        return self.coll.find(query, projection=projection)


    def find_packages(self, *names, vendor=None, projection=None):
        if not projection:
            projection = {self.NAME: 1, self.PRETTY_NAME: 1, self.ALIASES: 1, self.VENDOR: 1, self.AUTHOR: 1, self.FULLNAME: 1, self.WEBSITE: 1, self.PRODUCT_REGEX: 1, self.VENDOR_REGEX: 1, self.REQUIRES: 1}

        regex_names = []
        for name in names:
            # 分割名称
            name_parts = re.split(r'[\s\-_.]', name)
            # 构建正则表达式
            regex_name = r'\b' + r'\s*[-_.]*\s*'.join(re.escape(part) for part in name_parts) + r'\b'
            # 编译正则表达式
            regex_name = re.compile(regex_name, re.IGNORECASE)
            regex_names.append(regex_name)
        
        query = {}

        if regex_names:
            query["$or"] = [{self.FULLNAME: {'$in': regex_names}}, 
                            {self.NAME: {'$in': regex_names}},
                            {self.PRETTY_NAME: {'$in': regex_names}}]
        if vendor:
            query[self.VENDOR] = vendor

        return self.coll.find(query, projection=projection)


    def remove_packages(self, *names, vendor=None, match_whole_name=True):
        regex_names = []
        for name in names:
            # 分割名称
            name_parts = re.split(r'[\s\-_.]', name)
            # 构建正则表达式
            regex_name = r'\b' + r'\s*[-_.]*\s*'.join(re.escape(part) for part in name_parts) + r'\b'
            # 编译正则表达式
            regex_name = re.compile(regex_name, re.IGNORECASE)
            regex_names.append(regex_name)

        query = {}

        if regex_names:
            query = {"$or": [{self.FULLNAME: {'$in': regex_names}}, 
                            {self.NAME: {'$in': regex_names}},
                            {self.PRETTY_NAME: {'$in': regex_names}}]}

        if vendor:
            query[self.VENDOR] = vendor
        
        if query:
            return self.coll.delete_many(query)

        else:
            return None # just ignore it


    def getSummaries(self, uname, name=None, alias=None, vendor=None, projection=None, use_regex=False):
        if not projection:
            projection = {self.NAME: 1, self.PRETTY_NAME: 1, self.ALIASES: 1, self.VENDOR: 1, self.AUTHOR: 1, self.FULLNAME: 1, self.WEBSITE: 1, self.PRODUCT_REGEX: 1, self.VENDOR_REGEX: 1, self.REQUIRES: 1}
        
        if use_regex:        
            query = {self.FULLNAME: {"$regex": uname}}
        elif '@' in uname:
            query = {self.FULLNAME: uname}
        else:
            query = {self.NAME: uname}

        if name:            
            query.setdefault(self.NAME, name)
        if alias:
            query.setdefault(self.ALIASES, name)

        if vendor:
            query[self.VENDOR] = vendor

        return list(self.coll.find(query, projection=projection))
        
    def getSummary(self, fullname):
        summaries = self.getSummaries(fullname)
        return summaries[0] if summaries else None



        

if __name__=="__main__":
    import time
    import pathlib
    from exlib.utils import jsonex
    from pprint import pprint
    from database.core.mongo_db import mongo_client

    with mongo_client() as client:
        tableSummary = TableSbomPackagesSummary(client)
        tablePackages = TableSbomPackages(client)

        all_packages = {}

        records = tableSummary.find({}, projection={tableSummary.NAME: 1, tableSummary.PRETTY_NAME: 1, tableSummary.ALIASES: 1, tableSummary.VENDOR: 1, tableSummary.AUTHOR: 1,
                                             tableSummary.FULLNAME: 1, tableSummary.WEBSITE: 1, tableSummary.PRODUCT_REGEX: 1, tableSummary.VENDOR_REGEX: 1})
        for sr in records:
            sr.pop("_id")
            fullname = sr.pop(tableSummary.FULLNAME)
            
            all_packages[fullname] = sr
            

        jsonex.dump(all_packages, pathlib.Path(f"/share/temp/all_packages_{time.ctime()}.json"))