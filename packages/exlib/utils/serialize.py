import re
from datetime import datetime

# we are often comparing 2 versions. The leading numbers has higher priority. This function is to convert the version as a simple string 
def serialize_version(version_name):
    formatted_version = re.sub(r'[^0-9_\-\.]', '', version_name)
    if not len(formatted_version):
        return version_name

    values = re.split(r'-|_|\.', formatted_version)
    new_value = ''
    for value in values:
        if len(value):
            new_value += f"{int(value):03d}"

    return new_value


def serialized_datetime(t=None, sep=" ", timespec="seconds"):
    return t.isoformat(sep=sep, timespec=timespec)

def serialized_datetime_now(sep=" ", timespec="seconds"):
    return datetime.utcnow().isoformat(sep=sep, timespec=timespec)