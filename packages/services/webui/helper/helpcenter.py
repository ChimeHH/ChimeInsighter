from flask import request
from flask_jwt_extended import jwt_required, get_current_user
from marshmallow import Schema, fields
from exlib.http.http_webargs_ex import GeneralMetaSchema, NullableString
from exlib.http.http_server_api_ex import *
from exlib.classes.base import EnumClass
from exlib.settings import osenv
from database.core.mongo_db import mongo_client
from database.master_database import ScanOptions, ScanTypes
from database.findings_database import TableThreats
from database.vuln_database import VulnerabilityType, ExploitType, TableVulnCves, TableVulnCnnvds, TableVulnCnvds, TableVulnJvns, TableVulnExploits
from database.compliance_database import TableComplianceCwe, TableComplianceGuideline, TableComplianceLicenses, TableComplianceCweView
from services.webui.interfaces.application_api import ApplicationAPIDefinition
from services.webui.core.general_api_service import GeneralAPIService

from exlib.ai.deepseek_chat import DeepSeekChat

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class HelpCenterService(GeneralAPIService):
    def _validate_year(year: int) -> bool:
        """验证年份是否在有效范围内"""
        current_year = datetime.utcnow().year
        return 1990 <= year <= current_year
    
    GET_PACKAGE_VULNERABILITIES = type('GET_PACKAGE_VULNERABILITIES', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetPackageVulnerabilities.Params.PACKAGE_NAME: fields.Str(required=True),
        ApplicationAPIDefinition.GetPackageVulnerabilities.Params.VERSION_NAME: NullableString(allow_none=True),        
        ApplicationAPIDefinition.GetPackageVulnerabilities.Params.VENDOR_NAME: NullableString(allow_none=True),        
        ApplicationAPIDefinition.GetPackageVulnerabilities.Params.FUZZY_FLAG: fields.Bool(missing=False),
    })

    GET_THREAT_TYPES = type('GET_THREAT_TYPES', (GeneralMetaSchema, Schema), {
    })

    GET_THREAT_SUBTYPES = type('GET_THREAT_SUBTYPES', (GeneralMetaSchema, Schema), {        
        ApplicationAPIDefinition.GetThreatSubtypes.Params.THREAT_TYPE: fields.Str(required=True), 
    })

    GET_THREAT_STATTUSES = type('GET_THREAT_STATTUSES', (GeneralMetaSchema, Schema), {
    })

    GET_SCAN_SETTINGS = type('GET_SCAN_SETTINGS', (GeneralMetaSchema, Schema), {
    })

    GET_VULNERABILITY_LIST = type('GET_VULNERABILITY_LIST', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetVulnerabilityList.Params.TYPE: fields.Str(missing=None),
        ApplicationAPIDefinition.GetVulnerabilityList.Params.YEAR: fields.Int(missing=None, validate=_validate_year)
    })
    
    GET_VULNERABILITY_DETAIL = type('GET_VULNERABILITY_DETAIL', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetVulnerabilityDetail.Params.ID: fields.Str(required=True),
    })

    GET_EXPLOIT_LIST = type('GET_EXPLOIT_LIST', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetExploitList.Params.TYPE: fields.Str(missing=None),
        ApplicationAPIDefinition.GetExploitList.Params.YEAR: fields.Int(missing=None, validate=_validate_year)
    })

    GET_EXPLOIT_DETAIL = type('GET_EXPLOIT_DETAIL', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetExploitDetail.Params.ID: fields.Str(required=True),
    })

    GET_CWE_LIST = type('GET_CWE_LIST', (GeneralMetaSchema, Schema), {
    })

    GET_CWE_DETAIL = type('GET_CWE_DETAIL', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetCweDetail.Params.CWE_ID: fields.Str(required=True),
    })

    GET_COMPLIANCE_LICENSE_LIST = type('GET_COMPLIANCE_LICENSE_LIST', (GeneralMetaSchema, Schema), {
    })

    GET_COMPLIANCE_LICENSE_DETAIL = type('GET_COMPLIANCE_LICENSE_DETAIL', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.GetComplianceLicenseDetail.Params.LICENSE_ID: fields.Str(required=True),
    })

    ASK_AI = type('ASK_AI', (GeneralMetaSchema, Schema), {
        ApplicationAPIDefinition.AskAI.Params.LANGUAGE: fields.Str(required=False, missing='中文'),
        ApplicationAPIDefinition.AskAI.Params.QUESTION: fields.Str(required=True),
    })

    def init_apis(self):
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetPackageVulnerabilities.URI,
                              ApplicationAPIDefinition.GetPackageVulnerabilities.NAME,
                              view_func=self.api_package_vulnerabilities,
                              methods=[ApplicationAPIDefinition.GetPackageVulnerabilities.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetThreatTypes.URI,
                              ApplicationAPIDefinition.GetThreatTypes.NAME,
                              view_func=self.api_get_threat_types,
                              methods=[ApplicationAPIDefinition.GetThreatTypes.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetThreatSubtypes.URI,
                              ApplicationAPIDefinition.GetThreatSubtypes.NAME,
                              view_func=self.api_get_threat_subtypes,
                              methods=[ApplicationAPIDefinition.GetThreatSubtypes.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetThreatStatuses.URI,
                              ApplicationAPIDefinition.GetThreatStatuses.NAME,
                              view_func=self.api_get_threat_statuses,
                              methods=[ApplicationAPIDefinition.GetThreatStatuses.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetScanSettings.URI,
                              ApplicationAPIDefinition.GetScanSettings.NAME,
                              view_func=self.api_get_scan_settings,
                              methods=[ApplicationAPIDefinition.GetScanSettings.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetVulnerabilityList.URI,
                            ApplicationAPIDefinition.GetVulnerabilityList.NAME,
                            view_func=self.api_vulnerability_list,
                            methods=[ApplicationAPIDefinition.GetVulnerabilityList.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetVulnerabilityDetail.URI,
                            ApplicationAPIDefinition.GetVulnerabilityDetail.NAME,
                            view_func=self.api_vulnerability_detail,
                            methods=[ApplicationAPIDefinition.GetVulnerabilityDetail.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetExploitList.URI,
                            ApplicationAPIDefinition.GetExploitList.NAME,
                            view_func=self.api_exploit_list,
                            methods=[ApplicationAPIDefinition.GetExploitList.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetExploitDetail.URI,
                            ApplicationAPIDefinition.GetExploitDetail.NAME,
                            view_func=self.api_exploit_detail,
                            methods=[ApplicationAPIDefinition.GetExploitDetail.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetCweList.URI,
                            ApplicationAPIDefinition.GetCweList.NAME,
                            view_func=self.api_cwe_list,
                            methods=[ApplicationAPIDefinition.GetCweList.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetCweDetail.URI,
                            ApplicationAPIDefinition.GetCweDetail.NAME,
                            view_func=self.api_cwe_detail,
                            methods=[ApplicationAPIDefinition.GetCweDetail.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetComplianceLicenseList.URI,
                              ApplicationAPIDefinition.GetComplianceLicenseList.NAME,
                              view_func=self.api_compliance_license_list,
                              methods=[ApplicationAPIDefinition.GetComplianceLicenseList.METHOD])

        self.engine.app.add_url_rule(ApplicationAPIDefinition.GetComplianceLicenseDetail.URI,
                              ApplicationAPIDefinition.GetComplianceLicenseDetail.NAME,
                              view_func=self.api_compliance_license_detail,
                              methods=[ApplicationAPIDefinition.GetComplianceLicenseDetail.METHOD])
        
        self.engine.app.add_url_rule(ApplicationAPIDefinition.AskAI.URI,
                              ApplicationAPIDefinition.AskAI.NAME,
                              view_func=self.api_ask_ai,
                              methods=[ApplicationAPIDefinition.AskAI.METHOD])

    @jwt_required()
    def api_package_vulnerabilities(self):        
        from services.core.fingerprints import SignedLicense, ExpiredLicense, WrongLicenseFingerprint, WrongSignatureException
        
        args = parse_webargs(self.GET_PACKAGE_VULNERABILITIES, request)        
        current_user = get_current_user()

        try:
            license = SignedLicense.load_license()            
            license.verify_fingerprint()
            license.verify_not_expired()

            package_name = args.get(ApplicationAPIDefinition.GetPackageVulnerabilities.Params.PACKAGE_NAME, None)
            version_name = args.get(ApplicationAPIDefinition.GetPackageVulnerabilities.Params.VERSION_NAME, None)
            vendor_name = args.get(ApplicationAPIDefinition.GetPackageVulnerabilities.Params.VENDOR_NAME, None)
            fuzzy_flag = args.get(ApplicationAPIDefinition.GetPackageVulnerabilities.Params.FUZZY_FLAG, None)

            if not package_name:
                raise RequestParametersError(self.ErrorCodes.MISSING_PARAMETERS, 'package_names is required')
            
            with mongo_client() as client:
                tableVulnCves = TableVulnCves(client)

                results = []
                if fuzzy_flag:
                    cves = tableVulnCves.find_product_fuzzy(package_name, vendor=vendor_name)
                else:
                    cves = tableVulnCves.find_product(package_name, vendor=vendor_name)
                for cve in cves:
                    cpes = cve.get('cpes', [])
                    cve_id = cve.get('cve_id', None)
                    if not cve_id:
                        continue

                    cpe = tableVulnCves.search_cpe(cve, cpes, version_name)
                    if cpe:
                        cve['cpe'] = cpe
                        cve['component'] = dict(product=str(package_name), version=version_name, vendor=str(vendor_name))
                        results.append(cve)

                return SuccessResponse({"results": results}).generate_response()

        except Exception as e:
            log.exception(f"failed to get package threats: {e}")
            raise GeneralClientException(self.ErrorCodes.UNEXPECTED_ERROR, 'unexpected error')

    @jwt_required()
    def api_get_threat_types(self):
        args = parse_webargs(self.GET_THREAT_TYPES, request)        
        current_user = get_current_user()

        threat_types = TableThreats.ThreatTypes.values()

        return SuccessResponse({"threat_types": threat_types}).generate_response()

    @jwt_required()
    def api_get_threat_subtypes(self):
        args = parse_webargs(self.GET_THREAT_SUBTYPES, request)        
        current_user = get_current_user()

        params = ApplicationAPIDefinition.GetThreatSubtypes.Params
        threat_type = args[params.THREAT_TYPE]

        threat_types = TableThreats.ThreatTypes.values()
        if threat_type not in threat_types:
            raise RequestParametersError(self.ErrorCodes.THREAT_TYPE_UNKNOWN, 'threat type unknown')

        elif threat_type == TableThreats.ThreatTypes.PUBLIC:            
            threat_subtypes = TableThreats.PublicTypes.values()

        elif threat_type == TableThreats.ThreatTypes.ZERODAY:
            threat_subtypes = TableThreats.ZerodayTypes.values()

        elif threat_type == TableThreats.ThreatTypes.INFOLEAK:
            threat_subtypes = TableThreats.InfoLeakTypes.values()

        elif threat_type == TableThreats.ThreatTypes.SECURITY:
            threat_subtypes = TableThreats.SecurityTypes.values()

        else:
            threat_subtypes = []

        return SuccessResponse({"threat_subtypes": threat_subtypes}).generate_response()

    @jwt_required()
    def api_get_threat_statuses(self):
        args = parse_webargs(self.GET_THREAT_STATTUSES, request)        
        current_user = get_current_user()

        threat_statuses = TableThreats.ThreatWorkStatuses.values()

        return SuccessResponse({"threat_statuses": threat_statuses}).generate_response()

    @jwt_required()
    def api_get_scan_settings(self):
        args = parse_webargs(self.GET_SCAN_SETTINGS, request)        
        current_user = get_current_user()

        license_data = osenv.license_data()
        scan_scope = license_data.get('scan_scope', {})
        scan_options = ScanOptions.values()
        scan_types = ScanTypes.values()

        return SuccessResponse({ "scan_scope": scan_scope, "scan_options": scan_options, "scan_types": scan_types, }).generate_response()

    @jwt_required()
    def api_vulnerability_list(self):
        args = parse_webargs(self.GET_VULNERABILITY_LIST, request)        
        current_user = get_current_user()

        vulnerability_type = args.get(ApplicationAPIDefinition.GetVulnerabilityList.Params.TYPE, None)
        year = args.get(ApplicationAPIDefinition.GetVulnerabilityList.Params.YEAR, None)
        
        vulnerabilitie_types = VulnerabilityType.values()
        
        vulnerabilities = []
        table_projection_map = {
            VulnerabilityType.CVE: (TableVulnCves, {
                TableVulnCves.CVE_ID: 1,
                TableVulnCves.ASSIGNER: 1,
                TableVulnCves.DESCRIPTION: 1,
            }),
            VulnerabilityType.CNNVD: (TableVulnCnnvds, {
                TableVulnCnnvds.CNNVD_ID: 1,
                TableVulnCnnvds.NAME: 1,
                TableVulnCnnvds.DESCRIPTION: 1,
            }),
            VulnerabilityType.CNVD: (TableVulnCnvds, {
                TableVulnCnvds.CNVD_ID: 1,
                TableVulnCnvds.TITLE: 1,
                TableVulnCnvds.DESCRIPTION: 1,                
            }),
            VulnerabilityType.JVNDB: (TableVulnJvns, {
                TableVulnJvns.JVN_ID: 1,
                TableVulnJvns.DESCRIPTION: 1,
            })
        }

        if vulnerability_type and vulnerability_type in table_projection_map:
            TableClass, projection = table_projection_map[vulnerability_type]

            with mongo_client() as client:
                table_instance = TableClass(client)
                
                # 使用 projection 参数查询数据
                for vuln in table_instance.find_by_year(year, projection=projection):
                    vuln.pop('_id')
                    if 'description' not in vuln:
                        vuln['description'] = vuln.pop('vuln_descript', '')

                    if 'title' in vuln:
                        vuln['description'] = vuln.pop('title') + ':\n' + vuln.pop('description')
                    elif 'name' in vuln:
                        vuln['description'] = vuln.pop('name') + ':\n' + vuln.pop('description')
                    vulnerabilities.append(vuln)
                
        return SuccessResponse({"vulnerabilities": vulnerabilities, "count": len(vulnerabilities), "vulnerability_types": vulnerabilitie_types}).generate_response()

    @jwt_required()
    def api_vulnerability_detail(self):
        args = parse_webargs(self.GET_VULNERABILITY_DETAIL, request)        
        current_user = get_current_user()

        vulnerability_id = args.get(ApplicationAPIDefinition.GetVulnerabilityDetail.Params.ID, None)

        if not vulnerability_id:
            raise RequestParametersError(self.ErrorCodes.MISSING_PARAMETERS, 'vulnerability_id is required')

        # 确定要查询的表和方法
        table_map = {
            'CVE': TableVulnCves,
            'CNNVD': TableVulnCnnvds,
            'CNVD': TableVulnCnvds,
            'JVNDB': TableVulnJvns
        }

        # 提取 vulnerability_id 的前缀并转换为大写进行匹配
        vulnerability_id = vulnerability_id.upper()
        prefix = vulnerability_id.split('-')[0]

        if prefix not in table_map:
            raise RequestParametersError(self.ErrorCodes.INVALID_PARAMETERS, 'Invalid vulnerability_id prefix')

        TableClass = table_map[prefix]

        with mongo_client() as client:
            table_instance = TableClass(client)

            # 选择适当的查询方法
            if prefix == 'CVE':
                vulnerabilities = table_instance.find_cve(vulnerability_id)
            elif prefix == 'CNNVD':
                vulnerabilities = table_instance.find_cnnvd(vulnerability_id)
            elif prefix == 'CNVD':
                vulnerabilities = table_instance.find_cnvd(vulnerability_id)
            elif prefix == 'JVNDB':
                vulnerabilities = table_instance.find_jvn(vulnerability_id)
            else:
                raise RequestParametersError(self.ErrorCodes.INVALID_PARAMETERS, 'Unexpected error')

            if not vulnerabilities:
                raise RequestParametersError(self.ErrorCodes.VULNERABILITY_NOT_FOUND, 'vulnerability not found')

            vulnerability = list(vulnerabilities)[0]
            vulnerability.pop('_id')
            return SuccessResponse({"vulnerability": vulnerability}).generate_response()

    @jwt_required()
    def api_exploit_list(self):
        args = parse_webargs(self.GET_EXPLOIT_LIST, request)        
        current_user = get_current_user()

        exploit_type = args.get(ApplicationAPIDefinition.GetExploitList.Params.TYPE, None)
        year = args.get(ApplicationAPIDefinition.GetExploitList.Params.YEAR, None)
        
        exploit_types = ExploitType.values()
        
        with mongo_client() as client:
            tableExploits = TableVulnExploits(client)

            exploits = tableExploits.find_by_year(exploit_type, year)

            exploit_list = []
            for exploit in exploits:
                exploit.pop('_id')
                exploit_list.append(exploit)

            return SuccessResponse({"exploit_types": exploit_types, "count": len(exploit_list), "exploits": exploit_list}).generate_response()  
        
    @jwt_required()
    def api_exploit_detail(self):
        args = parse_webargs(self.GET_EXPLOIT_DETAIL, request)        
        current_user = get_current_user()

        exploit_id = args.get(ApplicationAPIDefinition.GetExploitDetail.Params.ID, None)

        if not exploit_id:
            raise RequestParametersError(self.ErrorCodes.MISSING_PARAMETERS, 'exploit_id is required')

        with mongo_client() as client:
            tableExploits = TableVulnExploits(client)

            exploits = tableExploits.find_exploit(exploit_id)
            if not exploits:
                raise RequestParametersError(self.ErrorCodes.EXPLOIT_NOT_FOUND, 'exploit not found')

            exploit = list(exploits)[0]
            exploit.pop('_id')

            return SuccessResponse({"exploit": exploit}).generate_response()

    @jwt_required()
    def api_cwe_detail(self):
        args = parse_webargs(self.GET_CWE_DETAIL, request)        
        current_user = get_current_user()

        cwe_id = args.get(ApplicationAPIDefinition.GetCweDetail.Params.CWE_ID, None)

        if not cwe_id:
            raise RequestParametersError(self.ErrorCodes.MISSING_PARAMETERS, 'cwe_id is required')

        with mongo_client() as client:
            tableComplianceCwe = TableComplianceCwe(client)
            tableComplianceCweView = TableComplianceCweView(client)

            # 查找 TableComplianceCwe 的 cwe 记录
            cwe_record = tableComplianceCwe.getCwe(cwe_id)
            if not cwe_record:
                raise RequestParametersError(self.ErrorCodes.CWE_NOT_FOUND, 'cwe not found')

            # 查找 TableComplianceCweView 的 view 记录
            view_records = list(tableComplianceCweView.find_cwe(cwe_id))

            # 将 CweRecord 和 ViewRecord 转换为字典格式
            cwe_dict = cwe_record.to_dict()
            view_dicts = [view_record.to_dict() for view_record in view_records]

            # 返回 {cwe: xx, view: []} 格式的响应
            response_data = {
                "cwe": cwe_dict,
                "view": view_dicts
            }

            return SuccessResponse(response_data).generate_response()

    @jwt_required()
    def api_cwe_list(self):
        args = parse_webargs(self.GET_CWE_LIST, request)        
        current_user = get_current_user()

        with mongo_client() as client:
            tableComplianceCwe = TableComplianceCwe(client)

            # 设定 projection 只获取所需字段
            projection = {
                tableComplianceCwe.CWE_ID: 1,
                tableComplianceCwe.NAME: 1,
                tableComplianceCwe.DESCRIPTION: 1
            }

            cwes = tableComplianceCwe.find_cwe(projection=projection)

            # 生成包含所需格式的 cwe 列表
            cwe_list = [
                {
                    "cwe_id": f"CWE-{cwe['cwe_id']}",
                    "name": cwe['name'],
                    "description": cwe['description']
                }
                for cwe in cwes
            ]

            return SuccessResponse({"cwes": cwe_list, "count": len(cwe_list)}).generate_response()

    @jwt_required()
    def api_compliance_license_list(self):
        args = parse_webargs(self.GET_COMPLIANCE_LICENSE_LIST, request)
        current_user = get_current_user()

        # 假设有一个 License 类能获取所有的许可证信息
        with mongo_client() as client:
            tableLicenses = TableComplianceLicenses(client)
            licenses = tableLicenses.find_all()

            license_list = []
            for license_data in licenses:
                license_data.pop('_id')
                license_list.append(license_data)

            return SuccessResponse({"licenses": license_list, "count": len(license_list)}).generate_response()

    @jwt_required()
    def api_compliance_license_detail(self):
        args = parse_webargs(self.GET_COMPLIANCE_LICENSE_DETAIL, request)
        current_user = get_current_user()

        license_id = args.get(ApplicationAPIDefinition.GetComplianceLicenseDetail.Params.LICENSE_ID, None)

        if not license_id:
            raise RequestParametersError(self.ErrorCodes.MISSING_PARAMETERS, 'license_id is required')

        with mongo_client() as client:
            tableLicenses = TableComplianceLicenses(client)

            licenseRecord = tableLicenses.findLicense(license_id)
            if not licenseRecord:
                raise RequestParametersError(self.ErrorCodes.LICENSE_NOT_FOUND, 'license not found')

            license_data = licenseRecord.to_dict()

            return SuccessResponse({"license": license_data}).generate_response()
    
    @jwt_required()
    def api_ask_ai(self):
        args = parse_webargs(self.ASK_AI, request)
        current_user = get_current_user()

        language = args.get(ApplicationAPIDefinition.AskAI.Params.LANGUAGE, "中文")
        question = args.get(ApplicationAPIDefinition.AskAI.Params.QUESTION, None)

        if not question:
            raise RequestParametersError(self.ErrorCodes.MISSING_PARAMETERS, 'question 参数是必需的')

        question = ApplicationAPIDefinition.AskAI.QUESTION_TEMPLATE.format(language, question)

        chat = DeepSeekChat()        
        answer_stream = chat.ask(question)

        return StreamResponse().generate_stream_response(answer_stream)