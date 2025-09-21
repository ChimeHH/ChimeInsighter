import re  
import pathlib
from pprint import pprint
from exlib.parsers.ctags import guess_strings, guess_ctags

# 因为python编译成so后，解析出来的结果只有symbol/object是有效的，在通过源码生成时，需要保持member, variable为varname类型。这是个特殊的处理，要牢记。 sbom库里，只有varname的python token！！！
type_map = {  
        'pf': 'Python function',  
        'f': 'function',  
        'm': 'module',  
        'n_s': 'string_name',  
        'k': 'constant',  
        'v': 'variable',  
        'pt': 'pointer',  
        'pw': 'Python method'  
    }  

def parse_cython_symbol(symbol):
    stype = symbol.get('type')    
    name = symbol.get('name', "")
    if stype not in ('func', 'object') or not name.startswith(('__pyx_n_s_',)):
        return None
    match = re.search(r'^__pyx_[a-z]{1,2}_([a-z]_)?(.+)', name)
    if not match:
        return (stype, name)

    name = re.sub(r'_\d+(?=[a-zA-Z])', '_', re.sub(r'^\d+(?=[a-zA-Z])', '',  match.group(2)))    
    return (stype, name)

def parse_python_tag(tag):
    kind = tag.get('kind')
    if kind not in ('variable', 'member'):
        return None

    name = tag.get('name')
    scope = tag.get('scope', "")

    if scope and kind=='member':
        name2 = f"{scope.replace('.', '_')}_{name}"
        return (kind,name), (kind,name2)
    return (kind,name),

if __name__ == '__main__':
    import pickle
    path = pathlib.Path('/share/simple-test/pypi_test')


    print("symbols::")    
    with (path/'info.pkl').open('rb') as f:
        filedata = pickle.load(f)
    symbols = filedata['metadata']['symbols']

    for sym in symbols:  
        python_name = parse_cython_symbol(sym)  
        if python_name:
            print(python_name)
        
    print("tags::")
    tags = guess_ctags(path/'om_database.py')
    for tag in tags:
        python_name = parse_python_tag(tag)
        if python_name:
            print(python_name)
        


