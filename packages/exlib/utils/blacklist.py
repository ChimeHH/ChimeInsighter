import re
import pathlib
import magic
import fnmatch
from pprint import pprint

from exlib.settings import osenv
from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class Blacklist:
    ANY = '*'
    def __init__(self, filepath=pathlib.Path('/usr/local/share/appdata/ast_blacklist.ini')):
        self.currentRules = [self.ANY]
        self.rules = {self.ANY: { self.ANY: []}}
        
        if not filepath.is_file():
            return

        with filepath.open('r') as f:
            for no, line in enumerate(f):
                line = line.strip()
                if not line:
                    continue

                if line.startswith('['):
                    m = re.fullmatch(r'\[(.+)\]', line)
                    if not m:
                        log.error(f"invalid line {no}: {line}")
                        break
                    self.addRule(m.group(1))
                elif not line.startswith(('-', '#')):
                    self.addPattern(line)

    def addRule(self, rule):
        self.currentRules = []        
        if ':' in rule:
            category, features = rule.split(':')
        else:
            category = rule.strip()
            features = self.ANY

        if not category:
            category = self.ANY
        if not features:
            features = self.ANY

        self.rules.setdefault(category, {})

        for feature in features.split(','):
            feature = feature.strip()
            if feature:
                self.rules[category].setdefault(feature, [])
                self.currentRules.append((category, feature))

    def addPattern(self, pattern):
        typ = ""
        if pattern.startswith("%"):
            typ = "re"
            pattern = pattern.strip("%")
        elif '*' in pattern:
            typ = "fn"
        elif pattern.startswith('^') and pattern.endswith('$'):
            typ = 'fm'
            pattern = pattern.lstrip('^').rstrip('$')
        elif pattern.startswith('^'):
            typ = "ss"
            pattern = pattern.lstrip("^")
        elif pattern.endswith('$'):
            typ = "es"
            pattern = pattern.rstrip("$")
        
        for category, feature in self.currentRules:
            self.rules[category][feature].append((typ, pattern))

    def showRules(self, category=None, feature=None):
        if category:
            if feature:
                print(f"rules {category} / {feature}:")
                pprint(self.rules.get(category, {}).get(feature, []), indent=4)
            else:
                print(f"rules {category}:")
                pprint(self.rules.get(category, {}), indent=4)
        else:
            print(f"rules:")
            pprint(self.rules, indent=4)

    def getRule(self, category, feature):
        return self.rules.get(self.ANY, {}).get(self.ANY, []) + self.rules.get(category, {}).get(self.ANY, []) + self.rules.get(category, {}).get(feature, [])

    def match(self, feature, filepath=None, filetype=None, filemime=None):
        if osenv.get_setting('DISABLE_BLACKLIST', 0): # by default, 0 
            return False

        # Check path
        path = str(filepath)
        rules = self.getRule('path', feature)
        
        for typ, pattern in rules:
            if typ == 'fn' and fnmatch.fnmatch(path, pattern):  
                return True
            
            elif typ == 're' and re.match(pattern, path):
                return True

            elif typ == 'fm' and pattern == path:
                return True

            elif typ == 'ss' and path.startswith(pattern):
                return True

            elif typ == 'es' and path.endswith(pattern):
                return True

            elif typ == '' and pattern in path:
                return True

        # Check filetype
        if filetype:
            for _, pattern in self.getRule('type', feature):
                if pattern in filetype:
                    return True

        # Check filemime    
        if filemime:
            for _, pattern in self.getRule('mime', feature):
                if pattern in filemime:
                    return True    

        return False


if __name__=="__main__":
    import click

    @click.group()
    def app():
        pass

    @app.command()
    @click.argument('filepath', type=click.Path(path_type=pathlib.Path, exists=False))
    def check(filepath):
        bl = Blacklist()
        bl.showRules()

        if filepath.is_file():
            filetype = magic.from_file(str(filepath))
            filemime = magic.from_file(str(filepath), mime=True)
            log.debug(f"input file type={filetype}, filemime={filemime}")
        else:
            filetype = None
            filemime = None
        
        for feature in ('zeroday', 'infoleak', 'public', 'infoleak.domain', 'infoleak.xml', 'infoleak.path'):
            if bl.match(feature, filepath, filetype=filetype, filemime=filemime):
                print(f"{feature}, {filepath}: 黑名单路径")
            else:
                print(f"{feature}, {filepath}: 非黑名单路径")
    
    app()

        
















