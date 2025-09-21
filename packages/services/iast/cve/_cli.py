import re
import time
import pathlib
import pickle
import shutil
import subprocess
from datetime import datetime
from pprint import pprint

from database.core.mongo_db import mongo_client

from services.core.cve_search import cve_search_by_product_version

from exlib.concurrent.context import WorkerResult

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class CveScanException(Exception):
    pass

class CveScanLinuxKernelException(Exception):
    pass

def scan(context):
    try:
        results = []
            
        with mongo_client() as client:
            components = context.metadata.get('components', [])
            labels = context.metadata.get('labels', []) or []
            
            for meta in components:                
                component_name = meta.get('fullname', meta.get('name', ''))
                if not component_name:
                    log.warning(f"missing component name in meta")
                    continue

                promote_sources = { filename: percent for filename,percent in meta.get('promote_sources', []) or [] }

                # 这里，我们不再检查克隆标记。在日常测试中，我们发现，部分克隆产品的漏洞，并不被大组件报告。这里的检查，会导致漏报。
                # clone = meta.get('clone', None)
                # if clone:
                #     log.warning(f"ignore cloned {fullname}")
                #     continue

                version = meta.get('version', '')
                summary = meta.get('summary', {})

                log.debug(f"searching cve: {component_name}:{version}, labels:{labels}")
                cves = cve_search_by_product_version(client, component_name, version, summary, labels=labels, promote_sources=promote_sources)
                for cve in cves:
                    results.append(cve)

        return WorkerResult(context, {'cve': results})

    except Exception as e:
        errstr = f"iast/cve failed to analyze cve on {context.version_id}/{context.filepath}, reason: {e}"
        log.exception(errstr)
        raise CveScanException(errstr)



if __name__=="__main__":
    '''
    'components': [   {   'fullname': 'busybox@mirror',
                                                                                                  'real_score': {   'c': 0,
                                                                                                                    'e': 0,
                                                                                                                    'n': 0.0,
                                                                                                                    's': 0.3557622243354174},
                                                                                                  'scale_percent': 0.792911,
                                                                                                  'version': '1.35.0'}],
    '''
    from addict import Addict
    context = Addict({ 
                "version_id": "unittest",
                "filepath": "fake",
                "reports": {},

                "metadata": { }
            })
    context.metadata['components'] = [  
                                        {   'fullname': 'log4j@maven.org.apache', 'version': '1.2.13'},
                                    ]

    wr = scan(context)
    print(wr)

    cves = wr.context.result.cve
    for i, cve in enumerate(cves):
        print(f"{i}. {cve['cve_id']}, {cve['cpe']}:: {cve['cpes']}")


