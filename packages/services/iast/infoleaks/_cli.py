import pathlib
import yara

from pprint import pprint
from exlib.settings import osenv


from .rule.cid import CID
from .rule.domain import Domain
from .rule.email import Email
from .rule.gps import GPS
from .rule.ip import IP
from .rule.path import Path
from .rule.phone import Phone
from .rule.url import URL
from .rule.ssl import SSL

from exlib.concurrent.context import WorkerResult
from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)  


class InfoleakPattern:
    def __init__(self, pattern, begin=False, end=False):
        self.pattern = pattern
        self.begin = begin
        self.end = end

    def __str__(self):
        return f"{self.pattern}{'^' if self.begin else ''}{'$' if self.end else ''}"
    
    def __repr__(self):
        return f"InfoleakPattern({self.pattern}, begin={self.begin}, end={self.end})"

    def __eq__(self, other):
        return self.pattern == other.pattern and self.begin == other.begin and self.end == other.end

    def __hash__(self):
        return hash((self.pattern, self.begin, self.end))
    
class InfoleakWhitelist:
    def __init__(self, type_name, data_path):

        self.filepath = data_path / type_name / 'whitelist.txt'
        self.whitelist = set()

        if self.filepath.is_file():
            with self.filepath.open('r') as f:
                for line in f.readlines():
                    line = line.strip()
                    if not line:
                        continue
                    if line.startswith('#'):
                        continue
                    
                    begin = False
                    end = False
                    if line.startswith('^'):                    
                        line = line[1:]
                        begin = True
                    if line.endswith('$'):
                        line = line[:-1]
                        end = True

                    self.whitelist.add(InfoleakPattern(line, begin=begin, end=end))

    def __contains__(self, string):
        string = string.lower() # ignore case always

        for p in self.whitelist:
            if p.begin and p.end:
                if p.pattern == string:
                    return True
            elif p.begin and string.startswith(p.pattern):
                return True
            elif p.end and string.endswith(p.pattern):
                return True
            elif p.pattern in string:
                return True
            
        return False

    def __str__(self):
        return str(self.whitelist)

    def __repr__(self):
        return f"InfoleakWhitelist({self.filepath}, {self.whitelist})"

def scan(context, **kwargs):    
    data_path = osenv.appdata_path() / "resource" / "infoleaks"
        
    try:        
        rules = yara.load(str(data_path / "rules.dat"))
        
        db_handles = dict(cid = CID(), 
                        domain = Domain(),
                        email = Email(),
                        gps = GPS(),
                        ip = IP(),
                        path = Path(),
                        phone = Phone(),
                        ssl = SSL(),
                        url = URL())

        whitelist_table = { name : InfoleakWhitelist(name, data_path) for name in db_handles }
    except:
        log.exception(f"failed to load rules from {data_path}")
        return -1

    result = {}

    subfiles = context.metadata.get('subfiles', None)
    if not subfiles:
        return None

    for checksum, filedata in subfiles.items():
        filepath = context.version_path / filedata['filepath']

        blacklist = {}
        if osenv.get_setting('INFOLEAK_SCAN_ALL', "no") != 'yes':
            filetype = filedata.get('filetype', "")
            if not filetype or not filetype.startswith(("code", "shared", "javaclass", "octet-stream", "executable", "kernelmod", "linux", "pe", "relocatable", "binary")):
                blacklist['path'] = True
                blacklist['domain'] = True
                blacklist['ip'] = True

        _all_infoleaks = {}
        with filepath.open('rb') as f:
            matches = rules.match(data=f.read())
            for m in matches:
                group = m.tags[0] if m.tags else m.rule
                if blacklist.get(group, False):
                    continue

                for pattern in m.strings:
                    for instance in pattern.instances:                                                     
                        offset=instance.offset                            
                        length=instance.matched_length
                        text = instance.matched_data.decode('latin-1')
                        _all_infoleaks.setdefault(group, {})
                        _all_infoleaks[group][offset] = dict(rule=m.rule, length=length, text=text, pattern=str(pattern), meta=m.meta, tags=m.tags)
        
        infoleaks = {}

        abs_path_only = (osenv.get_setting('INFOLEAK_ABSPATH_ONLY', "yes") == 'yes')

        for group,_infoleaks in _all_infoleaks.items():            
            _end = 0
            for offset, leak in sorted(_infoleaks.items()):
                try:
                    text = leak['text']

                    # log.debug(f"calculating {text}, offset: {offset}, previous end: {_end}")

                    if offset < _end:
                        # log.debug(f"ignored {text}, offset: {offset}, _end: {_end}")                        
                        continue

                    length = leak['length']
                    _end = offset + length
                    rule = leak['rule']

                    if group == "path" and abs_path_only and 'abs' not in rule:
                        # log.debug(f"ignored relative path: {rule}, {text}")
                        continue

                    if text in infoleaks:
                        infoleaks[text]['offset'].add(offset)
                        continue

                    if group in whitelist_table and text in whitelist_table[group]:
                        # log.debug(f"whitelist ignored: {text}")
                        continue

                    fc = db_handles.get(group, None)
                    if fc:
                        reference = fc.get_info(rule, text) or {}

                        if reference:
                            leak.update(group=group, reference=reference, offset={offset,})                        
                            infoleaks[text] = leak                        

                except:
                    log.exception(f"failed to handle {rule}: {text}, {offset}/{length}")

        for leak in infoleaks.values():
            leak['offset'] = ",".join([str(x) for x in leak['offset'] ])
            result.setdefault(checksum, [])
            result[checksum].append(leak)

    return WorkerResult(context, result)


if __name__=="__main__":    
    import yara
    import click
    import pathlib

    from pprint import pprint

    @click.group()
    def app():
        pass

    @app.command()
    @click.argument('filepath', type=click.Path(path_type=pathlib.Path, exists=True))
    def scan(filepath):        
        try:
            # rules = yara.compile(filepath='/share/digitaltwins-ng/yara/infoleaks/ssl.yar')

            data_path = osenv.appdata_path() / "resource" / "infoleaks"        
            rules = yara.load(str(data_path / "rules.dat"))            
        except:
            log.exception(f"failed to load rules from {data_path}")
            return -1

        _all_infoleaks = {}
        with filepath.open('rb') as f:
            matches = rules.match(data=f.read())
            for m in matches:
                print(m)
                for pattern in m.strings:
                    for instance in pattern.instances:                                                     
                        offset=instance.offset                            
                        length=instance.matched_length
                        text = instance.matched_data.decode('latin-1')
                        group = m.tags[0] if m.tags else m.rule
                        _all_infoleaks.setdefault(group, {})
                        _all_infoleaks[group][offset] = dict(rule=m.rule, length=length, text=text, pattern=str(pattern), meta=m.meta, tags=m.tags)

        pprint(_all_infoleaks)
    
    app()

