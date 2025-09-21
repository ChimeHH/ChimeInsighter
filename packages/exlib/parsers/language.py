import os
import sys
import re
import json
import pathlib



from exlib.whatscode.election import guess_language_all_methods


from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

def guess_language(code, filename):
    try:
        lang = guess_language_all_methods(code, file_name=filename)
        return lang
    except Exception as e:            
        # log.warning(f"failed to parser {filename}, reason: {e}") 
        return None


    











