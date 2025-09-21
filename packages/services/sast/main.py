import os
import time
import traceback
import pathlib
import shutil
import pickle

from exlib.settings import osenv
from ..core.message import AstMessage
from amq.message import AmqMessage
from amq.general import PollingTimeoutHook,AmqQueue,AmqGeneral

from database.master_database import DatabaseMaster,TableProjects,ScanTypes,ScanOptions,ScanModes

from database.core.mongo_db import mongo_client
import database.cache_database as cache_db
import database.master_database as master_db

from .process_message import UIRequestHandle, JobResponseHandle

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)        


class SastEngine(AmqGeneral):
    def __init__(self, *args, **kwargs):
        super().__init__('sast', *args, **kwargs)

        self.create_queues()
        
        self.uiEventProcesser = UIRequestHandle(self)
        self.jobEventProcesser = JobResponseHandle(self) 
        
    def create_queues(self):
        self.in_queues = []        
        for queue in self.config.sastQueues:            
            self.in_queues.append(self.create_queue(queue['queue'], queue['routekey']))
        
        self.out_queues = {}
        for engine_name in ('bast', 'iast', 'mast'):
            self.out_queues[engine_name] = []
            queues = self.config.queues.get(engine_name)
            for queue in queues:
                self.out_queues[engine_name].append(self.create_queue(queue['queue'], queue['routekey']))
 
        log.info(f"Sast {self.name}, vhost: {self.config.vhost}, exchange: {self.config.exchange} is ready.")
        log.info(f"Sast Queues: {self.in_queues}")

        for engine_name, queues in self.out_queues.items():
            log.info(f"{engine_name} Queues: {queues}")

    def in_queue(self, priority=AmqQueue.M_PRI_Q):
        priority = min(len(self.in_queues)-1, max(0, priority))
        return self.in_queues[priority]

    def get_queue(self, engine_name, priority=AmqQueue.M_PRI_Q):
        queues = self.out_queues.get(engine_name, None)
        if queues:
            priority = min(len(queues)-1, max(0, priority))
            return queues[priority]
        return None
        
    def is_ready(self):
        return True

    def on_message(self, queue, message):  
        if os.environ.get('VERBOSE_TRACE', 'no') == 'yes':
            log.debug(f"on_message: {message}")
              
        sastmsg = AstMessage.from_payload(message['payload'])        

        log.debug(f"Received {sastmsg.msgid} from {queue}")
        
        if sastmsg.is_job_message():
            self.on_job_message(queue, sastmsg)
            return

        if sastmsg.is_ui_message():
            self.on_ui_message(queue, sastmsg)
            return

        log.warning(f"unknown message: {sastmsg.msgid}")        

    def on_ui_message(self, queue, sastmsg):
        
        errmsg = self.__validate__()
        if errmsg:
            log.warning(f"Ignored {sastmsg.msgid} due to {errmsg}")
            return None

        return self.uiEventProcesser.process_message(queue, sastmsg)

    def on_job_message(self, queue, sastmsg):        
        return self.jobEventProcesser.process_message(queue, sastmsg)


if __name__ == "__main__":
    import sys

    engine = SastEngine()

    if '-c' in sys.argv[1:] or '--cleanup' in sys.argv[1:]:
        engine.cleanup_queues()
        engine.om.flushall()

    engine.kickoff()
