from collections import OrderedDict
from exlib.export.view import RichCell, DataView


def fmt_percent(percent):
    if isinstance(percent, (int, float)):
        return "{}%".format(round(percent*100, 1))
    return ""

def fmt_score(score):
    if not isinstance(score, dict):
        return "virtual-scan"

    doc = []
    for s in ('s', 'c', 'n', 'e'):
        v = score.get(s, 0)
        if isinstance(v, (int, float)):
            doc.append(f"{round(v*100, 2)}")
        else:
            doc.append(str(v))
    return ",".join(doc)
    
        
def fmt_license_data(license_data):
    if not license_data:
        return ""

    doc = ""

    index = 0
    for lic in license_data:
        license = lic.get('license', "")
        typ = lic.get('type') or ""
        url = lic.get('license') or ""
        
        reference = lic.get('reference') or {}
        
        index += 1
        doc += f"{index}: {license}, {typ}, {url}\n"
        if reference:
            for k, v in reference.items():
                if k in ("fullName", "summary", "usageSuggestion"):
                    doc += f"   {v}\n"
    return doc

def fmt_component_origin(origin):
    if origin.startswith('github.'):
        return origin.replace('github.', 'github.com/')
    elif origin.startswith('gitlab.'):
        return origin.replace('gitlab.', 'gitlab.com/')
    elif origin.startswith('pypi.'):
        return origin.replace('pypi.', 'pypi.org/')
    elif origin.startswith('maven.'):
        return origin.replace('gitlab.', 'maven.org/')
    else:
        return origin

def fmt_component_clone(clone):
    return clone.split("@")[0] if clone else ""
    
class PackageSummaryView(DataView):
    Params = OrderedDict(
        name = RichCell("Name", "名称"),
        alias = RichCell("Alias", "别名"),
        pretty_name = RichCell("Pretty Name", "通用名"),        
        vendor = RichCell("Vendor", "厂商"),
        author = RichCell("Author", "作者"),
        website = RichCell("Website", "网站", width=50)
        )

class PackageInfoView(DataView):
    Params = OrderedDict(
        document = RichCell("Document", "文档"),
        release_time = RichCell("Release Time", "发布时间"),    
        downloadurl = RichCell("Download URL", "下载地址", width=50),        
        # origin = RichCell("Origin", "来源"),    
        )

class ComponentView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),        
        name = RichCell("Package", "组件", width=20),
        version = RichCell("Version", "版本"),
        origin = RichCell("Origin", "来源", width=20, fmt=fmt_component_origin),

        filepath = RichCell("File Path", "文件路径", width=50),
        clone = RichCell("Clone", "克隆源", fmt=fmt_component_clone),
        license_data = RichCell("License", "授权方式", width=80, fmt=fmt_license_data),
        package_summary = PackageSummaryView,

        scale = RichCell("Scale", "成份比", fmt=fmt_percent, ),
        integrity = RichCell("Integrity", "引用率", fmt=fmt_percent, ),
        score = RichCell("Score", "评分", fmt=fmt_score, width=30, ),
        package_info = PackageInfoView,      
        uid = RichCell("UID", "标识", width=30),
        checksum = RichCell("CHECKSUM", "文件校验和", width=65),
        )

    
def generate_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0):   
    columns = ComponentView.columns()    
    original = data_manager.get_components(version_id, lang=lang)
    
    data = ComponentView.data(original, maxrows=maxrows)
    exporter.add_table(bookname, columns, data, lang=lang)