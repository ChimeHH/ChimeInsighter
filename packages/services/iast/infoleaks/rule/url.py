import re
from exlib.utils.abstract import Singleton

class URL(metaclass=Singleton):
    def __init__(self, *args, **kwargs):
        pass

    def get_info(self, rule, original):        
        return {"url": original, }