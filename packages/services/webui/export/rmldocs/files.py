from exlib.export.view import RmlDocView
from exlib.export import pdf

from database.findings_database import TableThreats

from pprint import pprint

class RmlFiles(RmlDocView):
    _document = {
        "title": ["Files", "文件"],
        "introduce": ["n computer science, a symbol table is a data structure used by a language translator such as a compiler or interpreter, where each identifier (or symbol), constant, procedure and function in a program's source code is associated with information relating to its declaration or appearance in the source. In other words, the entries of a symbol table store the information related to the entry's corresponding symbol.", 
                    "在计算机科学中，文件是语言翻译器（例如编译器或解释器）使用的数据结构，其中程序源代码中的每个标识符（或符号）、常量、过程和函数都与其在源代码中的声明或出现有关的信息相关联。换句话说，文件的条目存储与条目对应符号相关的信息。"],
        "no_records": ["No records found", "未发现相关的记录"],

        "table_list": ["Files List Table", "文件清单"],

        "list_columns": [["NO.", "Hashes", "Labels", "Size", "PropertyRatio", "File Path"], ["编号", "哈希", "类型", "大小", "开源比例", "路径"]],
    }    

    @classmethod
    def generate_report(cls, exporter, data_manager, version_id, lang="en", maxrows=0):
        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('title', lang)}", exporter.stylesheet.Heading2))
        exporter.append(exporter.draw_paragraph(cls.document('introduce', lang), exporter.stylesheet.body))

        threats = data_manager.get_files(version_id)

        if not threats:
            exporter.append(exporter.draw_text(cls.document('no_records', lang)))
            return    

        data = [tuple(cls.document('list_columns', lang)),]
        
        index = 0
        for meta in exporter.subset(threats, maxrows=maxrows):
            index += 1

            hashes = "<br/>".join([ f"{k}:{v}" for k, v in meta['hashes'].items()])            
            labels = ", ".join(meta.get('labels', []) or []) or meta.get('filtype', "")
            path = "<br/>".join(meta['filepath_r'][:5])
            percent = meta.get('oss_percent', None)
            ratio = "{}%".format(round(percent, 3)*100) if percent != None else None

            line = (index, exporter.draw_cell(hashes), exporter.draw_cell(labels), meta.get("size", ""), ratio, exporter.draw_cell(path) )
            data.append(line)

        exporter.append(exporter.draw_paragraph(f"1) {cls.document('table_list', lang)}", exporter.stylesheet.Heading3))        
        exporter.append(exporter.draw_table(*data, col_width=[40, 200, 40, 40, 40, 160]))