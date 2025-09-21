import re
import pathlib
from database.core.database import DatabaseClass
from database.vuln_database import TableVulnCves

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

def matches_pattern_ignore_special(pattern, b):
    b_filtered = re.sub(r'[^a-zA-Z0-9]', '', b)
    return re.search(pattern, b_filtered, re.IGNORECASE) is not None

def cve_search_by_product_version(client, name, version, summary, labels=None, promote_sources=None):
    tableVulnCves = TableVulnCves(client)
    
    if summary:
        product = summary.get('product_regex', None)
        product = DatabaseClass.to_python_regex(product) if product else summary.get('name', name.split('@')[0])
        vendor = summary.get('vendor_regex', None)
        vendor = DatabaseClass.to_python_regex(vendor) if vendor else summary.get('vendor', None)
    else:
        if '@' in name:
            product, vendor = name.split('@')
        else:
            product = name
            vendor = ""
                                                 
    log.debug("looking for vendor: {}, product: {}, version: {}".format(vendor, product, version))

    cves = tableVulnCves.find_product(product, vendor=vendor)
    for cve in cves:
        cve_id = cve.get('cve_id', None)
        if not cve_id:
            continue

        cpe = tableVulnCves.search_cpe(cve, product, version)
        if cpe:
            cve['cpe'] = cpe
            cve['component'] = dict(product=str(product), version=version, vendor=str(vendor))

            platforms = cve.pop('platform', [])
            sources = cve.get('source', [])

            # check operate system
            if labels and 'pe' in labels:
                cve['os_filtered'] = "windows/pe"
                for p in platforms:                                
                    pname = p.get('name', p.get('subname', None))
                    if pname and matches_pattern_ignore_special(r'win(32|64)?', pname):
                        cve.pop('os_filtered', None)
                        break

            # continue check sources
            if sources and promote_sources:
                source_filtered = {}

                for p in sources:
                    filename = pathlib.Path(p).name

                    if filename not in promote_sources:
                        source_filtered[p] = 0 # not existing at all
                    else:
                        # -1 means no-token files; others means the percent of tokens found; hence, the lower is less possible.
                        if promote_sources[filename] <= 0:
                            source_filtered[p] = -1 # not sure if existing because it's a no-token file
                        elif promote_sources[filename] <= 0.3: 
                            source_filtered[p] = round(promote_sources[filename], 3)

                if source_filtered:
                    cve['source_filtered'] = source_filtered

            yield cve