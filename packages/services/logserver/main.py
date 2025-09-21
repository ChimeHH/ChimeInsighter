import os
import re
import time
import pickle
import pathlib
import shutil
import traceback
from datetime import datetime
import threading
import queue

import logging
import socketserver

from exlib.settings import osenv

def init_log(logfile):
    import logging
    from logging.handlers import RotatingFileHandler
    from logging import handlers
    import sys

    log = logging.getLogger('logd')
    log.setLevel(logging.DEBUG)

    format = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

    ch = logging.StreamHandler(sys.stdout)
    ch.setFormatter(format)
    log.addHandler(ch)

    fh = handlers.RotatingFileHandler(logfile, maxBytes=1024*1024*10, backupCount=10)
    fh.setFormatter(format)
    log.addHandler(fh)

    return log

log_root = pathlib.Path(os.environ.get("LOG_ROOT", "/data/logs"))
log_root.mkdir(mode=0o777, parents=True, exist_ok=True)
logfile = log_root / f'log_server.log'
log = init_log(logfile)

class LogFile:
    def __init__(self, filehandle):
        self.fileHandle = filehandle

    def writeline(self, host, processName, processId, logName, levelName, timestamp, module, pathname, lineno, msg, others=None): 
        try:
            self.fileHandle.write(f"{time.ctime(timestamp)[4:-5]} {levelName} - {host}/{processName}/{processId} - {module} - {logName}:{lineno} - {msg}\n")
            self.fileHandle.flush() # disable buffering to avoid log loss
        except Exception as e:
            self.fileHandle.close()
            self.fileHandle = None
            log.exception(f"writeline failed: {e}")

    def close(self):
        if self.fileHandle:
            self.fileHandle.close()
            self.fileHandle = None
            
class LogFilePool:    
    def __init__(self, logRoot):        
        self.logRoot = logRoot
        self._logFiles = dict()
        self.last_update = datetime.now()

    def getLogFile(self, whoami):        
        if whoami in self._logFiles:
            logFile = self._logFiles[whoami]
            if logFile.fileHandle:
                return logFile

        log.info("add log file handle for engine:: {}".format(whoami))

        filepath = self.logRoot / whoami  / "master.log"
        filepath.parent.mkdir(mode=0o777, parents=True, exist_ok=True)
                
        fh = filepath.open('a')
        self._logFiles[whoami] = LogFile(fh)

        return self._logFiles[whoami]

    def cleanup(self):
        now = datetime.now()        

        total_seconds = (now - self.last_update).total_seconds()
        if total_seconds < int(osenv.get_setting('CHECK_LOG_INTERVAL', 86400)):
            return
        
        self.last_update = now

        max_seconds = int(osenv.get_setting('MAX_LOG_LIFE', 86400*30))

        # flush all opening files 
        backupName = self.last_update.isoformat().replace(':', '-') + ".log"

        for whoami in list(self._logFiles.keys()):
            try:
                logFile = self._logFiles[whoami]
                logFile.close()

                filepath = self.logRoot / whoami /'master.log'
                filepath.rename(self.logRoot / whoami  / backupName)
            except:
                log.exception(f"failed to backup log file: {filepath}")

        # walk log directories and remove all outdated logs
        for p in self.logRoot.iterdir():
            if p.is_dir():                   
                for f in p.iterdir():
                    try:
                        creation_datetime = datetime.fromtimestamp(f.stat().st_ctime) 
                        if (now - creation_datetime).total_seconds() > max_seconds:
                            log.info(f"{creation_datetime} outdated.")
                            f.unlink(missing_ok=True)
                    except:
                        log.exception(f"failed to unlink outdated log file: {f}")

class SyslogUDPHandler(socketserver.BaseRequestHandler):
    cache_queue = queue.Queue()    
    logfile_hs = dict()
    
    def handle(self):        
        self.cache_queue.put_nowait((self.client_address, self.request))

    @classmethod
    def handle_thread(cls, logRoot):
        logPool = LogFilePool(logRoot)

        while True:
            try:
                for _ in range(int(osenv.get_setting('CHECK_LOG_RANGE', 10000))):
                    client_address, request = cls.cache_queue.get()
                    
                    try:
                        data = pickle.loads(request[0])

                        whoami = data.pop('whoami', "-")
                        logName = data.pop('name', "-")
                        levelName = logging.getLevelName(data.pop('levelno', "-"))

                        processId = data.pop('processId', "-")
                        processName = data.pop('processName', "-")
                        
                        msg = data.pop('msg')            
                        timestamp = data.pop('timestamp')
                        
                        pathname = data.pop('pathname', "-")
                        lineno = data.pop('lineno', "-")
                        funcName = data.pop('funcName', "-")
                        module = data.pop('module', "-")

                        others = ' - '.join(data.values())

                        host = client_address[0]
                        
                        file = logPool.getLogFile(whoami)
                        file.writeline(host, processName, processId, logName, levelName, timestamp, module, pathname, lineno, msg, others)

                    except Exception as e:
                        logging.exception(f"handle log failed: <{str(e)}>, {client_address}, {request}")

                logPool.cleanup()
            except:
                log.exception(f"log server raised an unexpected exception")
            





if __name__ == "__main__":
    try:
        host = "0.0.0.0"
        port =  1514

        log.info(f"starting log server @{host}:{port}/{logfile}")

        # logging.basicConfig(level=logging.INFO, format='%(message)s', datefmt='', filename=logfile, filemode='a')
        server = socketserver.UDPServer((host,port), SyslogUDPHandler)
        
        threading.Thread(target=SyslogUDPHandler.handle_thread, args=(log_root,)).start()
        
        server.serve_forever(poll_interval=0.5)

    except (IOError, SystemExit):
        raise
    except KeyboardInterrupt:
        log.info ("Crtl+C Pressed. Shutting down.")

'''
export CHECK_LOG_RANGE=10
export CHECK_LOG_INTERVAL=30
export MAX_LOG_LIFE=120
'''