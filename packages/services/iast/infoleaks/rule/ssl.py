import re

from exlib.settings import osenv

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


from exlib.utils.abstract import Singleton

class SSL(metaclass=Singleton):
    def __init__(self, *args, **kwargs):
        pass

    def get_info(self, rule, original):
        original = original.strip()
        if original.startswith("-"):
            begin = re.sub(r"-+|BEGIN ", "", original.split("\n")[0])
            return dict(type=begin,)
        else:
            return dict(type=original.split(" ")[0])



if '__main__' == __name__:
    import yara
    import click
    import pathlib

    @click.group()
    def app():
        pass

    @app.command()
    @click.argument('filepath', type=click.Path(path_type=pathlib.Path, exists=True))
    def scan(filepath):
        rules = yara.compile(filepath='/share/digitaltwins-ng/yara/infoleaks/ssl.yar')
        # data_path = osenv.appdata_path() / "resource" / "infoleaks"        
        # rules = yara.load(str(data_path / "rules.dat"))   

        with filepath.open('rb') as f:
          matches = rules.match(data=f.read())
          for m in matches:
            print(m)
            for s in m.strings:
                for si in s.instances:
                    print(f"{si.offset}:{si.matched_length} {si.plaintext()}")
    
    app()