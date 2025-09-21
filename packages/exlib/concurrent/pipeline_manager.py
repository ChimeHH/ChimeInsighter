import os
import signal  
import sys
import copy
import uuid
import psutil
import importlib
import traceback
import multiprocessing

from datetime import datetime

from exlib.settings import osenv
from services.core.message import AstResponse
from amq.general import AmqGeneral

from database.om_database import OmDatabase

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

from .context import WorkerError, WorkerResult, WorkerContext

class PipelineWorker:
    def __init__(self, result_q, worker_id, context):
        self.worker_id = worker_id
        self.context = context
        self.create_time = datetime.utcnow()
        self.update_time = datetime.utcnow()
        self._process = multiprocessing.Process(target=self.entry, args=(result_q, self.worker_id, context,))          
        
    @classmethod
    def entry(cls, result_q, worker_id, context):        
        log.setProcessName(worker_id)
        
        om = OmDatabase(context.name, context.whoami)
        process_id =  os.getpid()

        version_id = context.version_id
        checksum = context.checksum
        pipeline_id = context.pipeline_id
        filepath = context.filepath
        start_time = context.start_time
        
        om.update_job(version_id, checksum, pipeline_id, OmDatabase.Status.initiated, filepath=filepath, worker_id=worker_id, process_id=process_id)
        
        log.debug(f"start job {version_id}, {checksum}, {pipeline_id}, {filepath}, {process_id}")

        for k, v in enumerate(context.pipeline_rules):            
            module = v.get('module')
            command = v.get('command')

            args = [ osenv.eval_value(n) for n in v.get('args', []) ]
            kwargs = { m: osenv.eval_value(n) for m, n in v.get('kwargs', {}).items() }

            # check if the version was cancelled already. we here check in the loop, to cancel operations asap.
            if not om.is_active_version(version_id, start_time):
                log.info(f"ignored cancelled version {version_id}, {pipeline_id}, {filepath}: {module}, command: {command}, {start_time}")
                om.update_job(version_id, checksum, context.pipeline_id, OmDatabase.Status.cancelled, command=f"{module}.{command}", filepath=filepath, 
                                    worker_id=worker_id, process_id=process_id, reason=f"cancelled: version was cancelled")                
                return 0

            # check the blacklist, and return if matched anyone. we here check in the loop, to cancel operations asap.
            if om.in_version_filter(version_id, pipeline_id, str(filepath)):
                log.info(f"ignored filtered version {version_id}, {pipeline_id}, {filepath}: {module}, command: {command}, args: {args}, kwargs: {kwargs}")
                om.update_job(version_id, checksum, pipeline_id, OmDatabase.Status.cancelled, command=f"{module}.{command}", filepath=filepath, 
                                    worker_id=worker_id, process_id=process_id, reason=f"blacklist: the path was ignored")
                return 0

            om.update_job(version_id, checksum, pipeline_id, OmDatabase.Status.running, 
                                    command=f"{module}.{command}({args}, {kwargs})", filepath=filepath, worker_id=worker_id, process_id=process_id)

            if not v.get('enable', True):
                continue
            
            try:
                log.debug(f"loading module: {module}, command: {command}, args: {args}, kwargs: {kwargs}")

                libmodule = importlib.import_module(module)
                fnCall = getattr(libmodule, command)
            
                result = fnCall(context, *args, **kwargs)
                if result in (0, None):                    
                    continue

                if isinstance(result, WorkerResult):
                    result_q.put(result)
                    continue

                else:
                    if isinstance(result, WorkerError):
                        result_q.put(result)
                    else:
                        result_q.put(WorkerError(-1, f"{module}.{command}({args}, {kwargs}) failed to handle {context}, return: {result}"))                    
                    
                    om.update_job(version_id, checksum, pipeline_id, OmDatabase.Status.failed, command=f"{module}.{command}", filepath=filepath, 
                                worker_id=worker_id, process_id=process_id, reason=f"invalid return: {result}")
                    log.error(f"failed to handle result, {version_id}, {checksum}, {pipeline_id}, {filepath}, {process_id}, {module}.{command}, return: {result}")
                    return -1

            except Exception as e:
                exc_info = log.format_exc()
                result_q.put(WorkerError(-1, f"{module}.{command}({args}, {kwargs}), exception: {exc_info}"))

                om.update_job(version_id, checksum, pipeline_id, OmDatabase.Status.unknown,command=f"{module}.{command}", filepath=filepath, 
                                worker_id=worker_id, process_id=process_id, reason=f"exception: {exc_info}")
                log.error(f"unknown exception job {version_id}, {checksum}, {pipeline_id}, {filepath}, {process_id}, {module}.{command}: {exc_info}")                
                return -2
        
        log.debug(f"end job {version_id}, {checksum}, {pipeline_id}, {filepath}, {process_id}")
        om.update_job(version_id, checksum, pipeline_id, OmDatabase.Status.completed, filepath=filepath, worker_id=worker_id, process_id=process_id)

        return 0

    @classmethod
    def update_running(cls, worker_id, context):
        # update om status here, called by process.entry
        pass

    def update_completed(self):
        # update om completed status, called by workerManager, shall check the exitcode here
        pass

    def start(self, daemon=True):        
        self._process.daemon = daemon
        self._process.start()

    def is_alive(self):
        if self._process:
            return self._process.is_alive()
        return False
    
    @property
    def process_id(self):
        if self._process:
            return self._process.pid
        return None

    @property
    def memory_total(self):
        pid = self.process_id
        if pid:
            m = psutil.Process(pid).memory_info()
            return m.rss + m.vms

        return 0

    @property
    def exitcode(self):        
        if self._process:
            return self._process.exitcode
        return None

    def terminate(self):
        # 常规情况下，先发terminate， 然后close。如果异常，则强制关闭， 发kill -9
        try:
            if self._process.is_alive():
                self._process.terminate()
        except:
            log.exception(f"failed to terminate {self}")
            pid = self.process_id
            if pid:
                os.kill(pid, signal.SIGKILL)

    def close(self):
        # 常规情况下，先发terminate， 然后close。如果异常，则强制关闭， 发kill -9
        try:
            if self.is_alive():
                self.terminate()

            self._process.join(120)
            self._process.close()
        except:
            log.exception(f"failed to close {self}")            
            pid = self.process_id
            if pid:
                os.kill(pid, signal.SIGKILL)

        self._process = None
        
    def __str__(self):
        return f"Worker(id={self.worker_id}, checksum={self.context.checksum}, pipeline_id={self.context.pipeline_id}, pid={self.process_id})"

    def __repr__(self):
        return self.__str__()


class PipelineManager:
    MAX_CPU_CORE_PERCENT = 0.8
    REPORT_WORKER_STATUS_INTERVAL = 300

    def __init__(self, engine, max_workers=0):
        self.engine = engine

        self.max_workers = int(max(3, os.cpu_count()*self.MAX_CPU_CORE_PERCENT)) if max_workers <= 0 else int(max_workers) 

        self._id_seed = 0
        self.worker_list = {}

        self.result_q = multiprocessing.Queue()
        

    def rebuild(self):        
        log.warning("now recreating process pool. This might loss partical scan results")

        try:
            executor = self.executor
            worker_list = self.worker_list
            self.worker_list = {}

            for _, worker in self.worker_list:
                try:
                    worker.close()
                except:
                    log.exception(f"failed to cancel worker {worker}")
        except:
            log.exception(f"failed to recreate process pool")
            sys.exit(1)


    def add_worker(self, context):
        try:            
            self._id_seed += 1
            worker_id = f"{self.engine.whoami}.{self._id_seed}"

            log.debug(f"## adding worker: {worker_id} / {context.pipeline_id}")

            context.name = self.engine.name
            context.whoami = self.engine.whoami
            
            worker = PipelineWorker(self.result_q, worker_id, context)
            self.worker_list[worker_id] = worker

            log.debug(f"## added worker {worker_id} / {context.pipeline_id}")
            worker.start(daemon=True)
            
            return worker
        except:            
            log.exception(f"## failed to add worker")             
            self.engine.om.update_job(context.version_id, context.checksum, context.pipeline_id, self.engine.om.Status.unknown, reason=f"failed to add worker: {log.format_exc()}")
            return None

    def remove_worker(self, worker_id, reason=""):
        worker = self.worker_list.pop(worker_id, None)
        if worker:
            log.debug(f"## closing worker {worker_id} / {worker.context.pipeline_id}")
            worker.close()

    def pool_workers(self):
        while not self.result_q.empty():  
            message = self.result_q.get() 
            
            if isinstance(message, WorkerError):  
                log.error(f"Worker encountered an error: {message}")  
                continue

            sastmsg = AstResponse(self.engine.whoami, message.context.response_id, version_id=message.context.version_id, checksum=message.context.checksum, report=message.result)            
            self.engine.publish(self.engine.queue_obj(*message.context.reponse_queue), sastmsg)

        now = datetime.utcnow()
        for worker_id, worker in list(self.worker_list.items()):
            context = worker.context

            if worker.is_alive():                
                if (now - worker.update_time).seconds > 300:
                    self.engine.om.update_job(context.version_id, context.checksum, context.pipeline_id, self.engine.om.Status.running,
                              filepath=context.filepath, worker_id=worker.worker_id, process_id=worker.process_id)
                    worker.update_time = now
            else:
                self.remove_worker(worker_id)

        return self.max_workers - len(self.worker_list)

    def audit_workers(self):        
        overload_level = self.engine.get_overload_level()

        count = 0
        now = datetime.utcnow()
        
        for _, worker in self.worker_list.items():
            context = worker.context

            if worker.is_alive():                
                if (now - worker.create_time).total_seconds() > context.max_timeout > 0:
                    count += 1
                    worker.terminate()
                    reason = f"terminating worker {worker}: exceed max timeout: {context.max_timeout}"
                    log.warning(reason)
                    self.engine.om.update_job(context.version_id, context.checksum, context.pipeline_id, self.engine.om.Status.cancelled, 
                                        filepath=context.filepath, worker_id=worker.worker_id, process_id=worker.process_id, reason=reason)

                elif worker.memory_total > context.max_memory > 0 and overload_level in (self.engine.OverloadLevel.HIGH, self.engine.OverloadLevel.MEDIUM, ):
                    count += 1
                    worker.terminate()
                    reason = f"terminating worker {worker}: exceed max memory: {context.max_memory}"
                    log.warning(reason)
                    self.engine.om.update_job(context.version_id, context.checksum, context.pipeline_id, self.engine.om.Status.cancelled, 
                                        filepath=context.filepath, worker_id=worker.worker_id, process_id=worker.process_id, reason=reason)

        if count > 0:
            return count
        
        # 高度过载（尚未找到高占用，或是超时任务, 挑内存最大占用干掉
        if overload_level in (self.engine.OverloadLevel.HIGH, ):            
            temp_memory = 0
            temp_worker = None
            
            for _, worker in self.worker_list.items():
                if worker.is_alive():
                    if worker.memory_total > temp_memory:
                        temp_memory = worker.memory_total
                        temp_worker = worker

            if temp_worker:
                temp_worker.terminate()
                reason = f"terminating worker {temp_worker}, memory heavy overload protection: {temp_memory}"
                log.warning(reason)
                self.engine.om.update_job(context.version_id, context.checksum, context.pipeline_id, self.engine.om.Status.cancelled,
                                    filepath=context.filepath, worker_id=worker.worker_id, process_id=worker.process_id, reason=reason)
                return 1

        return 0























