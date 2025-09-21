# sending logs to server
import os
import re
import time
import socket
import pickle
import multiprocessing

from pprint import pformat
from traceback import format_exc,format_stack

import logging
from logging.handlers import SysLogHandler


WHOAMI = os.environ.get("ENGINE_ID", "UNKNOWN")
LOG_LEVEL = os.environ.get("LOG_LEVEL", logging.ERROR)

def exception_log(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as err:
            args[0].logger.exception(str(err))
            # re-raise the exception
            raise

    return wrapper

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
            data = dict(whoami=WHOAMI, name=record.name, levelno=record.levelno, module=record.module,
                        pathname=record.pathname, lineno=record.lineno, funcName=record.funcName,
                        processName=record.processName, processId=record.process,
                        msg=str(record.msg)[:2048], timestamp=time.time())

            pickled = pickle.dumps(data)

            if not self.socket:
                self.createSocket()

            if self.unixsocket:
                try:
                    self.socket.send(pickled)
                except OSError:
                    self.socket.close()
                    self._connect_unixsocket(self.address)
                    self.socket.send(pickled)
            elif self.socktype == socket.SOCK_DGRAM:
                self.socket.sendto(pickled, self.address)
            else:
                self.socket.sendall(pickled)
        except Exception:
            self.handleError(record)


class MyLogger(logging.Logger):
    _initialized = False

    DEBUG = logging.DEBUG
    INFO = logging.INFO
    WARNING = logging.WARNING
    ERROR = logging.ERROR
    CRITICAL = logging.CRITICAL

    @classmethod
    def setLoggerLevel(cls, name, level):
        logger = logging.root if name=="root" else logging.getLogger(name)
        logger.setLevel(int(level))

    @classmethod
    def initHandlers(cls, name="root", handlers=[]):        
        logger = logging.root if name=="root" else logging.getLogger(name)
        logger.handlers.clear()

        if handlers:
            for h in handlers:
                logger.addHandler(h)
        else:
            r_handler = MySysLogHandler(address=('logserver', 1514))
            logger.addHandler(r_handler)

            s_format = logging.Formatter('%(levelname)s - %(asctime)s - %(module)s - %(filename)s %(lineno)d - %(message)s')
            s_handler = logging.StreamHandler()
            s_handler.setFormatter(s_format)
            logger.addHandler(s_handler)

    @classmethod
    def getLogger(cls, name, *args, level=None, **kwargs):
        if logging._loggerClass is not MyLogger:
            cls.initHandlers()
            logging.setLoggerClass(MyLogger)
        
        logger = logging.getLogger(name, *args, **kwargs)

        if level:
            logger.setLevel(int(level))

        elif not logger.level: # update level if not set yet
            logger.setLevel(int(LOG_LEVEL))
            
        return logger

    @classmethod
    def setProcessName(cls, process_name):
        if process_name:
            process = multiprocessing.current_process()
            process.name = process_name    

    @property
    def _level(self):
        return self.level

    @property
    def _debug(self):
        return self._level==self.DEBUG

    @property
    def _info(self):
        return self._level in (self.DEBUG, self.INFO)

    @classmethod
    def EnableLog2server(cls, _logger, logLevel=None, logName=None, processName=None):
        if logLevel:
            _logger.setLevel(logLevel)
        if logName:
            _logger.name = logName
        if processName:
            process = multiprocessing.current_process()
            process.name = processName

        r_handler = MySysLogHandler(address=('logserver', 1514))
        _logger.addHandler(r_handler)

    @classmethod
    def EnableLog2console(cls, _logger, logLevel=None, logName=None, processName=None):
        if logLevel:
            _logger.setLevel(logLevel)
        if logName:
            _logger.name = logName
        if processName:
            process = multiprocessing.current_process()
            process.name = processName

        s_format = logging.Formatter('%(levelname)s - %(asctime)s - %(filename)s %(lineno)d - %(message)s')
        s_handler = logging.StreamHandler()
        s_handler.setFormatter(s_format)
        _logger.addHandler(s_handler)

    @classmethod
    def pformat(cls, *args, **kwargs):
        return pformat(*args, **kwargs)

    @classmethod
    def vars(cls, obj, exclude_callables=True, exclude_private=True):   
        attrs = {}

        if hasattr(obj, '__dict__'):
            for name, value in obj.__dict__.items():
                attrs[name] = f"{value} /{type(value)}"
        
        slots = getattr(type(obj), '__slots__', [])
        for name in slots:
            if hasattr(obj, name):
                value = getattr(obj, name)
                attrs[name] = f"{value} /{type(value)}"
        
        for name in dir(obj):
            if exclude_private and name.startswith('_'):
                continue

            try:
                value = getattr(obj, name)
                if exclude_callables and callable(value):
                    continue

                if name not in attrs:
                    attrs[name] = f"{value} /{type(value)}"

            except AttributeError:
                continue
        
        return attrs

    @classmethod
    def pfvars(cls, obj, exclude_callables=True, exclude_private=True):
        return f"{obj}/{type(obj)}::\n{cls.pformat(cls.vars(obj))}"

    @classmethod
    def format_exc(cls):
        return format_exc()

    def exception(self, desc=""):
        ''' instead of just logging the exception, we return the reason information to caller, then the caller might pass it to web, redis, or any remote caller.'''
        reason = f"{desc}:\n{format_exc()}"
        self.error(reason)
        return reason

    @classmethod
    def format_stack(cls, return_in_string=True):
        if return_in_string:
            return "".join(format_stack())
        return format_stack()




class SimpleLogger(logging.Logger):
    def __init__(self, name, *args, logfilepath="/data/Logs/logs.log", **kwargs):
        super().__init__(name, *args, **kwargs)

        s_format = logging.Formatter('%(levelname)s - %(asctime)s - %(module)s - %(filename)s %(lineno)d - %(message)s')

        stdout_handler = logging.StreamHandler()
        stdout_handler.setFormatter(s_format)
        # stdout_handler.setLevel(logging.DEBUG)
        self.addHandler(stdout_handler)

        file_handler = logging.FileHandler(logfilepath)
        file_handler.setFormatter(s_format)
        # file_handler.setLevel(logging.DEBUG)
        self.addHandler(file_handler)

        self.setLevel(logging.DEBUG)


if __name__=='__main__':
    def hello_world1():
        logger = MyLogger(__package__)
        logger.setLevel(logging.INFO)
        logger.setProcessName('TEST_01')

        for j in range(100):
            time.sleep(1)
            for i in range(5000):
                time.sleep(3)
                logger.debug(f"Hello World {i}")
                logger.info(f"Hello World {i}")
                logger.warning(f"Hello World {i}")
                logger.error(f"Hello World {i}")
                logger.critical(f"Hello World {i}")

    def hello_world2():
        logger = MyLogger.getLogger(__package__)
        logger.setLevel(logging.DEBUG)
        MyLogger.EnableLog2server(logger, logName='DEMO_01', processName='demo-process')
        MyLogger.EnableLog2console(logger)

        for j in range(100):
            time.sleep(1)
            for i in range(5000):
                time.sleep(3)
                logger.debug(f"Hello World {i}")
                logger.info(f"Hello World {i}")
                logger.warning(f"Hello World {i}")
                logger.error(f"Hello World {i}")
                logger.critical(f"Hello World {i}")


    # hello_world1()
    hello_world2()


