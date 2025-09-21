import os
import pathlib

from exlib.settings import osenv
from exlib.utils.abstract import Singleton


class MongoCredential:
    def __init__(self, cred=None):
        if not cred:
            cred = {}

        self.host = cred.get('host', 'mongo')
        self.port = cred.get('port', 27017)
        self.username = cred.get('username', 'chime')
        self.password = cred.get('password', '09b909e7cd6a8cd8327368a9df348a82')
        self.auth_database = cred.get('auth_database', 'admin')
        self.auth_mechanism = cred.get('auth_mechanism', 'SCRAM-SHA-1')
        self.enc = cred.get('enc', False)

    def __str__(self):
        return str(vars(self))

class MongoConfig(metaclass=Singleton):
    def __init__(self, group=None):
        if not group:
            group = "mongo"

        self.config = osenv.database_config(group)

    @property
    def mongo(self):
        return self.config.get('mongo', {})

    @property
    def _mapping(self):
        return self.mongo.get('_mapping', {})

    @property
    def cache(self):
        return self._mapping.get('cache', 'cache')

    @property
    def compliance(self):
        return self._mapping.get('compliance', 'compliance')
    
    @property
    def findings(self):
        return self._mapping.get('findings', 'findings')
    
    @property
    def master(self):
        return self._mapping.get('master', 'master')
    
    @property
    def sbom(self):
        return self._mapping.get('sbom', 'sbom2')
    
    @property
    def vuln(self):
        return self._mapping.get('vuln', 'vuln')


    def credential(self, instance=None):
        if not instance:
            instance = os.getenv("MONGO_INSTANCE", "default")

        return MongoCredential(self.config.get(instance, {}))


class RedisCredential:
    def __init__(self, cred=None):
        if not cred:
            cred = {}

        self.host = cred.get('host', 'redis')
        self.port = cred.get('port', 6379)
        self.password = cred.get('password', '09b909e7cd6a8cd8327368a9df348a82')
        self.db = cred.get('db', 0)
        self.disable = cred.get('disable', False)

    def __str__(self):
        return str(vars(self))

class RedisConfig(metaclass=Singleton):
    def __init__(self, group=None):
        if not group:
            group = "redis"

        self.config = osenv.database_config(group)

    @property
    def redis(self):
        return self.config.get('redis', {})

    def credential(self, instance=None):
        if not instance:
            instance = os.getenv("REDIS_INSTANCE", "default")

        return RedisCredential(self.config.get(instance, {}))


if __name__=='__main__':
    config = MongoConfig()

    print(f"cache: {config.cache}")
    print(f"compliance: {config.compliance}")
    print(f"findings: {config.findings}")
    print(f"master: {config.master}")
    print(f"sbom: {config.sbom}")
    print(f"vuln: {config.vuln}")

    print(f"credential: {config.credential()}")

    print("#"*128)
    config = RedisConfig()
    print(f"credential: {config.credential()}")
