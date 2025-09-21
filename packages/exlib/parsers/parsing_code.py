import os
import sys
import re
import json
import pathlib
from pprint import pp

from .ctags import guess_ctags
from .language import guess_language
from .licenses import guess_licenses
from .ctags import guess_strings
from .cypy import parse_python_tag
from exlib.utils.stringex import get_words,find_words_in_strings
from exlib.utils.hashex import sha1sum_file
import cxxfilt

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


def cxx_demangle(s):
    """
    cxxfilt.demangle('_ZZN6google12_GLOBAL__N_113LogFileObject13CreateLogfileERKNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEEE6w_lock')
        'google::(anonymous namespace)::LogFileObject::CreateLogfile(std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> > const&)::w_lock'
    cxxfilt.demangle('_ZTIN6spdlog5sinks18rotating_file_sinkINS_7details10null_mutexEEE')
        'typeinfo for spdlog::sinks::rotating_file_sink<spdlog::details::null_mutex>'
    cxxfilt.demangle("_ZN7android10FqInstance5setToERKNSt3__112basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEE")
        'android::FqInstance::setTo(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > const&)'
    """
    ns = cxxfilt.demangle(s)
    while True:
        ns2 = re.sub(r"\([^\(]*?\)|\[[^\[]*?\]|\{[^\{]*?\}|\<[^\<]*?\>|\s+const$", "", ns)
        ns2 = re.sub(r"\s+const$", "", ns2)
        if ns2 == ns:
            ns2 = re.sub(r".*\s", "", ns2)
            break
        ns = ns2

    return ns, ns2.split("::")

def _word_set_(s):
    languages = set()
    for w in s.split(","):
        w = w.strip().lower()
        if not w:
            continue
        languages.add(w)

    return languages

_languages_map = {
        "evoquehtml": "html",
        "evoquexml": "xml",
        "cpp": "c++",
        "csharp": "c#",
        "golang": "go", 
        }
_token_kind_map = {
    "variable": "varname",
    "member": "function",
    } 
_ignore_languages = _word_set_("""markdown, text, json""") 
_ctags_languages = _word_set_("""Abaqus, Abc, Ada, AnsiblePlaybook, Ant, Asciidoc, Asm, Asp, Autoconf, AutoIt, Automake, Awk,
                            Basic, BETA, BibTeX, C, C#, C++, Clojure, CMake, Cobol, CobolFree, CobolVariable, CPreProcessor,
                            CSS, Ctags, CUDA, D, DBusIntrospect, Diff, DosBatch, DTD, DTS, Eiffel, Elixir, Elm, EmacsLisp,
                            Erlang, Falcon, Flex, Fortran, FunctionParameters, Fypp, Gdbinit, Glade, Go, Haskell, Haxe, HTML,
                            Iniconf, Inko, IPythonCell, ITcl, Java, JavaProperties, JavaScript, JSON, Julia, Kconfig, Kotlin,
                            LdScript, Lisp, LiterateHaskell, Lua, M4, Make, Man, Markdown, MatLab, Maven2, Meson, MesonOptions,
                            Moose, Myrddin, NSIS, ObjectiveC, OCaml, Pascal, Passwd, Perl, Perl6, PHP, PlistXML, Pod, PowerShell,
                            Protobuf, PuppetManifest, Python, PythonLoggingConfig, QemuHX, QtMoc, R, R6Class, RelaxNG, ReStructuredText,
                            REXX, Robot, RpmMacros, RpmSpec, RSpec, Ruby, Rust, S4Class, Scheme, SCSS, Sh, SLang, SML, SQL, SVG,
                            SystemdUnit, SystemTap, SystemVerilog, Tcl, TclOO, Tex, TeXBeamer, TTCN, Txt2tags, TypeScript,
                            Varlink, Vera, Verilog, VHDL, Vim, WindRes, XML, XSLT, YACC, Yaml, YumRepo, Zephir""")

_python_tags = get_words("__pyx_ __doc__ __init____name__ __dict__ __globals__ __defaults__ __kwdefaults__ __module__ __reduce__")

def _load_code(filepath):
    try:
        with open(filepath, 'r') as f:
            return f.read()
    except:
        # log.warning(f"ignored non source file: {filepath}")
        return None


def _calc_checksum(self):
    return sha1sum_file(filepath)


def parse_code_file(filepath, runtime=True):
    metadata = dict()

    with filepath.open('r', encoding='utf-8', errors='ignore') as f:
        code = f.read()

    checksum = sha1sum_file(filepath)
    metadata.update(filepath=filepath, checksum=checksum)

    stem = filepath.stem.lower()
    if stem in ('readme', 'license', 'dockerfile', 'makefile',):
        metadata.update(lang=stem)
        return metadata
    
    lang = guess_language(code, filepath.name)
    if not lang:
        return metadata

    lang = _languages_map.get(lang.lower(), lang.lower())            
        
    metadata.update(lang=lang)
    if not lang or lang not in _ctags_languages:
        # log.warning(f"{filepath} is not a supported ctags lang: {lang}")
        return metadata
    
    metadata['type'] = 'code'

    # strings = [s[0] for s in guess_strings(code, lang=lang)]
    strings = [s[0] for s in guess_strings(filepath, lang=lang)]

    if runtime:    
        symbols = []          
        classes = []
        for t in guess_ctags(filepath, lang):
            s = tag2symbols(lang, t)
            if s:
                symbols.extend(s)
            s = tag2classes(t)
            if s:
                classes.extend(s)
        metadata.update(strings=strings, symbols=symbols, classes=classes)

    else:
        tokens = []     
        for t in guess_ctags(filepath, lang):
            s = tag2tokens(lang, t)
            if s:
                tokens.extend(s)
        metadata.update(strings=strings, tokens=tokens)
            
    return metadata

def tag2tokens(lang, tag):
    '''
    {'_type': 'tag', 'name': 'gloabl_var_a', 'line': 8, 'typeref': 'typename:int', 'kind': 'variable', 'end': 8},
    {'_type': 'tag', 'name': 'test_double_free_1', 'line': 10, 'typeref': 'typename:void', 'kind': 'function', 'end': 15},
    '''    
    name = tag.get('name', None)
    kind = tag.get('kind', None)
    linenumber = tag['line']
    linecount = tag.get('end', tag['line'])-tag['line']
    typeref = tag.get('typeref', None)

    tokens = []
    if lang == 'python':
        rs = parse_python_tag(tag)
        if rs:
            for r in rs:
                tokens.append( {'name': r[1], 'type': 'object', 'typeref': typeref, 'linenumber': linenumber, 'linecount': linecount} )
                
    else:
        if kind in ('function', 'member', 'method'):
            tokens.append( {'name': name, 'type': 'func', 'typeref': typeref, 'linenumber': linenumber, 'linecount': linecount} )
        elif kind in ('variable', 'field'):
            tokens.append(  {'name': name, 'type': 'object', 'typeref': typeref, 'linenumber': linenumber, 'linecount': linecount} )
        
        if kind in ('function', 'method', 'member', 'variable', 'field') and tag.get('scopeKind', None) in ('class', 'namespace'):
            scope = tag.get('scope', '')
            tokens.append(  {'name': f"{scope}.{name}", 'type': 'class', 'typeref': typeref, 'linenumber': linenumber, 'linecount': linecount} )
        elif kind in ('package', 'namespace'):
            tokens.append(  {'name': f"{name}", 'type': 'class', 'typeref': typeref, 'linenumber': linenumber, 'linecount': linecount} )

    return tokens

def tag2symbols(lang, tag):  
    symbols = []  

    if lang == 'python':
        rs = parse_python_tag(tag)
        if rs:
            for r in rs:
                symbols.append( {'name': r[1], 'size': 1, 'type': 'object', 'value': 0, } )

    else:   
        name = tag.get('name', None)
        kind = tag.get('kind', None)
        if not name:
            return None

 
        if kind in ('function', 'member', 'method'):
            symbols.append( {'name': name, 'size': 1, 'type': 'func', 'value': 0,} )
        elif kind in ('variable', 'field'):
            symbols.append( {'name': name, 'size': 1, 'type': 'object', 'value': 0, } )
    
    return symbols

def tag2classes(tag):
    name = tag.get('name', None)
    kind = tag.get('kind', None)
    if not name:
        return None

    classes = []
    
    if kind in ('function', 'method', 'member', 'variable', 'field') and tag.get('scopeKind', None) in ('class', 'namespace'):
        scope = tag.get('scope', '')
        classes.append( f"{scope}.{name}" )
    elif kind in ('package', 'namespace'):
        classes.append( f"{name}" )

    return classes

def is_pyx(strings):
    pytags = find_words_in_strings(strings, *_python_tags)
    if len(pytags) / len(_python_tags) >= 0.75:
        return True
    return False

def cxxdemangle_ctags(filepath, symbols):
    new_symbols = []
    new_classes = []
    for sym in symbols:
        try:
            name = sym.get('name', None) 
            typ = sym.get('type', None)
            size = sym.get('size', 0)
            if not name or not typ or typ not in ('func', 'object'):            
                continue

            # typeinfo for spdlog::sinks::rotating_file_sink<spdlog::details::null_mutex>
            # typeinfo name for spdlog::sinks::base_sink<std::mutex>        
            sname, cxxnames = cxx_demangle(name)
            if sname != name:
                sym['c++name'] = sname
            
            if len(cxxnames) <= 1:
                new_symbols.append(sym)
                continue

            sym['name'] = cxxnames[-1]
            new_symbols.append(sym)

            if size != 0:
                for j in range(len(cxxnames)-1):
                    new_classes.append( f"{cxxnames[j]}.{cxxnames[j+1]}" )
        except:
            log.warning(f"failed to demangle {filepath} sym={sym}.")

    return new_symbols, new_classes

def javaclass_ctags(classname, methods, fields):
    new_symbols = []
    new_classes = []

    classes = classname.split('/')
    for j in range(len(classes)-1):
        new_classes.append( f"{classes[j]}.{classes[j+1]}" ) 

    for method in methods:
        new_symbols.append( {'name': f"{method}", 'size': 1, 'type': 'func', 'value': 0, } ) 
        new_classes.append( f"{classes[-1]}.{method}" )

    return new_symbols, new_classes





if __name__=="__main__":
    # filepath = pathlib.Path("/share/simple-test/output/demo.c")
    # filepath = pathlib.Path("/share/simple-test/opensource/samples/TimeTypeAdapter.java")
    filepath = pathlib.Path("/share/simple-test/opensource/samples/TypeAdapters.java")
    # filepath = pathlib.Path("/share/simple-test/opensource/samples/CommonEngine.php")
    metadata = parse_code_file(filepath, runtime=True)
    pp(metadata)












