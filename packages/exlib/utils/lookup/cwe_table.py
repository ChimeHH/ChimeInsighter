import pathlib
import json
import re
import glob

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class CweInfo:
    def __init__(self, cwe_id, name, description):
        self.cwe_id = f"CWE-{cwe_id}"
        self.name = name
        self.description = description

    def __repr__(self):
        return f"CweInfo(cwe_id={self.cwe_id}, name={self.name}, description={self.description})"

class CweTable:
    def __init__(self, directory=pathlib.Path('/usr/local/share/appdata/cwe')):
        self.directory = directory
        self.cwe_data = {}
        self.load_from_file()

    def load_from_file(self):
        file_pattern = str(self.directory / 'cwe-*.json')
        for file_path in glob.glob(file_pattern):
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                    self.cwe_data.update(data)
            except (IOError, json.JSONDecodeError) as e:
                log.exception(f"Failed to load file {file_path}: {e}")

    def query(self, cwe_id):
        cleaned_cwe_id = re.sub(r'^CWE\s*[-_]?\s*', '', cwe_id, flags=re.IGNORECASE)
        log.debug(f"Querying CWE {cleaned_cwe_id}")
        cwe_info = self.cwe_data.get(cleaned_cwe_id, None)
        log.debug(f"Got CWE info: {cwe_info}")
        if cwe_info:
            return CweInfo(
                cwe_id=cleaned_cwe_id,
                name=cwe_info.get('Name', ''),
                description=cwe_info.get('Description', '')
            )
        return None

if __name__ == "__main__":
    from pprint import pprint
    cwe_table = CweTable()
    # pprint(cwe_table.cwe_data, indent=4)
    cwe_info = cwe_table.query('CWE-1004')
    print(cwe_info)
    assert cwe_info is not None
    assert cwe_info.cwe_id == 'CWE-1004'
    log.info("Existing CWE query test passed.")

    cwe_info = cwe_table.query('CWE-9999')
    assert cwe_info is None
    log.info("Non-existing CWE query test passed.")
