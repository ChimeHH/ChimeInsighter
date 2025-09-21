import time
import re
import traceback
import pathlib
import shutil
import pickle
import copy
from datetime import datetime
from pprint import pprint, pformat

from ..core.message import AstRequest, AstResponse
from amq.general import AmqQueue

from exlib.settings import osenv

from database.master_database import DatabaseMaster,TableProjects,ScanTypes,ScanOptions,ScanModes

from database.core.mongo_db import mongo_client
from database.master_database import TableProjects,TableVersions
from database.findings_database import TableFiles,TablePackages,TableThreats
from database.compliance_database import TableComplianceGuideline
from database.compliance_database import TableComplianceCwe
from database.vuln_database import TableVulnExploits

from exlib.utils.blacklist import Blacklist

from .file_data import FileData



from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


class UnknownEnginePipeline(Exception):
    pass

class EventHandle:
    def __init__(self, engine):
        self.engine = engine
                
    def _load_version(self, client):        
        tableVersions = TableVersions(client)
        tableProjects = TableProjects(client)

        versionRecord = tableVersions.getVersion(self.version_id)
        self.status = versionRecord.get(tableVersions.STATUS, None)
        
        self.project_id = versionRecord[tableVersions.PROJECT_ID]                
        projectRecord = tableProjects.getProject(self.project_id)

        self.version_path = self.engine.config.version_path(self.project_id, self.version_id)


        license_data = osenv.license_data()
        license_scope = license_data.get('scan_scope', {})

        self.scan_modes = ScanModes(versionRecord.get('scan_modes', None))
        self.scan_options = ScanOptions(projectRecord.get('scan_options', None), license_scope=license_scope)
        

    def _cleanup_version(self, client, revise=False):
        # revise here is reserved for further features
        tableFiles = TableFiles(client)
        tablePackages = TablePackages(client)
        tableThreats = TableThreats(client)
        
        log.debug("delete version history") 
        tableThreats.deleteVersion(self.version_id)
        tablePackages.deleteVersion(self.version_id)
        tableFiles.deleteVersion(self.version_id)

        if not revise:
            shutil.rmtree(self.version_path, ignore_errors=True)

class UIRequestHandle(EventHandle):
    def __init__(self, engine):
        super().__init__(engine)

    def _scan(self, client):
        log.info(f"cleanup previous findings and om of version {self.version_id}")

        self.engine.om.delete_version(self.version_id)
        self._cleanup_version(client, revise=self.scan_modes.revise)    

        start_time=datetime.utcnow()

        if self.scan_modes.revise:
            log.info(f"start revise rescanning version {self.version_id}")

            response_queue = self.engine.in_queue(self.scan_modes.priority)

            self.engine.om.init_version_status(self.version_id, start_time.isoformat())
            TableVersions(client).updateVersion(self.version_id, start_time=start_time, progress=self.engine.om.vesion_idle_progress(), status=TableVersions.Status.EXTRACTED) 

            # now send a fake response message to sast's job response queue
            sastmsg2 = AstResponse(self.engine.whoami, AstResponse.JOB.files, version_id=self.version_id, report=dict(files=['aggregate.pkl',]))
            self.engine.publish(self.engine.in_queues[self.scan_modes.priority], sastmsg2)
            
        else:
        
            engine_config = self.engine.config.engine_bast.get('bast')
            pipeline_id = 0

            response_id = engine_config[pipeline_id]['response']
            pipeline_rules = engine_config[pipeline_id]['rules']
            

            self.engine.om.init_version_status(self.version_id, start_time.isoformat())
            TableVersions(client).updateVersion(self.version_id, start_time=start_time, progress=self.engine.om.vesion_idle_progress(), status=TableVersions.Status.EXTRACTING) 

            response_queue = self.engine.in_queue(self.scan_modes.priority)
            sastmsg2 = AstRequest(self.engine.whoami, AstRequest.JOB.scan, self.data, response_id=response_id, response_queue=(response_queue.qname, response_queue.routekey), 
                                version_id=self.version_id, version_path=self.version_path, scan_modes=self.scan_modes.to_dict(), scan_options=self.scan_options.to_dict(),
                                pipeline_id=f"bast.bast.{pipeline_id}", pipeline_rules=pipeline_rules, start_time=start_time.isoformat())

            log.info(f"start scanning version {self.version_id}")
            self.engine.publish(self.engine.get_queue('bast', priority=self.scan_modes.priority), sastmsg2)

            self.engine.om.update_job(self.version_id, self.checksum, f"bast.bast.{pipeline_id}", self.engine.om.Status.queued, filepath=str(self.filepath))

        return 0
        
    def _cancel(self, client): 
        self.engine.om.delete_version(self.version_id)
        TableVersions(client).updateVersion(self.version_id, status=TableVersions.Status.CANCELLED) 

    def process_message(self, queue, sastmsg):
        self.msgid = sastmsg.msgid

        if self.msgid == AstRequest.UI.scan:
            self.data = sastmsg.data
            self.version_id = sastmsg.data['version_id']               
            self.filepath = sastmsg.data['filepath']
            self.checksum = sastmsg.data['checksum']

            with mongo_client() as client:
                self._load_version(client)
                return self._scan(client)


        log.warning(f"Unkown message {sastmsg.msgid}, ignored.")

# below instance is initialized by the engine in the initialization phase to register the handler
class JobResponseHandle(EventHandle):
    def __init__(self, engine):
        super().__init__(engine)
        self.blacklist = Blacklist()
    
    def _handle_files_response(self, client):
        tableFiles = TableFiles(client)
        tableThreats = TableThreats(client)        
        tablePackages = TablePackages(client)

        self.file_list = {}

        pickle_files = self.reports.get("files", ['aggregate.pkl',])

        for pickle_file in pickle_files:
            filepath = self.version_path / pickle_file
            
            with filepath.open('rb') as f:
                records = pickle.load(f)

                for checksum, record in records.items():
                    self.file_list[checksum] = FileData(record, self.version_path)

        tableFiles.addFiles(self.version_id, self.file_list)
        tableFiles.commit()
        
        tableComplianceGuideline = TableComplianceGuideline(client)


        for checksum, filedata in self.file_list.items():
            try:
                for meta in filedata.components:
                    # linux kernel镜像，会被extract成子文件，为了避免字文件与镜像重叠，甚至冲突，aggregate方法会进行prune操作。这里忽略已经剪除的组件。仅对extract类型处理，而压缩文件unpacked等没有剪枝处理。
                    if meta.get('pruned'):
                        continue

                    tablePackages.updatePackage(self.version_id, checksum, meta.get('fullname', meta.get('name')), meta.get('version', None), 
                        meta.get('real_score', None), meta.get('scale_percent', None), meta.get('integrity_percent', None), clone=meta.get('clone', None), summary=meta.get('summary', None), mem_threshold=50)

                if filedata.functions:
                    tableThreats.addThreat(self.version_id, checksum, TableThreats.ThreatTypes.SECURITY, TableThreats.SecurityTypes.FUNCTIONS, {"data": filedata.functions}, mem_threshold=50)
                if filedata.varnames:
                    tableThreats.addThreat(self.version_id, checksum, TableThreats.ThreatTypes.SECURITY, TableThreats.SecurityTypes.VARNAMES, {"data": filedata.varnames}, mem_threshold=50)
                if filedata.ex_functions:
                    tableThreats.addThreat(self.version_id, checksum, TableThreats.ThreatTypes.SECURITY, TableThreats.SecurityTypes.EXFUNCTIONS, {"data": filedata.ex_functions}, mem_threshold=50)
                if filedata.ex_varnames:
                    tableThreats.addThreat(self.version_id, checksum, TableThreats.ThreatTypes.SECURITY, TableThreats.SecurityTypes.EXVARNAMES, {"data": filedata.ex_varnames}, mem_threshold=50)
                if filedata.libs:
                    tableThreats.addThreat(self.version_id, checksum, TableThreats.ThreatTypes.SECURITY, TableThreats.SecurityTypes.EXLIBS, {"data": filedata.libs}, mem_threshold=50)
                if filedata.security:
                    tableThreats.addThreat(self.version_id, checksum, TableThreats.ThreatTypes.SECURITY, TableThreats.SecurityTypes.HARDENING, {"data": filedata.security}, mem_threshold=50)
                
                for linked_name in filedata.ex_functions:
                    function_name = linked_name.split("@@")[0]
                    guidelines = tableComplianceGuideline.searchGuidelines(function_name)
                    for guideline in guidelines:
                        tableThreats.addThreat(self.version_id, checksum, TableThreats.ThreatTypes.COMPLIANCE, guideline.protocol_name, 
                                                dict(function=linked_name, name=guideline.name, description=guideline.description,
                                                    state=guideline.state, source=guideline.source, languages=guideline.languages), mem_threshold=50)                

            except:
                log.exception(f"failed to handle {checksum}")
        
        tablePackages.commit()
        tableThreats.commit()

        return 0


    def _handle_infoleaks_response(self, client):
        tableFiles = TableFiles(client)
        tableThreats = TableThreats(client)  

        for checksum, infoleaks in self.reports.items():
            filedata = tableFiles.getVersionFile(self.version_id, checksum)            

            for meta in infoleaks:
                subtype = meta.pop('group', None)
                if not subtype:
                    continue
                
                if self.blacklist.match(f"infoleak.{subtype}", filedata[tableFiles.FILEPATH], filetype=filedata[tableFiles.FILETYPE], filemime=filedata[tableFiles.FILEMIME]):
                    continue

                tableThreats.addThreat(self.version_id, checksum, TableThreats.ThreatTypes.INFOLEAK, subtype, meta, mem_threshold=50)

        tableThreats.commit()

        return 0


    def _handle_malwares_response(self, client):
        tableThreats = TableThreats(client)  

        for checksum, malwares in self.reports.items():
            for meta in malwares:
                subtype = meta.pop('group', None)
                if subtype:
                    tableThreats.addThreat(self.version_id, checksum, TableThreats.ThreatTypes.MALWARE, subtype, meta, mem_threshold=50) 

        tableThreats.commit()

        return 0

    def _handle_public_response(self, client):
        tableThreats = TableThreats(client)        
        tableVulnExploits = TableVulnExploits(client) 

        for subtype, threats in self.reports.items():
            if not threats:
                continue
                
            for meta in threats:
                meta['exploits'] = []

                cve_id = "CVE-2009-3699" #meta.get('cve_id', None)
                if cve_id:                    
                    exploits = tableVulnExploits.find_by_code(cve_id)
                    if exploits:
                        meta['exploits'] = [ e[tableVulnExploits.EXPLOIT_ID] for e in exploits]

                tableThreats.addThreat(self.version_id, self.checksum, TableThreats.ThreatTypes.PUBLIC, subtype, meta, mem_threshold=50)

        tableThreats.commit()

        return 0

    def _handle_zeroday_response(self, client): 
        tableThreats = TableThreats(client)
        tableFiles = TableFiles(client)   

        for subtype, threats in self.reports.items():
            if not threats:
                continue
            
            entries = []

            for meta in threats:
                if subtype in ('cscan', ):
                    routine = meta['routine']

                    if routine in ('general_info', ):
                        if 'arch' in meta:
                            tableFiles.update_arch(self.version_id, self.checksum, meta['arch'])
                        elif 'number_of_functions' in meta:                            
                            tableFiles.update_num_functions(self.version_id, self.checksum, meta['number_of_functions'])
                        elif 'function_name' in meta:
                            rva = meta.get('rva', None)
                            name = meta.get('function_name', None)
                            if rva and name:
                                entries.append(f"{rva} - {name}")
                    else:
                        meta['cwes'] = self.engine.config.zeroday_risks.get(routine, [])
                        tableThreats.addThreat(self.version_id, self.checksum, TableThreats.ThreatTypes.ZERODAY, subtype, meta, mem_threshold=50) 
                else:
                    log.warning(f"unknown response: {meta}")

            if entries:
                entries_type = TableThreats.SecurityTypes.ENTRIES
                entries_meta = {"data": entries}
                tableThreats.addThreat(self.version_id, self.checksum, TableThreats.ThreatTypes.SECURITY, TableThreats.SecurityTypes.ENTRIES, entries_meta, mem_threshold=50)
        
        tableThreats.commit()

        return 0

    def _handle_mobile_response(self, client): 
        tableThreats = TableThreats(client)
        tableFiles = TableFiles(client)   

        for subtype, threats in self.reports.items():
            if not threats:
                continue
            
            for meta in threats:
                if subtype in ('sscan', ):
                    cwe = self.engine.config.sscan_risks.get(meta.get('abbrev', None), None)
                    if cwe:
                        meta['cwe'] = f'CWE-{cwe}'
                
                tableThreats.addThreat(self.version_id, self.checksum, TableThreats.ThreatTypes.MOBILE, subtype, meta, mem_threshold=50)
                        
        tableThreats.commit()

        return 0

    def _handle_password_response(self, client):
        tableThreats = TableThreats(client)   
    
        for subtype, threats in self.reports.items():
            if not threats:
                continue

            for meta in threats:
                tableThreats.addThreat(self.version_id, self.checksum, TableThreats.ThreatTypes.PASSWORD, subtype, meta, mem_threshold=50)

        tableThreats.commit()

        return 0

    def _handle_misconfiguration_response(self, client):  
        tableThreats = TableThreats(client)    
        
        for subtype, threats in self.reports.items():
            if not threats:
                continue

            for meta in threats:
                tableThreats.addThreat(self.version_id, self.checksum, TableThreats.ThreatTypes.MISCONFIGURATION, subtype, meta, mem_threshold=50)

        tableThreats.commit()

        return 0

    def _do_next(self, engine_name, p_name, p_settings, checksum, filedata):
        filepath = filedata.filepath
        filetype = filedata.filetype
        filesize = filedata.size
        metadata = filedata.metadata
        labels = filedata.labels
        filepath_p = self.version_path / filedata.filepath_p # unpacked path, eg. zip will extracted to root/rel, uuid/rel;

        if not self.scan_options.is_scan_enabled(p_name):
            log.debug(f"ignored scan types, {checksum}, {filepath}, {p_name} - {self.scan_options.scan_types}")
            return
        
        if filedata.components and p_name in ('zeroday', ) and self.scan_modes.strategy.lower() in (ScanModes.Strategy.FAST, ):        
            log.debug(f"ignored known component, {checksum}, {filepath}, {p_name} - strategy: {self.scan_modes.strategy}/components count:{len(filedata.components)}")
            return


        # log.debug(f"do next: {filepath}/{filetype}, labels: {labels}")
        response_queue = self.engine.in_queue(self.scan_modes.priority)

        max_files_counts = {}
        
        for p_index, p_setting in enumerate(p_settings):
            pipeline_id = f"{engine_name}.{p_name}.{p_index}"  # 为了在redis里，使得version, checksum的job id唯一，这里需要engine name，pipeline name, pipeline index三项

            p_pipeline_rules = p_setting['rules']
            if not p_pipeline_rules:
                log.warning(f"ignored pipeline {pipeline_id}, no rules.")
                continue

            # log.debug("checking {}/{} p_name {}, setting: {}".format(checksum, filepath, p_name, p_setting))
            if self.scan_modes.allow_blacklist and self.blacklist.match(p_name, filepath, filetype=filetype):
                log.debug(f"ignored blacklist file, {checksum}, {filepath}, {p_name},  {filetype}")
                continue

            p_event = p_setting['event'].upper()
            p_response = p_setting.get('response', '').upper()
            p_labels = p_setting.get('labels', None)
            p_filetypes = p_setting.get('filetype', None)
            p_meta = p_setting.get('meta', [])
            p_required = p_setting.get('required', [])

            p_pathregex = p_setting.get('pathregex', None)                

            p_maxsize = p_setting.get('max_kbytes', 0)*1024
            p_maxfiles = p_setting.get('max_files', 0)
            p_timeout_per_mb = p_setting.get('timeout_per_mb', 0)
            p_raw_binary_gain = p_setting.get('raw_binary_gain', 0)
            p_max_memory_gb = p_setting.get('max_memory_gb', 0)

            if (p_maxsize > 0) and (filesize > p_maxsize) and self.scan_modes.strategy in (ScanModes.Strategy.FAST, ScanModes.Strategy.BALANCE):
                log.debug(f"ignored, file {checksum}/{filepath} p_name {p_name} filesize not required in {self.scan_modes.strategy}")
                continue

            if p_pathregex:
                _pattern = re.compile(p_pathregex, re.I)
                if not re.search(_pattern, str(filepath)):
                    log.debug(f"ignored, file {checksum}/{filepath} p_name {p_name} path not match regex {p_pathregex}")
                    continue

            metadata=FileData.meta_args(metadata, 'filetype', 'lang', *p_meta)
            bad_required = False
            for r in p_required:
                if r[0] in '-':
                    r = r[1:]
                    if filedata.record.get(r, None): # exists and not null
                        bad_required = True
                        break
                else:
                    if not filedata.record.get(r, None): # not exists or null
                        bad_required = True
                        break
                    metadata[r] = filedata.record[r]
                    
            if bad_required:
                # log.debug("ignored, {}/{}/{} - {}".format(checksum, filepath, p_name, p_required))
                continue

            if self.msgid != p_event:
                # log.debug("ignored event, {}/{}/{} - {} not {}".format(checksum, filepath, p_name, p_event, self.msgid))
                continue

            if p_filetypes and filetype not in p_filetypes:
                # log.debug("ignored filetype, {}/{}/{} - {} not in {}".format(checksum, filepath, p_name, filetype, p_filetypes))
                continue

            if p_labels and not any(item in p_labels for item in labels):
                # log.debug("ignored labels, {}/{}/{} - {} not in {}".format(checksum, filepath, p_name, labels, p_labels))
                continue
            
            if (p_maxfiles > 0) and self.scan_modes.strategy not in (ScanModes.Strategy.COVERAGE,):
                max_files_counts.setdefault(p_name, 0)
                
                max_files_counts[p_name] += 1
                if max_files_counts[p_name] > p_maxfiles:
                    log.warning(f"version {self.version_id} has too much files to scan {p_name} threats, ignored")
                    continue

            if self.scan_options.raw_binary and p_timeout_per_mb and p_raw_binary_gain:
                p_timeout_per_mb *= p_raw_binary_gain

            max_memory = p_max_memory_gb * (1024**3)
            max_timeout = p_timeout_per_mb * max(1, filesize / (1024**2))

            sastmsg2 = AstRequest(self.engine.whoami, AstRequest.JOB.scan, dict(response_id=p_response, response_queue=(response_queue.qname, response_queue.routekey), 
                                                              pipeline_rules=p_pipeline_rules, pipeline_id=pipeline_id,
                                                              version_id=self.version_id, checksum=checksum, version_path=self.version_path,
                                                               scan_modes=self.scan_modes.to_dict(), scan_options=self.scan_options.to_dict(),
                                                              filepath=self.version_path / filepath, filepath_p=filepath_p, 
                                                              max_memory=max_memory, max_timeout=max_timeout,
                                                              metadata=metadata, start_time=self.start_time))
            
            # log.info(f"sending message {sastmsg2}")
            self.engine.publish(self.engine.get_queue(engine_name, priority=self.scan_modes.priority), sastmsg2)
            
            self.engine.om.update_job(self.version_id, checksum, pipeline_id, self.engine.om.Status.queued, filepath=str(filepath))

    

    def process_message(self, queue, sastmsg):
        log.debug(f"start processing message: {sastmsg}")
        
        self.msgid = sastmsg.msgid
        self.version_id = sastmsg.data['version_id']
        self.start_time = sastmsg.data.get('start_time', "")
        
        self.checksum = sastmsg.data.get('checksum', "")        
        self.reports = sastmsg.data.get('report', {})

        self.file_list = {}

        with mongo_client() as client:
            self._load_version(client)
            if self.status in (TableVersions.Status.CANCELLED,):
                return

            if self.msgid == AstResponse.JOB.files:
                TableVersions(client).updateVersion(self.version_id, status=TableVersions.Status.EXTRACTED)
            

            if self.reports:
                handle_list = {
                    AstResponse.JOB.files: self._handle_files_response,
                    AstResponse.JOB.public: self._handle_public_response,
                    AstResponse.JOB.zeroday: self._handle_zeroday_response,
                    AstResponse.JOB.password: self._handle_password_response,
                    AstResponse.JOB.infoleaks: self._handle_infoleaks_response,
                    AstResponse.JOB.malwares: self._handle_malwares_response,
                    AstResponse.JOB.misconfiguration: self._handle_misconfiguration_response, 
                    AstResponse.JOB.mobile: self._handle_mobile_response,               
                    }

                handle = handle_list.get(self.msgid, None)
                if handle:
                    log.debug(f"handle={handle}")
                    try:
                        handle(client)
                    except:
                        log.exception(f"failed to execute {handle} on {self.version_id}")
                else:
                    log.error(f"no handle configured for message: {self.msgid}, ignored")  

                if self.file_list:
                    # whether it's an aggregated report
                    log.info(f"process file list: {len(self.file_list)}")   

                    TableVersions(client).updateVersion(self.version_id, status=TableVersions.Status.SCANNING)

                    for checksum, filedata in self.file_list.items():
                        if len(self.file_list) == 1: # single file
                            filedata.record['subfiles'] = {checksum: dict(filepath=filedata.filepath, filetype=filedata.filetype)}
                            break

                        if not filedata.subfiles:
                            continue

                        subfiles = {}
                        
                        for c, p in filedata.subfiles.items():
                            f = self.file_list.get(c, None)
                            if not f or f.subfiles:
                                continue
                            subfiles[c] = dict(filepath=p, filetype=f.filetype)

                        filedata.record['subfiles'] = subfiles

                    for checksum, filedata in self.file_list.items():  
                        # log.debug("processing further scan on file: {}/{}".format(self.version_id, checksum))

                        for engine_name in ('iast', 'mast'):
                            try:
                                engine_config = self.engine.config.get_engine(engine_name)
                                if not engine_config:
                                    raise UnknownEnginePipeline(f'failed to get config of engine: {engine_name}')

                                for p_name, p_settings in engine_config.items():                                    
                                    if p_name.startswith('_') or p_name in ['zeroday',]:
                                        continue

                                    try:
                                        self._do_next(engine_name, p_name, p_settings, checksum, filedata)

                                    except:
                                        log.exception(f"failed to do next on {engine_name}, {p_name}/{p_settings} on {checksum}")

                            except:
                                log.exception(f"failed to do {engine_name} next on {self.version_id}, {checksum}")

                    for checksum, filedata in self.file_list.items():  
                        # log.debug("processing further zeroday,... scan on file: {}/{}".format(self.version_id, checksum))

                        for engine_name in ('iast', 'mast'):
                            try:
                                engine_config = self.engine.config.get_engine(engine_name)
                                if not engine_config:
                                    raise UnknownEnginePipeline(f'failed to get config of engine: {engine_name}')

                                for p_name, p_settings in engine_config.items():                                    
                                    if p_name.startswith('_') or p_name not in ['zeroday',]:
                                        continue

                                    try:
                                        self._do_next(engine_name, p_name, p_settings, checksum, filedata)

                                    except:
                                        log.exception(f"failed to do next on {engine_name}, {p_name}/{p_settings} on {checksum}")

                            except:
                                log.exception(f"failed to do {engine_name} next on {self.version_id}, {checksum}")

            
            progress = self.engine.om.get_version_progress(self.version_id)            
            if progress:
                if progress['percent'] < 1:
                    TableVersions(client).updateVersion(self.version_id, progress=progress)

                else:                    
                    if not self.engine.om.is_finalize_version(self.version_id):
                        progress['percent'] = 0.999 # percent is not correct. so give it a fake value, then master databse can reset finish time                    
                        TableVersions(client).updateVersion(self.version_id, progress=progress)

                    else:
                        TableVersions(client).updateVersion(self.version_id, progress=progress, finish_time=datetime.utcnow(), status=TableVersions.Status.COMPLETED)
                        
                        if self.scan_modes.auto_cleanup:
                            try:
                                # note, verison path is /data/nfs-data/project-id/version-id/_, note "_" is a part of version path
                                shutil.rmtree(self.version_path.parent, ignore_errors=True)
                            except:
                                log.exception(f"failed to remove path of {self.version_id}")

            
                  

    





                






























