import re
import magic
import pathlib
import subprocess
from exlib.utils.stringex import find_lower_words

MINIMUM_STRING_LENGTH = 3

class MRulePrecision:
    CHECKSUM =  10
    PATTER = 9
    SCORE = 8


def get_file_size(filepath):
    return filepath.stat().st_size

def guess_file_mime(filepath, mime=True):  
    abs_path = filepath.resolve()
    return magic.from_file(abs_path, mime=mime)

def guess_application_meta(filepath):
    metadata = dict()

    abs_path = filepath.resolve()
    filemime = guess_file_mime(filepath)
    fileinfo = magic.from_file(abs_path, mime=False)

    if 'boot executable' in fileinfo:
        metadata['type'] = 'image'
    elif 'executable' in fileinfo:
        metadata['type'] = 'executable'
    elif 'shared' in fileinfo:
        metadata['type'] = 'shared'
    elif fileinfo=='data' and filemime=='application/octet-stream':
        metadata['type'] = 'octet-stream'
    else:
        metadata['type'] = None

    matches = find_lower_words(fileinfo, "ELF", "PE", "kernel", "Ubuntu", "Centos", "Debian", "Android", "Linux", "Mac", "Windows", "dynamically", "statically")
    metadata['labels'] = list(set(matches))

    if 'elf' in metadata['labels']:
        if 'dynamically' in metadata['labels']:
            metadata['elf_type'] = ['dynamic']
        elif 'statically' in metadata['labels']:
            metadata['elf_type'] = ['static']

    m = re.search(r'version (\d[\d.-]+\d)', fileinfo, flags=re.I)
    if m:
        metadata['version'] = m.group(1)

    if re.search(r'-64|64-?bit|[a-z]64', fileinfo, re.I):
        metadata['bits'] = "64"
    elif re.search(r'-32|32-?bit|[a-z]32|[a-z]86', fileinfo, re.I):
        metadata['bits'] = 32

    if "LSB" in fileinfo:
        metadata["endian"] = 'little'
    elif "MSB" in fileinfo:
        metadata["endian"] = 'big'

    matches = find_lower_words(fileinfo, 'aarch64', 'alpha', 'amd64', 'arm', 'avr', 'cris', 'i386', 'ia64', 'm68k', 'mips', 'mips64', 'msp430', 'none', 'powerpc', 'powerpc64', 'riscv32', 'riscv64', 's390', 'sparc', 'sparc64', 'thumb', 'vax')
    if matches:
        metadata['machine_name'] = matches[0]

    if metadata['type'] in ('executable', 'shared', 'octet-stream') and "kernel" not in metadata['labels']:        
        cmd = 'strings -n 3 -a "{}"'.format(abs_path)
        output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
        readable_strings = output.decode().split('\n')

        metadata['strings'] = [ s for s in readable_strings if ('@@' not in s and len(s)>MINIMUM_STRING_LENGTH) ]
        metadata['symbols'] = [ {'binding': 'global_symbol', 'name': s.split("@@")[0], 'versioning_resolved_name': s.split("@@")[1], 'size': 0, 'type': 'func', 'visibility': 'default'} for s in readable_strings if ('@@' in s and re.match(r'^[a-z]\w*@@\w+$', s))]

    return metadata

def guess_linux_kernel_version(*strings, vermagic=None, fileinfo=None):
    for s in strings:
        m = re.search(r'Linux version.+ (\d\.\d+\.\d+)\)$|Linux version (\d\.\d+\.\d+)|/linux-(\d\.\d+\.\d+)/(lib|include)', s, flags=re.I)        
        if m:
            return MRulePrecision.PATTER, m.group(1) or m.group(2) or m.group(3), m.group(0)

    if vermagic:
        m = re.search(r'(?:^|[^\d])(\d\.\d+\.\d+)', vermagic, flags=re.I)
        if m:
            return MRulePrecision.PATTER-1, m.group(1), m.group(0)

    if fileinfo:
        m = re.search(r'version (\d\.\d+\.\d+)', fileinfo, flags=re.I)        
        if m:
            return MRulePrecision.PATTER-2, m.group(1), m.group(0)

    return None,None,None

def guess_text_meta(filepath):
    metadata = dict()

    abs_path = filepath.resolve()


if __name__=="__main__":
    from pprint import pp

    filepathes = [
                  '/share/simple-test/output/AllVulns32.so',
                  '/share/simple-test/output/vmlinuz-5.4.0-149-generic',
                  '/share/simple-test/output/demo.c',]
    strings = ['Linux version 4.4.217 (guestuser@ip-10-134-10-197)',
                'Linux version 5.4.0-149-generic (buildd@lcy02-amd64-041) (gcc version 9.4.0 (Ubuntu 9.4.0-1ubuntu1~20.04.1)) #166-Ubuntu SMP Tue Apr 18 16:51:45 UTC 2023 (Ubuntu 5.4.0-149.166-generic 5.4.233)',
                '/build/linux-i3qvTV/linux-5.4.0/lib/crypto',
                '/build/linux-i3qvTV/linux-5.4.0/include/linux/unaligned',]

    for filepath in filepathes:
        size = get_file_size(pathlib.Path(filepath))
        mime = guess_file_mime(pathlib.Path(filepath))
        print(f"{filepath} {size} {mime}")
        if mime.startswith("application/"):
            metadata = guess_application_meta(pathlib.Path(filepath))
            pp(metadata)

    precision, version = guess_linux_kernel_version(strings)
    print(precision, version)





