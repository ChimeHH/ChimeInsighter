import subprocess
import os
from os.path import expanduser
import sys
import psutil
import uuid
import json

TOKEN_FILE = '/usr/local/share/appdata/token.json'


class TokenManager():
    @staticmethod
    def token():
        try:
            with open(TOKEN_FILE, 'r') as f:        
                text = f.read()
                mj = json.loads(text)
                token = mj['token']                
        except:
            token = str(uuid.uuid1())
            uptime = psutil.boot_time()
            
            with open(TOKEN_FILE, 'w') as f:            
                f.write(json.dumps(dict(token=token, uptime=uptime)))
        
        return token

    @staticmethod
    def update_token(new_token=None):
        with open(TOKEN_FILE, 'w') as f:
            if not new_token:
                new_token = str(uuid.uuid1())
            up_time = psutil.boot_time()
            f.write(json.dumps(dict(token=new_token, up_time=up_time)))

            return new_token
