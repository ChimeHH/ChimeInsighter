from exlib.export.view import RmlDocView
from exlib.export import pdf
import json

from database.findings_database import TableThreats

from pprint import pprint

class RmlSummary(RmlDocView):
    _document = {
        'project_summary': ["Project Summary", "项目配置参数"],
        'project_versions': ["Project Versions", "已扫描版本统计"],
        'invalid_project_id': ["Invalid project ID: not found", "无效的项目标识：无相关记录"],
        'version_summary': ["Version Summary", "版本配置参数"],
        'invalid_version_id': ["Invalid version ID: not found", "无效的版本标识：无相关记录"],
        'configuration': ["Configuration", "配置信息"],

        "users": ["Users", "用户列表(用户名/角色)"],
        "creater": ["Creater User", "创建者"],
        "tester": ["The Tester", "测试人"],

        "project_id": ["Project ID", "项目标识"],
        "project_name": ["Project Name", "项目名"],
        "department": ["Department", "部门"],
        "vendors": ["Vendor", "厂家"],        
        "description": ["Description", "描述"],
        "customerized_data": ["Customerized Information", "自定义信息"],
        "created_time": ["Created Data", "创建时间"],
        "updated_time": ["Updated Date", "更新时间"],
        "start_time": ["Start Date", "开始时间"],
        "finish_time": ["Finish Date", "完成时间"],
        "raw_binary": ["Micro Controller", "单片机"],
        "public": ["Public", "公开漏洞"],
        "zeroday": ["Zeroday", "零日漏洞"],
        "infoleak": ["Info Leak", "信息泄露"],
        "malware": ["Malware", "恶意软件"],
        "misconfiguration": ["Misconfiguration", "错误配置"],
        "password": ["Password", "弱密码"],
        "interface": ["Interface", "驱动接口"],
        "security": ["Security", "安全配合"],
        "compliance": ["Compliance", "合规风险"],

        "version_id": ["Version ID", "版本标识"],
        "version_name": ["Version Name", "版本名"],
        "filepath": ["File Path", "文件路径"],
        "version_date": ["Release Date", "发布时间"],

        "scan_modes": ["Scan Modes", "扫描模式"],
        "rescan": ["Re-scan", "重新扫描"],
        "revise": ["Re-calc", "重新计算"],        
        "extracted": ["Extracted", "已加压路径"],
        'priority': ["Priority", "优先级"],
        "strategy": ["Scan Strategy", "扫描策略"],
        "allow_cache": ["Allow Cached Results", "缓存结果优先"],
        "allow_blacklist": ["Allow File Blacklist", "文件黑名单"],
        "auto_cleanup": ["Auto Cleanup On Scanned", "扫描结束自动清除缓存文件"],
        
        "progress": ["Scan Progress", "扫描进度"],
        "queued": ["Total Jobs", "总计任务数"],
        "initiated": ["Initiated", "已发起任务数"],
        "completed": ["Completed Jobs", "已完成任务数"],
        "failed": ["Failed Jobs", "已失败任务数"],
        "unknown": ["Unknown Reason", "未知原因错误"],
        "cancelled": ["User Cancel", "用户取消任务数"],
        "percent": ["Percent of Done", "扫描进度百分比"],
        "status": ["Status", "状态"],
        "scores": ["Public Scores", "公开评分"],
        "exploitabilitySecurityScore": ["Exploitability Score", "可利用评分"],
        "impactSecurityScore": ["Impact Score", "影响评分"],
        "cvssSecurityScore": ["CVSS Score", "CVSS 评分"],
        "overallSecurityScore": ["Overall Security Score", "综合安全评分"],

        "stats": ["Statistic Matrix", "统计表"],

        "versions_major_threats_stat": ["Major Threats Trend Chart (Public & Zeroday Vulnabilities, Password, Misconfiguration, Malware)", 
                     "主要风险发展趋势表（公开&未知漏洞，弱密码，错误配置，恶意软件）"],

        "versions_minor_threats_stat": ["Minor Threats Trend Chart (Information Leakage)", 
                     "次要风险发展趋势表（信息泄露）"],


        "versions_files_stat": ["Versions Files Trend Chart", "各版本文件数量发展趋势表"],
        "file_type": ["File Type", "文件类型"],

        "versions_components_stat": ["Versions Components Trend Chart", "各版本组件数量发展趋势表"],
        "fullname": ["Component Name", "组件名"],
        "version": ["Version", "版本"],


        "list_columns": [["PARAM", "VALUE"], ["参数", "值"]],   
        }    

    @classmethod
    def generate_project_report(cls, exporter, data_manager, project_id, lang="en", including_versions=False):
        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('project_summary', lang)}", exporter.stylesheet.Heading2))
                
        project = data_manager.get_project(project_id)        
        exporter.append(exporter.draw_paragraph(f"1) {cls.document('configuration', lang)}", exporter.stylesheet.Heading3))

        project.pop("_id", None)
        scan_options = project.pop('scan_options', {})
        scan_types = scan_options.pop('scan_types', {})
        
        data = [tuple(cls.document('list_columns', lang)),]

        for k, v in project.items():
            data.append((cls.document(k, lang), exporter.draw_cell(str(v)) ))
        for k, v in scan_options.items():
            data.append((cls.document(k, lang), exporter.draw_cell(str(v)) ))
        for k, v in scan_types.items():
            data.append((cls.document(k, lang), exporter.draw_cell(str(v)) ))

        exporter.append(exporter.draw_table(*data, col_width=[150, 300]))

        if not including_versions:
            return

        versions = data_manager.get_project_versions(project_id)       
        
        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('project_versions', lang)}", exporter.stylesheet.Heading2))

        exporter.append(exporter.draw_paragraph(f"1) {cls.document('versions_major_threats_stat', lang)}", exporter.stylesheet.Heading3))
        data = []
        valueMax = 0
        columns = [ TableThreats.ThreatTypes.PUBLIC, TableThreats.ThreatTypes.ZERODAY, TableThreats.ThreatTypes.PASSWORD, 
                    TableThreats.ThreatTypes.MALWARE, TableThreats.ThreatTypes.MISCONFIGURATION ]
        for c in columns:
            line = []
            for v in versions:
                count = v['type_stats'].get(c, 0)
                line.append(count)
                valueMax = max(valueMax, count)                
            data.append(tuple(line))
        
        ax = [ v['version_name'] for v in versions]
        use_colors = [pdf.colors.red, pdf.colors.darkred, pdf.colors.pink, pdf.colors.orange, pdf.colors.yellow]

        exporter.append(exporter.draw_lineplot(data, ax, columns, use_colors=use_colors, valueMin=0, valueMax=valueMax))        

        exporter.append(exporter.draw_paragraph(f"2) {cls.document('versions_minor_threats_stat', lang)}", exporter.stylesheet.Heading3))
        data = []
        valueMax = 0
        
        columns = [ TableThreats.InfoLeakTypes.CID, TableThreats.InfoLeakTypes.EMAIL, TableThreats.InfoLeakTypes.GPS, TableThreats.InfoLeakTypes.IP,
                    TableThreats.InfoLeakTypes.PHONE, TableThreats.InfoLeakTypes.SSL, TableThreats.InfoLeakTypes.URL,]
        
        for c in columns:            
            line = []
            for v in versions:
                count = v['subtype_stats'].get('infoleak', {}).get(c, 0)
                line.append(count)
                valueMax = max(valueMax, count)                
            data.append(tuple(line))

        ax = [ v['version_name'] for v in versions]
        
        use_colors = [pdf.colors.red, pdf.colors.darkred, pdf.colors.pink, pdf.colors.orange, pdf.colors.yellow, pdf.colors.blue, pdf.colors.green]
        exporter.append(exporter.draw_lineplot(data, ax, columns, use_colors=use_colors, valueMin=0, valueMax=valueMax))

        
        exporter.append(exporter.draw_paragraph(f"3) {cls.document('versions_components_stat', lang)}", exporter.stylesheet.Heading3))
        data = []
        valueMax = 0            
        line = []
        for v in versions:
            count = v['components']
            line.append(count)
            valueMax = max(valueMax, count)
        data.append(line)
        
        ax = [ v['version_name'] for v in versions]
        use_colors = [pdf.colors.blue, ]

        exporter.append(exporter.draw_lineplot(data, ax, ['Components Count',], use_colors=use_colors, valueMin=0, valueMax=valueMax))

        exporter.append(exporter.draw_paragraph(f"4) {cls.document('versions_files_stat', lang)}", exporter.stylesheet.Heading3))
        data = []
        valueMax = 0
        line = []
        for v in versions:
            count = v['files']
            line.append(count)
            valueMax = max(valueMax, count)
        data.append(line)

        ax = [ v['version_name'] for v in versions]
        use_colors = [pdf.colors.green,]

        exporter.append(exporter.draw_lineplot(data, ax, ['Files Count'], use_colors=use_colors, valueMin=0, valueMax=valueMax))


    @classmethod
    def generate_version_report(cls, exporter, data_manager, version_id, lang="en"):
        version = data_manager.get_version(version_id)
        project_id = version.pop('project_id')
        cls.generate_project_report(exporter, data_manager, project_id, lang=lang)

        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('version_summary', lang)}", exporter.stylesheet.Heading2))
        exporter.append(exporter.draw_paragraph(f"1) {cls.document('configuration', lang)}", exporter.stylesheet.Heading3))
        version.pop("_id", None)
        scan_modes = version.pop('scan_modes', None) or  {}
        progress = version.pop('progress', None) or  {}
        scores = version.pop('scores', None) or  {}
        stats = version.pop('stats', None) or  {}

        # to alian with early releases
        if stats and isinstance(stats, str):
            stats = json.loads(stats)

        data = [tuple(cls.document('list_columns', lang)),]

        for k, v in version.items():
            data.append((cls.document(k, lang), exporter.draw_cell(str(v)) ))

        data.append((cls.document('scan_modes', lang), exporter.draw_cell("") ))
        for k, v in scan_modes.items():
            data.append((cls.document(k, lang), exporter.draw_cell(str(v)) ))

        data.append((cls.document('progress', lang), exporter.draw_cell("") ))
        percent = progress.pop('percent', 0)
        for k, v in progress.items():
            data.append((cls.document(k, lang), exporter.draw_cell(str(v)) ))
        data.append((cls.document('percent', lang), exporter.draw_cell(f"{round(percent*100, 2)}%") ))

        data.append((cls.document('scores', lang), exporter.draw_cell("") ))
        for k, v in scores.items():
            data.append((cls.document(k, lang), exporter.draw_cell(str(round(v, 2))) ))

        exporter.append(exporter.draw_table(*data, col_width=[150, 300]))
        
        if not stats:
            stats = data_manager.get_version_stats(version_id)        

        type_items = [ TableThreats.ThreatTypes.PUBLIC, TableThreats.ThreatTypes.ZERODAY, TableThreats.ThreatTypes.PASSWORD,
               TableThreats.ThreatTypes.MISCONFIGURATION, TableThreats.ThreatTypes.MALWARE]

        severity_items = [TableThreats.ThreatSeverities.CRITICAL, TableThreats.ThreatSeverities.HIGH, TableThreats.ThreatSeverities.MEDIUM, TableThreats.ThreatSeverities.LOW, 
                        TableThreats.ThreatSeverities.NONE, TableThreats.ThreatSeverities.ADVICE]
        use_colors = [pdf.colors.darkred, pdf.colors.red, pdf.colors.orange, pdf.colors.yellow, pdf.colors.lightgrey, 
                        pdf.colors.blue, pdf.colors.grey]

        valueMax = 0
        version_stats = {}

        threats_stats = stats.get('threats', None) or {}
        for threat_type, type_stats in threats_stats.items():
            if threat_type not in type_items:
                continue

            version_stats[threat_type] = {}
            total_count = 0
            for threat_subtype, subtype_stats in type_stats.items():
                for severity, count in subtype_stats.items():
                    version_stats[threat_type].setdefault(severity, 0)
                    version_stats[threat_type][severity] += count
                    total_count += count
            valueMax = max(valueMax, total_count)

        b_data = []
        
        for severity in severity_items:
            line = []
            for threat_type in type_items:
                count = version_stats.get(threat_type, {}).get(severity, 0)
                line.append(count)
            b_data.append(tuple(line))

        exporter.append(exporter.draw_paragraph(f"2) {cls.document('versions_major_threats_stat', lang)}", exporter.stylesheet.Heading3))
                
        exporter.append(exporter.draw_bar(b_data, type_items, severity_items, use_colors=use_colors, valueMin=0, valueMax=valueMax, style="stacked"))


