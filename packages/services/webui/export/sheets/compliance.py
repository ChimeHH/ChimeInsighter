from collections import OrderedDict

from exlib.export.view import RichCell, DataView


class ComplianceMetaView(DataView):
    Params = OrderedDict(
        linked_name = RichCell("Function", "函数", width=20),
        name = RichCell("Rule", "规则", width=10),
        state = RichCell("State", "状态", width=10),
        description = RichCell("Description", "描述", width=50),
        )


class ComplianceView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),
        filepath = RichCell("File Path", "文件路径", width=50),
        sub_type = RichCell("Type", "类型"),
        metadata = ComplianceMetaView,
        checksum = RichCell("CHECKSUM", "文件校验和", width=65),
        )


def generate_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0):  
    columns = ComplianceView.columns()    
    original = data_manager.get_compliance_threats(version_id)
    data = ComplianceView.data(original, maxrows=maxrows)
    exporter.add_table(bookname, columns, data, lang=lang)
