import json
from bson import ObjectId
from datetime import datetime
from datetime import date
from datetime import timezone


class SortedDictEncoder(json.JSONEncoder):
    def encode(self, obj):
        def sort_dicts(item):
            if isinstance(item, list):
                return [sort_dicts(i) for i in item]
            if isinstance(item, dict):
                return {k: sort_dicts(v) for k, v in item.items()}
            else:
                return item
        return super(SortedDictEncoder, self).encode(sort_dicts(obj))


class JSONEncoder(json.JSONEncoder):
    def __init__(self):
        super().__init__()

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.replace(tzinfo=timezone.utc).isoformat(timespec='microseconds')
        if isinstance(o, date):
            return o.isoformat()

        return json.JSONEncoder.default(self, o)


def parse_unicode_string(data):
    if isinstance(data, str):
        return data.encode(errors='replace').decode()

    if isinstance(data, bytes):
        return data.decode(errors='replace')

    return data.__str__()