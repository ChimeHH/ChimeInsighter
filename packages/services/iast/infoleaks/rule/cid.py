from exlib.utils.abstract import Singleton
from id_validator import validator

class CID(metaclass=Singleton):
    def __init__(self, *args, **kwargs):
        pass

    def get_info(self, rule, original):
        return validator.get_info(original)