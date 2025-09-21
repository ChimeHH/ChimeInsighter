import re
import copy
import json
from exlib.classes.base import BaseClass
from database import master_database
from database import findings_database
from database import vuln_database
from database import sbom_database
from database import compliance_database


class DataManager(BaseClass):
    def __init__(self, client):
        super().__init__()
        self.client = client

    def get_project(self, project_id):
        tableProjects = master_database.TableProjects(self.client)

        project = tableProjects.getProject(project_id)
        options = project.get(tableProjects.SCAN_OPTIONS, {})
        project[tableProjects.SCAN_OPTIONS] = master_database.ScanOptions(options).to_dict()

        return project

    def get_project_versions(self, project_id):
        tableVersions = master_database.TableVersions(self.client)
        tableThreats = findings_database.TableThreats(self.client)
        tablePackages = findings_database.TablePackages(self.client)
        tableFiles = findings_database.TableFiles(self.client)

        versions = tableVersions.getVersions(project_id)        
        versions.sort(key=lambda v: v['created_time'])

        for version in versions:
            version_id = version['version_id']
            
            threats = tableThreats.getVersionThreats(version_id, tableThreats.ThreatTypes.PUBLIC, tableThreats.ThreatTypes.ZERODAY, tableThreats.ThreatTypes.PASSWORD, 
                                            tableThreats.ThreatTypes.MALWARE, tableThreats.ThreatTypes.MISCONFIGURATION, )
            version['type_stats'] = tableThreats.getThreatsStats(threats, dime='type')
            
            threats = tableThreats.getVersionThreats(version_id, tableThreats.ThreatTypes.INFOLEAK, )
            version['subtype_stats'] = tableThreats.getThreatsStats(threats, dime='subtype')

            version['components'] = len(tablePackages.getVersionPackages(version_id))
            version['files'] = len(tableFiles.getVersionFiles(version_id))

        return versions

    def get_version(self, version_id):
        tableVersions = master_database.TableVersions(self.client)

        version = tableVersions.getVersion(version_id)
        modes = version.get(tableVersions.SCAN_MODES, {})
        version[tableVersions.SCAN_MODES] = master_database.ScanModes(modes).to_dict()

        return version

    def get_files(self, version_id):
        tableFiles = findings_database.TableFiles(self.client)

        cursor = tableFiles.get(version_id) 
        
        original = []
        for r in cursor:
            original.append(r)

        return original

    def get_components(self, version_id, lang='cn'):
        tablePackages = findings_database.TablePackages(self.client)
        tableFiles = findings_database.TableFiles(self.client)
        
        tableComplianceLicense = compliance_database.TableComplianceLicenses(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1, tableFiles.FILETYPE: 1, tableFiles.LABELS: 1, tableFiles.HASHES: 1,}) 
        files = { r['checksum']: r for r in cursor }

        cursor = tablePackages.get(version_id)
        original = []
        for r in cursor:
            meta = {}

            checksum = r.get('checksum', None)
            if not checksum:
                continue

            fullname = r.get('fullname')
            version = r.get('version') or ''
            meta['fullname'] = fullname
            meta['version'] = version
            if '@' in fullname:
                meta['name'] = fullname.split('@')[0]
                meta['origin'] = fullname.split('@')[1] + "/" + meta['name']
            else:
                meta['name'] = fullname
                meta['origin'] = ""

            meta['clone'] = r.get('clone') or ''
            meta['scale'] = r.get('scale', 0)
            meta['integrity'] = r.get('integrity', 0)            
            meta['uid'] = r.get('uid', None)

            meta['score'] = r.get('score', {})
                        
            packages = None
            licenses = None
            file_info = files.get(checksum, {})

            meta['file_info'] = file_info
            meta['checksum'] = checksum 
            meta['filepath'] = file_info.get('filepath_r', [])[:5]

            summary = r.pop('summary', None)
            if summary:
                licenses = summary.pop('licenses', [])                
                meta.update(summary)

                license_names = set()
                for r in  licenses:
                    if isinstance(r, dict):
                        license = r.get('license', None)
                        if license:
                            license_names.add(license)
                    elif r:
                        license_names.add(r)

                meta['license_data'] = []
                for license_name in license_names:
                    license = tableComplianceLicense.findLicense(license_name)
                    if license:
                        meta['license_data'].append({ 'license': license.license_id, 'url': license.url, 'type': license.license_type, 'reference': license.reference.get(lang, license.reference.get('en', {})) })

                    else:
                        meta['license_data'].append({ 'license': str(license_name)[:64], 'type': None, "url": None, 'reference': {} })
            
            original.append(copy.copy(meta))

        return original

    def get_version_stats(self, version_id):
        tableVersions = master_database.TableVersions(self.client)
        version = tableVersions.getVersion(version_id)
        
        stats = version.get(tableVersions.STATS, None)
        if not stats:
            tableVersions = master_database.TableVersions(self.client)
            tableThreats = findings_database.TableThreats(self.client)
            tablePackages = findings_database.TablePackages(self.client)
            tableFiles = findings_database.TableFiles(self.client)

            all_threats = tableThreats.getVersionThreats(version_id) 
            all_files = tableFiles.getVersionFiles(version_id)
            all_packages = tablePackages.getVersionPackages(version_id)                   
            
            threats_stats = tableThreats.getThreatsStats(all_threats)
            files_stats = tableFiles.getFiletypesStats(all_files)                    
            components_stats = tablePackages.getComponentsStats(all_packages)
            licenses_stats = tablePackages.getLicensesStats(all_packages)                    
            
            stats = dict(files=files_stats, packages=components_stats, licenses=licenses_stats, threats=threats_stats)
            tableVersions.updateVersion(version_id, stats=stats)

        return stats

    def get_cve_threats(self, version_id):
        tableThreats = findings_database.TableThreats(self.client)
        tableFiles = findings_database.TableFiles(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
        files = { r['checksum']: r['filepath_r'] for r in cursor }

        cursor = tableThreats.get(version_id, tableThreats.ThreatTypes.PUBLIC)
        original = []
        for r in cursor:
            meta = copy.copy(r) 

            checksum = r.get('checksum', None)
            if not checksum:
                continue

            metadata = r.get('metadata', None)
            if not metadata:
                continue

            if 'description' in metadata:
                metadata['description'] = metadata['description'][:1024]

            references = metadata.get('references', [])
            if references:
                metadata['references'] = references[:5]

            if metadata.get('origin', None) == "unknown":
                metadata['origin'] = None

            metadata.pop('platform', None)
            
            if 'severity' not in meta:
                meta['severity'] = tableThreats.getThreatSeverity(r)

            meta['checksum'] = checksum          
            meta['filepath'] = files.get(checksum, [])[:5]

            original.append(meta)

        return original

    def get_cnnvd_threats(self, version_id):
        tableThreats = findings_database.TableThreats(self.client)
        tableFiles = findings_database.TableFiles(self.client)
        tableCnnvds = vuln_database.TableVulnCnnvds(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
        files = { r['checksum']: r['filepath_r'] for r in cursor }

        cursor = tableThreats.get(version_id, tableThreats.ThreatTypes.PUBLIC)
        original = []

        for r in cursor:
            checksum = r.get('checksum', None)
            if not checksum:
                continue

            metadata = r.get('metadata', None)
            if not metadata:
                continue
            
            cve_id = metadata.get('cve_id', None)
            if not cve_id:
                continue
                      
            cursor2 = tableCnnvds.find_cve(cve_id)  
            for r2 in cursor2:
                meta = copy.copy(r2) 

                if 'severity' not in meta:
                    meta['severity'] = tableThreats.getThreatSeverity(r2)

                meta['checksum'] = checksum          
                meta['filepath'] = files.get(checksum, [])[:5]

                original.append(meta)

        return original

    def get_cnvd_threats(self, version_id):
        tableThreats = findings_database.TableThreats(self.client)
        tableFiles = findings_database.TableFiles(self.client)
        tableCnvds = vuln_database.TableVulnCnvds(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
        files = { r['checksum']: r['filepath_r'] for r in cursor }

        cursor = tableThreats.get(version_id, tableThreats.ThreatTypes.PUBLIC)
        original = []

        for r in cursor:
            checksum = r.get('checksum', None)
            if not checksum:
                continue

            metadata = r.get('metadata', None)
            if not metadata:
                continue
            
            cve_id = metadata.get('cve_id', None)
            if not cve_id:
                continue
         
            cursor2 = tableCnvds.find_cve(cve_id)  
            for r2 in cursor2:
                meta = copy.copy(r2) 

                if 'severity' not in meta:
                    meta['severity'] = tableThreats.getThreatSeverity(r2)

                meta['checksum'] = checksum          
                meta['filepath'] = files.get(checksum, [])[:5]

                original.append(meta)

        return original

    def get_jvn_threats(self, version_id):
        tableThreats = findings_database.TableThreats(self.client)
        tableFiles = findings_database.TableFiles(self.client)
        tableJvns = vuln_database.TableVulnJvns(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
        files = { r['checksum']: r['filepath_r'] for r in cursor }

        cursor = tableThreats.get(version_id, tableThreats.ThreatTypes.PUBLIC)
        original = []

        for r in cursor:
            checksum = r.get('checksum', None)
            if not checksum:
                continue

            checksum = r.get('checksum', None)
            if not checksum:
                continue

            metadata = r.get('metadata', None)
            if not metadata:
                continue
            
            cve_id = metadata.get('cve_id', None)
            if not cve_id:
                continue
        
            cursor2 = tableJvns.find_cve(cve_id)  
            for r2 in cursor2:
                meta = copy.copy(r2) 

                if 'severity' not in meta:
                    meta['severity'] = tableThreats.getThreatSeverity(r2)

                meta['checksum'] = checksum          
                meta['filepath'] = files.get(checksum, [])[:5]

                original.append(meta)

        return original


    def get_zeroday_threats(self, version_id):
        tableThreats = findings_database.TableThreats(self.client)
        tableFiles = findings_database.TableFiles(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
        files = { r['checksum']: r['filepath_r'] for r in cursor }

        cursor = tableThreats.get(version_id, tableThreats.ThreatTypes.ZERODAY)
        original = []
        for r in cursor:
            if r.get('sub_type', None) in ['qscan', 'mscan', 'sscan']:
                continue

            meta = copy.copy(r)  
            
            checksum = r.get('checksum', None)
            if not checksum:
                continue

            metadata = r.get('metadata', None)
            if not metadata:
                continue         
            
            if 'severity' not in meta:
                meta['severity'] = tableThreats.getThreatSeverity(r)

            meta['checksum'] = checksum        
            meta['filepath'] = files.get(checksum, [])[:5]

            original.append(meta)

        return original

    def get_mobile_threats(self, version_id):
        tableThreats = findings_database.TableThreats(self.client)
        tableFiles = findings_database.TableFiles(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
        files = { r['checksum']: r['filepath_r'] for r in cursor }

        cursor = tableThreats.get(version_id, tableThreats.ThreatTypes.MOBILE)
        original = []
        for r in cursor:            
            meta = copy.copy(r)  
            
            checksum = r.get('checksum', None)
            if not checksum:
                continue

            metadata = r.pop('metadata', None)
            if not metadata:
                continue
            
            meta['checksum'] = checksum        
            meta['filepath'] = files.get(checksum, [])[:5]

            meta['metadata'] = {}
            meta['metadata']['vulnerability_type'] = metadata.pop('vulnerability_type', None)
            meta['metadata']['vulnerability_sub_type'] = metadata.pop('vulnerability_sub_type', None)
            meta['metadata']['cwe'] = metadata.pop('cwe', None)
            meta['metadata']['severity'] = metadata.pop('severity', None)
                        
            meta['metadata']['appendix'] = metadata

            original.append(meta)

        return original
        
    def get_password_threats(self, version_id):
        tableThreats = findings_database.TableThreats(self.client)
        tableFiles = findings_database.TableFiles(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
        files = { r['checksum']: r['filepath_r'] for r in cursor }

        cursor = tableThreats.get(version_id, tableThreats.ThreatTypes.PASSWORD)
        original = []
        for r in cursor:
            meta = copy.copy(r)            
            checksum = r.get('checksum', None)
            if not checksum:
                continue

            metadata = r.get('metadata', None)
            if not metadata:
                continue

            if 'severity' not in meta:
                meta['severity'] = tableThreats.getThreatSeverity(r)

            meta['checksum'] = checksum
            meta['filepath'] = files.get(checksum, [])[:5]
            
            original.append(meta)

        return original

    def get_infoleak_threats(self, version_id):
        tableThreats = findings_database.TableThreats(self.client)
        tableFiles = findings_database.TableFiles(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
        files = { r['checksum']: r['filepath_r'] for r in cursor }

        cursor = tableThreats.get(version_id, tableThreats.ThreatTypes.INFOLEAK)
        original = []
        for r in cursor:
            meta = copy.copy(r)            
            checksum = r.get('checksum', None)
            if not checksum:
                continue

            metadata = r.get('metadata', None)
            if not metadata:
                continue

            if 'severity' not in meta:
                meta['severity'] = tableThreats.getThreatSeverity(r)

            meta['checksum'] = checksum         
            meta['filepath'] = files.get(checksum, [])[:5]
            
            original.append(meta)

        return original


    def get_misconfiguration_threats(self, version_id):
        tableThreats = findings_database.TableThreats(self.client)
        tableFiles = findings_database.TableFiles(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
        files = { r['checksum']: r['filepath_r'] for r in cursor }

        cursor = tableThreats.get(version_id, tableThreats.ThreatTypes.MISCONFIGURATION)
        original = []
        for r in cursor:
            meta = copy.copy(r)            
            checksum = r.get('checksum', None)
            if not checksum:
                continue

            metadata = r.get('metadata', None)
            if not metadata:
                continue

            if 'severity' not in meta:
                meta['severity'] = tableThreats.getThreatSeverity(r)

            meta['checksum'] = checksum           
            meta['filepath'] = files.get(checksum, [])[:5]
            
            original.append(meta)

        return original

    def get_security_threats(self, version_id):
        tableThreats = findings_database.TableThreats(self.client)
        tableFiles = findings_database.TableFiles(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
        files = { r['checksum']: r['filepath_r'] for r in cursor }

        cursor = tableThreats.get(version_id, tableThreats.ThreatTypes.SECURITY, )
        original = []
        for r in cursor:
            meta = copy.copy(r)            
            checksum = r.get('checksum', None)
            if not checksum:
                continue

            metadata = r.get('metadata', [])
            if not metadata:
                continue

            meta['filepath'] = files.get(checksum, [])[:5]
            
            original.append(meta)

        return original

    def get_malware_threats(self, version_id):
        tableThreats = findings_database.TableThreats(self.client)
        tableFiles = findings_database.TableFiles(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
        files = { r['checksum']: r['filepath_r'] for r in cursor }

        cursor = tableThreats.get(version_id, tableThreats.ThreatTypes.MALWARE)
        original = []
        for r in cursor:
            meta = copy.copy(r)            
            checksum = r.get('checksum', None)
            if not checksum:
                continue

            metadata = r.get('metadata', None)
            if not metadata:
                continue

            if 'severity' not in meta:
                meta['severity'] = tableThreats.getThreatSeverity(r)

            meta['checksum'] = checksum
            meta['filepath'] = files.get(checksum, [])[:5]
            
            original.append(meta)

        return original

    def get_compliance_threats(self, version_id):
        tableThreats = findings_database.TableThreats(self.client)
        tableFiles = findings_database.TableFiles(self.client)

        cursor = tableFiles.get(version_id, projection={tableFiles.CHECKSUM: 1, tableFiles.FILEPATH_R: 1}) 
        files = { r['checksum']: r['filepath_r'] for r in cursor }

        cursor = tableThreats.get(version_id, tableThreats.ThreatTypes.COMPLIANCE)
        original = []
        for r in cursor:
            meta = copy.copy(r)            
            checksum = r.get('checksum', None)
            if not checksum:
                continue

            metadata = r.get('metadata', None)
            if not metadata:
                continue

            if 'severity' not in meta:
                meta['severity'] = tableThreats.getThreatSeverity(r)
                
            meta['checksum'] = checksum        
            meta['filepath'] = files.get(checksum, [])[:5]
            
            original.append(meta)

        return original

    













