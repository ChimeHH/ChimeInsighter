import os
import uuid
import json
import base64
import pickle
import traceback

from pprint import pformat

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

_verbose_ = True

class NotAvailableInThisMessage(Exception):
    pass


class AmqMessage:
    UNISEQ = 0

    class MTYPE:
        request = 'REQUEST'
        response = 'RESPONSE'
        ack = 'ACK'

    def __init__(self, sender, msgid, data={}, uid=None, mtype=None, **kwargs):        
        self.msgid = msgid.upper()
        self.data = data
        self.data.update(kwargs)

        self._uid = uid # only available in a received message or a sent message     
        self._sender = sender   
        self._mtype = mtype

    @classmethod
    def uniseq(cls):
        cls.UNISEQ += 1
        return cls.UNISEQ

    @property
    def uid(self):
        if not self._uid:
            self._uid = self.uniseq()
        return self._uid

    @uid.setter
    def uid(self, value):
        self._uid = value

    @property
    def sender(self):
        return self._sender
        
    @sender.setter
    def sender(self, value):
        raise NotAvailableInThisMessage(f"{self.msgid}/{self.uid}")

    @property
    def mtype(self):
        return self._mtype
        
    @mtype.setter
    def mtype(self, value):
        raise NotAvailableInThisMessage(f"{self.msgid}/{self.uid}")

    @classmethod
    def from_payload(cls, buffer):
        payload = json.loads(buffer)
        data = pickle.loads(base64.b64decode(payload['data'].encode()))

        if os.environ.get('VERBOSE_TRACE', 'no') == 'yes':
            log.debug(f"# decoded message: {payload['sender']}, {payload['msgid']}, {log.pformat(data)}, {payload['uid']}, {payload['mtype']}")
                        
        return cls(payload['sender'], payload['msgid'], data, uid=payload['uid'], mtype=payload['mtype'])

    def __str__(self):
        return f"{self.__class__.__name__}( sender={self.sender}, msgid={self.msgid}, data={pformat(self.data, indent=4)}, uid={self.uid}, mtype={self.mtype} )"

    def __repr__(self):
        return str(self)