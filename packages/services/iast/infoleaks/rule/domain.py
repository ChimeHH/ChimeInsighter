import re
import pathlib
from exlib.settings.osenv import appdata_path
from exlib.utils.abstract import Singleton

class Domain(metaclass=Singleton):
    def __init__(self, *args, **kwargs):        
        filepath = appdata_path() / "resource" / "infoleaks" / 'domain'
        known = []
        with (filepath / 'known.txt').open('r') as f:
            for line in f:
                if line.startswith("#"):
                    continue
                known.append(line.strip().lower())
        self.known = set(known)

        malicious = []
        with (filepath / 'malicious.txt').open('r') as f:
            for line in f:
                if line.startswith("#"):
                    continue
                malicious.append(line.strip().lower())
        self.malicious = set(malicious)
                
    def get_info(self, rule, original):
        parts = original.split('.')
        
        for i in range(len(parts)):
            domain = ".".join(parts[i:])
            if domain in self.malicious:
                return dict(domain=domain, malicious=True)

        domain = parts[-1] 
        if domain in self.known:            
            return dict(domain=domain, malicious=False)

        return None

if __name__=="__main__":
    urls = [
        "a@sina.com",
        "a.b@sina.com.cn",
        "x.sina.co",
        "www.004q.info",
        ]

    domain = Domain()
    for n in urls:
        print("{}: {}".format(n, domain.get_info(n)))