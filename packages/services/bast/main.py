import os
import time
import pathlib
import copy

from exlib.concurrent.pipeline_manager import WorkerContext, PipelineManager
from services.core.slaver_engine import SlaverEngine

from amq.config import AmqConfig

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class BastPipelineManager(PipelineManager):    
    class Context(WorkerContext):
        def __init__(self, sastmsg):
            super().__init__(sastmsg)
            
    def __init__(self, engine, max_workers):        
        super().__init__(engine, max_workers=max_workers)
    

class BastEngine(SlaverEngine):
    def __init__(self):
        super().__init__('bast', BastPipelineManager)
            

if __name__=="__main__":
    import sys
    engine = BastEngine()

    if '-c' in sys.argv[1:] or '--cleanup' in sys.argv[1:]:
        engine.cleanup_queues()

    engine.kickoff()