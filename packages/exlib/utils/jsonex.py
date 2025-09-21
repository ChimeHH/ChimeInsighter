import json
from bson import json_util


def _add_prefixed_object(nested_object, prefix, results_dict, including_lists=True):
    if isinstance(nested_object, dict):
        if prefix != '':
            prefix += '.'
        for key, val in nested_object.items():
            new_prefix = prefix + key
            _add_prefixed_object(val, new_prefix, results_dict)
    elif isinstance(nested_object, list) and including_lists:
        for idx, elem in enumerate(nested_object):
            new_prefix = prefix + f'[{idx}]'
            _add_prefixed_object(elem, new_prefix, results_dict)
    else:
        results_dict[prefix] = nested_object


def flatten_json(json_object, including_lists=True):
    results_dict = {}
    _add_prefixed_object(json_object, '', results_dict, including_lists=including_lists)
    return results_dict


def unflatten_json(flattened_json_object):
    from unflatten import unflatten
    return unflatten(flattened_json_object)


# json with magic key comments
def remove_comments(data):
    if isinstance(data, dict):
        for k in list(data.keys()):
            if k.startswith("//"):
                data.pop(k)
            else:
                remove_comments(data[k])
    elif isinstance(data, (list, set)):
        for d in data:
            remove_comments(d)



# json with plain comments
def load(filepath, plain_mode=False, object_hook=json_util.object_hook, **kwargs):
    with filepath.open('r') as f:
        if plain_mode:
            return json.loads(f.read())

        doc = []
        for line in f:
            if line.strip().startswith("//"):
                continue
            doc.append(line)
        return json.loads(''.join(doc),  object_hook=object_hook, **kwargs)

def loads(text, plain_mode=False, object_hook=json_util.object_hook, **kwargs):
    if plain_mode:
        return json.loads(text)

    text_lines = text.split("\n")
    doc = []
    for line in text_lines:
        if line.strip().startswith("//"):
            continue
        doc.append(line)
    return json.loads(''.join(doc), object_hook=object_hook, **kwargs)


def dump(data, filepath, indent=4, default=json_util.default, **kwargs):    
    with filepath.open('w') as f:
        json.dump(data, f, indent=indent, default=default, **kwargs)

def dumps(data, indent=4, default=json_util.default, **kwargs):
    return json.dumps(data, indent=indent, default=default, **kwargs)
