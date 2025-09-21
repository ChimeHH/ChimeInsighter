import hashlib


def checksum(*lines, method='md5'):    
    m = getattr(hashlib, method)()
    for d in lines:
        if isinstance(d, bytes):
            m.update(d)
        else:
            m.update(d.encode())
    return m.hexdigest()

def checksum_file(filepath, method='md5'):
    with filepath.open('rb') as f:
        return checksum(f.read(), method=method)

def hashes(*lines):    
    md5 = hashlib.md5()
    sha256 = hashlib.sha256()
    sha1 = hashlib.sha1()
    for d in lines:
        if isinstance(d, bytes):
            md5.update(d)
            sha1.update(d)
            sha256.update(d)
        else:
            de = d.encode()
            md5.update(de)
            sha1.update(de)
            sha256.update(de)
    return dict(md5=md5.hexdigest(), sha1=sha1.hexdigest(), sha256=sha256.hexdigest())

def hashes_file(filepath):
    with filepath.open('rb') as f:
        return hashes(f.read())

def md5sum(*lines):
    return checksum(*lines, method='md5')
def sha1sum(*lines):
    return checksum(*lines, method='sha1')
def sha256sum(*lines):
    return checksum(*lines, method='sha256')

def md5sum_file(filepath):
    return checksum_file(filepath, method='md5')
def sha1sum_file(filepath):
    return checksum_file(filepath, method='sha1')
def sha256sum_file(filepath):
    return checksum_file(filepath, method='sha256')


if __name__=='__main__':
    import pathlib
    print(md5sum('digitaltwins@123'))
    print(sha1sum('digitaltwins@123'))
    print(sha256sum('digitaltwins@123'))

    print(md5sum_file(pathlib.Path(__file__)))
    print(sha1sum_file(pathlib.Path(__file__)))
    print(sha256sum_file(pathlib.Path(__file__)))
    
    print(hashes_file(pathlib.Path(__file__)))