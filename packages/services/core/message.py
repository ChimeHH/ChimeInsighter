import os
import json
import base64
import pickle
from amq.message import AmqMessage

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


class AstMessage(AmqMessage):    
    class GROUP:
        job = 'JOB/'
        ui  = 'UI/'

    class UI:
        scan = 'UI/SCAN'

    class JOB:
        scan = 'JOB/SCAN'
        
        files = 'JOB/FILES'
        public = 'JOB/PUBLIC'
        zeroday = 'JOB/ZERODAY'        
        mobile = 'JOB/MOBILE'
        password = 'JOB/PASSWORD'
        misconfiguration = 'JOB/MISCONFIGURATION'
        hardening = 'JOB/HARDENING'
        compliance = 'JOB/COMPLIANCE'
        infoleaks = 'JOB/INFOLEAKS'
        malwares = 'JOB/MALWARES'
        virus = 'JOB/VIRUS'

    def is_job_message(self):
        return self.msgid.startswith(self.GROUP.job)

    def is_ui_message(self):
        return self.msgid.startswith(self.GROUP.ui)

class AstRequest(AstMessage):    
    def encode(self):            
        data = base64.b64encode(pickle.dumps(self.data)).decode()        
        payload = dict(uid=self.uid, msgid=self.msgid, sender=self.sender, mtype=self.MTYPE.request)
        payload['data'] = data

        if os.environ.get('TRACE_MESSAGES', 'no') == 'yes':
            log.info(f"# encoding request message: {payload['uid']}, {payload['msgid']}, {payload['sender']}, {self.data.get('version_id', '-')}, {self.data.get('routine', '-')}, {self.data.get('status', '-')}, {self.data.get('filepath', '-')}")        

        return json.dumps(payload)


class AstResponse(AstMessage):    
    def encode(self):
        data = base64.b64encode(pickle.dumps(self.data)).decode() 
        payload = dict(uid=self.uid, msgid=self.msgid, sender=self.sender, mtype=self.MTYPE.response)
        payload['data'] = data

        if os.environ.get('TRACE_MESSAGES', 'no') == 'yes':
            log.info(f"# encoding resonse message: {payload['uid']}, {payload['msgid']}, {payload['sender']}, {self.data.get('version_id', '-')}, {self.data.get('routine', '-')}, {self.data.get('status', '-')}, {self.data.get('filepath', '-')}")        
        
        return json.dumps(payload)

class AstAck(AstMessage):
    def encode(self):
        payload = dict(uid=self.uid, msgid=self.msgid, sender=self.sender, mtype=self.MTYPE.ack)

        if os.environ.get('TRACE_MESSAGES', 'no') == 'yes':
            log.info(f"# encoding ack message: {payload['uid']}, {payload['msgid']}, {payload['sender']}")

        return json.dumps(payload)