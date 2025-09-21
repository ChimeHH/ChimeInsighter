from collections import OrderedDict

from exlib.export.view import RichCell, DataView

import json
from pprint import pprint, pformat

def fmt_appendix(appendix):
    s = ""

    if not appendix:
        return ""    

    for k, v in appendix.items():
        s += f"{k}: {pformat(v, indent=4)}\n"

    return s

class MetadataView(DataView):
    Params = OrderedDict(
        vulnerability_type = RichCell("Vulnerability Type", "漏洞类型"),
        vulnerability_sub_type = RichCell("Vulnerability SubType", "漏洞细分", width=20),        
        cwe = RichCell("CWE", "CWE", width=16),
        severity = RichCell("Severity", "严重性", width=10),
        appendix = RichCell("Meta", "Meta", fmt=fmt_appendix, width=120),
        )

class MobileView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),        
        filepath = RichCell("File Path", "文件路径", width=50),
        metadata = MetadataView,
        checksum = RichCell("CHECKSUM", "文件校验和", width=65),
        )


def generate_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0):     
    columns = MobileView.columns()    
    original = data_manager.get_mobile_threats(version_id)
    
    data = MobileView.data(original, maxrows=maxrows)    
    exporter.add_table(bookname, columns, data, lang=lang)

