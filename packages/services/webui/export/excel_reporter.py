from collections import OrderedDict

from pprint import pp

from database.core.mongo_db import mongo_client
from ..core.data_manager import DataManager

from exlib.export.view import WorkbookView, SummaryView, SimpleCell, RichCell
from exlib.export.excel import ExcelExporter

from .sheets import summary as summary_sheet
from .sheets import file as file_sheet
from .sheets import component as component_sheet

from .sheets import cve as cve_sheet

from .sheets import zeroday as zeroday_sheet
from .sheets import mobile as mobile_sheet

from .sheets import malware as malware_sheet
from .sheets import security as security_sheet

from .sheets import infoleak as infoleak_sheet
from .sheets import password as password_sheet
from .sheets import compliance as compliance_sheet
from .sheets import misconfiguration as misconfiguration_sheet


from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class VersionWorkbookView(WorkbookView):
    Params = OrderedDict(
        summary = SimpleCell("Summary", "概要"), 
        file = SimpleCell("File", "文件"),
        component = SimpleCell("Component", "组件"),
        
        cve = SimpleCell("CVE", "美国国家漏洞库"),
        cnnvd = SimpleCell("CNNVD", "中国国家漏洞库"),
        cnvd = SimpleCell("CNVD", "中国Cert漏洞库"),
        jvn = SimpleCell("JVN", "日本漏洞库"),

        zeroday = SimpleCell("Zeroday", "零日漏洞"),
        mobile = SimpleCell("Mobile", "Mobile漏洞"),
        malware = SimpleCell("Malware", "恶意软件"),

        infoleak = SimpleCell("InfoLeak", "信息泄露"),
        password = SimpleCell("Password", "密码泄露"),
        compliance = SimpleCell("Compliance", "合规标准"),
        misconfiguration = SimpleCell("Misconfiguration", "错误配置"),
        
        security = SimpleCell("Security", "安全参考"),

        )

def generate_version_excel_report(client, version_id, filepath, lang="en", maxrows=0):
    data_manager = DataManager(client)

    exporter = ExcelExporter(filepath)

    bookname = VersionWorkbookView.bookname('summary', lang)
    summary_sheet.generate_report(data_manager, version_id, exporter, bookname, lang=lang)

    bookname = VersionWorkbookView.bookname('file', lang)
    file_sheet.generate_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)
    
    bookname = VersionWorkbookView.bookname('component', lang)
    component_sheet.generate_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)

    bookname = VersionWorkbookView.bookname('cve', lang)
    cve_sheet.generate_cve_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)
    
    bookname = VersionWorkbookView.bookname('cnnvd', lang)
    cve_sheet.generate_cnnvd_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)

    bookname = VersionWorkbookView.bookname('cnvd', lang)
    cve_sheet.generate_cnvd_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)

    bookname = VersionWorkbookView.bookname('jvn', lang)
    cve_sheet.generate_jvn_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)

    bookname = VersionWorkbookView.bookname('zeroday', lang)
    zeroday_sheet.generate_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)

    bookname = VersionWorkbookView.bookname('mobile', lang)
    mobile_sheet.generate_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)

    bookname = VersionWorkbookView.bookname('compliance', lang)
    compliance_sheet.generate_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)

    bookname = VersionWorkbookView.bookname('misconfiguration', lang)
    misconfiguration_sheet.generate_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)

    bookname = VersionWorkbookView.bookname('password', lang)
    password_sheet.generate_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)

    bookname = VersionWorkbookView.bookname('infoleak', lang)
    infoleak_sheet.generate_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)

    bookname = VersionWorkbookView.bookname('malware', lang)
    malware_sheet.generate_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)
    
    bookname = VersionWorkbookView.bookname('security', lang)
    security_sheet.generate_report(data_manager, version_id, exporter, bookname, lang=lang, maxrows=maxrows)


    exporter.save()
    

