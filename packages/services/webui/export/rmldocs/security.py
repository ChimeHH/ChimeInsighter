from exlib.export.view import RmlDocView
from exlib.export import pdf

from database.findings_database import TableThreats

from pprint import pprint

class RmlSecurity(RmlDocView):
    _document = {
        "title": ["Security", "安全参考"],
        "introduce": ["Security information includes software hardening, symbol tables, and linking information. Software hardening is primarily achieved through compilation, such as optimizing compilation options and removing debugging information; the symbol table contains information about functions and global variables; linking information pertains to the dynamic libraries required at runtime and the functions being called.", 
                    "安全信息包括软件加固、符号表、链接信息等内容。软件加固主要是通过编译来实现，比如优化编译选项、去除调试信息等；符号表包含函数和全局变量的信息；链接信息涉及运行所依赖的动态链接库及调用的函数等。"],
        "no_records": ["No records found", "未发现相关的记录"],

        "table_list": ["Security Reference Table", "二进制加固清单"],

        "list_columns": [["NO.", "Data", "File Path"], ["编号", "数据", "路径"]],
    }    

    @classmethod
    def generate_report(cls, exporter, data_manager, version_id, lang="en", maxrows=0):
        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('title', lang)}", exporter.stylesheet.Heading2))
        exporter.append(exporter.draw_paragraph(cls.document('introduce', lang), exporter.stylesheet.body))

        threats = data_manager.get_security_threats(version_id)

        if not threats:
            exporter.append(exporter.draw_text(cls.document('no_records', lang)))
            return    

        data = [tuple(cls.document('list_columns', lang)),]
        
        index = 0
        for meta in exporter.subset(threats, maxrows=maxrows):
            issues = meta.get('metadata', {}).get('data', None)
            if not issues:
                continue
                        
            index += 1

            security = "<br/>".join([f"{n}. {v}" for n,v in enumerate(issues[:10])])
            if len(issues) > 10:
                security += "<br/> ... "
            
            path = "<br/>".join(meta['filepath'])
            line = (index, exporter.draw_cell(security), exporter.draw_cell(path) )
            data.append(line)

        exporter.append(exporter.draw_paragraph(f"1) {cls.document('table_list', lang)}", exporter.stylesheet.Heading3))
        exporter.append(exporter.draw_table(*data, col_width=[40, 160, 300]))



