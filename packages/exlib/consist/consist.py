import os,sys
import yaml
import json
import hashlib
import base64
from .printers import *
from .filesystemex import *
from .hashex import *
from .cryptoex import PublicKey,InvalidSignature

SYSTEM_CONSISTS_NAME='/share/digitaltwins.vm/appdata/consists.sig'
PYTHON_CONSISTS_NAME='consists.sig'

class ConsistError(Exception):
    pass

class Consist(object): 
    __shared_context__ = set()   
    def __init__(self):
        self._consists_path = None

    def calc_consists(self, job):
        raise Exception('NotImplementedYet')

    def load(self, consists_path):
        if self._consists_path == consists_path:
            return

        with open(consists_path, 'rb') as f:
            _bytes = f.read()
            text = _bytes.decode()
        
        content = json.loads(text)
        # pprint(content, indent=4)

        _debug_mode = content.get('debug_mode', None) or False
        _consists = content.get('consists', None) or dict()
        _signature = content.get('signature')


        text = json.dumps(dict(debug_mode=_debug_mode, consists=_consists), sort_keys=True)
        sha256 = hashlib.sha256(text.encode('utf-8')).hexdigest()
        
        public_key = PublicKey()
        public_key.validate_signature(sha256.encode(), base64.b64decode(_signature.encode()))

        self._consists_path = consists_path
        self._debug_mode = _debug_mode
        self._consists = _consists
        
    def validate(self, job):
        hashed_job = hashlib.sha256(job.encode('utf-8')).hexdigest()
        if hashed_job in self.__shared_context__:
            return

        consists = self.calc_consists(job)

        for name, value in consists.items():            
            if name not in self._consists or value!=self._consists[name]:
                if self._debug_mode:
                    print_yellow("Malformed install: {}/{}".format(job, name))
                else:
                    raise ConsistError("Malformed install: {}/{}".format(job, name))

            self.__shared_context__.add(name)

        self.__shared_context__.add(hashed_job)

class PythonConsist(Consist):
    def __init__(self):
        super().__init__()
        self._module = None

    def calc_consists(self, module_name, consists_path=PYTHON_CONSISTS_NAME):
        module = module_name.split('.')[0]
        if self._module != module:
            self._module = module
            self.load(os.path.join(python_package_path(module_name), consists_path))

        return calc_python_hash(module_name)            
    
class CommandConsist(Consist):
    def calc_consists(self, command, consists_path=SYSTEM_CONSISTS_NAME):
        self.load(consists_path)
        return calc_command_hash(command)
    
class FileConsist(Consist):
    def calc_consists(self, filepath, consists_path=SYSTEM_CONSISTS_NAME):
        self.load(consists_path)
        return calc_filepath_hash(filepath)

    