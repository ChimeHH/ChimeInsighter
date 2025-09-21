from exlib.export.view import RmlDocView
from exlib.export import pdf

from database.findings_database import TableThreats

from pprint import pprint

class RmlPassword(RmlDocView):
    _document = {
        "title": ["Weak Passwords", "弱密码"],
        "introduce": ["Weak passwords are a common vulnerability that can be easily exploited by cyber criminals to gain unauthorized access to sensitive information.A weak password is a password that is easily guessable or crack able. This could be a simple word or a short phrase that can be easily found in a dictionary, a password that uses easily obtainable personal information, or a password that is commonly used. A password that is easy to guess or crack leaves your personal information and online accounts at risk.", 
                    "弱密码是一种常见的漏洞，网络犯罪分子很容易利用这种漏洞未经授权访问敏感信息。弱密码是指容易被猜到或破解的密码。这可能是一个可以在字典中轻松找到的简单单词或短语，使用容易获得的个人信息的密码，或常用的密码。容易猜到或破解的密码会让您的个人信息和在线帐户面临风险。"],
        "no_records": ["No records found", "未发现相关的记录"],

        "table_stat": ["Weak Passwords Stat Table", "弱密码统计表"],
        "pie_stat": ["Weak Passwords Stat Chart", "弱密码分布图"],

        "table_list": ["Weak Passwords List Table", "弱密码清单"],

        "stat_columns": [["TYPE", "COUNT"], ["类型", "数量"]],
        "list_columns": [["NO.", "TYPE", "ALG", "OFFSET", "File Path"], ["编号", "类型", "算法", "位置", "路径"]],
    }    

    @classmethod
    def generate_report(cls, exporter, data_manager, version_id, lang="en", maxrows=0):
        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('title', lang)}", exporter.stylesheet.Heading2))
        exporter.append(exporter.draw_paragraph(cls.document('introduce', lang), exporter.stylesheet.body))

        threats = data_manager.get_password_threats(version_id)

        if not threats:
            exporter.append(exporter.draw_text(cls.document('no_records', lang)))
            return

        stats = { t.get('metadata', {}).get('type', ""): 0 for t in threats }

        for meta in threats:
            metadata = meta.get('metadata', {})
            if metadata:
                alg = metadata.get('type', "")
                if alg in stats:
                    stats[alg] += 1
        
        b_data = list(stats.values())

        exporter.append(exporter.draw_paragraph(f"1) {cls.document('table_stat', lang)}", exporter.stylesheet.Heading3))
        data = [tuple(cls.document('stat_columns', lang))] + list(zip(stats.keys(), b_data))
        exporter.append(exporter.draw_table(*data, col_width=[160, 120]))


        exporter.append(exporter.draw_paragraph(f"2) {cls.document('pie_stat', lang)}", exporter.stylesheet.Heading3))        
        exporter.append(exporter.draw_pie(b_data, list(stats.keys())))

        data = [tuple(cls.document('list_columns', lang)),]
        
        index = 0
        for meta in exporter.subset(threats, maxrows=maxrows):
            metadata = meta.get('metadata', {})
            alg = metadata.get('type', "")  or ""
            offset = metadata.get('offset')
            
            index += 1
            path = "<br/>".join(meta['filepath'])
            line = (index, meta['sub_type'], alg, offset, exporter.draw_cell(path) )
            data.append(line)

        exporter.append(exporter.draw_paragraph(f"3) {cls.document('table_list', lang)}", exporter.stylesheet.Heading3))
        exporter.append(exporter.draw_table(*data, col_width=[30, 120, 40, 40, 260]))