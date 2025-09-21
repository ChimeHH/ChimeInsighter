import hashlib
import pathlib

RULE_TEMPL = '''
rule FULLNAME : SHORTNAME
{
    meta:
        description = "ORIGINAL_PASSWORD"
        threat_level = 3
        in_the_wild = true

    strings:
        $sha1_string = "SHA1_STRING" nocase
        $sha1_bytes = { SHA1_BYTES }         
        
        $sha256_string = "SHA256_STRING" nocase
        $sha256_bytes = { SHA256_BYTES }        

        $md5_string = "MD5_STRING" nocase
        $md5_bytes = { MD5_BYTES }

    condition:
        any of them
}
'''

def calc_password_hash(password):
    data = password.encode('latin-1')    
    hashes = []

    for f in ('sha1', 'sha256', 'md5'):
        m = getattr(hashlib, f)()
        m.update(data)
        hashes.append((m.hexdigest(), " ".join("%02x" % b for b in m.digest())))

    return hashes
    

def generate_rule(n, password):
    hashes = calc_password_hash(password)
    fullname = f"password{n}"
    shortname = f"p{n}"

    rule = RULE_TEMPL
    rule = rule.replace('FULLNAME', fullname)
    rule = rule.replace('SHORTNAME', shortname)
    rule = rule.replace('ORIGINAL_PASSWORD', password.replace('\\', '\\\\'))

    rule = rule.replace('SHA1_STRING', hashes[0][0])
    rule = rule.replace('SHA1_BYTES', hashes[0][1])
    rule = rule.replace('SHA256_STRING', hashes[1][0])
    rule = rule.replace('SHA256_BYTES', hashes[1][1])
    rule = rule.replace('MD5_STRING', hashes[2][0])
    rule = rule.replace('MD5_BYTES', hashes[2][1])

    return rule


if __name__=="__main__":
    from pprint import pprint
    
    filepath = pathlib.Path(__file__).parent / "passwords.txt"
    with filepath.open('r') as f:
        doc = f.readlines()

    filepath = pathlib.Path(__file__).parent / "passwords.rules"
    with filepath.open('w') as f:
        for n, line in enumerate(doc):        
            password = line.strip()
            if not password or password.startswith('//'):
                continue
            f.write(generate_rule(n, password))
