from collections import OrderedDict

from exlib.export.view import RichCell, DataView


class PasswordMetaView(DataView):
    Params = OrderedDict(
        text = RichCell("text", "文本", width=50),
        type = RichCell("type", "类型", width=15),
        password = RichCell("password", "密码", width=30),
        offset = RichCell("offset", "偏移量", width=10),
        )

class PasswordView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),
        filepath = RichCell("File Path", "文件路径", width=50),
        sub_type = RichCell("Type", "类型"),
        metadata = PasswordMetaView,
        checksum = RichCell("CHECKSUM", "文件校验和", width=65),
        )


def generate_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0):        
    columns = PasswordView.columns()    
    original = data_manager.get_password_threats(version_id)
    data = PasswordView.data(original, maxrows=maxrows)
    exporter.add_table(bookname, columns, data, lang=lang)