from exlib.export.view import RmlDocView
from exlib.export import pdf

from database.findings_database import TableThreats

from pprint import pprint

class RmlMisconfiguration(RmlDocView):
    _document = {
        "title": ["Misconfiguration", "错误配置"],
        "introduce": ["An incorrect or subobtimal configuration of an information system or system component that may lead to vulnerabilities. Without a concerted, repeatable application security configuration process, systems are at a higher risk.", 
                    "信息系统或系统组件的配置不正确或配置不合理，可能导致漏洞。如果没有协调一致、可重复的应用程序安全配置流程，系统的风险会更高。"],
        "no_records": ["No records found", "未发现相关的记录"],

        "table_stat": ["Misconfiguration Stat Table", "错误配置统计表"],
        "pie_stat": ["Misconfiguration Stat Chart", "错误配置分布图"],

        "table_list": ["Misconfiguration List Table", "错误配置清单"],

        "stat_columns": [["TYPE", "COUNT"], ["类型", "数量"]],
        "list_columns": [["NO.", "TYPE", "PROPERTY", "CONFIGURED", "SUGGESTED", "File Path"], ["编号", "类型", "参数", "当前值", "建议值", "路径"]],
    }    

    @classmethod
    def generate_report(cls, exporter, data_manager, version_id, lang="en", maxrows=0):
        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('title', lang)}", exporter.stylesheet.Heading2))
        exporter.append(exporter.draw_paragraph(cls.document('introduce', lang), exporter.stylesheet.body))

        threats = data_manager.get_misconfiguration_threats(version_id)

        if not threats:
            exporter.append(exporter.draw_text(cls.document('no_records', lang)))
            return

        stats = {}
        for meta in threats:
            stats.setdefault(meta['sub_type'], 0)
            stats[meta['sub_type']] += 1

        exporter.append(exporter.draw_paragraph(f"1) {cls.document('table_stat', lang)}", exporter.stylesheet.Heading3))
        data = [tuple(cls.document('stat_columns', lang))] + list(zip(stats.keys(), stats.values()))
        exporter.append(exporter.draw_table(*data, col_width=[160, 120]))


        exporter.append(exporter.draw_paragraph(f"2) {cls.document('pie_stat', lang)}", exporter.stylesheet.Heading3))        
        exporter.append(exporter.draw_pie(list(stats.values()), list(stats.keys())))

        data = [tuple(cls.document('list_columns', lang)),]
        
        index = 0
        for meta in exporter.subset(threats, maxrows=maxrows):
            metadata = meta.get('metadata', {})
            prop = metadata.get('prop', "") or ""
            configured = metadata.get('configured', "") or ""
            suggested = metadata.get('suggested', "") or ""
            
            index += 1

            path = "<br/>".join(meta['filepath'])
            line = (index, meta['sub_type'],  exporter.draw_cell(prop), exporter.draw_cell(configured), exporter.draw_cell(suggested), exporter.draw_cell(path) )
            data.append(line)

        exporter.append(exporter.draw_paragraph(f"3) {cls.document('table_list', lang)}", exporter.stylesheet.Heading3))
        exporter.append(exporter.draw_table(*data, col_width=[40, 80, 80, 50, 50, 220]))