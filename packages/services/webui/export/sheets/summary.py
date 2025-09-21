import json
from collections import OrderedDict
from pprint import pprint

from exlib.export.view import SummaryView, RichCell

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class UnknownVersionId(Exception):
    pass

class UnknownProjectId(Exception):
    pass

class ScanTypesView(SummaryView):
    Params = OrderedDict(
        public = RichCell("PUBLIC", "公开漏洞"),
        zeroday = RichCell("0Day", "零日漏洞"),
        infoleak = RichCell("Information Leak", "信息泄露"),
        malware = RichCell("Malware", "恶意软件"),
        password = RichCell("Password", "密码"),
        interface = RichCell("Interface", "接口"),
        misconfiguration = RichCell("Misconfiguration", "错误配置"),
        )

class ScanOptionsView(SummaryView):
    Params = OrderedDict(
        scan_types = ScanTypesView,
        raw_binary = RichCell("Raw Binary (Micro Controller)", "纯执行序列/单片机"),
        enable_monitor=RichCell("Monitor", "持续追踪"),        
        )

def priority_str(p):
    try:
        if p<1:
            return "high"
        elif p>1:
            return "low"
    except:
        pass
    
    return "normal"

class ScanModesView(SummaryView):
    Params = OrderedDict(
        priority = RichCell("Priority", "优先级", priority_str),
        extracted = RichCell("Extracted", "文件已解压", fmt=lambda flag: "yes" if flag else "no"),
        rescan = RichCell("Rescan Flag", "重新扫描", fmt=lambda flag: "yes" if flag else "no"),
        revise = RichCell("Revise Flag", "重新计算", fmt=lambda flag: "yes" if flag else "no"),
        strategy = RichCell("Scan Strategy", "扫描策略"),
        allow_cache = RichCell("Cache Flag", "允许缓存", fmt=lambda flag: "yes" if flag != False else "no"),
        allow_blacklist = RichCell("Blacklist Flag", "允许文件黑名单", fmt=lambda flag: "yes" if flag != False else "no"),
        auto_cleanup = RichCell("Auto Cleanup on Scanned", "扫描后自动清除缓存文件", fmt=lambda flag: "yes" if flag != False else "no"),
        )

def percent_str(p):
    return "{:.2f}%".format(p*100)

def fmt_files_stats(files):
    if not files:
        return ""

    s = "{:<16} {:<6}\n".format("File Type", "Count")
    for k, v in files.items():
        s += "{:<16} {:<6}\n".format(k, v)
    return s

def fmt_licenses_stats(licenses):
    if not licenses:
        return ""

    s = "{:<16} {:<6}\n".format("License Type", "Count")
    for k, v in licenses.items():
        s += "{:<16} {:<6}\n".format(k, v)
    return s

def fmt_packages_stats(packages):
    if not packages:
        return ""

    s = "{:<16} {:<6}\n".format("Package Type", "Count")
    for k, v in packages.items():
        s += "{:<16} {:<6}\n".format(k, sum(v.values()))
    return s

def fmt_threat_stats(threats):
    if not threats:
        return ""

    try:        
        s = "{:<16} {:<8} {:<6}\n".format("Risk Type", "Level", "Count")
        for k, v in threats.items():
            for m, n in v.items():
                m = "" if m in (None, "none") else m
                s += "{:<16} {:<8} {:<6}\n".format(k, m, n)
        return s
    except:
        log.exception(f"## threats: {threats}")
        return ""

class ScanProgressView(SummaryView):
    Params = OrderedDict(
        queued = RichCell("Total Scan Count", "扫描任务总数"),
        completed = RichCell("Completed Count", "已完成数"),
        failed = RichCell("Failed Count", "失败数"),
        unknown = RichCell("Unknown Count", "未知原因数"),
        cancelled = RichCell("Canceled Count", "取消数"),
        percent = RichCell("Progress Percent", "扫描进度", fmt=percent_str),
        )

class ThreatsStatsView(SummaryView):
    Params = OrderedDict(
        zeroday = RichCell("0Day", "零日漏洞统计", fmt=fmt_threat_stats),
        public = RichCell("Public Vuln", "公开漏洞统计", fmt=fmt_threat_stats),
        password = RichCell("Weak Password", "弱密码统计", fmt=fmt_threat_stats),
        misconfiguration = RichCell("Misconfiguration", "错误配置统计", fmt=fmt_threat_stats),
        compliance = RichCell("Compliance", "授权合规统计", fmt=fmt_threat_stats),
        infoleak = RichCell("Information Leakage", "信息泄露统计", fmt=fmt_threat_stats),
        malware = RichCell("Malwre & Virus", "恶意软件统计", fmt=fmt_threat_stats),
        security = RichCell("Security Reference", "安全参考统计", fmt=fmt_threat_stats),
        )

class ScanStatsView(SummaryView):
    Params = OrderedDict(
        files = RichCell("Files", "文件统计", fmt=fmt_files_stats),
        threats = ThreatsStatsView,
        licenses = RichCell("License", "授权方式统计", fmt=fmt_licenses_stats),
        packages = RichCell("Packages", "第三方组件统计", fmt=fmt_packages_stats),
        )

class ProjectView(SummaryView):
    Params = OrderedDict(
        project_id = RichCell("Project", "项目"),
        project_type = RichCell("Type", "类型"),
        vendor = RichCell("Vendor", "厂商"),
        description = RichCell("Description", "描述"),
        domain = RichCell("Domain", "行业"),
        scan_options = ScanOptionsView,
        created_time = RichCell("Created", "创建时间"),
        updated_time = RichCell("Updated", "更新时间"),   
        )

class VersionView(SummaryView):
    Params = OrderedDict(
        version_id = RichCell("Version", "版本"),
        version_name = RichCell("Name", "名称"),
        version_date = RichCell("Version Date", "版本日期"),
        filepath = RichCell("File Path", "扫描文件"),
        description = RichCell("Description", "描述"),
        customerized_data = RichCell("Customerized Data", "客户自定义"),
        created_time = RichCell("Created", "创建时间"),
        updated_time = RichCell("Updated", "更新时间"),
        scan_modes = ScanModesView,
        )

    
def generate_report(data_manager, version_id, exporter, bookname, lang="en"):    
    version_data = data_manager.get_version(version_id)
    if not version_data:
        raise UnknownVersionId("Not found version_id: {}".format(version_id))

    project_data = data_manager.get_project(version_data['project_id'])
    if not project_data:
        raise UnknownProjectId("Not found project_id: {}".format(version_data['project_id']))

    
    columns = ProjectView.columns()    
    data = ProjectView.data(project_data, lang=lang)

    exporter.add_table(bookname, columns, data, caption="Project Summary", autofilter=False, lang=lang)

    columns = VersionView.columns()    
    data = VersionView.data(version_data, lang=lang)    
    exporter.add_table(bookname, columns, data, caption="Version Summary", autofilter=False, lang=lang)

    columns = ScanModesView.columns()    
    data = ScanModesView.data(version_data['scan_modes'], lang=lang)    
    exporter.add_table(bookname, columns, data, caption="Version Scan Mode", autofilter=False, lang=lang)

    columns = ScanProgressView.columns()    
    data = ScanProgressView.data(version_data['progress'], lang=lang)    
    exporter.add_table(bookname, columns, data, caption="Version Scan Progress", autofilter=False, lang=lang)

    columns = ScanStatsView.columns()    
    stats = version_data.get('stats', "{}")

    # to alian with early releases
    if stats and isinstance(stats, str):
        stats = json.loads(stats)

    data = ScanStatsView.data(stats, lang=lang)    
    exporter.add_table(bookname, columns, data, caption="Version Scan Stats", autofilter=False, lang=lang)