from datetime import datetime
from flask import request
import pathlib
import shutil
from pprint import pprint

from marshmallow import Schema, fields, ValidationError
from flask_jwt_extended import (jwt_required, get_current_user)

from exlib.settings import osenv
from exlib.utils import filesystemex
from exlib.http.http_webargs_ex import GeneralMetaSchema, NullableString, NullableNested, NullableList, NullableInt, NullableBool, Json
from exlib.http.http_server_api_ex import *

from services.webui.interfaces.application_api import ApplicationAPIDefinition
from services.webui.core.general_api_service import GeneralAPIService

from database.core.mongo_db import mongo_client
from database.master_database import ScanOptions, ScanTypes, TableVersions
from database.findings_database import TablePackages, TableThreats
from database.vuln_database import TableVulnCves, TableVulnExploits
from services.core.cve_search import cve_search_by_product_version

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class MonitorEventReasons:
    NEW_THREAT = 'new_threat'
    UPDATED_THREAT = 'updated_threat'
    NEW_EXPLOIT = 'new_exploit'
    UPDATED_EXPLOIT = 'updated_exploit'

class MonitorService(GeneralAPIService):
    GET_MONITOR_VERSION_EVENTS = type('GET_MONITOR_VERSION_EVENTS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetMonitorVersionEvents.Params.VERSION_ID: fields.Str(required=True),
    })

    GET_MONITOR_EVENTS = type('GET_MONITOR_EVENTS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetMonitorEvents.Params.DATE_FROM: fields.Str(required=True),
        ApplicationAPIDefinition.GetMonitorEvents.Params.DATE_TO: fields.Str(required=False),
    })

    EXPORT_MONITOR_EVENTS = type('EXPORT_MONITOR_EVENTS', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.ExportMonitorEvents.Params.DATE_FROM: fields.Str(required=True),
        ApplicationAPIDefinition.ExportMonitorEvents.Params.DATE_TO: fields.Str(required=False),
    })

    def init_apis(self):
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetMonitorVersionEvents.URI,
                               ApplicationAPIDefinition.GetMonitorVersionEvents.NAME,
                               view_func=self.api_get_monitor_version_events,
                               methods=[ApplicationAPIDefinition.GetMonitorVersionEvents.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetMonitorEvents.URI,
                               ApplicationAPIDefinition.GetMonitorEvents.NAME,
                               view_func=self.api_get_monitor_events,
                               methods=[ApplicationAPIDefinition.GetMonitorEvents.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.ExportMonitorEvents.URI,
                               ApplicationAPIDefinition.ExportMonitorEvents.NAME,
                               view_func=self.api_export_monitor_events,
                               methods=[ApplicationAPIDefinition.ExportMonitorEvents.METHOD])
    
    def _generate_monitor_version_events(self, version_id):
        log.info(f"generate monitor version events for version {version_id}")

        # TODO: 实现导出监控事件的逻辑
        with mongo_client() as client:
            tablePackages = TablePackages(client)
            tableThreats = TableThreats(client)
            tableCves = TableVulnCves(client)
            tableExploits = TableVulnExploits(client)

            all_packages = {}
            for package in tablePackages.get(version_id, projection={tablePackages.CHECKSUM: 1, tablePackages.FULLNAME: 1, tablePackages.VERSION: 1}):
                package_name = package[tablePackages.FULLNAME]
                version_name = package.get(tablePackages.VERSION, "")
                if package_name not in all_packages:
                    all_packages[package_name] = {}

                if version_name not in all_packages[package_name]:
                    all_packages[package_name][version_name] = []
                
                if package[tablePackages.CHECKSUM] not in all_packages[package_name][version_name]:
                    all_packages[package_name][version_name].append(package[tablePackages.CHECKSUM])
            
            new_cves = {}
            for package_name, versions in all_packages.items():
                for version_name, checksums in versions.items():
                    cves = cve_search_by_product_version(client, package_name, version_name)
                    for cve in cves:
                        cve_id = cve[tableCves.CVE_ID]
                        if cve_id not in new_cves:
                            new_cves[cve_id] = dict(exploits={}, checksums=checksums, 
                                                    component=cve['component'], cpe=cve['cpe'], description=cve[tableCves.DESCRIPTION], 
                                                    published_date=cve[tableCves.PUBLISHED_DATE], last_modified_date=cve[tableCves.LAST_MODIFIED_DATE])  

            previous_cves = {}
            threats = tableThreats.gets(threat_types=[TableThreats.ThreatTypes.PUBLIC], threat_subtypes=[TableThreats.PublicTypes.CVE])
            for threat in threats:
                cve_id = threat[tableThreats.METADATA]['cve_id']
                
                if cve_id not in previous_cves:
                    metadata = threat[tableThreats.METADATA]
                    published_date = metadata[tableCves.PUBLISHED_DATE]
                    last_modified_date = metadata[tableCves.LAST_MODIFIED_DATE]

                    if isinstance(published_date, str):
                        published_date = datetime.fromisoformat(published_date.replace('Z', ''))
                    if isinstance(last_modified_date, str):
                        last_modified_date = datetime.fromisoformat(last_modified_date.replace('Z', ''))
                
                    previous_cves[cve_id] = dict(exploits=metadata['exploits'], published_date=published_date, last_modified_date=last_modified_date)
                
            cve_ids = list(new_cves.keys())
            exploits = tableExploits.find_by_code(*cve_ids)
            for ex in exploits:
                for _id in ex[tableExploits.CODES]:
                    if _id in new_cves:
                        exploit_id = ex[tableExploits.EXPLOIT_ID]
                        date_updated = ex[tableExploits.DATE_UPDATED]

                        if _id in previous_cves:
                            previous_updated = previous_cves[_id]['last_modified_date']
                            previous_exploits = previous_cves[_id]['exploits']
                            if exploit_id not in previous_exploits or previous_updated < date_updated:
                                new_cves[_id]['exploits'][exploit_id] = date_updated
                                new_cves[_id]['reason'] = MonitorEventReasons.UPDATED_EXPLOIT
                        else:
                            new_cves[_id]['exploits'][exploit_id] = date_updated
                            new_cves[_id]['reason'] = MonitorEventReasons.NEW_EXPLOIT
            
            new_events = []
                        
            for cve_id, cve in new_cves.items():
                cve['cve_id'] = cve_id

                last_modified_date = cve[tableCves.LAST_MODIFIED_DATE]
                exploits = cve['exploits']
                
                if cve_id not in previous_cves:
                    cve['reason'] = MonitorEventReasons.NEW_THREAT
                    new_events.append(cve)
                    continue

                if exploits:
                    new_events.append(cve)
                    continue

                previous_updated = previous_cves[cve_id]['last_modified_date']                    
                if previous_updated < last_modified_date:
                    cve['reason'] = MonitorEventReasons.UPDATED_THREAT
                    new_events.append(cve)
                    continue
                    
            return new_events
        
    @jwt_required()
    def api_get_monitor_version_events(self):
        args = parse_webargs(self.GET_MONITOR_VERSION_EVENTS, request)
        current_user = get_current_user()

        version_id = args[ApplicationAPIDefinition.GetMonitorVersionEvents.Params.VERSION_ID]

        ne_events = self._generate_monitor_version_events(version_id)

        return SuccessResponse({"events": ne_events}).generate_response()

    def _generate_monitor_events(self, date_from, date_to):
        with mongo_client() as client:
            tablePackages = TablePackages(client)
            tableThreats = TableThreats(client)
            tableCves = TableVulnCves(client)
            tableExploits = TableVulnExploits(client)

            all_packages = {}
            for package in tablePackages.gets(projection={tablePackages.CHECKSUM: 1, tablePackages.FULLNAME: 1, tablePackages.VERSION: 1}):                
                package_name = package[tablePackages.FULLNAME]
                version_name = package.get(tablePackages.VERSION, "")
                if package_name not in all_packages:
                    all_packages[package_name] = {}

                if version_name not in all_packages[package_name]:
                    all_packages[package_name][version_name] = []

                all_packages[package_name][version_name].append(package[tablePackages.CHECKSUM])

            new_cves = {}
            for package_name, versions in all_packages.items():
                for version_name, checksums in versions.items():
                    cves = cve_search_by_product_version(client, package_name, version_name)
                    for cve in cves:
                        cve_id = cve[tableCves.CVE_ID]
                        if cve_id not in new_cves:
                            new_cves[cve_id] = dict(exploits={}, checksums=checksums, 
                                                    component=cve['component'], cpe=cve['cpe'], description=cve[tableCves.DESCRIPTION], 
                                                    published_date=cve[tableCves.PUBLISHED_DATE], last_modified_date=cve[tableCves.LAST_MODIFIED_DATE])  
            
            cve_ids = list(new_cves.keys())
            exploits = tableExploits.find_by_code(*cve_ids)
            for ex in exploits:                
                for _id in ex[tableExploits.CODES]:
                    if _id in new_cves:
                        exploit_id = ex[tableExploits.EXPLOIT_ID]
                        date_updated = ex[tableExploits.DATE_UPDATED]
                        if date_updated > date_from and date_updated <= date_to:
                            new_cves[_id]['exploits'][exploit_id] = date_updated
                            break

            new_events = []
                        
            for cve_id, cve in new_cves.items():
                last_modified_date = cve[tableCves.LAST_MODIFIED_DATE]

                # 进行 datetime 比较, 如果事件发生在 date_from 和 date_to 之间，或者 CVE 有 exploits，则添加到 new_events 中
                if (last_modified_date >= date_from and last_modified_date <= date_to):
                    cve['cve_id'] = cve_id
                    cve['reason'] = MonitorEventReasons.UPDATED_THREAT
                    new_events.append(cve)
                elif cve['exploits']:
                    cve['cve_id'] = cve_id
                    cve['reason'] = MonitorEventReasons.UPDATED_EXPLOIT
                    new_events.append(cve)

            return new_events
        
    @jwt_required()
    def api_get_monitor_events(self):
        args = parse_webargs(self.GET_MONITOR_EVENTS, request)
        current_user = get_current_user()

        # 获取 date_from 和 date_to
        date_from_str = args[ApplicationAPIDefinition.GetMonitorEvents.Params.DATE_FROM]
        date_to_str = args.get(ApplicationAPIDefinition.GetMonitorEvents.Params.DATE_TO)

        # 将 date_from 转换为 datetime
        date_from = datetime.fromisoformat(date_from_str)

        # 如果 date_to 没有提供，则使用当前时间
        if date_to_str:
            date_to = datetime.fromisoformat(date_to_str)
        else:
            date_to = datetime.utcnow()
        
        log.debug(f"date_from: {date_from}, date_to: {date_to}")
        new_events = self._generate_monitor_events(date_from, date_to)

        return SuccessResponse({"events": new_events}).generate_response()

    @jwt_required()
    def api_export_monitor_events(self):
        args = parse_webargs(self.EXPORT_MONITOR_EVENTS, request)
        current_user = get_current_user()

        # 获取 date_from 和 date_to
        date_from_str = args[ApplicationAPIDefinition.ExportMonitorEvents.Params.DATE_FROM]
        date_to_str = args.get(ApplicationAPIDefinition.ExportMonitorEvents.Params.DATE_TO)

        # 将 date_from 转换为 datetime
        date_from = datetime.fromisoformat(date_from_str)

        # 如果 date_to 没有提供，则使用当前时间
        if date_to_str:
            date_to = datetime.fromisoformat(date_to_str)
        else:
            date_to = datetime.utcnow()

        new_events = self._generate_monitor_events(date_from, date_to)

        return SuccessResponse({"events": new_events}).generate_response()
