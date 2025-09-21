import re
import time
import psutil
import traceback
import pathlib
import fnmatch  

from pprint import pprint
from datetime import datetime,timedelta
from redis import StrictRedis, ConnectionPool
from .core.config import RedisConfig

from .core.errors import *

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class OmDatabase:
    class Status:
        queued = 'QUEUED'
        initiated = "INITIATED"
        running = 'RUNNING'
        completed = 'COMPLETED'
        failed = 'FAILED'
        cancelled = 'CANCELLED'
        unknown = 'UNKNOWN'

    VERSION_TIMEOUT = 3600*24*10
    ENGINE_TIMEOUT = 1800 
    JOB_TIMEOUT = 3600*24*10

    def __init__(self, name, whoami, group=None, instance=None):
        self.name = name
        self.whoami = whoami
        self.client = None    

        config = RedisConfig(group)
        credential = config.credential(instance)

        if credential.disable:
            log.warning(f"redis is disabled and ignored")
            return

        try_times = 0
        while True:
            try:
                try_times += 1

                pool = ConnectionPool(host=credential.host, port=credential.port, db=credential.db, password=credential.password, encoding="utf-8", decode_responses=True)
                self.client = StrictRedis(connection_pool=pool)
                break
            except:
                if try_times < 30:
                    log.warning(f"failed to connect to redis {try_times} times, will retry in 1 second")
                    time.sleep(1)
                    continue

                raise
        
        log.debug(f"client: {self.client}")
        self.update_engine()


    def flushall(self):
        self.client.flushall()

    @staticmethod
    def _vid(version_id):
        return f"//VERSION/{version_id}"

    @staticmethod
    def _jid(version_id, checksum, pipeline_id):
        return f"//JOB/{version_id}/{checksum}/{pipeline_id}"

    def update_job(self, version_id, checksum, pipeline_id, status, command="", filepath="", worker_id="", process_id="", reason=""):
        # log.debug(f"update job: {version_id}/{checksum}, pipeline: {pipeline_id}, status: {status}, worker_id: {worker_id}")
        if not self.client:
            return
        
        try:
            checksum = str(checksum)
            status = str(status) if status else self.Status.queued
            filepath = str(filepath)
            worker_id = str(worker_id)
            process_id = str(process_id)
            reason = str(reason)

            # init version progress progress table
            vid = self._vid(version_id)
            jid = self._jid(version_id, checksum, pipeline_id)            

            time_now = datetime.utcnow().isoformat()
            version = self.client.hgetall(vid)
            if not version:
                self.client.hset(vid, mapping=dict(start_time="", blacklist="", **self.vesion_idle_progress()))
                self.client.expire(vid, self.VERSION_TIMEOUT)

            # add job to version progress table, we collect peg, except running, because it pegs per each command and timely
            if status != self.Status.running:
                self.client.hincrby(vid, status, 1)
                self.client.hset(vid, mapping=dict(update_time=time_now))
                self.client.expire(vid, self.VERSION_TIMEOUT)

            if status==self.Status.queued:
                # add to version scan jobs table, without expire setting
                self.client.hset(jid, mapping=dict(version_id=version_id, checksum=checksum, pipeline_id=pipeline_id, filepath=filepath, 
                                status=status, create_time=time_now))
                self.client.expire(jid, self.VERSION_TIMEOUT)

            elif status==self.Status.initiated:
                self.client.hset(jid, mapping=dict(version_id=version_id, checksum=checksum, pipeline_id=pipeline_id, filepath=filepath, 
                                status=status, start_time=time_now))
                self.client.expire(jid, self.JOB_TIMEOUT)
            else:
                if status in [self.Status.completed, ]:
                    self.client.delete(jid)

                elif status in [self.Status.cancelled, self.Status.failed, self.Status.unknown]:
                    self.client.hset(jid, mapping=dict(version_id=version_id, checksum=checksum, pipeline_id=pipeline_id, filepath=filepath, command=command,
                                        status=status, dworker_id=worker_id, process_id=process_id, reason=reason, update_time=time_now))
                    self.client.expire(jid, self.VERSION_TIMEOUT) # keep while version is alive, for debug purpose

                else:
                    mapping=dict(version_id=version_id, checksum=checksum, pipeline_id=pipeline_id, filepath=filepath, 
                                    status=status, worker_id=worker_id, process_id=process_id, update_time=time_now)
                    if command:
                        mapping.update(command=command)

                    self.client.hset(jid, mapping=mapping)
                    self.client.expire(jid, self.JOB_TIMEOUT)

        except:
            log.exception(f"failed to update {version_id}/{checksum}/{worker_id}/{pipeline_id} status: {status}")

    def get_job(self, jid):
        if not self.client:
            return None

        return self.client.hgetall(jid)

    @property
    def eid(self):
        return f'//ENGINE/{self.whoami}' 

    def update_engine(self):
        if not self.client:
            return None

        virtual_memory = psutil.virtual_memory()
        memory_total = virtual_memory.total
        memory_used = virtual_memory.percent

        swap_memory = psutil.swap_memory()        
        swap_total = swap_memory.total
        swap_used = swap_memory.percent

        cpu_total = psutil.cpu_count()
        cpu_used = psutil.cpu_percent()

        disk_usage = psutil.disk_usage('/data')
        disk_total = disk_usage.total
        disk_used = disk_usage.percent

        version = ""
        filepath = pathlib.Path("/data/version/ast.txt")
        try:
            if filepath.is_file():
                with filepath.open('r') as f:
                    version = f.readline().strip()
        except:
            log.exception(f"failed to read version from {filepath}")
            
        self.client.hset(self.eid, mapping=dict(name=self.name, whoami=self.whoami, version=version, memory_total=memory_total, memory_used=memory_used, swap_total=swap_total, swap_used=swap_used, 
                        cpu_total=cpu_total, cpu_used=cpu_used, disk_total=disk_total, disk_used=disk_used, update_time=datetime.utcnow().isoformat()))
        self.client.expire(self.eid, self.ENGINE_TIMEOUT)

    def get_engine_status(self):
        if not self.client:
            return None
        return self.client.hgetall(self.eid)

    def init_version_status(self, version_id, start_time): # start_time is from versionTable.start_time 
        if not self.client:
            return None       
        vid = self._vid(version_id)
        self.client.hset(vid, mapping=dict(start_time=start_time, blacklist="", **self.vesion_idle_progress()))
        self.client.expire(vid, self.VERSION_TIMEOUT)

    def get_version_status(self, version_id):
        if not self.client:
            return None
        vid = self._vid(version_id)
        return self.client.hgetall(vid)

    @classmethod
    def vesion_idle_progress(cls):
        return {cls.Status.queued:0, cls.Status.initiated: 0, 
                cls.Status.completed:0, cls.Status.failed:0, cls.Status.unknown:0, cls.Status.cancelled:0,}

    def get_version_progress(self, version_id):
        if not self.client:
            return None

        version = self.client.hgetall(self._vid(version_id))        
        if not version:
            version = {}

        queued = int(version.get(self.Status.queued, 0))
        initiated = int(version.get(self.Status.initiated, 0))
        completed = int(version.get(self.Status.completed, 0))
        failed = int(version.get(self.Status.failed, 0))
        unknown = int(version.get(self.Status.unknown, 0))
        cancelled = int(version.get(self.Status.cancelled, 0))

        done = (completed+failed+unknown+cancelled)
        percent = min(1, done / max(1, max(done, queued)))

        return dict(queued=queued, initiated=initiated, completed=completed, failed=failed, unknown=unknown, cancelled=cancelled, percent=percent)

    def update_version_blacklist(self, version_id, blacklist):
        if not self.client:
            return None

        vid = self._vid(version_id)
        self.client.hset(vid, mapping=dict(blacklist=blacklist))

    def in_version_filter(self, version_id, pipeline_id, filepath):
        if not self.client:
            return None

        vid = self._vid(version_id)
        version = self.client.hgetall(vid)
        if not version:
            log.info(f"version {version_id}/{filepath} filtered: version not found.")
            return True

        blacklist = version.get('blacklist', "").split('|')        
        for rule in blacklist:
            kv = rule.split(':')
            if len(kv) < 2:
                continue

            k = kv[0].strip()
            v = kv[1].strip()

            if v and pipeline_id.startswith(k):            
                if v in filepath or fnmatch.fnmatch(filepath, v):
                    log.info(f"version {version_id}/{filepath} filtered by {rule}")
                    return True

        return False

    def is_active_version(self, version_id, start_time):
        if not self.client:
            return None

        vid = self._vid(version_id)
        version = self.client.hgetall(vid)
        if not version:
            log.info(f"version {version_id} not found.")
            return False

        # version has been killed and restarted
        start_time2 = version.get('start_time', None)
        if not start_time2:
            log.info(f"version {version_id} cancelled already.")
            return False

        if start_time and start_time2 != start_time:
            log.info(f"version {version_id} was cancelled and updated.")
            return False

        return True

    def is_finalize_version(self, version_id):
        if not self.client:
            return None

        jids = self.client.keys(f"//JOB/{version_id}/*")        
        for jid in jids:
            job = self.client.hgetall(jid)
            if job.get('status') in (self.Status.queued, self.Status.initiated, self.Status.running):
                return False

        return True

    def delete_version(self, version_id):      
        if not self.client:
            return None

        vid = self._vid(version_id)
        jids = self.client.keys(f"//JOB/{version_id}/*")
        self.client.delete(vid)
        for jid in jids:
            self.client.delete(jid)

    def delete_versions(self, *version_ids):
        if not self.client:
            return None

        if not version_ids:
            vids = self.client.keys("//VERSION/*")
            jids = self.client.keys(f"//JOB/*")

            for vid in vids:
                self.client.delete(vid)
            for jid in jids:
                self.client.delete(jid)
        else:
            for version_id in version_ids:
                self.delete_version(version_id)

    def flush(self):
        if not self.client:
            return None

        self.client.flushdb()

    def list_engines(self):
        if not self.client:
            return {}

        _ids = self.client.keys("//ENGINE/*")
        
        return {e: self.client.hgetall(e) for e in _ids}
    
    def list_versions(self):
        if not self.client:
            return {}

        _uids = self.client.keys("//VERSION/*")        
        return {uid: self.client.hgetall(uid) for uid in _uids}
    
    def list_jobs(self, version_id=None):
        if not self.client:
            return {}
            
        if version_id:
            jids = self.client.keys(f"//JOB/{version_id}/*")
        else:
            jids = self.client.keys(f"//JOB/*")  
            
        return {jid: self.client.hgetall(jid) for jid in jids}

    def delete_job(self, *jids):
        if not self.client:
            return None
            
        if not jids:
            jids = self.client.keys(f"//JOB/*")

        for jid in jids:
            if jid.startswith("//JOB/"):
                self.client.delete(jid)
                    
        return True

if __name__=="__main__":
    import uuid
    import time
    from pprint import pprint

    om = OmDatabase('bast', 'bast1')
    # only for unit test purpose
    
    om.VERSION_TIMEOUT = 10
    om.ENGINE_TIMEOUT = 10    
    om.JOB_TIMEOUT = 10

    version_id1 = "VID202308091021"
    version_id2 = "VID202308091022"
    version_id3 = "VID202308091023"

    om.delete_versions()
    
    print("listing versions and jobs:")
    print(om.list_versions())
    print(om.list_jobs())

    checksum1 = '11111'
    checksum2 = '22222'
    checksum3 = '33333'
    checksum4 = '44444'
    checksum5 = '55555'

    start_time = datetime.utcnow().isoformat()

    om.init_version_status(version_id1, start_time)
    om.init_version_status(version_id2, start_time)

    # version_id, checksum, pipeline_id, status, filepath=None, worker_id=None, process_id=None
    om.update_job(version_id1, checksum1, "iast.public.1" , om.Status.queued, filepath='a/b/c.so')
    om.update_job(version_id2, checksum2, 'iast.zeroday.1', om.Status.queued, filepath='a/b/c.so')
    om.update_job(version_id2, checksum3, 'iast.zeroday.1', om.Status.queued, filepath='a/b/c.so')
    om.update_job(version_id2, checksum4, 'iast.zeroday.1', om.Status.queued, filepath='a/b/c.so')
    om.update_job(version_id3, checksum1, 'iast.zeroday.1', om.Status.queued, filepath='a/b/c.so')
    om.update_job(version_id3, checksum2, 'iast.zeroday.1', om.Status.queued, filepath='a/b/c.so')
    om.update_job(version_id3, checksum3, 'iast.zeroday.1', om.Status.queued, filepath='a/b/c.so')
    
    print("listing versions progress (version 1~3):")
    print(om.get_version_progress(version_id1))
    print(om.get_version_progress(version_id2))
    print(om.get_version_progress(version_id3))

    om.update_job(version_id1, checksum1, "bast.public.1", om.Status.running,   filepath="/a/b/a1.so", worker_id='bast1.20240123', process_id=100)
    om.update_job(version_id2, checksum2, 'iast.zeroday.1', om.Status.running,   filepath="/c/b/b1.a",  worker_id='iast1.20240124', process_id=200)
    om.update_job(version_id2, checksum3, 'iast.zeroday.2', om.Status.completed, filepath="/a/b/b2.so", worker_id='iast1.20240125', process_id=300)
    om.update_job(version_id2, checksum4, 'iast.zeroday.3', om.Status.completed, filepath="/a/b/b3.exe", worker_id='iast1.20240126', process_id=400)
    om.update_job(version_id3, checksum1, 'iast.zeroday.1', om.Status.failed,    filepath="/x/y/c1.so", worker_id='iast1.20240127', process_id=500)
    om.update_job(version_id3, checksum2, 'iast.zeroday.1', om.Status.cancelled,  filepath="/m/n/c2.elf", worker_id='iast1.20240128', process_id=600)
    om.update_job(version_id3, checksum3, 'iast.zeroday.1', om.Status.unknown,   filepath="/x/n/c3.out", worker_id='iast1.20240129', process_id=700)

    om.update_version_blacklist(version_id1, blacklist="bast.public: *.so | iast.zeroday.1: /x/")
    om.update_version_blacklist(version_id2, blacklist="bast.public: *.so | iast.zeroday.1: /x/")
    print("listing versions progress (version 1~3):")
    print(om.get_version_progress(version_id1))
    print(om.get_version_progress(version_id2))
    print(om.get_version_progress(version_id3))

    print("listing engines:")
    pprint(om.list_engines())

    print("listing versions:")
    pprint(om.list_versions())

    print("listing jobs (1~3):")
    pprint(om.list_jobs(version_id1))
    pprint(om.list_jobs(version_id2))
    pprint(om.list_jobs(version_id3))

    om.delete_version(version_id1)
    print(f'id1 {version_id1} is active: {om.is_active_version(version_id1, start_time)}')
    print(f'id2 {version_id2} is active: {om.is_active_version(version_id2, datetime.utcnow().isoformat())}')

    print(f'id1 {version_id1} is filtered: {om.in_version_filter(version_id1, "bast.public.1", "/a/b/a1.so")}')
    print(f'id2 {version_id2} is filtered: {om.in_version_filter(version_id2, "bast.public.1", "/a/b/b2.so")}')
    print(f'id3 {version_id3} is filtered: {om.in_version_filter(version_id3, "iast.zeroday.1", "/x/n/c3.out")}')

    time.sleep(12)
    print("listing engines:")
    pprint(om.list_engines())

    print("listing versions:")
    pprint(om.list_versions())

    print("listing jobs (1~3):")
    pprint(om.list_jobs(version_id1))
    pprint(om.list_jobs(version_id2))
    pprint(om.list_jobs(version_id3))


    










        
        


    
