from .password_db.generate_rule import generate_rule

import pathlib
import yara

class PassowrdHash:
    def __init__(self, password_hash, hash_type, original_password, offset=0):
        self.password_hash = password_hash if isinstance(password_hash, str) else password_hash.decode('latin-1')
        self.hash_type = hash_type
        self.original_password = original_password
        self.offset = offset


class PasswordIdentifier:
    def __init__(self):
        passwords_filepath = pathlib.Path(__file__).parent / 'password_db' / 'passwords.txt'
        rules_filepath = pathlib.Path(__file__).parent / 'password_db' / 'passwords.rules'
        compiled_filepath = pathlib.Path(__file__).parent / 'password_db' / 'passwords.db'

        try:
            self.rules = yara.load(str(compiled_filepath))
        except:
            self.generate_rules(passwords_filepath, rules_filepath, compiled_filepath)
            self.rules = yara.load(str(compiled_filepath))

    def generate_rules(self, passwords_filepath, rules_filepath, compiled_filepath):
        with passwords_filepath.open('r') as f:
            doc = f.readlines()

        with rules_filepath.open('w') as f:
            for n, line in enumerate(doc):        
                password = line.strip()
                if not password or password.startswith('//'):
                    continue
                f.write(generate_rule(n, password))

        rules = yara.compile(filepath=str(rules_filepath))
        rules.save(str(compiled_filepath))

    def analyze(self, file_path):
        found_password_hashes = []
        with open(file_path, 'rb') as f:
            matches = self.rules.match(data=f.read())
            for match in matches:
                tags = match.tags
                meta = match.meta
                strings = match.strings
                
                for string in match.strings:
                    for instance in string.instances:
                        password_hash = instance.matched_data if isinstance(instance.matched_data, str) else instance.matched_data.decode('latin-1')                        
                        found_password_hashes.append(dict(text=password_hash, type=string.identifier[1:].split('_')[0], password=meta["description"], offset=instance.offset))

        return found_password_hashes


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('file_path', help='the file path to search in hashed passwords')
    args = parser.parse_args()
    password_identifier = PasswordIdentifier()
    hashes = password_identifier.analyze(args.file_path)
    for password_hash in hashes:
        print(password_hash.__dict__)
