from collections import OrderedDict

from exlib.export.view import RichCell, DataView

def fmt_labels(labels):
    if not labels:
        return ""

    return ",".join(set(labels))

    
def filetype_info(filetype):
    if filetype == 'Unknown' or filetype is None:
        filetype = ""

    return filetype

def fmt_percent(percent):
    if percent == None:
        return None

    return "{}%".format(round(percent*100, 1))


class HashesView(DataView):
    Params = OrderedDict(       
        sha256 = RichCell("SHA256", "SHA256", width=65),
        md5 = RichCell("MD5", "MD5"),
        sha1 = RichCell("SHA1", "SHA1"),
        tlsh = RichCell("TLSH", "TLSH"),
        )

class FileView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),
        filepath_r = RichCell("File Path", "文件路径", width=50),
        filetype = RichCell("Type", "类型", fmt=filetype_info),
        size = RichCell("Size", "大小"),
        labels = RichCell("Labels", "参考格式", fmt=fmt_labels, width=20),
        oss_percent = RichCell("OSS Ratio", "开源代码率", width=20, fmt=fmt_percent),
        hashes = HashesView,
        )


def generate_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0):    
    columns = FileView.columns()    
    original = data_manager.get_files(version_id)
    data = FileView.data(original, maxrows=maxrows)
    exporter.add_table(bookname, columns, data, lang=lang)