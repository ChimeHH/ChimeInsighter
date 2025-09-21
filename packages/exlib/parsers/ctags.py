import os
import sys
import re
import json
import pathlib
from exlib.utils.subprocessex import check_output
from pprint import pprint


from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)



def _language_set_(s):
    languages = set()
    for w in s.split(","):
        w = w.strip().lower()
        if not w:
            continue
        languages.add(w)

    return languages




def guess_ctags(filepath, lang=None):
    # language_force = f"--language-force={lang}" if lang else ""
    # output = check_output(f"ctags --fields=+ne -o - --sort=no --output-format=json {language_force} {filepath}")
    output = check_output(f"ctags --fields=+ne -o - --sort=no --output-format=json {filepath}")

    tags = []
    if output:            
        js_lines = output.decode('latin-1').split("\n")
        for n, line in enumerate(js_lines):
            js = line.strip()
            try:
                t = json.loads(js)
                t.pop('path')
                t.pop('pattern')
                tags.append(t)
            except:
                pass
    return tags


def guess_strings(filepath, lang=None):
    # language_force = f"--language={lang}" if lang else ""
    command = f"xgettext -a --omit-header --no-wrap --from-code=utf-8 \"{filepath}\" -o -"        
    output = check_output(command)

    strings = []
    if output:
        lines = output.decode('latin-1').split("\n")
        
        i = 0
        while i < len(lines):            
            line = lines[i]
            if not line.startswith("#:"):
                i += 1
                continue
            linenumbers = re.findall("\S+\:(\d+)", line)

            i += 1
            line = lines[i]
            if line.startswith("#,"):
                i += 1

            line = lines[i]
            if not line.startswith("msgid "):
                continue
            s = line[6:].strip('"')            
            i += 1

            if s:
                strings.extend([(s, ln) for ln in linenumbers])
            
    return strings

if __name__=="__main__":

    strings = guess_strings("/tmp/_extracted_busybox@mirror_0_33.tar.gz/mirror-busybox-ffe1808/zcat.c")
    pprint(strings)







