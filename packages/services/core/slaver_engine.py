import os
import time
import traceback

from .message import AstMessage
from amq.general import PollingTimeoutHook,AmqQueue,AmqGeneral

from exlib.settings import osenv
from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)   

class SlaverEngine(AmqGeneral):
    def __init__(self, name, mangerClass, *args, **kwargs):
        super().__init__(name, *args, **kwargs)
        
        self.whoami = osenv.engine_id(self.name)
        
        self.max_workers = self.config.max_workers(name, default=osenv.cpu_count()/2)
        self.mangerClass = mangerClass

        self.manager = mangerClass(self, max_workers=self.max_workers)

        self.create_queues()
        
    def create_queues(self):        
        self.in_queues = []
        for queue in self.config.getQueues(self.name):            
            self.in_queues.append(self.create_queue(queue['queue'], queue['routekey']))

        log.info(f"Engine {self.name}, vhost: {self.config.vhost}, exchange: {self.config.exchange} is ready.")        
        log.info(f"In Queues: {self.in_queues}")
    
    def on_message(self, queue, message):
        sastmsg = AstMessage.from_payload(message['payload'])
        
        if os.environ.get('TRACE_MESSAGES', 'no') == 'yes':
            log.info(f"Received sastmsg: {sastmsg}")

        if sastmsg.is_job_message():
            return self.on_job_message(queue, sastmsg)
        
        log.warning(f"unknown msgid: {sastmsg.msgid}")

    def is_ready(self):               
        idle_workers = self.manager.pool_workers()        

        # 处理完报告队列里的消息，及清理完已结束的任务后，再检查是否过载，避免创建新的任务
        if self.get_overload_level():
            return 0

        return idle_workers > 0

    def on_job_message(self, queue, sastmsg):
        if sastmsg.msgid == AstMessage.JOB.scan:
            errmsg = self.__validate__()
            if errmsg:
                log.warning(f"Ignored {sastmsg.msgid} due to {errmsg}")
                return None
                
            self._scan(queue, sastmsg)
        else:
            log.warning("unknowning message id: {}".format(sastmsg.msgid))

    def _scan(self, queue, sastmsg):
        context = self.manager.Context(sastmsg)
        worker = self.manager.add_worker(context)
        if not worker:
            log.warning(f"failed to add worker on {context}")

    # 重载update_status，这样就能检查超时、超限任务，及紧急情况下拣内存大的干掉
    def update_status(self):
        self.om.update_engine()
        self.manager.audit_workers()


if __name__ == "__main__":
    import click

    @click.group()
    def app():
        pass

    @app.command(short_help='create a bast task')    
    def bast():
        sim = SlaverEngine('bast')
        sim.kickoff()

    @app.command(short_help='create a cast task')    
    def cast():
        sim = SlaverEngine('cast')
        sim.kickoff()

    @app.command(short_help='create a identifier task')    
    def identifier():
        sim = SlaverEngine('identifier')
        sim.kickoff()

    app()