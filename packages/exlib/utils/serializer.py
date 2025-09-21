import json
import pickle
import base64  

class BsonObject:
    @staticmethod
    def dumpb(obj):
        return pickle.dumps(obj)

    @staticmethod
    def loadb(bytes):
        return pickle.loads(bytes)

    @staticmethod
    def dumps(obj):
        pickled_bytes = pickle.dumps(obj)      
        base64_string = base64.b64encode(pickled_bytes).decode('utf-8')  
        return base64_string  

    @staticmethod
    def loads(base64_string):      
        pickled_bytes = base64.b64decode(base64_string)
        obj = pickle.loads(pickled_bytes)  
        return obj  

class JsonObject:
    @staticmethod
    def dumps(obj):      
        return json.dumps(obj)

    @staticmethod
    def loads(s):      
        return json.loads(s)  