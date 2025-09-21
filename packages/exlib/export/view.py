
class SimpleCell:
    def __init__(self, en, cn, **kwargs):
        self._names= dict(cn=cn, en=en, **kwargs)

    def displayname(self, lang="en"):
        return self._names.get(lang, 'en')
    
    def __str__(self):
        return f"SimpleCell(names={self._names})"

class RichCell(SimpleCell):
    def __init__(self, en, cn, fmt=None, width=15, bold=True, color=None, **kwargs):
        self._names= dict(cn=cn, en=en, **kwargs)

        self.fmt = fmt
        self.width = width
        self.bold = bold
        self.color = color

    @property
    def en(self):
        return self._names['en']

    @property
    def cn(self):
        return self._names['cn']

    def displayname(self, lang="en"):
        return self._names.get(lang, 'en')

    @property
    def formats(self):
        formats = dict(text_wrap = True)
        if self.bold:
            formats.update(bold=self.bold)
        if self.color:
            formats.update(font_color=self.color)

        return formats

    def __repr__(self) :
        return self.__str__()
    
    def __str__(self):
        return (f"RichCell(fmt={self.fmt}, "
                f"width={self.width}, bold={self.bold}, color={self.color}, "
                f"names={self._names})")



class SimpleView:
    Params = dict()

    @staticmethod
    def _str(vs, fmt=None):
        if fmt:
            return fmt(vs)
        elif isinstance(vs, list):
            return ",\n".join([ f"{x}" for x in vs ])
        elif isinstance(vs, dict):
            return ",\n".join([ f"{x}={y}" for x,y in vs.items() ])
        elif isinstance(vs, bool):
            return "yes" if vs else "no"
        elif vs is None:
            return ""
        else:
            return str(vs)


class WorkbookView(SimpleView):
    @classmethod
    def param(cls, name):
        return cls.Params[name]

    @classmethod
    def bookname(cls, name, lang="en"):
        return cls.Params[name].displayname(lang)

class DataView(SimpleView):
    @classmethod
    def columns(cls):
        _columns = []
        for name, cell in cls.Params.items():            
            if type(cell) is not RichCell:
                _columns.extend(cell.columns())
                continue

            _columns.append(cell)

        return _columns

    @classmethod
    def line(cls, row):
        _row = []
        for name, cell in cls.Params.items():
            if type(cell) is not RichCell:
                _row.extend(cell.line(row.get(name, {})))
                continue

            _row.append(cls._str(row.get(name, ''), cell.fmt))

        return _row

    @classmethod
    def data(cls, original, from_index=0, maxrows=0):
        if maxrows:
            to_display = original[from_index:maxrows]
        elif from_index:
            to_display = original[from_index:]
        else:
            to_display = original

        _data = []        
        for index, row in enumerate(to_display):
            row['index'] = index+1
            _data.append(cls.line(row))
        return _data


class SummaryView(SimpleView):    
    Params = dict()
    
    @classmethod
    def columns(cls, name_width=32, value_width=100):        
        return [RichCell("Name", "名称", width=name_width), RichCell("Value", "值", width=value_width)]
        
    @classmethod
    def data(cls, original, lang="en"):
        _data = []
        
        if original is None:
            original = {}

        for name, cell in cls.Params.items():
            if type(cell) is not RichCell:
                _data.extend(cell.data(original.get(name, {}), lang=lang))
                continue

            _row = [cell.displayname(lang), cls._str(original.get(name, ""), cell.fmt)]
            _data.append(_row)
        return _data
    


class UnknownDocumentField(Exception):
    pass

class RmlDocView():
    _document = []

    @classmethod
    def document(cls, field, language):
        s = cls._document.get(field, None)
        if not s:
            return field

        if language == 'cn':
            _i = 1
        else:
            _i = 0

        if _i <= len(s):
            return s[_i]

        return s[0]