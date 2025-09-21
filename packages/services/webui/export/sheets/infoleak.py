from collections import OrderedDict

from exlib.export.view import RichCell, DataView


class InfoleakMetaView(DataView):
    Params = OrderedDict(
        rule  = RichCell("Rule", "规则", width=15),
        offset = RichCell("Offset", "偏移量", width=15),
        length = RichCell("Length", "长度", width=15),
        text = RichCell("Text", "原文", width=40),
        pattern = RichCell("Pattern", "匹配规则", width=30),
        reference = RichCell("Reference", "参考信息", width=50)
        )

class InfoleakView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),
        filepath = RichCell("File Path", "文件路径", width=50),
        sub_type = RichCell("Type", "类型", width=15),
        metadata = InfoleakMetaView,
        checksum = RichCell("CHECKSUM", "文件校验和", width=65),
        )

def generate_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0):
    columns = InfoleakView.columns()    
    original = data_manager.get_infoleak_threats(version_id)
    data = InfoleakView.data(original, maxrows=maxrows)
    exporter.add_table(bookname, columns, data, lang=lang)