import os
import time
import pathlib
import re
import uuid
from datetime import datetime
from pprint import pp
import traceback
from exlib.settings import osenv
from exlib.utils import jsonex
from exlib.utils.abstract import Singleton

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


class AmqConfig(metaclass=Singleton):    
    def __init__(self, config_file=None):
        if config_file:
            filepath = pathlib.Path(config_file)
        else:
            filepath = osenv.amq_config_path()

        self._config = jsonex.load(filepath)
        jsonex.remove_comments(self._config)

    def get(self, name, default):
        return self._config.get(name, default)

    ####################################################
    # rabbit mq
    @property
    def mq(self):
        return self._config.get("mq", {})

    @property
    def host(self):
        return self.mq.get("host", "rabbitmq")

    @property
    def port(self):
        return self.mq.get("port", 15672)

    @property
    def username(self):
        return self.mq.get("username", "digitaltwins")

    @property
    def password(self):
        return self.mq.get("password", "29bd161181234fccd35fcdc5ad5a60db")

    @property
    def vhost(self):
        return self.mq.get("vhost", "digitaltwins.vhost1")

    @property
    def exchange(self):
        return self.mq.get("exchange", "digitaltwins.exchange1")


    ####################################################
    # overload control
    @property
    def overload(self):
        return self._config.get("overload", {})

    @property
    def memory_used_threshold(self):
        return self.overload.get("memory_used_threshold", 90)

    @property
    def swap_used_threshold(self):
        return self.overload.get("swap_used_threshold", 70)

    @property
    def cpu_used_threshold(self):
        return self.overload.get("cpu_used_threshold", 95)

    ####################################################
    # queue names
    @property
    def queues(self):
        return self._config.get("queues", {})

    @property
    def sastQueues(self):
        return self.queues.get("sast")

    @property
    def bastQueues(self):
        return self.queues.get("bast")

    @property
    def mastQueues(self):
        return self.queues.get("mast")    
    
    @property
    def iastQueues(self):
        return self.queues.get("iast")


    def getQueues(self, name):
        return self.queues.get(name, [])
    
    @property
    def zeroday_risks(self):
        return self._config.get("zeroday_risks", {})

    @property
    def sscan_risks(self):
        return self._config.get("sscan_risks", {})

    @property
    def scores_weight(self):
        return self._config.get("scores_weight", {})

    @property
    def engines(self):
        return self._config.get("engines", {})

    def engines_preexec(self, name):
        return self.engines.get('_preexec')
        
    def engines_postexec(self, name):
        return self.engines.get('_postexec')

    def get_engine(self, name, default={}):
        return self.engines.get(name, default)

    @property
    def engine_sast(self):
        return self.get_engine('sast')

    @property
    def engine_bast(self):
        return self.get_engine('bast')

    @property
    def engine_mast(self):
        return self.get_engine('mast')

    @property
    def engine_webui(self):
        return self.get_engine('webui')

    @property
    def engine_iast(self):
        return self.get_engine('iast')

    @classmethod
    def new_project(cls):
        return "PID" + re.sub(r"[T\-:.]", "", datetime.utcnow().isoformat())

    @classmethod
    def new_version(cls):
        return "VID" + re.sub(r"[T\-:.]", "", datetime.utcnow().isoformat())

    ####################################################
    # filesystem
    @property
    def filesystem(self):
        return self._config.get("filesystem", {})

    @property
    def nfs_root(self):
        return pathlib.Path(self.filesystem.get("nfs_root", "/data/nfs-data"))

    @property
    def log_root(self):
        return pathlib.Path(self.filesystem.get("log_root", '/data/Logs'))

    @property
    def temp_root(self):
        return pathlib.Path(self.filesystem.get("temp_root", "/data/tmp"))

    @property
    def reports_root(self):
        return pathlib.Path(self.filesystem.get("reports_root", "/data/.reports"))

    def extract_tempdir(self, prefix='extract.'):
        tempdir = self.temp_root / (prefix + str(uuid.uuid4()))
        tempdir.mkdir(mode=0o777, parents=True, exist_ok=True)
        return tempdir        

    def downloads_tempdir(self, prefix='downloads.'):
        tempdir = self.temp_root / (prefix + str(uuid.uuid4()))
        tempdir.mkdir(mode=0o777, parents=True, exist_ok=True)
        return tempdir 

    def project_path(self, project_id, version_id):
        return  self.nfs_root / project_id

    def version_path(self, project_id, version_id):
        return  self.nfs_root / project_id / version_id / "_"
    
    def max_workers(self, engine_name, default=0):
        if not default:
            default = os.cpu_count()

        return int(max(1, osenv.eval_value(self.get_engine(engine_name).get('_max_workers', default))))
    
    def worker(self, engine_name, worker_name):
        engine = self.get_engine(engine_name)
        return engine.get(worker_name, engine.get('default', {}))

    def threat_severity(self, threat_type, threat_subtype):
        vector = self._config.get("severity", {}).get(threat_type, {})
        return vector.get(threat_subtype, vector.get("default", None))


if __name__ == "__main__":
    from pprint import pp
    config = AmqConfig()
    
    print(config.host, config.port, config.username, config.password)
    print(config.vhost, config.exchange)
    
    pp(config.queues)
    pp(config.sastQueues)
    pp(config.bastQueues)
    pp(config.mastQueues)    
    pp(config.iastQueues)

    print("new_project: {}".format(config.new_project()))    
    print("new_version: {}".format(config.new_version()))
    print("nfs_root: {}".format(config.nfs_root))
    print("log_root: {}".format(config.log_root))
    print("temp_root: {}".format(config.temp_root))
    print("extract_tempdir: {}".format(config.extract_tempdir()))
    print("downloads_tempdir: {}".format(config.downloads_tempdir()))
    
    print("monitor_default: {}".format(config.monitor_default))

    print("version_path: {}".format(config.version_path(config.new_project(), config.new_version())))
    print("bast engine::")
    print("max_workers: {}".format(config.max_workers('bast')))    
    
    print("mast engine::")
    print("max_workers: {}".format(config.max_workers('mast')))
    print("iast engine / zeroday::")
    print("max_workers: {}".format(config.max_workers('iast')))

    print("report")
    print("max files: {}".format(config.max_report_records('xlsx', 'file')))
    print("max infoleak path: {}".format(config.max_report_records('xlsx', 'infoleak', 'path')))
    print("max infoleak domain: {}".format(config.max_report_records('xlsx', 'infoleak', 'domain')))
    print("max infoleak ip: {}".format(config.max_report_records('xlsx', 'infoleak', 'ip')))
    print("max malware: {}".format(config.max_report_records('xlsx', 'malware')))
    print("max public cve: {}".format(config.max_report_records('xlsx', 'public', 'cve')))
