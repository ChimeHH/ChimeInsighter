from collections import OrderedDict

from exlib.export.view import RichCell, DataView

def fmt_data(data):
    if not data:
        return ""    
    return "\n".join([f"{n}. {v}" for n, v in enumerate(data) ])

class MetadataView(DataView):
    Params = OrderedDict(
        data = RichCell("Data", "数据", width=100, fmt=fmt_data)
        )

class SecurityView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),       
        sub_type = RichCell("Category", "类型", width=60),
        metadata = MetadataView,
        filepath = RichCell("File Path", "文件路径", width=50),
        checksum = RichCell("CHECKSUM", "文件校验和", width=65),
        )


def generate_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0): 
    columns = SecurityView.columns()    
    original = data_manager.get_security_threats(version_id)
    data = SecurityView.data(original, maxrows=maxrows)
    exporter.add_table(bookname, columns, data, lang=lang)