from exlib.export.view import RmlDocView
from exlib.export import pdf

from database.findings_database import TableThreats

from pprint import pprint

class RmlPublic(RmlDocView):
    _document = {
        "title": ["Public vulnerabilities", "公开漏洞"],
        "introduce": ["CVE stands for Common Vulnerabilities and Exposures. CVE is a glossary that classifies vulnerabilities. The glossary analyzes vulnerabilities and then uses the Common Vulnerability Scoring System (CVSS) to evaluate the threat level of a vulnerability. A CVE score is often used for prioritizing the security of vulnerabilities. The CVE glossary was created as a baseline of communication and source of dialogue for the security and tech industries. CVE identifiers serve to standardize vulnerability information and unify communication amongst security professionals. Security advisories, vulnerability databases, and bug trackers all employ this standard.", 
                    "CVE 代表通用漏洞和暴露。CVE 是一个对漏洞进行分类的术语表。该术语表会分析漏洞，然后使用通用漏洞评分系统 (CVSS) 来评估漏洞的威胁级别。CVE 分数通常用于确定漏洞的安全性优先级。CVE 术语表是作为安全和科技行业沟通的基准和对话来源而创建的。CVE 标识符用于标准化漏洞信息并统一安全专业人员之间的沟通。安全公告、漏洞数据库和错误跟踪器都采用此标准。"],
        "no_records": ["No records found", "未发现相关的记录"],

        "table_stat": ["Public vulnerabilities Stat Table", "公开漏洞统计表"],
        "pie_stat": ["Public vulnerabilities Stat Chart", "公开漏洞分布图"],

        "table_cve_list": ["CVE List Table", "CVE清单"],
        "table_cnnvd_list": ["CNNVD List Table", "中国国家漏洞库清单"],
        "table_cnvd_list": ["CNVD List Table", "中国CERT漏洞库清单"],
        "table_jvn_list": ["JVN List Table", "日本漏洞库清单"],

        "stat_columns": [["SERVERITY", "COUNT"], ["风险等级", "数量"]],
        "cve_list_columns": [["NO.", "CVE", "Description", "Path"], ["编号", "CVE", "描述", "文件路径"]],
        "cnnvd_list_columns": [["NO.", "CNNVD", "CVE", "Description", "Path"], ["编号", "CNNVD", "名称", "描述", "文件路径"]],
        "cnvd_list_columns": [["NO.", "CNVD", "CVE", "Description", "Path"], ["编号", "CNVD", "名称", "描述", "文件路径"]],
        "jvn_list_columns": [["NO.", "JVD", "CVE", "Description", "Path"], ["编号", "JVD", "名称", "描述", "文件路径"]],
    }

    @classmethod
    def generate_report(cls, exporter, data_manager, version_id, lang="en", maxrows=0):
        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('title', lang)}", exporter.stylesheet.Heading2))
        exporter.append(exporter.draw_paragraph(cls.document('introduce', lang), exporter.stylesheet.body))

        cve_threats = data_manager.get_cve_threats(version_id)
        cnnvd_threats = data_manager.get_cnnvd_threats(version_id)
        cnvd_threats = data_manager.get_cnvd_threats(version_id)
        jvn_threats = data_manager.get_jvn_threats(version_id)

        if not cve_threats:
            exporter.append(exporter.draw_text(cls.document('no_records', lang)))
            return
        
        severity_items = [TableThreats.ThreatSeverities.CRITICAL, TableThreats.ThreatSeverities.HIGH, TableThreats.ThreatSeverities.MEDIUM, TableThreats.ThreatSeverities.LOW, 
                        TableThreats.ThreatSeverities.NONE, TableThreats.ThreatSeverities.ADVICE]
        use_colors = [pdf.colors.darkred, pdf.colors.red, pdf.colors.orange, pdf.colors.yellow, pdf.colors.lightgrey, 
                        pdf.colors.blue, pdf.colors.grey]

        b_data = []   

        stats = TableThreats.getThreatsStats(cve_threats).get(TableThreats.ThreatTypes.PUBLIC, {})
        for severity in severity_items:
            count = stats['cve'].get(severity, 0)
            b_data.append(count)

        exporter.append(exporter.draw_paragraph(f"1) {cls.document('table_stat', lang)}", exporter.stylesheet.Heading3))
        data = [tuple(cls.document('stat_columns', lang))] + list(zip(severity_items, b_data))
        exporter.append(exporter.draw_table(*data, col_width=[120, 120]))

        exporter.append(exporter.draw_paragraph(f"2) {cls.document('pie_stat', lang)}", exporter.stylesheet.Heading3))        
        exporter.append(exporter.draw_pie(b_data, severity_items, use_colors=use_colors))

        # CVE LIST
        exporter.append(exporter.draw_paragraph(f"3) {cls.document('table_cve_list', lang)}", exporter.stylesheet.Heading3))
        data = [tuple(cls.document('cve_list_columns', lang)),]
        
        index = 0
        for meta in exporter.subset(cve_threats, maxrows=maxrows):
            index += 1
            metadata = meta['metadata']

            path = "<br/>".join(meta['filepath'])
            line = (index, metadata['cve_id'], exporter.draw_cell(metadata.get('description', "")), exporter.draw_cell(path) )
            data.append(line)

        exporter.append(exporter.draw_table(*data, col_width=[20, 100, 200, 200]))

        ####### CNNVD LIST
        exporter.append(exporter.draw_paragraph(f"4) {cls.document('table_cnnvd_list', lang)}", exporter.stylesheet.Heading3))        
        data = [tuple(cls.document('cnnvd_list_columns', lang)),]
        

        index = 0
        for meta in exporter.subset(cnnvd_threats, maxrows=maxrows):            
            index += 1

            path = "<br/>".join(meta['filepath'])
            line = (index, meta['cnnvd_id'], ", ".join(meta['cve_id']), exporter.draw_cell(meta.get('name', "")), exporter.draw_cell(path) )
            data.append(line)

        exporter.append(exporter.draw_table(*data, col_width=[20, 100, 100, 150, 150]))

        # ##### CNVD LIST
        exporter.append(exporter.draw_paragraph(f"5) {cls.document('table_cnvd_list', lang)}", exporter.stylesheet.Heading3))        
        data = [tuple(cls.document('cnvd_list_columns', lang)),]
        
        index = 0
        for meta in exporter.subset(cnvd_threats, maxrows=maxrows):            
            index += 1

            path = "<br/>".join(meta['filepath'])
            line = (index, meta['cnvd_id'], ", ".join(meta['cve_id']), exporter.draw_cell(meta.get('title', "")), exporter.draw_cell(path) )            
            data.append(line)
            
        exporter.append(exporter.draw_table(*data, col_width=[20, 100, 100, 150, 150]))

        ############ JVN LIST
        exporter.append(exporter.draw_paragraph(f"5) {cls.document('table_jvn_list', lang)}", exporter.stylesheet.Heading3))        
        data = [tuple(cls.document('jvn_list_columns', lang)),]
        
        index = 0
        for meta in exporter.subset(jvn_threats, maxrows=maxrows):            
            index += 1

            path = "<br/>".join(meta['filepath'])
            line = (index, meta['jvn_id'], ", ".join(meta['cve_id']), exporter.draw_cell(meta.get('jvn_solution', "")), exporter.draw_cell(path) )
            data.append(line)

        exporter.append(exporter.draw_table(*data, col_width=[20, 100, 100, 150, 150]))