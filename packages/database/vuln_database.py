import re
import ast
import traceback

from .core.database import DatabaseClass
from .core.errors import *
from exlib.classes.base import EnumClass
from pymongo import UpdateOne,InsertOne,DeleteOne,UpdateMany,DeleteMany,ASCENDING, DESCENDING

from datetime import datetime

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class VulnerabilityType(EnumClass):
    CVE = 'cve'
    CNNVD = 'cnnvd'
    CNVD = 'cnvd'
    JVNDB = 'jvndb'
    OSVDB = 'osvdb'
    CERT = 'cert'

class ExploitType(EnumClass):
    EXPLOIT_DB = 'exploit_db'

class TableVulnMissingCollectionName(Exception):
    pass

class DatabaseVuln(DatabaseClass):    
    @staticmethod
    def _validate_year(year: int) -> bool:
        """验证年份是否在有效范围内"""
        current_year = datetime.utcnow().year
        return 1990 <= year <= current_year

    def _find_by_year(self, field_name: str, year: int, other_fields: dict = None, projection: dict = None):
        if not self._validate_year(year):
            raise ValueError(f"无效的年份: {year}. 有效年份范围为1990到当前年份.")
        # 构建正则表达式
        regex_year = re.compile(f'-{year}[0-9]*-', re.IGNORECASE)
        # 构建查询条件
        query = {field_name: regex_year}
        if other_fields:
            query.update(other_fields)

        # 查询数据
        records = self.coll.find(query, projection=projection)
        return records

    def __init__(self, client, collection, database):
        if not database:
            database = self.config().vuln
        super().__init__(client, collection, database)

class TableVulnCves(DatabaseVuln):
    ''' Table 1.1 '''
    CVE_ID = 'cve_id'
    ASSIGNER = 'assigner'

    CPES = 'cpes' # type, vendor, version, end_excluding, end_including, start_excluding, start_including    
    CPES_PRODUCT = 'cpes.product'
    CPES_VENDOR = 'cpes.vendor'
    CPES_VERSION = 'cpes.version'
    
    DESCRIPTION = 'description'
    LAST_MODIFIED_DATE = 'last_modified_date'
    METRICS = 'metrics'

    SOURCE = 'source'
    PLATFORM = 'platform'

    PROBLEM_TYPES = 'problem_types'
    PUBLISHED_DATE = 'published_date'
    REFERENCES = 'references'

    UPDATE_TIME = 'update_time'
    
    def __init__(self, client, collection='cves', database=None):
        super().__init__(client, collection, database)

    def create_table(self):    
        self.coll.create_index([(self.CVE_ID, ASCENDING), ], unique=True, background=True)
        self.coll.create_index([(self.CVE_ID, ASCENDING), (self.CPES_PRODUCT, ASCENDING), ], unique=True, background=True)
        self.coll.create_index([(self.CVE_ID, ASCENDING), (self.CPES_PRODUCT, ASCENDING), (self.CPES_VENDOR, ASCENDING), ], unique=True, background=True)


    def update(self, cve_id, cve_info):
        cve_info[self.UPDATE_TIME] = datetime.utcnow()

        # product, vendor, version will be used to create index, hence they must be available
        cpes = cve_info.get('cpes', [])
        if cpes:
            for cpe in cpes:
                product = cpe.get('product', None)
                if not product or product in ("n/a", ):
                    cpe['product'] = ""
                vendor = cpe.get('vendor', None)
                if not vendor or vendor in ("n/a", ):
                    cpe['vendor'] = ""
                version = cpe.get('version', None)
                if not version or version in ("n/a", ):
                    cpe['version'] = ""
                update = cpe.get('update', None)
                if not update or update in ("n/a", ):
                    cpe['update'] = ""
        else:
            cve_info.pop('cpes', None)

        self._requests.append(UpdateOne({self.CVE_ID: cve_id, }, {'$set': cve_info,}, upsert=True))
        
    def find_cve(self, *cve_ids, projection=None):
        if not projection:
            projection = {self.CVE_ID: 1, self.ASSIGNER:1, self.CPES: 1, self.DESCRIPTION: 1, 
                          self.LAST_MODIFIED_DATE: 1, self.METRICS:1, self.SOURCE: 1, self.PLATFORM: 1, self.PROBLEM_TYPES: 1, 
                          self.PUBLISHED_DATE: 1, self.REFERENCES:1, } 

        if cve_ids:
            for _, chunks in self.divide_chunks(cve_ids):            
                records = self.coll.find({self.CVE_ID: {"$in": chunks}, }, projection=projection)
                for r in records:
                    yield r
        else:
            records = self.coll.find({}, projection=projection)
            for r in records:
                yield r


    def find_product(self, product, vendor=None, projection=None):
        if not projection:
            projection = {self.CVE_ID: 1, self.ASSIGNER: 1, self.CPES: 1, self.DESCRIPTION: 1, 
                        self.LAST_MODIFIED_DATE: 1, self.METRICS: 1, self.SOURCE: 1, self.PLATFORM: 1, self.PROBLEM_TYPES: 1, 
                        self.PUBLISHED_DATE: 1, self.REFERENCES: 1, }
        
        if isinstance(product, str):
            # 预处理产品名称        
            product = '.'.join(list(re.sub(r'[-_.\s]+', '', product.lower())))
            
            # 分割产品名称
            product_parts = re.split(r'[\s\-_.]', product)
            # 构建产品名称的正则表达式
            regex_product = r'\b' + r'\s*[-_.]*\s*'.join(re.escape(part) for part in product_parts) + r'\b'
            # 编译产品名称的正则表达式
            regex_product = re.compile(regex_product, re.IGNORECASE)

        else: # re.Pattern
            regex_product = product

        # 初始查询条件
        query = {self.CPES: {"$elemMatch": {"product": regex_product}}}

        if vendor:
            if isinstance(vendor, str):
                # 预处理厂商名称        
                vendor = '.'.join(list(re.sub(r'[-_.\s]+', '', vendor.lower())))

                # 分割厂商名称
                vendor_parts = re.split(r'[\s\-_.]', vendor)
                # 构建厂商名称的正则表达式
                regex_vendor = r'\b' + r'\s*[-_.]*\s*'.join(re.escape(part) for part in vendor_parts) + r'\b'
                # 编译厂商名称的正则表达式
                regex_vendor = re.compile(regex_vendor, re.IGNORECASE)
            else:
                regex_vendor = vendor

            # 更新查询条件
            query[self.CPES]["$elemMatch"]["vendor"] = regex_vendor

        records = self.coll.find(query, projection=projection)
        found_records = list(records)

        if not found_records and vendor:
            # 忽略 vendor 值，再查一次
            query = {self.CPES: {"$elemMatch": {"product": regex_product}}}
            records = self.coll.find(query, projection=projection)
            found_records = list(records)
            vendor = None  # 将 vendor 置空

        for record in found_records:
            matched_cpes = []
            for cpe in record[self.CPES]:
                if regex_product.match(cpe['product']):
                    if vendor:
                        if regex_vendor.match(cpe['vendor']):
                            matched_cpes.append(cpe)
                    else:
                        matched_cpes.append(cpe)
            if matched_cpes:
                record[self.CPES] = matched_cpes
                yield record

    def find_product_fuzzy(self, product, vendor=None, projection=None):
        if not projection:
            projection = {self.CVE_ID: 1, self.ASSIGNER: 1, self.CPES: 1, self.DESCRIPTION: 1, 
                        self.LAST_MODIFIED_DATE: 1, self.METRICS: 1, self.SOURCE: 1, self.PLATFORM: 1, self.PROBLEM_TYPES: 1, 
                        self.PUBLISHED_DATE: 1, self.REFERENCES: 1, }
        
        product = '.'.join(list(re.sub(r'[-_.\s]+', '', product.lower())))
        product_parts = re.split(r'[\s\-_.]', product)
        regex_product = re.compile(r'.*' + r'.*'.join(re.escape(part) for part in product_parts) + r'.*', re.IGNORECASE)
        query = {self.CPES: {"$elemMatch": {"product": regex_product}}}

        if vendor:
            vendor = '.'.join(list(re.sub(r'[-_.\s]+', '', vendor.lower())))
            vendor_parts = re.split(r'[\s\-_.]', vendor)
            regex_vendor = re.compile(r'.*' + r'.*'.join(re.escape(part) for part in vendor_parts) + r'.*', re.IGNORECASE)
            query[self.CPES]["$elemMatch"]["vendor"] = regex_vendor

        records = self.coll.find(query, projection=projection)
        found_records = list(records)

        if not found_records and vendor:
            query = {self.CPES: {"$elemMatch": {"product": regex_product}}}
            records = self.coll.find(query, projection=projection)
            found_records = list(records)
            vendor = None  # 将 vendor 置空

        for record in found_records:
            matched_cpes = []
            for cpe in record[self.CPES]:
                if regex_product.search(cpe['product']):
                    if vendor:
                        if regex_vendor.search(cpe['vendor']):
                            matched_cpes.append(cpe)
                    else:
                        matched_cpes.append(cpe)
            if matched_cpes:
                record[self.CPES] = matched_cpes
                yield record

    def find_products(self, *products, projection=None):
        if not projection:
            projection = {self.CVE_ID: 1, self.ASSIGNER: 1, self.CPES: 1, self.DESCRIPTION: 1, 
                        self.LAST_MODIFIED_DATE: 1, self.METRICS: 1, self.SOURCE: 1, self.PLATFORM: 1, self.PROBLEM_TYPES: 1, 
                        self.PUBLISHED_DATE: 1, self.REFERENCES: 1, }

        regex_products = []
        for product in products:
            # 分割产品名称
            product_parts = re.split(r'[\s\-_.]', product)
            # 构建正则表达式
            regex_product = r'\b' + r'\s*[-_.]*\s*'.join(re.escape(part) for part in product_parts) + r'\b'
            # 编译正则表达式
            regex_product = re.compile(regex_product, re.IGNORECASE)
            regex_products.append(regex_product)

        # 查询条件
        query = {self.CPES: {"$elemMatch": {"product": {"$in": regex_products}}}}

        records = self.coll.find(query, projection=projection)
        for r in records:
            yield r


    @staticmethod
    def compare_version(s0, s1):
        def _split(s):
            x = re.split(r'pre?', s, maxsplit=1)
            x.append("")

            return re.findall(r'\b[a-f0-9]{4,}\b|[a-z]+|[0-9]+', x[0]), re.findall(r'\b[a-f0-9]{4,}\b|[a-z]+|[0-9]+', x[1])

        def _compare(m0, m1):
            while(m0 and m1):
                x = m0.pop(0)
                y = m1.pop(0)

                if x==y:
                    continue

                if x.isdigit() and y.isdigit():
                    # 当数值是4位数时, 要以年份等格式进行字符串比较，而不是整数
                    if len(x) < 4 and len(y) < 4:
                        return int(x) - int(y)

                return 1 if x > y else -1

            return len(m0) - len(m1)


        a0, a1 = _split(s0.lower())
        b0, b1 = _split(s1.lower())

        r = _compare(a0, b0)
        if r:
            return r

        # prerelease是个特例，比如, 1.0.0 是 1.0-pr01, 1.0.0-pr01的正式版
        if not a1 and b1:
            return 1
        elif a1 and not b1:
            return -1
        else:            
            return _compare(a1, b1)

    @classmethod
    def search_cpe(cls, cve, product, version): 
        real_versions = { version, }
        pattern_verbose = re.compile(r"^\D+[_\-\.](?=\d) | ^\D[a-z0-9]+[_\-](?=\d+\.\d) | ^\D+(?=\d+\.\d) | (-release|-stable)$", flags=re.I|re.X)            
        pattern_dot_replace = re.compile(r"[_\-]+(?=\d)")
        if version:
            real_version = pattern_verbose.sub("", version)
            real_versions.add(real_version)
            real_version = pattern_dot_replace.sub('.', real_version)
            real_versions.add(real_version)
        else:
            real_version = ""
        
        START_INC = ">="
        END_INC = "<="
        START_EXC = ">"
        END_EXC = "<"

        for i, cpe in enumerate(cve.get('cpes', [])):
            # log.debug(f"cpe .{i}: {cpe}")  

            product2 = cpe.get('product', None)
            if product2.lower() != product.lower():
                continue

            if not real_version:
                return cpe

            # is the version
            version2 = cpe.get('version', None)
            if version2:
                if version2 in real_versions:
                    return cpe
                continue

            # in the list of versions
            versions = cpe.get('versions', None)
            if versions:
                for v in versions:
                    if v in real_versions:
                        return cpe
                continue

            version_end = cpe.get(END_INC, None)
            if version_end:
                end_including = True
            else:
                version_end = cpe.get(END_EXC, None)
                end_including = False

            version_start = cpe.get(START_INC, None)
            if version_start:
                start_including = True
            else:
                version_start = cpe.get(START_EXC, None)
                start_including = False

            if version_start:                
                r = cls.compare_version(real_version, version_start)                
                if r is None:
                    log.warning(f"failed to compare versions: {product}/{real_version} on {cve['cve_id']}")
                    continue

                if r < 0 or (r==0 and not start_including):
                    continue

            if version_end:
                r = cls.compare_version(real_version, version_end)
                if r is None:
                    log.warning(f"failed to compare versions: {product}/{real_version} on {cve['cve_id']}")
                    continue
                    
                if r > 0 or (r==0 and not end_including):
                    continue
            
            return cpe

        return None

    def find_by_year(self, year: int = None, projection=None):
        if year is None:
            year = datetime.utcnow().year
        if not projection:
            projection = {self.CVE_ID: 1, self.ASSIGNER: 1, self.CPES: 1, self.DESCRIPTION: 1, 
                          self.LAST_MODIFIED_DATE: 1, self.METRICS: 1, self.SOURCE: 1, self.PLATFORM: 1, self.PROBLEM_TYPES: 1, 
                          self.PUBLISHED_DATE: 1, self.REFERENCES: 1, }
        records = self._find_by_year(self.CVE_ID, year, projection=projection)
        for r in records:
            yield r

class TableVulnCnnvds(DatabaseVuln):
    ''' Table 1.1 '''
    CNNVD_ID = 'cnnvd_id'
    CVE_ID = 'cve_id'

    INDEX = 'index'
    MODIFIED = 'modified'
    
    NAME = 'name'
    PUBLISHED = 'published'
    SERVERITY = 'severity'
    SOLUTION = 'solution'  

    SOURCE = 'source'
    THREAT_TYPE = 'threat_type'
    TYPE = 'type'
    DESCRIPTION = 'vuln_descript'
        
    def __init__(self, client, collection='cnnvds', database=None):
        super().__init__(client, collection, database)

    def create_table(self):    
        self.coll.create_index([(self.CNNVD_ID, ASCENDING), ], unique=True, background=True)
        self.coll.create_index([(self.CVE_ID, ASCENDING), ], unique=False, background=True)

    def update(self, cnnvd_id, cnnvd_info):
        self._requests.append(UpdateOne({self.CNNVD_ID: cnnvd_id, }, {'$set': cnnvd_info,}, upsert=True))
        
    def find_cnnvd(self, *cnnvd_ids, projection=None):
        if not projection:
            projection = {self.CVE_ID: 1, self.CNNVD_ID:1, self.INDEX: 1, self.MODIFIED: 1, 
                          self.NAME: 1, self.PUBLISHED:1, self.SERVERITY: 1, self.SOLUTION: 1, 
                          self.SOURCE: 1, self.THREAT_TYPE:1, self.TYPE: 1, self.DESCRIPTION: 1, } 

        for _, chunks in self.divide_chunks(cnnvd_ids):            
            records = self.coll.find({self.CNNVD_ID: {"$in": chunks}, }, projection=projection)
            for r in records:
                yield r

    def find_cve(self, *cve_ids, projection=None):
        if not projection:
            projection = {self.CVE_ID: 1, self.CNNVD_ID:1, self.INDEX: 1, self.MODIFIED: 1, 
                          self.NAME: 1, self.PUBLISHED:1, self.SERVERITY: 1, self.SOLUTION: 1, 
                          self.SOURCE: 1, self.THREAT_TYPE:1, self.TYPE: 1, self.DESCRIPTION: 1, } 

        for _, chunks in self.divide_chunks(cve_ids):            
            records = self.coll.find({self.CVE_ID: {"$in": chunks}, }, projection=projection)
            for r in records:
                yield r

    def find_by_year(self, year: int = None, projection=None):
        if year is None:
            year = datetime.utcnow().year
        if not projection:
            projection = {self.CVE_ID: 1, self.CNNVD_ID: 1, self.INDEX: 1, self.MODIFIED: 1, 
                          self.NAME: 1, self.PUBLISHED: 1, self.SERVERITY: 1, self.SOLUTION: 1, 
                          self.SOURCE: 1, self.THREAT_TYPE: 1, self.TYPE: 1, self.DESCRIPTION: 1}
        records = self._find_by_year(self.CNNVD_ID, year, projection=projection)
        for r in records:
            yield r

class TableVulnCnvds(DatabaseVuln):
    ''' Table 1.1 '''
    CNVD_ID = 'cnvd_id'
    CVE_ID = 'cve_id'

    DESCRIPTION = 'description'
    DISCOVERER_NAME = 'discovererName'
    
    FORMALWAY = 'formalWay'
    INDEX = 'index'
    IS_EVENT = 'isEvent'
    OPEN_TIME = 'openTime'  

    PATCH_DESCRIPTION = 'patchDescription'
    PATCH_NAME = 'patchName'
    SEVERITY = 'severity'
    SUBMIT_TIME = 'submitTime'
    TITLE = 'title'
        
    def __init__(self, client, collection='cnvds', database=None):
        super().__init__(client, collection, database)

    def create_table(self):    
        self.coll.create_index([(self.CNVD_ID, ASCENDING), ], unique=True, background=True)
        self.coll.create_index([(self.CVE_ID, ASCENDING), ], unique=False, background=True)

    def update(self, cnvd_id, cnvd_info):
        self._requests.append(UpdateOne({self.CNVD_ID: cnvd_id, }, {'$set': cnvd_info,}, upsert=True))
        
    def find_cnvd(self, *cnvd_ids, projection=None):
        if not projection:
            projection = {self.CVE_ID: 1, self.CNVD_ID:1, self.DESCRIPTION: 1, self.DISCOVERER_NAME: 1, 
                          self.FORMALWAY: 1, self.INDEX:1, self.IS_EVENT: 1, self.OPEN_TIME: 1, 
                          self.PATCH_DESCRIPTION: 1, self.PATCH_NAME:1, self.SEVERITY: 1, self.SUBMIT_TIME: 1, 
                          self.TITLE: 1, } 

        for _, chunks in self.divide_chunks(cnvd_ids):            
            records = self.coll.find({self.CNVD_ID: {"$in": chunks}, }, projection=projection)
            for r in records:
                yield r

    def find_cve(self, *cve_ids, projection=None):
        if not projection:
            projection = {self.CVE_ID: 1, self.CNVD_ID:1, self.DESCRIPTION: 1, self.DISCOVERER_NAME: 1, 
                          self.FORMALWAY: 1, self.INDEX:1, self.IS_EVENT: 1, self.OPEN_TIME: 1, 
                          self.PATCH_DESCRIPTION: 1, self.PATCH_NAME:1, self.SEVERITY: 1, self.SUBMIT_TIME: 1, 
                          self.TITLE: 1, } 

        for _, chunks in self.divide_chunks(cve_ids):            
            records = self.coll.find({self.CVE_ID: {"$in": chunks}, }, projection=projection)
            for r in records:
                yield r
    
    def find_by_year(self, year: int = None, projection=None):
        if year is None:
            year = datetime.utcnow().year
        if not projection:
            projection = {self.CVE_ID: 1, self.CNVD_ID: 1, self.DESCRIPTION: 1, self.DISCOVERER_NAME: 1, 
                          self.FORMALWAY: 1, self.INDEX: 1, self.IS_EVENT: 1, self.OPEN_TIME: 1, 
                          self.PATCH_DESCRIPTION: 1, self.PATCH_NAME: 1, self.SEVERITY: 1, self.SUBMIT_TIME: 1, 
                          self.TITLE: 1}
        records = self._find_by_year(self.CNVD_ID, year, projection=projection)
        for r in records:
            yield r

class TableVulnJvns(DatabaseVuln):
    ''' Table 1.1 '''
    JVN_ID = 'jvn_id'
    CVE_ID = 'cve_id'

    AFFECTED = 'affected'
    ASSIGNER = 'assigner'
    # CPES = 'cpes' # type, vendor, version, end_excluding, end_including, start_excluding, start_including
    # CPES_PRODUCT = 'cpes.product'
    
    DESCRIPTION = 'description'
    JVN_SOLUTION = 'jvn_solution'
    LAST_MODIFIED_DATE = 'last_modified_date'
    METRICS = 'metrics'
    
    PUBLISHED_DATE = 'published_date'
    REFERENCES = 'references'
    SOURCE_ID = 'source_id'
        
    def __init__(self, client, collection='jvns', database=None):
        super().__init__(client, collection, database)

    def create_table(self):    
        self.coll.create_index([(self.JVN_ID, ASCENDING), ], unique=True, background=True)
        self.coll.create_index([(self.CVE_ID, ASCENDING), ], unique=False, background=True)

    def update(self, jvn_id, jvn_info):
        self._requests.append(UpdateOne({self.JVN_ID: jvn_id, }, {'$set': jvn_info,}, upsert=True))
        
    def find_jvn(self, *jvn_ids, projection=None):
        if not projection:
            projection = {self.CVE_ID: 1, self.JVN_ID:1, self.AFFECTED: 1, self.ASSIGNER: 1, 
                          self.DESCRIPTION: 1, self.JVN_SOLUTION:1, self.LAST_MODIFIED_DATE: 1, self.METRICS: 1, 
                          self.PUBLISHED_DATE: 1, self.REFERENCES:1, self.SOURCE_ID: 1, } 

        for _, chunks in self.divide_chunks(jvn_ids):            
            records = self.coll.find({self.JVN_ID: {"$in": chunks}, }, projection=projection)
            for r in records:
                yield r

    def find_cve(self, *cve_ids, projection=None):
        if not projection:
            projection = {self.CVE_ID: 1, self.JVN_ID:1, self.AFFECTED: 1, self.ASSIGNER: 1, 
                          self.DESCRIPTION: 1, self.JVN_SOLUTION:1, self.LAST_MODIFIED_DATE: 1, self.METRICS: 1, 
                          self.PUBLISHED_DATE: 1, self.REFERENCES:1, self.SOURCE_ID: 1, } 

        for _, chunks in self.divide_chunks(cve_ids):            
            records = self.coll.find({self.CVE_ID: {"$in": chunks}, }, projection=projection)
            for r in records:
                yield r

    def find_by_year(self, year: int = None, projection=None):
        if year is None:
            year = datetime.utcnow().year
        if not projection:
            projection = {self.CVE_ID: 1, self.JVN_ID: 1, self.AFFECTED: 1, self.ASSIGNER: 1, 
                          self.DESCRIPTION: 1, self.JVN_SOLUTION: 1, self.LAST_MODIFIED_DATE: 1, 
                          self.METRICS: 1, self.PUBLISHED_DATE: 1, self.REFERENCES: 1, self.SOURCE_ID: 1}
        records = self._find_by_year(self.JVN_ID, year, projection=projection)
        for r in records:
            yield r




class TableVulnExploits(DatabaseVuln):
    ''' Table for Exploits '''
    EXPLOIT_ID = 'exploit_id'
    FILE = 'file'
    DESCRIPTION = 'description'
    DATE_PUBLISHED = 'date_published'
    AUTHOR = 'author'
    TYPE = 'type'
    PLATFORM = 'platform'
    PORT = 'port'
    DATE_ADDED = 'date_added'
    DATE_UPDATED = 'date_updated'
    VERIFIED = 'verified'
    CODES = 'codes'
    TAGS = 'tags'
    ALIASES = 'aliases'
    SCREENSHOT_URL = 'screenshot_url'
    APPLICATION_URL = 'application_url'
    SOURCE_URL = 'source_url'

    def __init__(self, client, collection='exploits', database=None):
        super().__init__(client, collection, database)

    def create_table(self):
        self.coll.create_index([(self.EXPLOIT_ID, ASCENDING)], unique=True, background=True)
        self.coll.create_index([(self.CODES, ASCENDING)], background=True)  # 添加 CODES 索引

    def update(self, exploit_id, exploit_info):        
        # 处理 codes 和 tags 字段
        codes_to_add = []
        tags_to_add = []

        if self.CODES in exploit_info:
            codes = exploit_info.pop(self.CODES)
            codes_to_add = self.process_codes(codes)

        if self.TAGS in exploit_info:
            tags = exploit_info.pop(self.TAGS)
            tags_to_add = self.process_tags(tags)

        # 处理日期字段
        date_fields = [self.DATE_PUBLISHED, self.DATE_ADDED, self.DATE_UPDATED]
        for date_field in date_fields:
            if date_field in exploit_info:
                date_str = exploit_info.pop(date_field)
                date_obj = self.process_date(date_str)
                exploit_info[date_field] = date_obj

        # 使用 $set 和 $addToSet 来更新 codes 和 tags 字段
        update_operations = {
            "$set": exploit_info,
            "$addToSet": {
                self.CODES: {"$each": codes_to_add},
                self.TAGS: {"$each": tags_to_add},
            }
        }

        self._requests.append(UpdateOne({self.EXPLOIT_ID: exploit_id }, update_operations, upsert=True))



    def find_exploit(self, *exploit_ids, projection=None):
        if not projection:
            projection = {
                self.EXPLOIT_ID: 1, self.FILE: 1, self.DESCRIPTION: 1, self.DATE_PUBLISHED: 1,
                self.AUTHOR: 1, self.TYPE: 1, self.PLATFORM: 1, self.PORT: 1, self.DATE_ADDED: 1,
                self.DATE_UPDATED: 1, self.VERIFIED: 1, self.CODES: 1, self.TAGS: 1, self.ALIASES: 1,
                self.SCREENSHOT_URL: 1, self.APPLICATION_URL: 1, self.SOURCE_URL: 1, 
            }

        for _, chunks in self.divide_chunks(exploit_ids):
            records = self.coll.find({self.EXPLOIT_ID: {"$in": chunks}}, projection=projection)
            for r in records:
                yield r

    def find_by_year(self, exploit_type: str = None, year: int = None, projection=None):
        if year is None:
            year = datetime.utcnow().year
        if not projection:
            projection = {
                self.EXPLOIT_ID: 1, self.DESCRIPTION: 1, self.DATE_UPDATED: 1, self.VERIFIED: 1, 
                self.CODES: 1, self.TAGS: 1, self.ALIASES: 1,
            }
        
        # 构建日期范围
        start_date = datetime(year, 1, 1)  # 年的开始
        end_date = datetime(year + 1, 1, 1)  # 下一年的开始

        # 修改记录查询，直接使用日期范围进行查询
        query = {self.DATE_PUBLISHED: {"$gte": start_date, "$lt": end_date}}

        records = self.coll.find(query, projection=projection)
        for r in records:
            # 检查 EXPLOIT_ID 是否包含 exploit_type 的信息
            if exploit_type and exploit_type not in r.get(self.EXPLOIT_ID, ''):
                continue

            yield r


    def find_by_code(self, *codes, projection=None):
        if not projection:
            projection = {
                self.EXPLOIT_ID: 1, self.FILE: 1, self.DESCRIPTION: 1, self.DATE_PUBLISHED: 1,
                self.AUTHOR: 1, self.TYPE: 1, self.PLATFORM: 1, self.PORT: 1, self.DATE_ADDED: 1,
                self.DATE_UPDATED: 1, self.VERIFIED: 1, self.CODES: 1, self.TAGS: 1, self.ALIASES: 1,
                self.SCREENSHOT_URL: 1, self.APPLICATION_URL: 1, self.SOURCE_URL: 1, 
            }
        query = {self.CODES: {"$in": codes}}
        records = self.coll.find(query, projection=projection)
        for r in records:
            yield r

    @staticmethod
    def process_codes(codes):
        """将分号分隔的字符串转换为列表"""
        if codes:
            return codes.split(';')
        return []
    
    @staticmethod
    def process_tags(tags):
        """将逗号分隔的字符串转换为列表"""
        if tags:
            return tags.split(',')
        return []
    
    @staticmethod
    def process_date(date_str):
        """将日期字符串转换为 datetime 对象"""
        if date_str:
            return datetime.strptime(date_str, "%Y-%m-%d")
        return None


if __name__ == '__main__':
    from pprint import pprint
    from datetime import datetime
    import pathlib
    from database.core.mongo_db import mongo_client

    with mongo_client() as client:
        tableCves = TableVulnCves(client)
        tableExp = TableVulnExploits(client)

        if True:
            v0 = "'1.2-3b4-pr02-p03-202406-abcdef12"

            v1 = "'1.2-3b5-pr02-p04-202406-abcdef12"
            r = TableVulnCves.compare_version(v0, v1)
            print(f"{v0} ** {r} ** {v1}\n")

            v1 = "'1.2-3b4-pr01-p04-202406-abcdef12"
            r = TableVulnCves.compare_version(v0, v1)
            print(f"{v0} ** {r} ** {v1}\n")

            v1 = "'1.2-3b4-pr03-p04-202406-abcdef12"
            r = TableVulnCves.compare_version(v0, v1)
            print(f"{v0} ** {r} ** {v1}\n")

            v1 = "'1.2-3b4-0"
            r = TableVulnCves.compare_version(v0, v1)
            print(f"{v0} ** {r} ** {v1}\n")

            v1 = "'1.2-3b4"
            r = TableVulnCves.compare_version(v0, v1)
            print(f"{v0} ** {r} ** {v1}\n")

            v1 = "'1.2-3b4-pr02-p03-2025-abcdef12"
            r = TableVulnCves.compare_version(v0, v1)
            print(f"{v0} ** {r} ** {v1}\n")

        if True:
            
            # cves = tableCves.find_product("linux_kernel", vendor='linux_foundation')
            # cves = tableCves.find_product("mbedtls", vendor='arm')

            product = "bluez"
            version = "4.97"
            vendor = "BlueZ"
            cves = tableCves.find_product(product, vendor=vendor) 
            for cve in cves:
                cpes = cve.get('cpes', [])
                cpe = tableCves.search_cpe(cve, product, version)
                if cpe:
                    print("cve_id: {}, cpe: {}".format(cve.get('cve_id'), cpe))     

            product = "python"
            version = "2.7.2"
            vendor = "boost"
            cves = tableCves.find_product(product, vendor=vendor)           
            for cve in cves:
                cpes = cve.get('cpes', [])
                cpe = tableCves.search_cpe(cve, product, version)
                if cpe:
                    print("cve_id: {}, cpe: {}".format(cve.get('cve_id'), cpe))          
        
        if False:
            cursor = tableExp.find_exploit("exploit-db-44616")
            print(list(cursor))

            cursor = tableExp.find_by_year(exploit_type="exploit-db", year=2018)
            for r in cursor:
                print(r)

            
    








