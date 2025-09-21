from exlib.export.view import RmlDocView
from exlib.export import pdf

from database import master_database
from database import findings_database

class RmlCompliance(RmlDocView):
    _document = {
        "title": ["Compliance", "合规标准"],
        "introduce": ["A coding compliance plan establishes internal controls and processes to detect and prevent fraudulent coding practices, protecting the organization from potential legal liabilities. Here, we provide: AUTOSAR, CERT-C, ESCR-IPA, MISRA-2012, Deprecated, Dangerous", 
                    "编码合规帮助企业建立内部控制和流程来检测和防止风险编码行为，保护组织免受潜在的危害或法律责任。本报告涵盖的标准包括： AUTOSAR, CERT-C, ESCR-IPA, MISRA-2012, 废弃函数, 危险函数"],
        "no_records": ["No records found.", "未发现相关的记录"],

        "table_stat": ["Compliance Stat Table", "合规统计表"],
        "bar_stat": ["Compliance Stat Bar", "合规分布图"],
        "table_list": ["Compliance List Table", "合规清单"],

        "rule_columns": [["no", "name", "description", "count"], ["编号", "名称", "描述", "数量"]],
        "spec_ax": [["AUTOSAR", "CERT-C", "ESCR-IPA", "MISRA-2012", "Deprecated", "Dangerous"], ["AUTOSAR", "CERT-C", "ESCR-IPA", "MISRA-2012", "Deprecated", "Dangerous"]],
        "spec_items": [['Count'], ['违例数']],
    }    

    @classmethod
    def generate_report(cls, exporter, data_manager, version_id, lang="en", maxrows=0):
        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('title', lang)}", exporter.stylesheet.Heading2))
        exporter.append(exporter.draw_paragraph(cls.document('introduce', lang), exporter.stylesheet.body))
                
        threats = data_manager.get_compliance_threats(version_id)
        if not threats:
            exporter.append(exporter.draw_text(cls.document('no_records', lang)))
            return
       
        counts = []
        valueMax = 0
        ax_data = ["AUTOSAR", "CERT-C", "ESCR-IPA", "MISRA-2012", "Deprecated", "Dangerous"] 
        leg_items = cls.document('spec_items', lang)

        stats = findings_database.TableThreats.getThreatsStats(threats).get(findings_database.TableThreats.ThreatTypes.COMPLIANCE, {})
        for spec in ax_data:
            count = findings_database.TableThreats.sumThreatStats(stats.get(spec, {}))
            valueMax = max(valueMax, count)
            counts.append(count)

        exporter.append(exporter.draw_paragraph(f"1) {cls.document('table_stat', lang)}", exporter.stylesheet.Heading3))
        data = [("RULE SET", "COUNT")] + list(zip(ax_data, counts))
        exporter.append(exporter.draw_table(*data, col_width=[120, 80]))

        exporter.append(exporter.draw_paragraph(f"2) {cls.document('bar_stat', lang)}", exporter.stylesheet.Heading3))                
        use_colors = [pdf.colors.yellow, ]
        exporter.append(exporter.draw_bar([tuple(counts)], cls.document("spec_ax", lang), leg_items, use_colors=use_colors, valueMin=0, valueMax=valueMax))

        data = [("NO.", "CODE", "RULE", "STATE", "PATHES"),]
        
        index = 0
        for meta in exporter.subset(threats, maxrows=maxrows):
            metadata = meta[findings_database.TableThreats.METADATA]
            function = metadata['function']
            name = f"{meta[findings_database.TableThreats.THREAT_SUBTYPE]}.{metadata.get('name', '')}"
            # description = metadata.get('description', "")
            state = metadata.get('state', "")

            index += 1
            path = "<br/>".join(meta['filepath'])
            line = (index, function, name, state, exporter.draw_cell(path) )
            data.append(line)

        exporter.append(exporter.draw_paragraph(f"3) {cls.document('table_list', lang)}", exporter.stylesheet.Heading3))
        exporter.append(exporter.draw_table(*data, col_width=[30, 120, 100, 50, 180]))

