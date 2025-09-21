import pathlib
import json

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class License:
    def __init__(self, abbreviation, full_name, summary, usage_suggestion):
        self.abbreviation = abbreviation
        self.full_name = full_name
        self.summary = summary
        self.usage_suggestion = usage_suggestion

    def __repr__(self):
        return f"License(abbreviation={self.abbreviation}, full_name={self.full_name}, summary={self.summary}, usage_suggestion={self.usage_suggestion})"

class OssTable:
    def __init__(self, directory=pathlib.Path('/usr/local/share/appdata/oss')):
        self.directory = directory
        self.licenses = {}
        self.load_all_files()

    def load_all_files(self):
        for file_path in self.directory.glob('licenses-*.json'):
            self.load_from_file(file_path)

    def load_from_file(self, file_path):
        try:
            with file_path.open('r', encoding='utf-8') as file:
                data = json.load(file)
                lang = file_path.stem.split('-')[-1]  # 提取语言部分
                for license_info in data.values():
                    abbreviation = license_info['abbreviation']
                    if abbreviation not in self.licenses:
                        self.licenses[abbreviation] = {}
                    # 忽略 number 项
                    license_data = {k: v for k, v in license_info.items() if k != 'number'}
                    self.licenses[abbreviation][lang] = license_data
        except (IOError, json.JSONDecodeError) as e:
            log.exception(f"Failed to load file {file_path}: {e}")

    def query(self, abbreviation, default_lang='cn'):
        license_data = self.licenses.get(abbreviation, None)
        if license_data:
            lang_data = license_data.get(default_lang, license_data.get('en', {}))
            if lang_data:
                return License(
                    abbreviation=abbreviation,
                    full_name=lang_data.get('fullName', ''),
                    summary=lang_data.get('summary', ''),
                    usage_suggestion=lang_data.get('usageSuggestion', '')
                )
        return None

if __name__ == "__main__":
    oss_table = OssTable()

    # 测试查询存在的许可证
    license = oss_table.query('BSD-2-Clause')
    assert license is not None
    assert license.abbreviation == 'BSD-2-Clause'
    print("Existing license query test passed.")

    # 测试查询不存在的许可证
    license = oss_table.query('Non-Existing-License')
    assert license is None
    print("Non-existing license query test passed.")
