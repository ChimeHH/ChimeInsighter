# sending logs to server

import time
import socket
import pickle
import multiprocessing

from . import logging
from .logging.handlers import SysLogHandler

class MySysLogHandler(logging.handlers.SysLogHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def emit(self, record):
        """
        Emit a LogRecord.

        The record is formatted, and then sent to the syslog server. If
        exception information is present, it is NOT sent to the server.
        """
        try:            
            msg = pickle.dumps(dict(name=record.name, levelno=record.levelno, pathname=record.pathname, 
                       lineno=record.lineno, msg=record.msg, processName=record.processName, funcName=record.funcName,
                       scanning=record.scanning,
                       ct=time.time()))

            if not self.socket:
                self.createSocket()

            if self.unixsocket:
                try:
                    self.socket.send(msg)
                except OSError:
                    self.socket.close()
                    self._connect_unixsocket(self.address)
                    self.socket.send(msg)
            elif self.socktype == socket.SOCK_DGRAM:
                self.socket.sendto(msg, self.address)
            else:
                self.socket.sendall(msg)
        except Exception:
            self.handleError(record)



s_format = logging.Formatter('%(asctime)s - %(filename)s - %(levelname)s - %(message)s')

logger1 = logging.Logger('Test')
r_handler1 = MySysLogHandler(address=('logserver', 1514))
logger1.addHandler(r_handler1)
s_handler1 = logging.StreamHandler() 
s_handler1.setFormatter(s_format)
logger1.addHandler(s_handler1)
logger1.setLevel(logging.DEBUG)

logger2 = logging.Logger('HELLO')
s_handler2 = logging.StreamHandler() 
s_handler2.setFormatter(s_format)
logger2.addHandler(s_handler2)
logger2.setLevel(logging.DEBUG)
r_handler2 = MySysLogHandler(address=('logserver', 1514))
logger2.addHandler(r_handler2)

print(f"DEBUG: {logging.DEBUG}")
print(f"INFO: {logging.INFO}")
print(f"WARNING: {logging.WARNING}")
print(f"ERROR: {logging.ERROR}")
print(f"CRITICAL: {logging.CRITICAL}")

def hello_world():
    process = multiprocessing.current_process()
    process.name = 'PROCESS'    
    
    for j in range(100):
        time.sleep(1)
        for i in range(5000):
            logger1.setName(f'LOG1', scanning='abc.so')
            logger1.debug(f"Hello World {i}")
            logger1.info(f"Hello World {i}")

            logger2.setName(f'LOG2', scanning='abc.so')
            logger2.debug(f"Hello World {i}")
            logger2.info(f"Hello World  {i}")

hello_world() 