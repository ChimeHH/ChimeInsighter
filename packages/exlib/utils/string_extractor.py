from typing import List, Tuple, Pattern
import re


class PrintableString(object):
    STRING_REGEXES = [
        (b'[\x09-\x0d\x20-\x7e]{$len,}', 'utf-8'),
        (b'(?:[\x09-\x0d\x20-\x7e]\x00){$len,}', 'utf-16'),
    ]

    def __init__(self):
        self.regexes = self._compile_regexes()

    def _compile_regexes(self) -> List[Tuple[Pattern[bytes], str]]:
        min_length = '8'  # self._get_min_length_from_config()
        return [
            (re.compile(regex.replace(b'$len', min_length.encode())), encoding)
            for regex, encoding in self.STRING_REGEXES
        ]

    @staticmethod
    def _match_with_offset(regex: Pattern[bytes], source: bytes, encoding: str = 'utf-8') -> List[Tuple[int, str]]:
        return [
            (match.start(), match.group().decode(encoding))
            for match in regex.finditer(source)
        ]

    def find_all_strings_and_offsets(self, source: bytes) -> Tuple[List[str], List[Tuple[int, str]]]:
        strings_with_offset = []
        for regex, encoding in self.regexes:
            strings_with_offset.extend(self._match_with_offset(regex, source, encoding))
        return self._get_list_of_unique_strings(strings_with_offset), strings_with_offset

    @staticmethod
    def _get_list_of_unique_strings(strings_with_offset: List[Tuple[int, str]]) -> List[str]:
        return sorted(list(set(tuple(zip(*strings_with_offset))[1]))) if strings_with_offset else []
