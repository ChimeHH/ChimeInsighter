from exlib.export.view import RmlDocView
from exlib.export import pdf

from database import master_database
from database import findings_database

class RmlOverview(RmlDocView):
    _document = {
        "heading": ["Software Compostition and Security Analysis Report", "软件合规与安全分析报告"],
        "title": ["Overview", "平台简介"],
        "overview": [
                ["Thank you for choosing the Chime Digital Twins Software Compostition and Security Analysis Platform designed by Chime Security Lab. Chime Digital Twins provides two major features: software compostition analysis and software security analysis.",
                 "Software composition analysis (SCA) is an automated process that identifies the open source software in a codebase. This analysis is performed to evaluate security, license compliance, and code quality. Companies need to be aware of open source license limitations and obligations.",
                 "And from this initial use case, SCA expanded to analyze code security and quality. We call it Software Security Analysis. Software Security Analysis is a comprehensive use of a series of detection methods, such as Yara rule matching, virtual operation, etc., to discover various risks in the software, such as malware, information leakage, misconfiguration, unknown vulnerabilities, etc.",
                 "Chime Digital Twins 3.0 is based on the 3rd generation binary analysis technology engine. Compared with the 2nd generation engine in the current market, it can support both source code detection and binary detection. It has the characteristics of low running resources, fast speed, and allows customers to quickly generate and add any compostition to feature database. Most engines can run well on general computers with 32GB of memory. (Note: No special configuration is required except the zeroday engine in this case)"],

                ["感谢您选择极目安全实验室设计的极目数字孪生软件成分和安全分析平台，该平台提供两个主要功能：软件成分分析和软件安全分析。",
                 "软件成分分析Software Compostition Analysis (SCA)是一种用于管理开源组件应用安全的方法。通过 SCA，开发团队可以快速跟踪和分析引入项目的开源组件。同时，SCA工具可以发现所有相关组件、支持库以及它们之间直接和间接依赖关系。SCA工具还可以检测软件许可证、已弃用的依赖项以及漏洞和潜在威胁。扫描过程会生成物料清单 Bill of Materials（BOM），从而提供项目软件资产的完整清单。",
                 "软件安全分析Software Security Analysis是综合利用一些列的检测方法，如Yara规则匹配，虚拟运行等，发现软件中存在的各类风险，如恶意软件，信息泄露，错误配置，未知漏洞等。",
                 "极目数字孪生3.0基于第三代软件分析技术引擎，相比于当前市场的第二代，能同时支持源代码检测和二进制检测，具有运行资源低，速度快，允许客户快速生成新组件特征库等特性，其它功能可稳定运行在32GB内存的普通主机，(注，低配置时未知漏洞引擎需要特殊配置）。"],
            ],
        }    

    @classmethod
    def generate_report(cls, exporter, data_manager, lang="en"):
        exporter.append(exporter.draw_paragraph(cls.document('heading', lang), exporter.stylesheet.Title))

        exporter.append(exporter.draw_emptyline())
        exporter.append(exporter.draw_text("才饮长沙水，又食武昌鱼。万里长江横渡，极目楚天舒。不管风吹浪打，胜似闲庭信步，今日得宽馀。子在川上曰：逝者如斯夫！", fontSize=9, alignment=0, firstLineIndent=0))
        exporter.append(exporter.draw_text("-- 水调歌头·游泳, 毛泽东", alignment=2, fontSize=9))

        exporter.append(exporter.draw_emptyline())
        exporter.append(exporter.draw_emptyline())
        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('title', lang)}", exporter.stylesheet.Heading2))

        exporter.append(exporter.draw_emptyline())

        for text in cls.document('overview', lang):
            exporter.append(exporter.draw_paragraph(text, exporter.stylesheet.body))

