import re
import pathlib
import json
from exlib.settings.osenv import appdata_path
from exlib.utils.abstract import Singleton

from .domain import Domain
class Email(metaclass=Singleton):
    def __init__(self, *args, **kwargs):
        pass


    def get_info(self, rule, original):
        domain = Domain()
        info = domain.get_info(original)
        if not info:
            return None

        return dict(domain=info['domain'], malicious=info['malicious'])



if __name__=="__main__":
    emails = [
        "a@sina.com",
        "a.b@sina.com.cn",
        "x@sina.co",
        "www@004q.info",
        ]

    email = Email()
    for n in emails:
        print("{}: {}".format(n, email.get_info(n)))