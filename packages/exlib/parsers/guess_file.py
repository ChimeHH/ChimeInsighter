import os
import pathlib
import traceback
from pprint import pprint

from .filemeta import get_file_size, guess_file_mime, guess_application_meta, guess_linux_kernel_version
from .parsing_code import parse_code_file, is_pyx, cxxdemangle_ctags, javaclass_ctags

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

def _guess1(rootdir, pathname, data):
    filepath = rootdir / pathname
    
    log.debug(f"guess1: {filepath}")

    #note, shall only be called on files: not unpacked, not extracted, no strings, no symbols
    
    if data['filemime'].startswith('application/'): # binary file with only hashes
        data['metadata'].update(guess_application_meta(filepath))
    elif data['filemime'].startswith('text/'): # text file with only hashes
        data['metadata'].update(parse_code_file(filepath, runtime=True ))

def _guess2(rootdir, pathname, data):
    filepath = rootdir / pathname
    
    log.debug(f"guess2: {filepath}")

    metadata = data['metadata']

    type_str = ','.join(data.get('labels', []) + metadata.get('elf_type', []) + [data['fileinfo'], ]).lower()                
    if 'linux' in type_str and 'kernel' in type_str:        
        strings = metadata.get('strings', [])
        vermagic = metadata.get('Linux kernel module', {}).get('vermagic', '')
        if 'mod_unload' in vermagic or 'static' in metadata.get('elf_type', []):
            metadata['type'] = 'kernelmod'
        else:
            metadata['type'] = 'linux'

        metadata['version'] = metadata.get('header', {}).get('version', None) # note, this is the configuration file, but not elf actually
        if not metadata['version']:
            metadata['mrule_precision'], metadata['version'], promote_string = guess_linux_kernel_version(*strings, fileinfo=data['fileinfo'], vermagic=vermagic)
            if promote_string:
                metadata['promote_strings'] = [promote_string, ]

    if 'java class' in data.get('labels', []):
        metadata['type'] = 'javaclass'
        metadata['lang'] = 'java'
        metadata['symbols'], metadata['classes'] = javaclass_ctags(metadata.get('classname', ""), metadata.get('methods', []), metadata.get('fields', []))

def _guess3(rootdir, pathname, data):
    filepath = rootdir / pathname
    
    log.debug(f"guess3: {filepath}")

    metadata = data['metadata']
    
    filetype = metadata.get('type', None)

    if (filetype in ('shared', 'relocatable', 'executable', 'octet-stream')) or ('pe' in data.get('labels', [])):
        if is_pyx(metadata.get('strings', [])):
            metadata['lang'] = 'python'

        else:
            if 'lang' not in metadata:
                metadata['lang'] = 'c'

            symbols = metadata.get('symbols', [])

            if isinstance(symbols, dict): # windows
                if 'type' not in metadata:
                    metadata['type'] = 'pe'

                exported = symbols.get('exported', [])
                imported = symbols.get('imported', {})
                symbols = [] # reset symbols before adding data

                for s in exported:
                    if isinstance(s, str):
                        symbols.append({'binding': 'global_symbol', 'name': s.split("@@")[0], 'versioning_resolved_name': s.split("@@")[-1], 'size': 1, 'type': 'func', 'visibility': 'default'} )
                    else:
                        log.warning(f'unexpected symbol {s} in {filepath}')

                for name, functions in imported.items():
                    symbols.append({'name': name, 'symbol_versions': []})
                    for s in functions:
                        if isinstance(s, str):
                            symbols.append({'binding': 'global_symbol', 'name': s, 'versioning_resolved_name': name, 'size': 0, 'type': 'func', 'visibility': 'default'} )
                        else:
                            log.warning(f'unexpected symbol {s} in {filepath}')
            
            metadata['symbols'], metadata['classes'] = cxxdemangle_ctags(filepath, symbols)
        
def _guess_mobile(rootdir, pathname, data):
    filepath = rootdir / pathname
    
    data.setdefault('labels', [])

    if has_labels(data['labels'], ('apk', 'ipa', 'appx')):
        return

    unpacked_files = data['unpacked_relative_files']

    is_mcode = 0
    is_class = 0
    total = 0
    for p in unpacked_files:        
        if p.name == 'MANIFEST.MF' and p.parent.name == 'META-INF':
            if 'jar' not in data['labels']:
                data['labels'].extend(['jar', 'MANIFEST'])  
                return

        total += 1
        if p.name.endswith(('.java', '.m', '.kt', '.swift')): # removed xml here, we will check xml only if it's a package of thes given languages
            is_mcode += 1
           
        elif p.name.endswith(('.class', '.dex')):
            is_class += 1

    if (is_mcode/total > 0.2):
        data['labels'].append('mcode')

    if (is_class/total > 0.2):
        data['labels'].append('jar')

def _guess_android(rootdir, pathname, data):
    filepath = rootdir / pathname

    unpacked_files = data['unpacked_relative_files']
    
    properties_to_find = ('ro.build.version.release', 'ro.build.display.id', 'ro.build.version.incremental', 'ro.build.version.sdk', 
                          'ro.system.build.id', 'ro.system.build.tags', 'ro.system.build.version.release', 'ro.system.build.version.sdk',
                          'ro.odm.build.id', 'ro.odm.build.version.incremental', 'ro.odm.build.version.release', 'ro.odm.build.version.sdk')


    build_prop = {} 

    for p in unpacked_files:        
        if p.name == 'build.prop':            
            with (rootdir / p).open('r', encoding='utf-8', errors='ignore') as f:  
                for line in f:  
                    if line.startswith(properties_to_find):  
                        key, value = line.strip().split('=', 1)  
                        build_prop[key] = value

            for k in ('ro.build.version.release', 'ro.odm.build.version.release', 'ro.system.build.version.release'):
                if k in build_prop:
                    data.setdefault('labels', [])
                    data['labels'].append('android')
                    metadata = data.setdefault('metadata', {})

                    metadata['build_prop'] = build_prop
                    metadata['version'] = build_prop[k]
                    metadata['type'] = 'androidimage'

                    return

def _guess_compressed(rootdir, pathname, data):
    filepath = rootdir / pathname

    # Supported File Extensions
    ANDROID_EXTS = ('.apk', '.xapk', '.apks', '.aab', '.aar',)
    IOS_EXTS = ('.ipa', '.dylib', '.a')
    WINDOWS_EXTS = ('.appx',)
    ZIP_EXTS = ('.zip',)

    APK_MIME = [
        'application/octet-stream',
        'application/vnd.android.package-archive',
        'application/x-zip-compressed',
        'binary/octet-stream',
        'application/java-archive',
        'application/x-authorware-bin',
    ]
    IPA_MIME = [
        'application/iphone',
        'application/octet-stream',
        'application/x-itunes-ipa',
        'application/x-zip-compressed',
        'application/x-ar',
        'text/vnd.a',
        'binary/octet-stream',
    ]
    ZIP_MIME = [
        'application/zip',
        'application/octet-stream',
        'application/x-zip-compressed',
        'binary/octet-stream',
    ]
    APPX_MIME = [
        'application/octet-stream',
        'application/vns.ms-appx',
        'application/x-zip-compressed',
    ]
    
    mime = data['filemime']
    filename = filepath.stem
    exts = filepath.suffixes
    for label, allowed, mimes in zip(['apk', 'ipa', 'appx', 'zip'], [ANDROID_EXTS, IOS_EXTS, WINDOWS_EXTS, ZIP_EXTS], [APK_MIME, IPA_MIME, APPX_MIME, ZIP_MIME]):
        for ext in exts:
            if ext in allowed and mime in mimes:
                data['labels'].append(label)
    return


def has_labels(labels0, labels1):
    return set(labels0) & set(labels1)

def guess(rootdir, pathname, data):
    filepath = rootdir / pathname

    data['filemime'] = guess_file_mime(filepath)
    data['fileinfo'] = guess_file_mime(filepath, mime=False)

    if 'size' not in data:
        data['size'] = get_file_size(filepath)

    metadata = data.setdefault('metadata', {})
    labels = data.setdefault('labels', [])

    if metadata:
        try:
            symbols = metadata.get('symbols', None)
            strings = metadata.get('strings', None)
            
            if symbols is None and strings is None:
                _guess1(rootdir, pathname, data)
                
            _guess2(rootdir, pathname, data)

            if 'unpacked_relative_files' in data:
                if 'filesystem' in labels:
                    if 'ext2' in labels:
                        _guess_android(rootdir, pathname, data)
                
                _guess_compressed(rootdir, pathname, data)

                if not metadata.get('type', None):        
                    _guess_mobile(rootdir, pathname, data)        

            # note, .so files might be split to files .debug, .debugdata, hence, we need identify all files even it contains unpacked or extracted
            _guess3(rootdir, pathname, data)
        except:
            log.exception(f"failed to guess {filepath}")