from exlib.export.view import RmlDocView
from exlib.export import pdf

from database.findings_database import TableThreats

from pprint import pprint

class RmlInfoleak(RmlDocView):
    _document = {
        "title": ["Infoleak", "信息泄露"],
        "introduce": ["A data leak is a security incident where confidential, protected or sensitive data is released to an environment where the data is not meant to exist. Data leaks can result from various reasons, such as system vulnerabilities, improper disposal of data, operational errors, or even malicious insider threats. The data that is leaked could range from personal and financial data such as credit card details, social security numbers, to corporate financial figures or sensitive intellectual property.This exposure can lead to serious ramifications including damage to a company's reputation, financial loss, and legal consequences. Organizations are usually highly invested in preventing data leaks to guard their business and customer data. Regular security audits, a reliable data security framework, strong user access control and a proactive cyber security culture are some of the ways that companies can work to prevent data leaks.We check for information leakage of types such as IP, CID, Phone, Doamin, Email, URL, Path, GPS, etc. At the same time, we strongly encourage commercial customers to add new or remove certain rules to supplement these types of databases, such as ignore certain domains, phone numbers, emails, etc, or add new detection types.", 
                    "数据泄露是一种安全事件，机密、受保护或敏感数据被释放到数据不应该存在的环境中。数据泄露可能由各种原因造成，例如系统漏洞、数据处理不当、操作错误，甚至是恶意内部威胁。泄露的数据可能包括个人和财务数据（例如信用卡详细信息、社会保险号）、公司财务数据或敏感知识产权。这种暴露可能导致严重后果，包括损害公司声誉、财务损失和法律后果。组织通常会投入大量资金来防止数据泄露，以保护其业务和客户数据。定期安全审核、可靠的数据安全框架、强大的用户访问控制和主动的网络安全文化是公司可以采取的一些防止数据泄露的方法。我们检查IP地址，身份证，电话，域名，邮箱，网址，路径，位置等类型的信息泄露。同时，我们允许商业用户更新规则，以删除或是补充这些类型的数据库，特别是常用的黑白名单忽略特定的域名，电话，邮箱，或是增加新的检测类型。"],
        "no_records": ["No records found", "未发现相关的记录"],

        "table_stat": ["Infoleak Stat Table", "信息泄露统计表"],
        "pie_stat": ["Infoleak Stat Chart", "信息泄露分布图"],

        "table_list": ["Infoleak List Table", "信息泄露清单"],

        "stat_columns": [["TYPE", "COUNT"], ["类型", "数量"]],
        "list_columns": [["NO.", "TYPE", "TEXT", "OFFSET", "File Path"], ["编号", "类型", "原文", "偏移", "路径"]],
    }    

    @classmethod
    def generate_report(cls, exporter, data_manager, version_id, lang="en", maxrows=0):
        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('title', lang)}", exporter.stylesheet.Heading2))
        exporter.append(exporter.draw_paragraph(cls.document('introduce', lang), exporter.stylesheet.body))

        threats = data_manager.get_infoleak_threats(version_id)

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
            text = metadata.get('text', "") or ""
            offset = metadata.get('offset', "") or ""
            
            index += 1

            path = "<br/>".join(meta['filepath'][:5])
            line = (index, meta['sub_type'],  exporter.draw_cell(text), offset, exporter.draw_cell(path) )
            data.append(line)

        exporter.append(exporter.draw_paragraph(f"3) {cls.document('table_list', lang)}", exporter.stylesheet.Heading3))
        exporter.append(exporter.draw_table(*data, col_width=[30, 40, 120, 50, 220]))