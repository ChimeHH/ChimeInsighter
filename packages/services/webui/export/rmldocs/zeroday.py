from exlib.export.view import RmlDocView
from exlib.export import pdf

from database.findings_database import TableThreats

from pprint import pprint

class RmlZeroday(RmlDocView):
    _document = {
        "title": ["0-day vulnerabilities", "零日漏洞"],
        "introduce": ["A zero-day (also known as a 0-day) is a vulnerability in software or hardware that is typically unknown to the vendor and for which no patch or other fix is available. The vendor has zero days to prepare a patch as the vulnerability has already been described or exploited. Despite developers' goal of delivering a product that works entirely as intended, virtually all software and hardware contain bugs. Many of these impair the security of the system and are thus vulnerabilities. Although the basis of only a minority of cyberattacks, zero-days are considered more dangerous than known vulnerabilities because there are fewer countermeasures possible. Detecting unknown vulnerabilities is a very difficult task, and the calculation process is extremely complex. Usually, the calculation time and resources occupied by unknown vulnerabilities are at least several times the sum of other detection items.", 
                    "零日漏洞 (也称为 0-day) 是软件或硬件中的漏洞，供应商通常不知道该漏洞，并且没有可用的补丁或其他修复程序。供应商没有时间准备补丁，因为漏洞已经被描述或利用。尽管开发人员的目标是提供完全按预期运行的产品，但几乎所有软件和硬件都包含错误。其中许多会损害系统的安全性，因此是漏洞。尽管零日漏洞只是少数网络攻击的基础，但它被认为比已知漏洞更危险，因为可能的对策更少。检测未知漏洞是一项非常困难的，计算过程极其复杂，通常情况下，未知漏洞的计算时间、占用资源至少是其它检测项总和的数倍。"],
        "no_records": ["No records found", "未发现相关的记录"],

        "table_stat": ["0-day vulnerabilities Stat Table", "零日漏洞统计表"],
        "pie_stat": ["0-day vulnerabilities Stat Chart", "零日漏洞分布图"],

        "table_list": ["0-day vulnerabilities List Table", "零日漏洞清单"],

        "stat_columns": [["TYPE", "COUNT"], ["类型", "数量"]],
        "list_columns": [["NO.", "TYPE", "SEVERITY", "RVA", "File Path"], ["编号", "类型", "风险度", "堆栈", "路径"]],
    }    

    @classmethod
    def generate_report(cls, exporter, data_manager, version_id, lang="en", maxrows=0):
        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('title', lang)}", exporter.stylesheet.Heading2))
        exporter.append(exporter.draw_paragraph(cls.document('introduce', lang), exporter.stylesheet.body))

        threats = data_manager.get_zeroday_threats(version_id)

        if not threats:
            exporter.append(exporter.draw_text(cls.document('no_records', lang)))
            return

        b_data = []

        stats = {}
        for threat in threats:
            if threat['sub_type'] != 'cscan':
                continue
            vulnerability_sub_type =threat['metadata']['vulnerability_sub_type']
            stats.setdefault(vulnerability_sub_type, 0)
            stats[vulnerability_sub_type] += 1

        columns = []
        for k, v in stats.items():
            columns.append(k)
            b_data.append(v)

        exporter.append(exporter.draw_paragraph(f"1) {cls.document('table_stat', lang)}", exporter.stylesheet.Heading3))
        data = [tuple(cls.document('stat_columns', lang))] + list(zip(columns, b_data))
        exporter.append(exporter.draw_table(*data, col_width=[160, 120]))


        exporter.append(exporter.draw_paragraph(f"2) {cls.document('pie_stat', lang)}", exporter.stylesheet.Heading3))        
        exporter.append(exporter.draw_pie(b_data, list(columns)))

        data = [tuple(cls.document('list_columns', lang)),]
        
        index = 0
        for meta in exporter.subset(threats, maxrows=maxrows):
            metadata = meta.get('metadata', {})
            rva = metadata.get('rva')
            
            index += 1

            path = "<br/>".join(meta['filepath'])
            line = (index, metadata['vulnerability_sub_type'], meta.get('severity'), rva, exporter.draw_cell(path) )
            data.append(line)

        exporter.append(exporter.draw_paragraph(f"3) {cls.document('table_list', lang)}", exporter.stylesheet.Heading3))
        exporter.append(exporter.draw_table(*data, col_width=[40, 120, 50, 50, 240]))