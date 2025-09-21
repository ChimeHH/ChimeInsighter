import os
import uuid
import time
from pprint import pp

from pwnlib.tubes.process import process as pwnlib_process

class Tube():    
    def __init__(self, name, command, cwd=None, _id=None, shell=True, extra_info=None, *args, **kwargs):
        self._id = _id  if _id != None  else  str(uuid.uuid4())
        self._name = name

        self._command = command
        self._cwd = cwd
        self._extra_info = extra_info or dict()
        self._args = args
        self._kwargs = kwargs

        self.p = pwnlib_process(command, shell=shell, cwd=cwd, *args, **kwargs)        
        self._start = time.ctime()
        self._output = b''
    
    @property
    def fullname(self):
        return f"{self._name}/{self._id}"  

    def recv(self, numb=4096, timeout=0):
        ''' raise EOFError if process was closed '''
        data = self.p.recv(numb, timeout=timeout)
        if data:
            self._output += data
        return data
            
    def settimeout(self, timeout):
        self.p.settimeout(timeout)

    def kill(self):
        self.p.kill()


    @property
    def start(self):
        return self._start

    @property
    def end(self):
        return self.p._stop_noticed

    @property
    def extra_info(self):
        return self._extra_info

    def __getattr__(self, attr):
        if attr in self.extra_info:
            return self.extra_info[attr]
        raise

    @property
    def output(self):
        try:        
            while self.recv():
                pass
        except EOFError:
            pass
        return self._output

    @property
    def outputS(self):        
        return self.output.decode(errors="ignore")

    def clean_output(self):
        self._output = b''

    def is_finished(self):
        return self.p.poll() != None

    def poll(self):
        return self.p.poll()

    @property
    def status(self):
        ret = self.poll()
        if ret is None:
            return 'Pending'
        else:
            return f'Finished({ret})'

    @property
    def cwd(self):
        return os.path.basename(self._cwd) if self._cwd else None

    @property
    def details(self):
        return dict(name=self.fullname, cwd=self.cwd, status=self.status, output=self.output, start=self.start, end=self.end)

    @property
    def overview(self):
        return dict(name=self.fullname, cwd=self.cwd, status=self.status, start=self.start, end=self.end)

class TubeManager():
    def __init__(self):
        self._process_list = {}

    @property
    def count(self):
        return len(self.process_list)

    @property
    def fullnames(self):
        return list(self.process_list.keys())

    @property
    def process_list(self):
        return self._process_list

    def add_process(self, name, command, cwd=None, _id=None):        
        p = Tube(name, command, cwd=cwd, _id=_id)
        self._process_list[p.fullname] = p
        return p

    def get_process(self, fullname):
        return self._process_list.get(fullname, None)        


    def remove_process(self, fullname):
        process = self.get_process(fullname)
        if process:
            ret = process.poll()
            if ret is None:
                process.kill()
            self._process_list.pop(fullname, None)

    def get_processes(self, *names):        
        processes = []
        if not names:
            return processes

        for fullname, process in self.process_list.items():
            if process._name in names:
                processes.append(process)

        return processes

    def remove_processes(self, *names):
        processes = []
        if not names:
            return processes

        for fullname in list(self.process_list.keys()):
            process = self.process_list[fullname]
            if process._name in names:
                ret = process.poll()
                if ret is None:
                    process.kill()

                self.process_list.pop(fullname, None)
                processes.append(process)

        return processes

    def remove_finished_processes(self):
        processes = []

        for fullname in list(self.process_list.keys()):
            process = self.process_list[fullname]            
            if process.is_finished():
                self.process_list.pop(fullname, None)
                processes.append(process)

        return processes



if __name__ == '__main__':
    mgr = TubeManager()
    name = 'bash-test'
    mgr.add_process(name, 'ls -al')
    mgr.add_process(name, 'cat /etc/hosts')
    
    for fullname in mgr.fullnames:
        while True:
            process = mgr.get_process(fullname)
            if process.is_finished():
                pp(process.details)
                pp(process.details)
                pp(process.outputS)
                break
            else:
                print('Is running')        
                data = process.recv()
                if data:
                    pp(data)    
                time.sleep(0.5)

    processes = mgr.get_processes(name)
    for process in processes:
        pp(process.overview)

    print(f"count: {mgr.count}, fullnames: {mgr.fullnames}")
    mgr.remove_finished_processes()

    print(f"count: {mgr.count}, fullnames: {mgr.fullnames}")

    p = mgr.add_process(name, 'cat /etc/mime.types')    
    print(f"count: {mgr.count}, fullnames: {mgr.fullnames}")
    mgr.remove_process(p.fullname)
    print(f"count: {mgr.count}, fullnames: {mgr.fullnames}")

    p = mgr.add_process(name, 'cat /etc/mime.types')    
    print(f"count: {mgr.count}, fullnames: {mgr.fullnames}")
    mgr.remove_processes(name)
    print(f"count: {mgr.count}, fullnames: {mgr.fullnames}")

