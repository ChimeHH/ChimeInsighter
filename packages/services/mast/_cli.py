import os
import pathlib
from pprint import pprint

from exlib.concurrent.context import WorkerResult
from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

SPOTBUGS_JAR = os.getenv("SPOTBUGS", default="/usr/share/spotbugs/lib/spotbugs.jar")
def xml_to_dict(xml_file_path: pathlib.Path) -> dict:    
    import xmltodict

    """
    将 XML 文件内容转换为字典。

    :param xml_file_path: XML 文件的路径
    :return: XML 文件内容的字典
    """
    with xml_file_path.open('r', encoding='utf-8') as xml_file:
        # 读取 XML 内容并转换为字典
        xml_content = xml_file.read()
        dict_data = xmltodict.parse(xml_content)

        # 递归去掉字典中的 '@' 符号
        def remove_at_sign(d):
            if isinstance(d, dict):
                return {key.lstrip('@'): remove_at_sign(value) for key, value in d.items()}
            elif isinstance(d, list):
                return [remove_at_sign(item) for item in d]
            else:
                return d

    return remove_at_sign(dict_data)
    
    return dict_data

def qscan(context):
    from qark.decompiler.decompiler import Decompiler    
    from qark.scanner.scanner import Scanner
    from qark.issue import Issue

    def _severity_map(value):
        if value >= 3:
            return 'high'
        if value == 2:
            return 'medium'
        if value == 1:
            return 'low'
        if value == 0:
            return 'advice'

        return None

    try:
        results = []

        # qark不支持jar扫描；如果是apk，则扫描apk；如果是java，则扫描目录
        if 'apk' in context.labels:
            source_path = context.filepath
            build_path = context.filepath_p.parent / '_qscan' # root 
        else:
            source_path = context.filepath_p / 'rel'
            build_path = context.filepath_p.parent / '_qscan' # root 

        log.debug(f"Decompiling {source_path}")
        decompiler = Decompiler(path_to_source=str(source_path), build_directory=str(build_path))
        decompiler.run()

        log.debug(f"Running scans to {source_path}")
        path_to_source = decompiler.path_to_source if decompiler.source_code else decompiler.build_directory

        scanner = Scanner(manifest_path=decompiler.manifest_path, path_to_source=path_to_source)
        scanner.run()
        log.debug("Finish scans to {source_path}")

        for issue in scanner.issues:
            result = dict(category = issue.category,
                        severity = _severity_map(issue.severity.value),
                        description = issue.description,
                        vulnerability_type = 'qscan',
                        vulnerability_sub_type = issue.name,
                        line_number = f"{issue.line_number[0]}:{issue.line_number[1]}" if issue.line_number else None,
                        file_object = issue.file_object,
                        apk_exploit_dict = issue.apk_exploit_dict)
            results.append(result)

        return WorkerResult(context, {'qscan': results})

    except Exception as e:
        errstr = f"mast/qscan failed to analyze {context.version_id}/{context.filepath}, reason: {e}"
        log.exception(errstr)
        return -1

def mscan(context):
    from mobsfscan.mobsfscan import MobSFScan

    def _severity_map(value):
        if value >= 'ERROR':
            return 'high'
        if value == 'WARNING':
            return 'medium'
        if value == 'INFO':
            return 'low'

        return None

    try:
        results = []

        # mobsf can only handle source code, like java, swift, xml, twikle, objective-c, etc        
        source_path = context.filepath_p / 'rel'

        scanner = MobSFScan([str(source_path), ], json=True)
        report = scanner.scan()

        for name, issue in report.get('results', {}).items():
            metadata = issue.get('metadata', {})
            metadata['vulnerability_type'] = 'mscan'
            metadata['vulnerability_sub_type'] = name
            metadata['files'] = issue.get('files', [])
            metadata['severity'] = _severity_map(metadata.get('severity', None))
            cwe = metadata.get('cwe', None)
            if cwe:
                metadata['cwe'] = cwe.split(':')[0].strip().upper()
            
            results.append(metadata)

        return WorkerResult(context, {'mscan': results})

    except Exception as e:
        errstr = f"mast/mscan failed to analyze {context.version_id}/{context.filepath}, reason: {e}"
        log.exception(errstr)
        return -1

def sscan(context):    
    import subprocess

    def _severity_map(value):
        if value == '1':
            return 'high'
        if value == '2':
            return 'medium'
        if value == '3':
            return 'low'
        if value == '4':
            return 'advice'

        return None

    try:
        results = []

        if 'apk' in context.labels or 'jar' in context.labels:
            source_path = context.filepath
            report_path = context.filepath_p / '_sscan' / 'report.xml' # root 
        else:
            source_path = context.filepath_p / 'rel'
            report_path = context.filepath_p / '_sscan' / 'report.xml' # root 

        report_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            command = f"java -jar {SPOTBUGS_JAR}  -output {str(report_path)} -xml:withMessages {str(source_path)}"
            log.debug(command)
            p = subprocess.run(command, shell=True, check=True, capture_output=False)
        except Exception as e:
            errstr = f"sscan failed to scan {context.version_id}: {context.filepath}, reason: {e}"
            log.exception(errstr)
            return -1

        if p.returncode < 0:
            log.debug(f"returncode: {p.returncode}, {p.stdout}, {p.stderr}")
            
        report = xml_to_dict(report_path)        
        # 'priority': '2',
        # 'type': 'CT_CONSTRUCTOR_THROW'},
        for metadata in report.get('BugCollection', {}).get('BugInstance', []):
            metadata['vulnerability_type'] = 'sscan'
            metadata['vulnerability_sub_type'] = metadata.pop('type', None)
            metadata['severity'] = _severity_map(metadata.pop('priority', None))

            results.append(metadata)
            
        return WorkerResult(context, {'sscan': results})
    except subprocess.CalledProcessError:
        log.warning(f"mast/sscan failed to analyze {context.version_id}/{context.filepath}, reason: {e}")
        return -1

    except Exception as e:
        log.exception(f"mast/sscan failed to analyze {context.version_id}/{context.filepath}, reason: {e}")
        return -1



def fscan(context):    
    from .msf import MobSFScanner

    def _severity_map(value):
        if value == 'high':
            return 'high'        
        if value == 'dangerous':
            return 'high'
        if value in ('warning', 'unknown', "hotspot", "secure"):
            return 'medium'
        if value == ('suppressed', 'info'):
            return 'low'
        if value == ('normal', ):
            return 'advice'
        return 'advice'

    try:
        results = []

        filepath = context.filepath

        scanner = MobSFScanner()          
        scan_id = scanner.upload(filepath)
        if scan_id:
            try:
                report = scanner.scan(scan_id) 

                if report and not report.get('error', None):
                    activities = report.get("activities", [])
                    if activities:
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='activities', severity='advice', activities=activities)
                        results.append(metadata)

                    certificates = report.get("certificate_analysis", {}).get("certificate_findings", [])
                    for cert in certificates:
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='certificates', severity=_severity_map(cert[0]), name=cert[2], description=cert[1])
                        results.append(metadata)

                    permissions = report.get("permissions", {})
                    top_malware_permissions = report.get("malware_permissions", {}).get("top_malware_permissions", {})
                    other_abused_permissions = report.get("malware_permissions", {}).get("other_abused_permissions", {})                        
                    for ptype, permission in permissions.items():
                        status = permission.get('status', "")
                        info = permission.get('info', "")
                        description = permission.get('description', "")
                        if ptype in top_malware_permissions:
                            risk = 'top_malware_permissions'
                        elif ptype in other_abused_permissions:
                            risk = 'other_abused_permissions'
                        else:
                            risk = ""
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='permissions', severity=_severity_map(status), type=ptype, risk=risk, info=info, description=description)
                        results.append(metadata)

                    manifests = report.get("manifest_analysis", {}).get("manifest_findings", [])
                    for mani in manifests:
                        rule = mani.get("rule", "")
                        title = mani.get("title", "")
                        severity = mani.get("severity", "")
                        description = mani.get("description", "")
                        name = mani.get("name", "")
                        component = mani.get("component", [])
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='manifests', severity=_severity_map(severity), rule=rule, title=title, name=name, description=description, component=component)
                        results.append(metadata)

                    networks  = report.get('network_security', {}).get('network_findings', [])

                    binaries = report.get('binary_analysis', [])
                    for binary in binaries:
                        filename = binary.pop('name')
                        issues = {}
                        for k, v in binary.items():                            
                            issues[k] = v['description']
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='binary_hardening', severity='low', data=issues)
                        results.append(metadata)

                    android_apis = report.get("android_api", {})
                    for name, r in android_apis.items():
                        files = r.get('files', {})
                        severity = r.get('metadata', {}).get('severity', "")
                        description = r.get('metadata', {}).get('description', "")
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='android_apis', severity=_severity_map(severity), name=name, description=description, files=files)
                        results.append(metadata)

                    code_analysis = report.get("code_analysis", {}).get("findings", {})
                    for name, r in code_analysis.items():
                        files = r.get('files', {})
                        cvss = r.get('metadata', {}).get('cvss', "")
                        cwe  = r.get('metadata', {}).get('cwe', "").split(":")[0]
                        owasp = r.get('metadata', {}).get('owasp-mobile', "")
                        masvs = r.get('metadata', {}).get('masvs', "")

                        severity = r.get('metadata', {}).get('severity', "")
                        description = r.get('metadata', {}).get('description', "")
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='code_analysis', severity=_severity_map(severity), name=name, description=description, files=files, cwe=cwe, owasp=owasp, masvs=masvs)
                        results.append(metadata)

                    urls_analysis = report.get('urls', [])
                    for r in urls_analysis:
                        urls = r.get('urls', [])
                        path = r.get('path', "")
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='urls_analysis', severity=_severity_map(severity), path=path, urls=urls)
                        results.append(metadata)
                    
                    domains_analysis = report.get('domains', {})
                    for domain, r in domains_analysis.items():
                        bad = r.get('bad', "")
                        reference = r.get('geolocation', "")
                        ofac = r.get('ofac', False)
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='domains_analysis', severity=_severity_map(severity), domain=domain, bad=bad, ofac=ofac, reference=reference)
                        results.append(metadata)

                    # emails_analysis = report.get('emails', [])
                    # for r in emails_analysis:
                    #     emails = r.get('emails', [])
                    #     path = r.get('path', "")
                    #     metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='emails_analysis', severity=_severity_map(severity), path=path, emails=emails)
                    #     results.append(metadata)

                    apkid_analysis = report.get('apkid', {})
                    for name, r in apkid_analysis.items():                        
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='apkid_analysis', severity=_severity_map(severity), name=name)
                        metadata.update(r)
                        results.append(metadata)

                    behaviour_analysis = report.get('behaviour', {})
                    for _, r in behaviour_analysis.items():   
                        files = r.get('files', {})      
                        label = r.get('metadata', {}).get('label', "") 
                        severity = r.get('metadata', {}).get('severity', "")
                        description = r.get('metadata', {}).get('description', "")               
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='behaviour_analysis', severity=_severity_map(severity), description=description, label=label, files=files)
                        results.append(metadata)

                    secrets_analysis = report.get('secrets', [])
                    if secrets_analysis:
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='secrets_analysis', severity=_severity_map(severity), data=secrets_analysis)
                        results.append(metadata)

                    sbom_versioned = report.get("sbom", {}).get("sbom_versioned", [])   
                    sbom_packages = report.get("sbom", {}).get("sbom_packages", [])
                    for r in sbom_versioned:
                        ts = r.split(":")
                        if len(ts) == 2:
                            typ = ts[0]
                            pvs = ts[1].split('@')
                            if len(pvs) ==  2:
                                metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='sbom_external', severity="advice", type=typ, name=pvs[0], version=pvs[1])
                                results.append(metadata)

                    for r in sbom_packages:
                        metadata = dict(vulnerability_type='fscan', vulnerability_sub_type='sbom_internal', severity="advice", name=r)
                        results.append(metadata)                       

            except:
                log.exception(f"failed to run fscan on {filepath}")
                return -1

            finally:
                scanner.delete(scan_id)
            
        return WorkerResult(context, {'fscan': results})

    except Exception as e:
        errstr = f"mast/fscan failed to analyze {context.version_id}/{context.filepath}, reason: {e}"
        log.exception(errstr)
        return -1



if __name__ == '__main__':
    import addict
    import sys
    import argparse
    import pathlib

    from pprint import pprint

    # 定义命令行参数
    parser = argparse.ArgumentParser(description='Mobile scan routines.')
    parser.add_argument('filepath', type=str, 
                        help='Path to the binary file to scan.')
    parser.add_argument('sourcepath', type=str, 
                        help='Path to the extracted folder to scan.')
    
    args = parser.parse_args()

    filepath=pathlib.Path(args.filepath).resolve()
    filepath_p = pathlib.Path(args.sourcepath).resolve()

    labels = []    
    if '.apk' in filepath.name:
        labels.append('apk')
    elif '.jar' in filepath.name:
        labels.append('jar')
    elif '.ipa' in filepath.name:
        labels.append('ipa')
    elif '.appx' in filepath.name:
        labels.append('appx')
    elif '.tar' in filepath.name:
        labels.append('mcode')
    else:
        labels.append('zip')


    context = addict.Addict(version_id='unittest', filepath=filepath, filepath_p=filepath_p, labels=labels)  

    if any(item in labels for item in ('mcode', 'apk')):
        retcode = qscan(context)
        log.debug("qscan retcode: {}".format(retcode))
    
    if any(item in labels for item in ('mcode', )):
        retcode = mscan(context)
        log.debug("mscan retcode: {}".format(retcode))

    if any(item in labels for item in ('zip', 'apk', 'jar')):
        retcode = sscan(context)
        log.debug("sscan retcode: {}".format(retcode))

    if any(item in labels for item in ('zip', 'apk', 'jar', 'ipa', 'appx')):
        retcode = fscan(context)
        log.debug("fscan retcode: {}".format(retcode))
    


'''
python -m services.mast._cli xgb_app.apk _apk/root
python -m services.mast._cli tests.zip _java/root
python -m services.mast._cli gson.jar _jar/root


'''