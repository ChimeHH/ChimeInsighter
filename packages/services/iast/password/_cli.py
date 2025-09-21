import re
import time
import pathlib
import pickle
import shutil
import subprocess
from pprint import pprint
from datetime import datetime

from .hashed.identifier import PasswordIdentifier
from database.core.mongo_db import mongo_client

from exlib.concurrent.context import WorkerResult
from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class ScanException(Exception):
    pass

def scan(context):
    try:
        password_identifier = PasswordIdentifier()
        results = password_identifier.analyze(context.filepath)        
            
        return WorkerResult(context, {'hashed': results})
        
    except Exception as e:
        errstr = f"iast/credentials failed to analyze passwords on {context.version_id}/{context.filepath}, reason: {e}"
        log.exception(errstr)
        raise ScanException(errstr)

        return -1


if __name__=="__main__":
    from addict import Addict
    import pickle
    
    context = Addict({ 
                "version_id": "unittest",
                "filepath": "sample",
                "reports": {},

                "metadata": { "credentials": [ {"passwd": "/share/simple-test/output/credentials/passwd", "shadow": "/share/simple-test/output/credentials/shadow"}, ], }
            })
    

    returncode = scan(context)
    print(f"return code: {returncode}")
    pprint(context, indent=4)

                  

