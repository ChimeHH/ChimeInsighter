import re
from exlib.utils.abstract import Singleton

class Path(metaclass=Singleton):
    def __init__(self, *args, **kwargs):
        pass

    def get_info(self, rule, original):  
        if re.match(r"^(/usr/s?bin|/etc|/var|/sbin|/proc|/sys|/lib|/boot|/bin)\b", original):
            return None      

        return {"filepath": original, }