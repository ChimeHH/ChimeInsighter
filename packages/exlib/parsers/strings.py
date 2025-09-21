import re



def _gen_config(lang):
    """
    generate config for tokenization
    returns tuple
    """
    comment_strings = [
        # multi line comments
        {'start': '(*', 'end': '*)', 'langs': ['pascal', 'applescript', 'delphi']},
        {'start': '/*', 'end': '*/', 'langs': ['c', 'c++', 'c#', 'java', 'javascript', 'swift', 'scala', 'go', 'css', 'rust', 'scss', 'objectivec']},
        {'start': '{-', 'end': '-}', 'langs': ['haskell']},
        {'start': '\n=', 'end': '\n=', 'langs': ['perl', 'ruby']},
        {'start': '"""', 'end': '"""', 'langs': ['python']},
        {'start': '<!--', 'end': '-->', 'langs': ['xml', 'html', 'coldfusion', 'evoquehtml']},
        {'start': '--[[', 'end': '--]]', 'langs': ['lua']},
        {'start': '<#', 'end': '#>', 'langs': ['php', 'powershell']},
        {'start': '\'\'\'', 'end': '\'\'\'', 'langs': ['python']},
        {'start': '<%--', 'end': '--%>', 'langs': ['jsp']},
        # single line comments
        {'start': '--', 'end': '\n', 'langs': ['ada', 'lua', 'applescript', 'sql']},
        {'start': '#', 'end': '\n', 'langs': ['php', 'perl', 'python', 'powershell', 'bash']},
        {'start': '//', 'end': '\n', 'langs': ['c', 'c#', 'c++', 'java', 'javascript', 'pascal', 'php', 'scala', 'swift', 'go', 'objectivec']},
        {'start': '{ ', 'end': ' }', 'langs': ['pascal']},
        {'start': '#include ', 'end': ' }', 'langs': ['c', 'c++']},
        {'start': '#import ', 'end': ' }', 'langs': ['objectivec']},
    ]
    local_comment_strings = {}
    local_containers = ['\'', '"']

    if lang != 'common':
        for each in comment_strings:
            if lang in each['langs']:
                local_comment_strings[each['start']] = each['end']
    else:
        for each in comment_strings:
            if each['start'] not in ('{ ', '\n=', '(*'):
                local_comment_strings[each['start']] = each['end']
    return local_containers, local_comment_strings


def _is_escaped(string):
    """
    checks if given string can escape a suffix
    returns bool
    """
    count = 0
    for char in reversed(string):
        if char == '\\':
            count += 1
        else:
            break
    return count % 2

def _skip_splitted(string, containers='\'"'):
    """
    checks if given string is a splitted one
    returns bool
    """
    for idx, c in enumerate(string):    
        if c in containers:
            return idx+1
        if not c.isspace():
            return 0
    return 0

def _if_comment_started(string, comment_strings):
    """
    checks if given string starts a comment
    returns string required to close the comment and length of string that started the comment
    returns False on failure
    """
    # print(f"if comment started: string: {string.encode()}, comment_strings: {comment_strings}")
    for comment_start, comment_end in comment_strings.items():
        if string.startswith(comment_start):
            return (comment_end, len(comment_start))


def _tokenize(code, comments, comment_strings, containers):
    """
    tokenizes sources code to find hardcoded strings
    returns list of hardcoded strings
    """
    string = container = comment_end = ''
    state = 'look'
    skip = 0
    comment = False
    all_strings = []
    linenum = 0
    for index, char in enumerate(code):
        if char == '\n':
            linenum += 1
        # print(f"{index} {char.encode()}/container: {container}, comment end: {comment_end.encode()} / {state} - {skip} / comment:{comment} - {string}")
        if skip > 0:
            skip -= 1
            continue
        buff = code[index:index+4]
        if comment:
            if buff.startswith(comment_end):
                skip = len(comment_end) - 1
                if comments == 'string' and string:
                    all_strings.append((string.strip("\n"), linenum))
                state = 'look'
                comment = False
                string = container = ''
                continue

        if comment:
            if comments == 'string':
                string += char
                continue
            elif comments == 'ignore':
                continue
            else:
                continue

        if not comment and state == 'look':
            started = _if_comment_started(buff, comment_strings)
            if started:
                string = ''
                state = 'look'
                comment = True
                comment_end = started[0]
                skip = started[1] - 1
                continue

        if char in containers:
            if state == 'look':                
                state = 'store'
                container = char
                continue

            if state == 'store':
                if char == container:                
                    skip = _skip_splitted(code[index+1:], containers)
                    if skip:
                        container = code[index+skip]
                        continue

                    if string:
                        all_strings.append((string.strip("\n"), linenum))
                    string = ''
                    state = 'look'
                    continue

                string += char
                continue

        if state == 'store':
            string += char
    return all_strings


def guess_strings(code, lang='common', comments='ignore'):
    """
    main function that calls other functions
    returns list of hardcoded strings
    """
    # print(f"lang={lang}, comments={comments}")
    containers, comment_strings = _gen_config(lang)    
    return _tokenize(code, comments, comment_strings, containers)


if __name__=="__main__":
    import os
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('-r', '--recursive', help='use post method', dest='recursive', action='store_true')
    parser.add_argument('-c', '--comments', help='specify how to handles comments.\n\t\'ignore\'- ignore them\n\'parse\'- parse them like code\n\'string\'-return comments as hardcoded strings', dest='comments', default='ignore')
    parser.add_argument('-l', '--language', help='specify programming language of source code', dest='lang', default='common')
    parser.add_argument('-o', help='don\'t show location of found strings', dest='hide_path', action='store_true')
    parser.add_argument('file', help='file', type=str)
    args = parser.parse_args()

    files = []
    if args.recursive:
        for root, dirs, l_files in os.walk(args.file):
          for file in l_files:
            files.append(os.path.join(root, file))
    elif args.file:
        files.append(args.file)

    for file in files:
        with open(file, 'r', encoding='utf-8') as code:
            try:
                code = ''.join([line for line in code])                
            except UnicodeDecodeError:
                continue

        all_strings = guess_strings(code, args.lang, args.comments)
        if args.hide_path:
            prefix = ''
        else:
            prefix = file+':'
        for string in all_strings:
            print(f"{prefix} {string}")
