from exlib.export.view import RmlDocView
from exlib.export import pdf

from database import master_database
from database import findings_database

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


class RmlComponent(RmlDocView):
    _document = {
        "title": ["Compliance", "合规标准"],
        "introduce": ["The SBOM database covers most often used open source components and closed-source commercial software. However, it's impossible to include all known whatever. For example, the Pypi library contains more than 555,000 components in total. It takes several months to compute tokens from all these components. Considering that there are a large number of components in various other languages, the token database will be up to TBs. For most customers, importing a TB-level database is too hard to achive. Therefore, our SBOM database only includes most often used ones. At the same while, commercial customers still can add new component features as needed, via our toolset. The process of adding components is really simple. For example, components on GitHub and Pypi sites can be added almost automatically once giving the name of repos or packages", 
                    "组件列表，涵盖常用的开源组件，以及部分闭源的商业软件。但即便如此，也只能有限收录，比如Pypi库总共收录有55.5万多个组件,对所有这些组件生成特征库，需要数个月的计算时间；考虑到其它各种语言均存在大量的组件，产生的数据将超过TB。对于大部分用户来说，导入TB级的数据库会是非常困难的工作。因此，特征库只能有限收录常用的，同时，商业用户可以根据需要，使用附带的工具链添加新的组件特征。添加组件的过程大多比较简单，比如GitHub,Pypi站点的组件，仅需要告诉工具相应的仓库或组件名。"],
        "no_records": ["No records found.", "未发现相关的记录"],

        "table_stat": ["Component Stat Table", "组件统计表"],
        "pie_stat": ["Component Stat Bar", "组件分布图"],
        "table_list": ["Component List Table", "组件清单"],    
    }    

    @classmethod
    def generate_report(cls, exporter, data_manager, version_id, lang="en", maxrows=0):
        exporter.append(exporter.draw_paragraph(f"<seq id='spam'/>.{cls.document('title', lang)}", exporter.stylesheet.Heading2))
        exporter.append(exporter.draw_paragraph(cls.document('introduce', lang), exporter.stylesheet.body))
                
        components = data_manager.get_components(version_id, lang=lang)
        if not components:
            exporter.append(exporter.draw_text(cls.document('no_records', lang)))
            return
        
        license_stats = {}
        
        for meta in components:
            license_data = meta.get('license_data', {})
            for license_info in license_data:
                license = license_info.get('license', "NA")
                typ = license_info.get('type', "")
                reference = license_info.get('reference', {})
                summary = reference.get('summary', "")
                usageSuggestion = reference.get('usageSuggestion', "")

                license_stats.setdefault(license, dict(count=0, type=typ, summary=summary, usageSuggestion=usageSuggestion))
                license_stats[license]['count'] += 1

        if license_stats:
            log.info(f"license_stats: {license_stats}")      
            ax_data = list(license_stats.keys())

            exporter.append(exporter.draw_paragraph(f"1) {cls.document('table_stat', lang)}", exporter.stylesheet.Heading3))
            data = [("LICENSE", "TYPE", "COUNT", "SUMMARY", "SUGGESTION")]
            for license in ax_data:
                data.append((license, license_stats[license]['type'], license_stats[license]['count'], exporter.draw_cell(license_stats[license]['summary']), exporter.draw_cell(license_stats[license]['usageSuggestion'])))

            exporter.append(exporter.draw_table(*data, col_width=[80, 60, 30, 160, 160]))

            exporter.append(exporter.draw_paragraph(f"2) {cls.document('pie_stat', lang)}", exporter.stylesheet.Heading3))
            b_data = [ info['count'] for license, info in license_stats.items()]
            exporter.append(exporter.draw_pie(b_data, ax_data))

        data = [("NO.", "COMPONENT", "LICENSE", "PATHES"),]
        
        index = 0
        for meta in components[:maxrows]:
            license_data = meta.get('license_data', {})

            for license_info in license_data:
                license = license_info.get('license', "NA")
                
                index += 1
                path = "<br/>".join(meta['filepath'])
                line = (index, meta['fullname'], license, exporter.draw_cell(path) )
                data.append(line)

        exporter.append(exporter.draw_paragraph(f"3) {cls.document('table_list', lang)}", exporter.stylesheet.Heading3))
        exporter.append(exporter.draw_table(*data, col_width=[20, 120, 60, 300]))

