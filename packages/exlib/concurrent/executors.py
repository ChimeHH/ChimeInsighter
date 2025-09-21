import os
import time
import uuid
from contextlib import contextmanager

from itertools import repeat
from multiprocessing import Manager
from concurrent import futures

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

@contextmanager
def new_threads(max_workers=1):
    with futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        yield executor

def start_thread(executor, func, *args, **kwargs):
    f = executor.submit(func, *args, **kwargs)
    # must not call f.result() here, otherwise it's blocking
    return f


def run_threads(func, iterables, timeout=None, chunksize=1, max_workers=1):
    with futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        fs = executor.map(func, iterables, timeout=timeout, chunksize=chunksize)        
        return fs

@contextmanager
def new_processes(max_workers=1):
    with futures.ProcessPoolExecutor(max_workers=max_workers) as executor:
        yield executor

def start_process_ex(executor, func, *args, shared=None, **kwargs):
    f = executor.submit(func, *args, shared=shared, **kwargs)
    # must not call f.result() here, otherwise it's blocking
    return f


def start_process(executor, func, *args, **kwargs):
    f = executor.submit(func, *args, **kwargs)
    # must not call f.result() here, otherwise it's blocking
    return f

def as_completed(fs, timeout=None):
    return futures.as_completed({f: None for f in fs}, timeout=timeout)

class SharedDict:
    def __init__(self, data=dict()):
        manager = Manager()
        self._data = manager.dict(data)        
        self._rlock = manager.RLock()

    def add(self, k, v=None):
        with self._rlock:        
            if k in self._data:
                return False
            self._data[k] = v
            return True

    @property
    def keys(self):
        with self._rlock:        
            return self._data.keys()

    @property
    def data(self):
        with self._rlock: 
            return dict(self._data)

    @property
    def length(self):
        with self._rlock: 
            return len(self._data)


class SharedQueue:
    def __init__(self, *args, **kwargs):
        manager = Manager()
        self._queue = manager.Queue(*args, **kwargs)

    @property
    def queue(self):
        return self._queue

    def put(self, *args, **kwargs):
        return self._queue.put(*args, **kwargs)

    def get(self, *args, **kwargs):
        return self._queue.get(*args, **kwargs)

    def qsize(self):
        return self._queue.qsize()

'''
Below provided 2 examples on Threads and Processes, especially on the difference of performance. 
We concluded:
    1, with low io cost, multiple processes are much better;
    2, with high io cost, there's no significant difference;
    3, unlike threads, variables are cloned by each sub-process, except chunksize>1;
    4, processed in the same chunk shares variables (need further understanding on why later);
'''

def test_call(*args, shared=None, **kwargs):
    total = 0

    if shared:
        with shared['lock']:
            for i in range(1000):
                shared['data'][str(uuid.uuid1())] = time.time()
                total += 1
    
    return total


def test_task(*args, **kwargs):
    return test_call(*args, **kwargs)

def test_task_shared(*args, shared=None, **kwargs):
    return test_call(*args, shared=shared, **kwargs)


def test_threads():
    max_workers = os.cpu_count()    
    
    now = time.time()
    print("\n\ntest run_threads")
    fs = run_threads(test_task, [1, 2, 3, 4, 5,], max_workers=max_workers)
    for f in fs:
        print(f)
    print(f"Done: {time.time() - now}")

    print("\n\ntest new_threads & start_thread")
    fs = []
    now = time.time()
    with new_threads(max_workers=max_workers) as executor:
        for i in range(6):
            fs.append(start_thread(executor, test_task, i))
    for f in fs:
        print(f.result())    
    print(f"Done: {time.time() - now}")

def test_processes():    
    manager = Manager()    
    shared = dict(data = manager.dict(), lock = manager.Lock())

    max_workers = 3 # os.cpu_count()   
        
    fs = []
    start = time.time()
    with new_processes(max_workers=max_workers) as executor:
        for i in range(6):
            fs.append(start_process_ex(executor, test_task, i, shared=shared))
    for f in as_completed({f: None for f in fs}):
        print(f.result())
    print(f"Done: {time.time() - start}")

    # print(f"shared_data: {shared['data']}")

    fs = []
    now = time.time()
    with new_processes(max_workers=max_workers) as executor:
        for i in range(6):
            fs.append(start_process(executor, test_task, i))
    for f in as_completed({f: None for f in fs}):
        print("f: {}, result: {}".format(f, f.result()))
    print(f"Done: {time.time() - now}")

if __name__=="__main__":
    # test_threads()
    test_processes()

