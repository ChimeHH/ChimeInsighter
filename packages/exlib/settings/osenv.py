import os
import re
import pathlib
import uuid
import json
import psutil
import traceback
from datetime import datetime

def eval_value(v, int_flag=True):       
    try:
        if isinstance(v, str):
            v = re.sub(r"\$cpu", f"{cpu_count()}", v)
            v = re.sub(r"\$memory_total", f"{int(virtual_memory().total/1024/1024/1024)}", v)
            v = re.sub(r"\$memory_available", f"{int(virtual_memory().available/1024/1024/1024)}", v)
            
        if int_flag:
            return int(eval(v))

        return int(v)
    except:        
        return v

def appdata_path():
    return pathlib.Path('/usr/local/share/appdata')

def amq_config_path():
    return appdata_path() / 'amq_config.json'    

def license_path():
    return appdata_path() / 'license.dat'

def has_app(app_name):
    from shutil import which
    return which(app_name)

def license_data():
    filepath = license_path()
    if filepath.is_file():
        with filepath.open('r') as f:
            return json.load(f)
    return {}

def engine_id(default=str(uuid.uuid1())):
    return os.getenv('ENGINE_ID', default)

def log_level():
    return eval_value(os.getenv('LOG_LEVEL', 20))

def cpu_count():
    return psutil.cpu_count(logical=True)
    
def virtual_memory():
    return psutil.virtual_memory()

def get_setting(name, default=None):
    return os.getenv(name, default)

def database_config(group, filepath=None):    
    if not filepath:
        filepath = appdata_path() / 'database_config.json'

    with filepath.open('r') as f:
        config = json.load(f)            
        return config.get(group, {})