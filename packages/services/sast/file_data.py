import re
import magic
import pickle
import pathlib
import subprocess

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class FileData:
    def __init__(self, record, root_path):
        self.root_path = root_path
        self._record = record

    @staticmethod
    def find_substring(a_string, *matches, ignore_case=False):        
        if ignore_case:
            a_string = a_string.lower()

            for match in matches:
                match = match.lower()
                if match in a_string:
                    return match
            return None
        else:
            for match in matches:
                if match in a_string:
                    return match
            return None

    def __getattr__(self, key):
        if key in self._record:
            return self._record[key]
        else:
            return self.metadata.get(key, None)

    @property
    def abs_filepath(self):
        return self.root_path / self._record['filepath']

    @property
    def record(self):
        return self._record

    @property
    def metadata(self):
        if 'metadata' not in self._record:
            self._record['metadata'] = {}
        return self._record.get('metadata')

    @property
    def hashes(self):
        return self.metadata.get("hashes", {})

    @property
    def strings(self):
        return self.metadata.get("strings", [])

    @property
    def candicates(self):
        return self._record.get("candicates", [])

    @property
    def components(self):
        return self._record.get("components", [])


    @property
    def malwares(self):
        return self._record.get("malwares", [])

    @property
    def infoleaks(self):
        return self._record.get("infoleaks", [])

    @property
    def symbols(self):
        return [ r for r in self.metadata.get("symbols", []) if r['name'] and r.get('visibility', 'default') not in ('hidden', ) and r.get('versioning_resolved_name', None) ]

    @property
    def needed(self):
        return self.metadata.get("needed", [])


    @property
    def functions(self):
        return [ r['name'] for r in self.symbols if r['type']=='func' and r['size']>0 ]

    @property
    def varnames(self):
        return [ r['name'] for r in self.symbols if r['type']=='object' and r['size']>0 ]

    @property
    def libs(self):
        return [ r['name'] for r in self.needed ]

    @property
    def ex_functions(self):
        if 'ex_functions' in self.metadata:
            return self.metadata['ex_functions']
        
        return [ r['name'] for r in self.symbols if r['type']=='func' and r['size']==0 ]
    
    @property
    def ex_varnames(self):
        # will never be true
        if 'ex_varnames' in self.metadata:
            return self.metadata['ex_varnames']

        return [ r['name'] for r in self.symbols if r['type']=='object' and r['size']==0 ]

    @property
    def ex_files(self):
        return [ r['name'] for r in self.symbols if r['type']=='file' ]

    @property
    def filetype(self):
        return self.metadata.get('type', '')

    @property
    def fileinfo(self):
        return self._record.get('fileinfo', '')

    @property
    def filemime(self):
        return self._record.get('filemime', '')

    @property
    def labels(self):
        return self._record.get('labels', self.metadata.get('labels', []))

    @property
    def oss_percent(self):
        return self._record.get('oss_percent', None)

    @property
    def filepath_r(self):
        return self._record.get('filepath_r', [])

    @property
    def filepath_p(self):
        return self._record.get('filepath_p')

    @property
    def is_binary(self):
        return self.filetype in ('shared', 'executable')

    @property
    def unpacked_relative_files(self):
        return self._record.get('unpacked_relative_files', None)

    @property
    def extracted_files(self):
        return self._record.get('extracted_files', None)

    @property
    def subfiles(self):
        if 'subfiles' not in self._record:
            self._record['subfiles'] = {}
            
            extracted = self.unpacked_relative_files or self.extracted_files
            if extracted:            
                for p, c in extracted.items():
                    self._record['subfiles'].setdefault(c, p)
        return self._record['subfiles']
        

    @staticmethod
    def meta_args(metadata, *filters):
        meta = {}
        
        for ft in filters:
            v = metadata.get(ft, None)
            if v:
                meta[ft] = v
        return meta

    def __str__(self):
        return f"FileData({self.filepath},{self.filetype},{self.size})"

    def __repr__(self):
        return self.__str__()

if __name__ == "__main__":

    for path in ("AllVulns32_", "busybox1.35_", "demo.so_"):
    # for path in ("AllVulns32_", ):
        filepath = pathlib.Path("/share/simple-test/output") / path / "aggregate.pkl"
        with filepath.open('rb') as f:
            records = pickle.load(f)

            for checksum, record in records.items():
                log.debug(f"\n{filepath}")
                filedata = FileData(record, filepath.parent)                
                log.debug(f"hashes: {filedata.hashes}")
                log.debug(f"filetype: {filedata.filetype}, binary={filedata.is_binary}")
                log.debug(f"strings: {filedata.strings[:10]}")
                log.debug(f"functions: {filedata.functions[:10]}")
                log.debug(f"varnames: {filedata.varnames[:10]}")
                log.debug(f"libs: {filedata.libs}")
                log.debug(f"ex_functions: {filedata.ex_functions[:10]}")
                log.debug(f"ex_varnames: {filedata.ex_varnames[:10]}")
                log.debug(f"ex_files: {filedata.ex_files}")
                log.debug(f"symbols: {filedata.symbols[:10]}")

                log.debug(f"filepath: {filedata.filepath}")
                log.debug(f"labels: {filedata.labels}")
                log.debug(f"size: {filedata.size}")
                log.debug(f"elf_type: {filedata.elf_type}")
                log.debug(f"security: {filedata.security}")
                log.debug(f"version: {filedata.version}")
                log.debug(f"machine_name: {filedata.machine_name}")
                log.debug(f'meta_args: {filedata.meta_args("strings", "functions", "varnames", "ex_functions", "ex_varnames", "ex_files", "needs")}')
                








