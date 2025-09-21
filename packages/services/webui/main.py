import os
import sys
import time
import base64
import subprocess
import string
import tempfile
import uuid
import json
import secrets
import signal
from flask_cors import CORS
from cryptography.fernet import Fernet
from flask import Flask, request, send_file, send_from_directory, redirect, abort
from flask_socketio import SocketIO

from waitress import serve


from exlib.settings import osenv
from exlib.utils import filesystemex
from exlib.utils.filesigner import FileSigner, InvalidFileSignature
from exlib.http.http_server_api_ex import *

from amq.config import AmqConfig
from amq.general import AmqQueue,AmqGeneral

from services.core.init_database import InitDatabase

from .core.auth_config import AuthConfig
from .interfaces.application_api import ApplicationAPIDefinition

from .export.reports import ReportsAPIService
from .auth.authorization import AuthorizationService
from .project.projects import ProjectsService
from .project.versions import VersionsService
from .sys.sysinfo import SysInfoService
from .helper.helpcenter import HelpCenterService
from .monitor.monitor import MonitorService

from database import om_database

from exlib.log.logger import MyLogger, exception_log
log = MyLogger.getLogger(__package__)

 

class ApplicationServer(AmqGeneral):
    def __init__(self, *args, **kwargs):
        super().__init__('webui', *args, **kwargs)

        signal.signal(signal.SIGINT, self.signal_handler) 
        
        self.context = dict()

        log.info(f"starting to create, and audit database tables and indexes")
        r = InitDatabase()
        if r == False:
            log.error(f"failed to create, and audit database tables and indexes")
        
        log.info(f"starting to create queues and services to engines")

        self.out_queues = []        
        for queue in self.config.sastQueues:            
            self.out_queues.append(self.create_queue(queue['queue'], queue['routekey']))

        self.app = self._init_flask_app()

        self.services = [   SysInfoService(self, self.context),
                            HelpCenterService(self, self.context),
                            MonitorService(self, self.context),
                            AuthorizationService(self, self.context),
                            ProjectsService(self, self.context),
                            VersionsService(self, self.context),
                            ReportsAPIService(self, self.context),  ]
        
        log.info(f"starting to provide api services to web......")

    def signal_handler(self, sig, frame):  
        log.info('Main process: Exiting...')  

        for serv in self.services:
            serv.cleanup()

        sys.exit(0)  # 确保主进程退出 


    @property
    def om(self):
        return self._om_database
        
    @om.setter
    def om(self, value):
        self._om_database = value

    def _init_flask_app(self):
        self.app = Flask("Application API Server", static_folder=None)
        
        CORS(self.app)

        self.app.before_request(self.before_request_hook)

        register_default_error_handlers(self.app)
        return self.app

    def before_request_hook(self):        
        self.om.update_engine()
        
        if not osenv.get_setting('DISPLAY_REQUESTS', None):
            return

        endpoint_url = request.path  
        request_method = request.method  
        query_params = request.args.to_dict()  # 获取查询参数，并转为字典  

        log.debug(f'Request to: {endpoint_url}')  
        log.debug(f'Method: {request_method}')  
        log.debug(f'Query Parameters: {query_params}')  # 打印查询参数  

        # 检查 Content-Type  
        content_type = request.content_type  
        log.debug(f'Content-Type: {content_type}')  
        
        if content_type == 'application/json':  
            # 处理 JSON  
            request_body = request.get_json()  
            log.debug(f'Body (JSON): {request_body}')  
        elif content_type == 'application/x-www-form-urlencoded':  
            # 处理 form-data  
            request_body = request.form  
            log.debug(f'Body (form-data): {list(request_body.keys())}')  # only print keys, to avoid printing too much data, and to avoid printing sensitive data like passwords  
        elif content_type == 'multipart/form-data':  
            # 处理文件上传等  
            request_body = request.form  
            log.debug(f'Body (multipart): {request_body}')  
        else:  
            # 处理其他类型  
            request_body = request.get_data(as_text=True)  
            log.debug(f'Body (raw): {request_body}')     

    def publish_request(self, sastmsg, priority=None):
        log.debug(f"publish message {priority}: {log.pformat(sastmsg)}")

        priority = priority if isinstance(priority, int) else AmqQueue.M_PRI_Q
        priority = min(len(self.out_queues)-1, max(0, priority))
        q_obj = self.out_queues[priority]
        self.publish(q_obj, sastmsg)

server = ApplicationServer()
app = server.app
socketio = SocketIO(app, cors_allowed_origins="*")

if __name__ == "__main__":
    # app.run(host='0.0.0.0', port=AuthConfig.server_port(), threaded=True, ssl_context=AuthConfig.ssl_context(), debug=False)
    socketio.run(app, host='0.0.0.0', port=AuthConfig.server_port(), ssl_context=AuthConfig.ssl_context(), debug=False)


'''
python3 -m services.webui.application

gunicorn -c /share/digitaltwins-3.05/packages/services/webui/gunicorn.conf.py services.webui.application:app




'''