import pathlib
import json
import re
from exlib.log.logger import MyLogger

log = MyLogger.getLogger(__package__)

class ComplianceRule:
    def __init__(self, name, functions, state, description, languages, source):
        self.name = name
        self.functions = functions
        self.state = state
        self.description = description
        self.languages = languages
        self.source = source
        self.is_prohibited = self.compute_prohibit_status()

    def compute_prohibit_status(self):
        # 定义禁止使用的关键字
        prohibit_keywords = [
            "shall not be used", "shall not use",
            "should not be used", "should not use",
            "must not be used", "must not use",
            "prohibited", "not allowed",
            "do not use", "avoid using",
            "deprecated", "unsafe", "insecure"
        ]

        # 定义正则表达式模式列表
        patterns = [
            re.compile(r'\buse\s+\S+\s+instead\b', re.IGNORECASE),
            re.compile(r'\breplace\s+with\b', re.IGNORECASE),
            re.compile(r'\bconsider\s+using\b', re.IGNORECASE),
            re.compile(r'\bprefer\b', re.IGNORECASE)
        ]

        # 检查描述中是否包含任何关键字或匹配任何模式
        description_lower = self.description.lower()
        if any(keyword in description_lower for keyword in prohibit_keywords):
            return True
        if any(pattern.search(description_lower) for pattern in patterns):
            return True
        
        return False

    def __repr__(self):
        return (f"ComplianceRule(name={self.name}, functions={self.functions}, "
                f"state={self.state}, description={self.description}, "
                f"languages={self.languages}, source={self.source}, "
                f"is_prohibited={self.is_prohibited})")


class ComplianceTable:
    def __init__(self, directory=pathlib.Path('/usr/local/share/appdata/compliance')):
        self.directory = directory
        self.rules_data = {}
        self.load_all_files()

    def load_all_files(self):
        for file_path in self.directory.glob('compliance-*.json'):
            self.load_from_file(file_path)

    def load_from_file(self, file_path):
        try:
            with file_path.open('r', encoding='utf-8') as file:
                data = json.load(file)
                for rule_set_name, rule_list in data.items():
                    if rule_set_name not in self.rules_data:
                        self.rules_data[rule_set_name] = {}  # 初始化规则集合
                    for entry in rule_list:
                        name = entry['name']
                        if name in self.rules_data[rule_set_name]:
                            log.warning(f"Duplicate rule '{name}' in set '{rule_set_name}' found in file {file_path}. Skipping.")
                            continue
                        self.rules_data[rule_set_name][name] = entry  # 存储原始数据
        except (IOError, json.JSONDecodeError) as e:
            log.exception(f"Failed to load file {file_path}: {e}")

    def query(self, rule_set_name, name):
        rule_entry = self.rules_data.get(rule_set_name, {}).get(name)
        if rule_entry:
            return ComplianceRule(
                name=rule_entry['name'],
                functions=rule_entry.get('functions', []),
                state=rule_entry.get('state', ''),
                description=rule_entry.get('description', ''),
                languages=rule_entry.get('languages', []),
                source=rule_entry.get('source', '')
            )
        return None

if __name__ == "__main__":
    compliance_lookup = ComplianceTable()

    # 测试查询存在的规则
    rule_set_name = 'AUTOSAR'
    rule_name = 'A18-5-1'
    rule = compliance_lookup.query(rule_set_name, rule_name)
    assert rule is not None and rule.is_prohibited
    log.info("Existing prohibited rule query test passed.")

    # 测试查询不存在的规则
    rule_set_name = 'CERT-C'
    rule_name = 'Non-Existing-Rule'
    rule = compliance_lookup.query(rule_set_name, rule_name)
    assert rule is None
    log.info("Non-existing rule query test passed.")
