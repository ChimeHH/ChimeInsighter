from collections import OrderedDict

from exlib.export.view import RichCell, DataView

from pprint import pprint

def cwes_info(cwes):
    if cwes:
        return " | ".join(cwes)
    return ""

def dissassembly_info(disassembly):
    s = ""
    if disassembly:
        for i, block in enumerate(disassembly):
            function_name = block.get("function_name", "")
            block_addr = block.get("block_addr", "")
            s += f"{i} {block_addr} {function_name}\n"

            block_ins = block.get("block_ins", [])
            for j, ins in enumerate(block_ins):
                typ = ins.get("type", "")
                address = ins.get("address", "")
                instruction = ins.get("instruction", "")
                s += f"    {address} {instruction}\n"

    return s

def callstack_info(callstack):
    s = ""
    if callstack:
        for i, c in enumerate(callstack):
            address = c.get("address", "")
            name = c.get("name", "")
            rva = c.get("function_rva", "")
            exported = "EXPORTED" if c.get("is_exported", "") == "True" else ""
            s += f"{address}  {name}({rva})   {exported}\n"
    return s


def regs_info(regs):
    s = ""
    if regs:
        for k, v in regs.items():
            if v != "Dynamic Var":
                s += f"{k}: {v}\n"
    return s

def source_info(source):
    s = ""
    if source:
        for address, block in source.items():
            file_path = block.get("file_path", None) or "-"
            file_line = block.get("file_line", None) or "-"
            func_name = block.get("func_name", None) or "-"
            
            s += f"{address} {file_path}:{file_line} {func_name}\n"
    return s

def additional_source_rvas_info(additional_source_rvas):    
    if additional_source_rvas:
        return ", ".join([ str(a) for a in additional_source_rvas])
    return ""

def vulnerability_sub_type_info(vulnerability_sub_type):
    return vulnerability_sub_type.replace('-', ' ')

class MetadataView(DataView):
    Params = OrderedDict(
        vulnerability_type = RichCell("Vulnerability Type", "漏洞类型"),
        vulnerability_sub_type = RichCell("Vulnerability SubType", "漏洞细分", fmt=vulnerability_sub_type_info),
        rva = RichCell("RVA", "虚拟地址"),
        is_verified = RichCell("Verified", "验证状态"),
        cwes = RichCell("CWEs", "CWEs", fmt=cwes_info, width=25),
        disassembly = RichCell("Disassembly", "反汇编", fmt=dissassembly_info, width=80),
        additional_source_rvas = RichCell("Source RVAs", "源码向量", fmt=additional_source_rvas_info),
        callstack = RichCell("CallStack", "调用栈", fmt=callstack_info, width=80),
        regs = RichCell("Registers", "寄存器", fmt=regs_info, width=80),
        source = RichCell("Source", "源码", fmt=source_info, width=40),
        )

class ZerodayView(DataView):
    Params = OrderedDict(
        index = RichCell("Index", "索引", width=5),
        sub_type = RichCell("Class", "分类"),
        
        filepath = RichCell("File Path", "文件路径", width=50),
        metadata = MetadataView,
        checksum = RichCell("CHECKSUM", "文件校验和", width=65),
        )


def generate_report(data_manager, version_id, exporter, bookname, lang="en", maxrows=0): 
    columns = ZerodayView.columns()    
    original = data_manager.get_zeroday_threats(version_id)
    
    data = ZerodayView.data(original, maxrows=maxrows)    
    exporter.add_table(bookname, columns, data, lang=lang)

