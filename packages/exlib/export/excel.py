#https://xlsxwriter.readthedocs.io/worksheet.html#set_column
import xlsxwriter
import copy
import re

from exlib.classes.base import BaseClass

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class InconsistantColumns(Exception):
    pass

class ExcelExporter(BaseClass):
    def __init__(self, filepath):        
        super().__init__()

        self.workbook = xlsxwriter.Workbook(filepath)        
        self.worksheets = {}

    @classmethod
    def remove_hyperlinks(cls, html_string):
        return re.sub(r'<a [^>]*>(.*?)</a>|(\://)', lambda match: match.group(1) if match.group(1) else ': ', html_string)

    @classmethod
    def truncate_text(cls, text, maxlen, suffix=None):
        ommitted = len(text) - maxlen
        if maxlen> 0 and ommitted > 0:  
            if not suffix:
                suffix = f"(omitted {ommitted}...)"
            return text[:maxlen] + suffix  
        return text

    def add_table(self, name, headers, data, lang="en", caption=None, autofilter=True):                
        total_columns = len(headers)
        if data and total_columns != len(data[0]):
            raise InconsistantColumns("headers are different to data")
            
        self.worksheets.setdefault(name, [])

        self.worksheets[name].append(dict(caption=caption, headers=headers, data=data, lang=lang, autofilter=autofilter))


    def save(self, start_row=0, start_column=0, max_cell_size=0):
        if not max_cell_size:
            max_cell_size = 2048

        for name, tables in self.worksheets.items():
            worksheet = self.workbook.add_worksheet(name)

            row = start_row
            col = start_column

            for table in tables:                
                if table['caption']:
                    caption_font = self.workbook.add_format({'bold': True, 'font_color': 'blue'})

                    worksheet.write(row, col, table['caption'], caption_font)
                    row += 1 # caption and a blank line

                columns = table['headers']
                lang = table['lang']
                data = table['data']
                autofilter = table['autofilter']

                for i, cell in enumerate(columns):
                    cell_format = self.workbook.add_format(cell.formats)
                    worksheet.write(row, col+i, cell.displayname(lang), cell_format)
                    worksheet.set_column(col+i, col+i, cell.width)
                
                row += 1
                if data:
                    data_format = self.workbook.add_format({'text_wrap': True})
                    for i in range(len(data)):
                        data2 = [ self.truncate_text(self.remove_hyperlinks(str(v)), max_cell_size) for v in data[i] ]
                        worksheet.write_row(row+i, col, data2, data_format)                        

                if autofilter:
                    worksheet.autofilter(row-1, col, row+len(data)+1, col+len(columns)-1)

                row += len(data) + 1 # add a blank line

        self.workbook.close()

if __name__=="__main__":
    import pathlib
    

    filepath = pathlib.Path(__file__).parent / "AllResults.xlsx"
    
    data = [
                ["Apples", 10000, 5000, 8000, 6000],
                ["Pears", 2000, 3000, 4000, 5000],
                ["Bananas", 6000, 6000, 6500, 6000],
                ["Oranges", 500, 300, 200, 700],
            ]
    columns = [
                {"header": "Product"},
                {"header": "Quarter 1"},
                {"header": "Quarter 2"},
                {"header": "Quarter 3"},
                {"header": "Quarter 4", "width": 50},
            ]

    exporter = ExcelExporter(filepath)
    exporter.add_table("General Report", columns, data)
    exporter.add_table("General Report", columns, data, caption="second table")
    exporter.add_table("CVE", columns, data)
    exporter.add_table("Zeroday", columns, data, caption="zeroday")
    exporter.save(start_row=0)
