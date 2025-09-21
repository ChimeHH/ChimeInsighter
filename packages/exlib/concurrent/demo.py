import time
import uuid
import random
from multiprocessing import  current_process

from exlib.concurrent.pipeline_manager import WorkerContext
def fun_a(logger, context):
    process = current_process()    
    print(f"{process.name} fun_a: {context}")
    time.sleep(random.randint(1,5))
    return None

def fun_b(logger, context):
    process = current_process()    
    print(f"{process.name} fun_b: {context}")
    time.sleep(random.randint(1,5))    
    return None



if __name__=='__main__':
    from concurrent.futures import Executor,ProcessPoolExecutor
    executor = ProcessPoolExecutor(max_workers=2)

    messages = [dict(project_id=str(uuid.uuid1()), version_id=str(uuid.uuid1()), filepath=str(uuid.uuid1())),
                dict(project_id=str(uuid.uuid1()), version_id=str(uuid.uuid1()), filepath=str(uuid.uuid1())),
                dict(project_id=str(uuid.uuid1()), version_id=str(uuid.uuid1()), filepath=str(uuid.uuid1()))
            ]

    for message in messages:
        context = WorkerContext(message)
        executor.submit(fun_a, context)








