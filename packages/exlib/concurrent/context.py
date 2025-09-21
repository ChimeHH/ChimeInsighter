from database.master_database import ScanModes, ScanOptions

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


class WorkerContext:
    def __init__(self, sastmsg):           
        self.response_id = sastmsg.data['response_id']
        self.reponse_queue = sastmsg.data['response_queue']  
        self.version_id = sastmsg.data['version_id']
        self.version_path = sastmsg.data['version_path']
        
        self.scan_options = ScanOptions(sastmsg.data.get('scan_options', {}))
        self.scan_modes = ScanModes(sastmsg.data.get('scan_modes', {}))
        
        self.pipeline_id = sastmsg.data['pipeline_id']  
        self.pipeline_rules = sastmsg.data['pipeline_rules']
        
        # note, for bast, current we won't setup watchdog on workers.
        self.max_memory = sastmsg.data.get('max_memory', 0)
        self.max_timeout = sastmsg.data.get('max_timeout', 0)
        
        self.checksum = sastmsg.data.get('checksum', None)
        self.filepath = sastmsg.data['filepath']

        self.start_time = sastmsg.data.get('start_time', None)

        
    def __str__(self):
        return "WorkerContext({})".format(vars(self))

    def __repr__(self):
        return self.__str__()

class WorkerError:
    def __init__(self, errcode, errstr):
        self.errcode = errcode
        self.errstr = errstr

    def __str__(self):
        return f"WorkerError({self.errcode}, {self.errstr})"

    def __repr__(self):
        return self.__str__()

class WorkerResult:
    def __init__(self, context, result):
        self.context = context
        self.result = result

    def __str__(self):
        return f"WorkerResult({log.pformat(self.context)}, {log.pformat(self.result)})"

    def __repr__(self):
        return self.__str__()

