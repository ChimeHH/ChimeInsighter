import hashlib
import psutil
import traceback
import re
import bson
import json

from database.core.config import MongoConfig
from pymongo.errors import BulkWriteError, DocumentTooLarge, OperationFailure # 批量写错误； 单个记录超16MB； 总记录超16MB


from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class MissingDatabaseName(Exception):
    pass

class MissingCollectionName(Exception):
    pass


from pymongo.results import BulkWriteResult
from typing import Dict, Any

class CombinedBulkResult:
    """可合并的批量操作结果类，支持 + 运算符"""
    
    def __init__(self, result: BulkWriteResult = None):
        """
        初始化合并结果
        :param result: 可选的初始 BulkWriteResult 对象
        """
        self.inserted_count = 0
        self.matched_count = 0
        self.modified_count = 0
        self.deleted_count = 0
        self.upserted_count = 0
        self.upserted_ids = {}
        
        if result is not None:
            self._add_result(result)
    
    def _add_result(self, result: BulkWriteResult):
        """添加单个 BulkWriteResult"""
        self.inserted_count += result.inserted_count
        self.matched_count += result.matched_count
        self.modified_count += result.modified_count
        self.deleted_count += getattr(result, 'deleted_count', 0)
        self.upserted_count += result.upserted_count
        self.upserted_ids.update(result.upserted_ids)
    
    def __add__(self, other):
        """
        重载 + 运算符
        :param other: 可以是 BulkWriteResult 或 CombinedBulkResult
        :return: 新的 CombinedBulkResult 实例
        """
        new_result = CombinedBulkResult()
        
        # 复制当前对象的值
        new_result.inserted_count = self.inserted_count
        new_result.matched_count = self.matched_count
        new_result.modified_count = self.modified_count
        new_result.deleted_count = self.deleted_count
        new_result.upserted_count = self.upserted_count
        new_result.upserted_ids = self.upserted_ids.copy()
        
        # 添加另一个对象的值
        if isinstance(other, BulkWriteResult):
            new_result._add_result(other)
        elif isinstance(other, CombinedBulkResult):
            new_result.inserted_count += other.inserted_count
            new_result.matched_count += other.matched_count
            new_result.modified_count += other.modified_count
            new_result.deleted_count += other.deleted_count
            new_result.upserted_count += other.upserted_count
            new_result.upserted_ids.update(other.upserted_ids)
        else:
            raise TypeError(f"不支持的类型: {type(other)}")
        
        return new_result
    
    def __iadd__(self, other):
        """重载 += 运算符"""
        if isinstance(other, BulkWriteResult):
            self._add_result(other)
        elif isinstance(other, CombinedBulkResult):
            self.inserted_count += other.inserted_count
            self.matched_count += other.matched_count
            self.modified_count += other.modified_count
            self.deleted_count += other.deleted_count
            self.upserted_count += other.upserted_count
            self.upserted_ids.update(other.upserted_ids)
        else:
            raise TypeError(f"不支持的类型: {type(other)}")
        return self
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'inserted_count': self.inserted_count,
            'matched_count': self.matched_count,
            'modified_count': self.modified_count,
            'deleted_count': self.deleted_count,
            'upserted_count': self.upserted_count,
            'upserted_ids': self.upserted_ids
        }
    
    def __str__(self):
        return (
            f"CombinedBulkResult("
            f"inserted={self.inserted_count}, "
            f"matched={self.matched_count}, "
            f"modified={self.modified_count}, "
            f"deleted={self.deleted_count}, "
            f"upserted={self.upserted_count})"
        )

class DatabaseClass:
    _ID = '_id'

    # 注意，这里须空字典。如果是None，则查询返回除_id之外的所有字段
    PROJECTION_FULL = {}
    PROJECTION_RUN = {}
    PROJECTION_VERBOSE = {}

    
    
    def __init__(self, client, collection, database):
        self._client = client
        self._database = database
        self._collection = collection        
        self._requests = []
        self._last_check_count = 0

    @staticmethod
    def config(group=None):
        return MongoConfig(group)        

    @property
    def database(self):
        return self._database

    @property
    def collection(self):
        return self._collection

    @property
    def db(self):
        return self._client[self.database]

    @property
    def coll(self):
        return self._client[self.database][self.collection]

    def create_table(self):
        pass

    def smooth_upgrade(self):
        pass

    @staticmethod
    def reform_string(s, codec='utf-8'):
        return s.encode(codec, 'ignore').decode(codec, 'ignore') if s else s

    def commit(self, mem_threshold=0, cache_threshold=50000, n_chunks=10000, ordered=True):
        ''' mem_threshold: 0 commit now; <0 not commit; mem_threshold<100, commit unless mem-percent reached the threshold'''
        if not self._requests:
            return

        if len(self._requests) < cache_threshold:
            if mem_threshold > 0:
                count = len(self._requests)
                if count - self._last_check_count < n_chunks/2:
                    return
                self._last_check_count = count

                mem = psutil.virtual_memory()
                if mem.percent < mem_threshold:
                    return

        result = CombinedBulkResult()

        try:
            self._last_check_count = 0
            n = max(5000, min(n_chunks, 20000))

            for i, chunks in self.divide_chunks(self._requests, n=n):
                try:
                    result += self.coll.bulk_write(chunks, ordered=ordered)

                # 注意，尽量去写入，当记录太大，则拆分
                except (DocumentTooLarge, OperationFailure) as e:
                    if isinstance(e, OperationFailure) and "document too large" not in str(e):
                        raise

                    len_chunks = len(chunks)
                    n = max(500, min(1000, int(len_chunks/10)))
                    log.warning(f"cancelled committing {len_chunks} records due to {e.code}, trying {n}")


                    for j, chunks2 in self.divide_chunks(chunks, n=n):                            
                        try:
                            result += self.coll.bulk_write(chunks2, ordered=ordered)

                        except (DocumentTooLarge, OperationFailure) as e:
                            if isinstance(e, OperationFailure) and "document too large" not in str(e):
                                raise
                                
                            len_chunks2 = len(chunks2)
                            n = max(5, min(50, int(len_chunks2/10)))
                            log.warning(f"cancelled committing {len_chunks2} records, trying {n}")

                            for k, chunks3 in self.divide_chunks(chunks2, n=n):
                                try:
                                    result += self.coll.bulk_write(chunks3, ordered=ordered)

                                except (DocumentTooLarge, OperationFailure) as e:                                    
                                    if isinstance(e, OperationFailure) and "document too large" not in str(e):
                                        raise
                                        
                                    log.exception(f"cancelled committing, ignored {e}")
                                    continue                                    

            return result

        finally:
            self._requests = []


    @classmethod
    def divide_chunks(cls, l, n=5000):
        for i in range(0, len(l), n):  
            yield i, l[i:i + n]

    def estimated_document_count(self):
        return self.coll.estimated_document_count()

    @staticmethod
    def to_uid(*args, sep=','):
        return sep.join([str(arg) for arg in args])

    @staticmethod
    def from_uid(uid, sep=',', maxsplit=-1):
        return uid.split(sep=sep, maxsplit=maxsplit)

    def find(self, query, projection=None):
        return self.coll.find(query, projection=projection)

    def append(self, action):
        self._requests.append(action)

    @property
    def request_count(self):
        return len(self._requests)

    def drop(self):
        self.coll.drop()

    @staticmethod
    def compile_mongo_regex(s):
        try:
            # note, regex string in json should looks like: "^mbed[\\s_\\-]*tls$"; always have \\ instead of one \
            pattern = re.compile(s)
            regex = bson.regex.Regex.from_native(pattern)
            regex.flags ^= re.UNICODE|re.IGNORECASE
            
            return regex
        except:
            log.exception("failed compile regex {}".format(s))
            return None

    @staticmethod
    def to_python_regex(regex):
        return re.compile(regex.pattern, regex.flags)   

    @classmethod
    def format_obj(cls, obj):
        if isinstance(obj, (list, set, tuple)):
            return [ cls.format_obj(r) for r in obj ]
        elif isinstance(obj, dict):
            new_obj = {}
            for k, v in obj.items():
                k = str(k) if k != "" else "null"
                new_obj[k] = cls.format_obj(v)
            return new_obj
        else:
            return obj


