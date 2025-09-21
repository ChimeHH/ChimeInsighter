import pathlib
import time
import json
import yaml 
from datetime import datetime 

from database.core.mongo_db import mongo_client
from database import master_database
from database import findings_database
from database import vuln_database
from database import sbom_database
from database import compliance_database

from pprint import pprint

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)
 

def datetime_converter(o):  
    if isinstance(o, datetime):  
        return o.isoformat()  

class DateTimeDumper(yaml.Dumper):  
    def represent_datetime(self, data):  
        return self.represent_scalar('tag:yaml.org,2002:timestamp', data.isoformat())  

yaml.add_representer(datetime, DateTimeDumper.represent_datetime)  

def _generate_raw_data(db_client, version_id, extended=False):
    tableVersions = master_database.TableVersions(db_client)

    stats = {}
    threats = {}
    files = []
    components = []


    version = tableVersions.getVersion(version_id)
    version.pop('_id', None)
    
    modes = version.get(tableVersions.SCAN_MODES, {})
    version[tableVersions.SCAN_MODES] = master_database.ScanModes(modes).to_dict()

    tableProjects = master_database.TableProjects(db_client)

    project_id = version[tableVersions.PROJECT_ID]
    project = tableProjects.getProject(project_id)
    project.pop('_id', None)

    options = project.get(tableProjects.SCAN_OPTIONS, {})
    project[tableProjects.SCAN_OPTIONS] = master_database.ScanOptions(options).to_dict()

    tableThreats = findings_database.TableThreats(db_client)
    tablePackages = findings_database.TablePackages(db_client)
    tableFiles = findings_database.TableFiles(db_client)

    for r in tableFiles.getVersionFiles(version_id):
        r.pop('_id', None)
        files.append(r) 
    stats['files'] = len(files)

    for r in tablePackages.getVersionPackages(version_id):
        r.pop('_id', None)
        components.append(r)        
    stats['components'] = len(components)

    for r in tableThreats.getVersionThreats(version_id):
        r.pop('_id', None)
        threat_type = r.pop(tableThreats.THREAT_TYPE)
        threat_subtype = r.pop(tableThreats.THREAT_SUBTYPE)

        threats.setdefault(threat_type, {})
        threats[threat_type].setdefault(threat_subtype, [])
        threats[threat_type][threat_subtype].append(r)



    return dict(project=project, versio=version, stats=stats, files=files, threats=threats)

def export_json(db_client, version_id, filepath, lang="en", maxrows=0, extended=False):
    all_data = _generate_raw_data(db_client, version_id)
    with filepath.open('w') as f:
        json.dump(all_data, f, default=datetime_converter, indent=2)

def export_yaml(db_client, version_id, filepath, lang="en",  maxrows=0, extended=False):
    all_data = _generate_raw_data(db_client, version_id)
    with filepath.open('w') as f:
        yaml.dump(all_data, f, Dumper=DateTimeDumper, default_flow_style=False, sort_keys=False)

