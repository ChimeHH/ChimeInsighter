from collections import OrderedDict

from exlib.export.view import RichCell, DataView


class MisconfigurationMetaView(DataView):
    Params = OrderedDict(
        category = RichCell("Category", "类别", width=25),
        rule = RichCell("Rule", "规则", width=25),
        prop = RichCell("Property", "属性", width=50),
        configured = RichCell("Configured", "配置", width=20),
        suggested = RichCell("Suggested", "建议", width=20)
        )

class MisconfigurationView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),
        filepath = RichCell("File Path", "文件路径", width=50),
        sub_type = RichCell("Type", "类型"),
        metadata = MisconfigurationMetaView,
        checksum = RichCell("CHECKSUM", "文件校验和", width=65),
        )


def generate_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0):    
    columns = MisconfigurationView.columns()    
    original = data_manager.get_misconfiguration_threats(version_id)
    data = MisconfigurationView.data(original, maxrows=maxrows)
    exporter.add_table(bookname, columns, data, lang=lang)