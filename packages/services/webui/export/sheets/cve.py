from collections import OrderedDict

from exlib.export.view import RichCell, DataView

import re
def context_filter_info(fi):
    if isinstance(fi, str):
        return re.sub(r"^\s+|;\s*", "\n", fi)
    elif isinstance(fi, list):
        return "\n".join(fi)
    elif isinstance(fi, dict):
        s = ''
        for k, v in fi.items():
            s += f"{k}: {v}\n"
        return s

    return fi

def simple_list_fmt(ts):
    if ts:
        return "\n".join(ts)
    return ""

class CvssV2(DataView):
    Params = OrderedDict(
        accessComplexity = RichCell("CVSSv2 / Access Complexity", "CVSSv2 / 攻击复杂度", color="gray"),
        accessVector = RichCell("Access Vector", "攻击向量", color="gray"),
        authentication = RichCell("Authentication", "鉴权", color="gray"),
        availabilityImpact = RichCell("Availability Impact", "可用性影响", color="gray"),
        baseScore = RichCell("Base Score", "基本评分", color="gray"),
        confidentialityImpact = RichCell("Confidentiality Impact", "保密性影响", color="gray"),
        integrityImpact = RichCell("Integrity Impact", "完整性影响", color="gray"),
        vectorString = RichCell("Vector String", "向量字符串", color="gray"),
        version = RichCell("Version", "评分版本", color="gray"),
        )


class MetricsV2(DataView):
    Params = OrderedDict(
        cvssV2 = CvssV2,
        exploitabilityScore = RichCell("Exploitablility Score", "可利用性评分", color="gray"),
        impactScore = RichCell("Impact Score", "影响评分", color="gray"),
        obtainAllPrivilege = RichCell("Obtain All Privilege", "获取全部权限", color="gray"),
        obtainOtherPrivilege = RichCell("Obtain Other Privilege", "获取其他用户权限", color="gray"),
        obtainUserPrivilege = RichCell("Obtain User Privilege", "获取此用户权限", color="gray"),
        severity = RichCell("Severity", "严重程度", color="gray"),
        userInteractionRequired = RichCell("User Interaction Required", "用户交互要求", color="gray")
        )

class CvssV3(DataView):
    Params = OrderedDict(
        attackComplexity = RichCell("CVSSv3 / Attack Complexity", "CVSSv3 / 攻击复杂度"),
        attackVector = RichCell("Attack Vector", "攻击向量"),
        availabilityImpact = RichCell("Availability Impact", "可用性影响"),
        baseScore = RichCell("Base Score", "基本评分"),
        baseSeverity = RichCell("Base Serverity", "基本严重程度"),
        confidentialityImpact = RichCell("Confidentiality Impact", "保密性影响"),
        integrityImpact = RichCell("Integrity Impact", "完整性影响"),
        privilegesRequired = RichCell("Privileges Required", "权限要求"),
        scope = RichCell("Scope", "范围"),
        userInteraction = RichCell("User Interaction", "用户交互"),
        vectorString = RichCell("Vector String", "向量字符串"),
        version = RichCell("Version", "版本"),
        )

class MetricsV3(DataView):
    Params = OrderedDict(
        cvssV3 = CvssV3,
        exploitabilityScore = RichCell("Exploitability Score", "可利用性评分"),
        impactScore = RichCell("Impact Score", "影响评分")
        )

class CveMetricsView(DataView):
    Params = OrderedDict(
        baseMetricV3 = MetricsV3,
        baseMetricV2 = MetricsV2,
        )
class CveMetadataView(DataView):
    Params = OrderedDict(
        cve_id = RichCell("CVE ID", "CVE编号"), 
        description = RichCell("Description", "描述", width=50),
        problem_types = RichCell("CWEs", "问题类型", width=20, fmt=simple_list_fmt),
        exploits = RichCell("Exploits", "利用方法", width=20, fmt=simple_list_fmt),        
        os_filtered     = RichCell("Filter by OS", "系统过滤", width=20, fmt=context_filter_info),
        source_filtered = RichCell("Filter by Source", "源码过滤", width=30, fmt=context_filter_info),

        published_date = RichCell("Published Date", "发布时间", width=20),
        last_modified_date = RichCell("Last Modified Date", "最后修改时间", width=25),
        metrics = CveMetricsView,
        references = RichCell("References", "参考链接", width=80),
        source = RichCell("Source Files", "源文件", width=20),
        assigner = RichCell("Assigner", "指配方", width=20),
        component = RichCell("Component", "组件", width=20), 
        cpe = RichCell("CPE", "产品", width=20),       
        )
class CveView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),
        filepath = RichCell("File Path", "文件路径", width=50),
        metadata = CveMetadataView,
        checksum = RichCell("CHECKSUM", "文件校验和", width=65),
        )
        
class CnnvdView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),
        filepath = RichCell("File Path", "文件路径", width=50),
        cnnvd_id = RichCell("CNNVD ID", "CNNVD编号"),
        cve_id = RichCell("CVE ID", "CVE编号"),

        name = RichCell("Name", "名称"),
        published = RichCell("Published", "发布时间"),
        modified = RichCell("Modified", "更新时间"),

        severity = RichCell("Severity", "严重程度"),
        solution = RichCell("Solution", "解决方案"),

        source = RichCell("Source", "源码"),
        threat_type = RichCell("Threat Type", "风险类别"),
        type = RichCell("Type", "类型"),
        vuln_descript = RichCell("Vuln Descript", "漏洞描述"),
        checksum = RichCell("CHECKSUM", "文件校验和", width=65),
        )
    
class CnvdView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),
        filepath = RichCell("File Path", "文件路径", width=50),
        cnvd_id = RichCell("CNVD ID", "CNVD编号"),
        cve_id = RichCell("CVE ID", "CVE编号"),

        title = RichCell("Title", "标题"),
        submitTime = RichCell("Submit Time", "提交时间"),
        openTime = RichCell("Open Time", "更新时间"),

        description = RichCell("Description", "描述信息"),
        discovererName = RichCell("Discoverer Name", "发现者"),
        
        formalWay = RichCell("Formal Way", "缓解策略"),
        isEvent = RichCell("Is Event", "事件"),

        patchDescription = RichCell("Patch Description", "补丁描述"),
        patchName = RichCell("Patch Name", "补丁名"),
        severity = RichCell("Severity", "严重度"),

        checksum = RichCell("CHECKSUM", "文件校验和", width=65),
        )

class JvnView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),
        filepath = RichCell("File Path", "文件路径", width=50),
        jvn_id = RichCell("JVN ID", "JVN编号"),
        cve_id = RichCell("CVE ID", "CVE编号"),

        affected = RichCell("Affected", "影响"),
        assigner = RichCell("Assigner", "指配方"),
            
        description = RichCell("Description", "描述"),
        jvn_solution = RichCell("JVN Solution", "JVN方案"),
        last_modified_date = RichCell("Last Modified Date", "修改时间"),
                    
        published_date = RichCell("Published Date", "发布时间"),
        references = RichCell("References", "参考", width=80),
        source_id = RichCell("Source ID", "源"),

        checksum = RichCell("CHECKSUM", "文件校验和", width=65),
        )

def generate_cve_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0):
    columns = CveView.columns()    
    original = data_manager.get_cve_threats(version_id)

    data = CveView.data(original, maxrows=maxrows)    
    exporter.add_table(bookname, columns, data, lang=lang)

def generate_cnnvd_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0):    
    columns = CnnvdView.columns()    
    original = data_manager.get_cnnvd_threats(version_id)
    data = CnnvdView.data(original, maxrows=maxrows)    
    exporter.add_table(bookname, columns, data, lang=lang)

def generate_cnvd_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0):    
    columns = CnvdView.columns()    
    original = data_manager.get_cnvd_threats(version_id)
    data = CnvdView.data(original, maxrows=maxrows)    
    exporter.add_table(bookname, columns, data, lang=lang)

def generate_jvn_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0):    
    columns = JvnView.columns()    
    original = data_manager.get_jvn_threats(version_id)
    data = JvnView.data(original, maxrows=maxrows)    
    exporter.add_table(bookname, columns, data, lang=lang)