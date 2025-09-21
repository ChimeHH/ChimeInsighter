import re
import time
import pathlib
import pickle
import shutil
import subprocess
from pprint import pprint
from datetime import datetime

from .linux.identifier import crack_linux
from database.core.mongo_db import mongo_client

from exlib.concurrent.context import WorkerResult
from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class ScanException(Exception):
    pass

def find_credentials(version_path, files):
    credentials = {}

    for filepath in files:
        fullpath = str(version_path / filepath)
        
        if fullpath.endswith('/etc/shadow'):
            credentials.setdefault(filepath.parent, {})
            credentials[filepath.parent]['shadow'] = fullpath
        elif fullpath.endswith('/etc/passwd'):
            credentials.setdefault(filepath.parent, {})
            credentials[filepath.parent]['passwd'] = fullpath

    return credentials

def scan(context, jobs=2, timeout=600, interval=5):
    try:
        results = []

        credentials = find_credentials(context.version_path, context.metadata.get('unpacked_relative_files', []))

        for path, credential in credentials.items():
            shadow_file = credential.get('shadow', None)
            passwd_file = credential.get('passwd', None)

            if shadow_file or passwd_file:
                cracked_list = crack_linux(passwd_file, shadow_file, jobs=jobs, timeout=timeout, interval=interval)
                if cracked_list:
                    for r in cracked_list:
                        results.append(dict(platform='linux', passwd_file=passwd_file, shadow_file=shadow_file, text=r[0], password=r[1],))

        return WorkerResult(context, {'credentials': results})

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
    

    returncode, _, _ = scan(context)
    print(f"return code: {returncode}")
    pprint(context, indent=4)

    for leak in context.reports['credentials']:
        pprint(leak, indent=4)
                  

