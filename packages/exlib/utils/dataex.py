
def get_value(obj, name, default):
    try:
        val = obj.get(name, None)
        if val != None:
            return val
    except:
        pass

    return default