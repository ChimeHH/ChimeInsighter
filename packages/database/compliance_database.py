import re
import traceback
import json
import pathlib

from .core.database import DatabaseClass
from .core.errors import *

from pymongo import UpdateOne, InsertOne, DeleteOne, UpdateMany, DeleteMany, ASCENDING, DESCENDING

from datetime import datetime


from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class TableVulnMissingCollectionName(Exception):
    pass

class DatabaseCompliance(DatabaseClass):    
    def __init__(self, client, collection, database):
        if not database:
            database = self.config().compliance
        super().__init__(client, collection, database)


class CweRecord:
    def __init__(self, cwe_id, name, status, description, abstraction=None,
                 structure=None, extended_description=None, related_weaknesses=None,
                 applicable_platforms=None, potential_mitigations=None,
                 demonstrative_examples=None, observed_examples=None, web_link=None):
        self.cwe_id = cwe_id
        self.name = name
        self.status = status
        self.description = description
        self.abstraction = abstraction
        self.structure = structure
        self.extended_description = extended_description
        self.related_weaknesses = related_weaknesses
        self.applicable_platforms = applicable_platforms
        self.potential_mitigations = potential_mitigations
        self.demonstrative_examples = demonstrative_examples
        self.observed_examples = observed_examples
        self.web_link = web_link

    def __repr__(self):
        return f"CweRecord(cwe_id='{self.cwe_id}', name='{self.name}', status='{self.status}', description='{self.description}')"
    

    def to_dict(self):
        return {
            'cwe_id': self.cwe_id,
            'name': self.name,
           'status': self.status,
            'description': self.description,
            'abstraction': self.abstraction,
           'structure': self.structure,
            'extended_description': self.extended_description,
           'related_weaknesses': self.related_weaknesses,
            'applicable_platforms': self.applicable_platforms,
            'potential_mitigations': self.potential_mitigations,
            'demonstrative_examples': self.demonstrative_examples,
            'observed_examples': self.observed_examples,
            'web_link': self.web_link
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            data['cwe_id'], data['name'], data['status'], data['description'],
            **{k: v for k, v in data.items() if k in ['abstraction', 'structure', 'extended_description',
                                                    'related_weaknesses', 'applicable_platforms',
                                                    'potential_mitigations', 'demonstrative_examples',
                                                    'observed_examples', 'web_link']}
        )

    def __str__(self) -> str:            
        return f"CWE {self.cwe_id}: {self.name} ({self.status})"

class TableComplianceCwe(DatabaseCompliance):
    ''' Table for CWE (Common Weakness Enumeration) data '''
    CWE_ID = 'cwe_id'
    NAME = 'name'
    ABSTRACTION = 'abstraction'
    STRUCTURE = 'structure'
    STATUS = 'status'
    DESCRIPTION = 'description'
    EXTENDED_DESCRIPTION = 'extended_description'
    RELATED_WEAKNESSES = 'related_weaknesses'
    APPLICABLE_PLATFORMS = 'applicable_platforms'
    POTENTIAL_MITIGATIONS = 'potential_mitigations'
    DEMONSTRATIVE_EXAMPLES = 'demonstrative_examples'
    OBSERVED_EXAMPLES = 'observed_examples'
    WEBLINK = 'web_link'

    def __init__(self, client, collection='cwe', database=None):
        super().__init__(client, collection, database)

    def create_table(self):
        self.coll.create_index([(self.CWE_ID, ASCENDING)], unique=True, background=True)

    def update(self, cwe_id, name, status, description, abstraction=None,
            structure=None, extended_description=None, related_weaknesses=None,
            applicable_platforms=None, potential_mitigations=None,
            demonstrative_examples=None, observed_examples=None, web_link=None):

        self._requests.append(UpdateOne(
            {self.CWE_ID: cwe_id},
            {'$set': {
                self.NAME: name,
                self.STATUS: status,
                self.DESCRIPTION: description,
                self.ABSTRACTION: abstraction,
                self.STRUCTURE: structure,
                self.EXTENDED_DESCRIPTION: extended_description,
                self.RELATED_WEAKNESSES: related_weaknesses,
                self.APPLICABLE_PLATFORMS: applicable_platforms,
                self.POTENTIAL_MITIGATIONS: potential_mitigations,
                self.DEMONSTRATIVE_EXAMPLES: demonstrative_examples,
                self.OBSERVED_EXAMPLES: observed_examples,
                self.WEBLINK: web_link
            }},
            upsert=True
        ))


    def find_cwe(self, *cwe_ids, projection=None):
        if not projection:
            projection = {
                self.CWE_ID: 1, self.NAME: 1, self.ABSTRACTION: 1, self.STRUCTURE: 1, 
                self.STATUS: 1, self.DESCRIPTION: 1, self.EXTENDED_DESCRIPTION: 1, 
                self.RELATED_WEAKNESSES: 1, self.APPLICABLE_PLATFORMS: 1, 
                self.POTENTIAL_MITIGATIONS: 1, self.DEMONSTRATIVE_EXAMPLES: 1, 
                self.OBSERVED_EXAMPLES: 1, self.WEBLINK: 1
            }

        if cwe_ids:
            for _, chunks in self.divide_chunks(cwe_ids):
                records = self.coll.find({self.CWE_ID: {"$in": chunks}}, projection=projection)
                for r in records:
                    yield r
        else:
            records = self.coll.find({}, projection=projection)
            for r in records:
                yield r

    def delete(self, *cwe_ids):
        if cwe_ids:
            self._requests.append(DeleteMany({self.CWE_ID: {"$in": cwe_ids}}))
        else:
            self._requests.append(DeleteMany({}))
        self.commit()
    
    def getCwe(self, cwe_id):
        cleaned_cwe_id = re.sub(r'CWE|[-_\s]', '', cwe_id)
    
        cwe_records = list(self.find_cwe(cleaned_cwe_id))
        if len(cwe_records) == 0:
            return None
        else:
            return CweRecord.from_dict(cwe_records[0])

class ViewRecord:
    def __init__(self, view_id, name, view_type, status, objective, audience, members, mapping_notes):
        self.view_id = view_id
        self.name = name
        self.view_type = view_type
        self.status = status
        self.objective = objective
        self.audience = audience
        self.members = members
        self.mapping_notes = mapping_notes

    def __repr__(self):
        return f"ViewRecord(view_id='{self.view_id}', name='{self.name}', view_type='{self.view_type}', status='{self.status}')"

    def to_dict(self):
        return {
            'view_id': self.view_id,
            'name': self.name,
            'type': self.view_type,
            'status': self.status,
            'objective': self.objective,
            'audience': self.audience,
            'members': self.members,
            'mapping_notes': self.mapping_notes
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            data['view_id'], data['name'], data['type'], data['status'], data['objective'],
            data['audience'], data['members'], data['mapping_notes']
        )

    def __str__(self) -> str:
        return f"View {self.view_id}: {self.name} ({self.status})"


class TableComplianceCweView(DatabaseCompliance):
    ''' Table for Views data '''
    VIEW_ID = 'view_id'
    NAME = 'name'
    TYPE = 'type'
    STATUS = 'status'
    OBJECTIVE = 'objective'
    AUDIENCE = 'audience'
    MEMBERS = 'members'
    MAPPING_NOTES = 'mapping_notes'

    def __init__(self, client, collection='views', database=None):
        super().__init__(client, collection, database)

    def create_table(self):
        self.coll.create_index([(self.VIEW_ID, ASCENDING)], unique=True, background=True)

    def update(self, view_id, name, view_type, status, objective, audience, members, mapping_notes):
        self._requests.append(UpdateOne(
            {self.VIEW_ID: view_id},
            {'$set': {
                self.NAME: name,
                self.TYPE: view_type,
                self.STATUS: status,
                self.OBJECTIVE: objective,
                self.AUDIENCE: audience,
                self.MEMBERS: members,
                self.MAPPING_NOTES: mapping_notes
            }},
            upsert=True
        ))

    def find_view(self, *view_ids, projection=None):
        if not projection:
            projection = {
                self.VIEW_ID: 1, self.NAME: 1, self.TYPE: 1, self.STATUS: 1,
                self.OBJECTIVE: 1, self.AUDIENCE: 1, self.MEMBERS: 1, self.MAPPING_NOTES: 1
            }

        if view_ids:
            for _, chunks in self.divide_chunks(view_ids):
                records = self.coll.find({self.VIEW_ID: {"$in": chunks}}, projection=projection)
                for r in records:
                    yield r
        else:
            records = self.coll.find({}, projection=projection)
            for r in records:
                yield r

    def delete(self, *view_ids):
        if view_ids:
            self._requests.append(DeleteMany({self.VIEW_ID: {"$in": view_ids}}))
        else:
            self._requests.append(DeleteMany({}))
        self.commit()

    def getView(self, view_id):
        view_records = list(self.find_view(view_id))
        if len(view_records) == 0:
            return None
        else:
            return ViewRecord.from_dict(view_records[0])

    def find_cwe(self, cwe_id):
        # 预处理 cwe_id，去掉 "CWE"（大小写都去），和分隔符、空格等
        cwe_id = re.sub(r'\D', '', cwe_id)

        # 查找 members 数组中包含 cwe_id 的记录
        records = self.coll.find({self.MEMBERS: {"$in": [cwe_id]}})

        # 如果有匹配的记录，返回第一个匹配的 ViewRecord
        for record in records:
            yield ViewRecord.from_dict(record)
        
        return None

class GuidelineRecord:
    def __init__(self, protocol_name, name, functions, description, source=None, languages=None, state=None):
        self.protocol_name = protocol_name
        self.name = name if name else description  # If name is missing, use description
        self.functions = functions if functions else []
        self.description = description
        self.source = source
        self.languages = languages if languages else []
        self.state = state

    def __repr__(self):
        return f"GuidelineRecord(protocol_name='{self.protocol_name}', name='{self.name}', functions={self.functions}, description='{self.description}')"

    def to_dict(self):
        return {
            'protocol_name': self.protocol_name,
            'name': self.name,
            'functions': self.functions,
            'description': self.description,
            'source': self.source,
            'languages': self.languages,
            'state': self.state
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            data['protocol_name'],
            data.get('name', data['description']), 
            data.get('functions', []),
            data['description'],
            data.get('source'),
            data.get('languages', []),
            data.get('state')
        )

    def __str__(self) -> str:
        return f"Guideline {self.protocol_name}: {self.name} ({self.state})"


class TableComplianceGuideline(DatabaseCompliance):
    ''' Table for Guideline data '''
    PROTOCOL_NAME = 'protocol_name'
    NAME = 'name'
    FUNCTIONS = 'functions'
    DESCRIPTION = 'description'
    SOURCE = 'source'
    LANGUAGES = 'languages'
    STATE = 'state'

    def __init__(self, client, collection='guideline', database=None):
        super().__init__(client, collection, database)

    def create_table(self):
        # Create unique index on protocol_name + name
        self.coll.create_index([(self.PROTOCOL_NAME, ASCENDING), (self.NAME, ASCENDING)], unique=True, background=True)
        # Create index on functions
        self.coll.create_index([(self.FUNCTIONS, ASCENDING)], background=True)

    def update(self, protocol_name, name, functions, description, source=None, languages=None, state=None):
        self._requests.append(UpdateOne(
            {self.PROTOCOL_NAME: protocol_name, self.NAME: name},
            {'$set': {
                self.FUNCTIONS: functions,
                self.DESCRIPTION: description,
                self.SOURCE: source,
                self.LANGUAGES: languages,
                self.STATE: state
            }},
            upsert=True
        ))

    def find_guideline(self, *protocol_names, projection=None):
        if not projection:
            projection = {
                self.PROTOCOL_NAME: 1, self.NAME: 1, self.FUNCTIONS: 1, self.DESCRIPTION: 1,
                self.SOURCE: 1, self.LANGUAGES: 1, self.STATE: 1
            }

        if protocol_names:
            for _, chunks in self.divide_chunks(protocol_names):
                records = self.coll.find({self.PROTOCOL_NAME: {"$in": chunks}}, projection=projection)
                for r in records:
                    yield r
        else:
            records = self.coll.find({}, projection=projection)
            for r in records:
                yield r

    def delete(self, *protocol_names):
        if protocol_names:
            self._requests.append(DeleteMany({self.PROTOCOL_NAME: {"$in": protocol_names}}))
        else:
            self._requests.append(DeleteMany({}))
        self.commit()

    def getGuideline(self, protocol_name, name):
        guideline_records = list(self.find_guideline(protocol_name))
        for record in guideline_records:
            if record['name'] == name:
                return GuidelineRecord.from_dict(record)
        return None
    
    def searchGuidelines(self, function_name):
        """
        Search for guidelines that contain the specified function name.
        
        :param function_name: The name of the function to search for.
        :return: A list of GuidelineRecord objects that match the function name.
        """
        query = {self.FUNCTIONS: function_name}
        records = self.coll.find(query)
        return [GuidelineRecord.from_dict(record) for record in records]

    def listGuidelineProtocols(self):
        protocols = self.coll.distinct(self.PROTOCOL_NAME)
        return protocols
    
class LicenseRecord:
    def __init__(self, license_id, license_type=None, url=None, text=None, reference=None, comments=None):
        self.license_id = license_id
        self.license_type = license_type
        self.text = text
        self.url = url
        self.reference = reference if reference else {}
        self.comments = comments if comments else {}

    @classmethod
    def from_dict(cls, data):
        license_id = data['license']
        license_type = data.get('type') or ""
        url = data.get('url') or ""
        text = data.get('text') or ""
        reference = data.get('reference') or {}
        comments = data.get('comments') or ""
        return cls(license_id, license_type=license_type, url=url, text=text, reference=reference, comments=comments)

    def to_dict(self):
        return {
            'license': self.license_id,
            'type': self.license_type,
            'url': self.url,
            'text': self.text,
            'reference': self.reference,
            'comments': self.comments
        }

    def __repr__(self):
        return f"LicenseRecord(license_id='{self.license_id}', license_type='{self.license_type}', url='{self.url}', text='{self.text}', reference={self.reference}, comments={self.comments})"

class TableComplianceLicenses(DatabaseCompliance):
    LICENSE = 'license'
    TEXT = 'text'
    TYPE = 'type'
    URL = 'url'
    REFERENCE = 'reference'
    COMMENTS = 'comments'

    def __init__(self, client, collection='licenses', database=None):
        super().__init__(client, collection, database)

    def create_table(self):
        self.coll.create_index([(self.LICENSE, ASCENDING)], unique=True, background=True)

    def update(self, license, text=None, typ=None, url=None, reference=None, comments=None):
        object = dict()
        if text is not None:
            object[self.TEXT] = text
        if typ is not None:
            object[self.TYPE] = typ
        if url is not None:
            object[self.URL] = url
        if reference:
            object[self.REFERENCE] = reference
        if comments:
            object[self.COMMENTS] = comments

        if object:
            self._requests.append(UpdateOne({self.LICENSE: license},
                                            {'$set': object}, upsert=True))

    def find_license(self, license, projection=None):
        if not license:
            return []

        if not isinstance(license, str) or len(license)>64:
            license = str(license)[:64]

        if not projection:
            projection = {self.LICENSE: 1, self.TEXT: 1, self.TYPE: 1, self.URL: 1, self.REFERENCE: 1, self.COMMENTS: 1, }
        
        # Create a regular expression ignoring case, whitespace, underscores, and hyphens  
        license_parts = re.split(r'[\s\-_.]', license)  
        regex_license = '^' + '[-_.\s]*'.join(re.escape(part) for part in license_parts) + "$"
        
        return self.coll.find({self.LICENSE: {"$regex": regex_license}}, projection=projection)  
    
    def find_all(self, projection=None):
        if not projection:
            projection = {self.LICENSE: 1, self.TYPE: 1, self.URL: 1, self.REFERENCE: 1}
        return self.coll.find({}, projection=projection)

    def remove_license(self, *licenses, match_whole_name=True):
        regex_licenses = []
        for license in licenses:
            # Create a regular expression ignoring case, whitespace, underscores, and hyphens  
            license_parts = re.split(r'[\s\-_.]', license)  
            regex_license = '^' + '[-_.\s]*'.join(re.escape(part) for part in license_parts) + "$"

            self._requests.append(DeleteMany({self.LICENSE: {'$in': regex_licenses}}))

    def findLicense(self, license):
        try:
            license_records = list(self.find_license(license))
            if len(license_records) == 0:
                return None
            else:
                return LicenseRecord.from_dict(license_records[0])
        except:
            log.exception(f"invalid input license: {license[:64]}")
            return None
    
    def findAllLicenses(self):
        for record in self.find_all():
            yield LicenseRecord.from_dict(record)            
            

if __name__ == '__main__':
    from pprint import pprint
    from database.core.mongo_db import mongo_client
    import json
    import pathlib

    with mongo_client() as client:
        table_guideline = TableComplianceGuideline(client)  # Add TableComplianceGuideline
        table_license = TableComplianceLicenses(client)  # Add TableComplianceLicenses
        table_cwe = TableComplianceCwe(client)
        table_views = TableComplianceCweView(client)
        

        # Create tables and ensure indexes
        table_cwe.create_table()
        table_views.create_table()
        table_guideline.create_table()  # Create guideline table
        table_license.create_table()  # Create license table
        
        if False:
            # Load CWE data from JSON file
            json_path = pathlib.Path('/usr/local/share/appdata/cwe/cwec_v4.15.json')
            with open(json_path, 'r') as file:
                cwe_data = json.load(file)
            print(f"Loaded {len(cwe_data['Weaknesses'])} CWE records from {json_path}")

            # Insert or update CWE data
            for cwe in cwe_data['Weaknesses']:
                table_cwe.update(cwe['ID'], cwe['Name'], cwe['Status'], cwe['Description'], 
                             abstraction=cwe.get('Abstraction'),
                             structure=cwe.get('Structure'),
                             extended_description=cwe.get('Extended_Description'),
                             related_weaknesses=cwe.get('Related_Weaknesses'),
                             applicable_platforms=cwe.get('Applicable_Platforms'),
                             potential_mitigations=cwe.get('Potential_Mitigations'),
                             demonstrative_examples=cwe.get('Demonstrative_Examples'),
                             observed_examples=cwe.get('Observed_Examples'),
                             web_link=cwe.get('WebLink'))
            table_cwe.commit()

            # Retrieve and print the inserted CWE data        
            cwe_ids = [cwe['ID'] for cwe in cwe_data['Weaknesses'][:3]]
            cwe_records = list(table_cwe.find_cwe(*cwe_ids))
            # pprint(cwe_records)

            # Load Views data from JSON file
            with open(json_path, 'r') as file:
                views_data = json.load(file)
            print(f"Loaded {len(views_data['Views'])} View records from {json_path}")

            # Insert or update Views data
            for view in views_data['Views']:
                table_views.update(view['ID'], view['Name'], view['Type'], view['Status'], view['Objective'], 
                                  view['Audience'], view['Members'], view['Mapping_Notes'])
            table_views.commit()

            # Retrieve and print the inserted Views data        
            view_ids = [view['ID'] for view in views_data['Views'][:3]]
            view_records = list(table_views.find_view(*view_ids))
            # pprint(view_records, indent=4)

        if False:

            # Load Guideline data from JSON file
            guideline_json_path = pathlib.Path('/usr/local/share/appdata/compliance/compliance-en.json')
            with open(guideline_json_path, 'r') as file:
                guideline_data = json.load(file)
            print(f"Loaded {sum(len(guidelines) for guidelines in guideline_data.values())} Guideline records from {guideline_json_path}")

            # Insert or update Guideline data
            for protocol_name, guidelines in guideline_data.items():
                for guideline in guidelines:
                    table_guideline.update(
                        protocol_name,
                        guideline.get('name', guideline['description']), 
                        guideline.get('functions', []),
                        guideline['description'],
                        guideline.get('source'),
                        guideline.get('languages', []),
                        guideline.get('state')
                    )
            table_guideline.commit()
            protocol_names = table_guideline.listGuidelineProtocols()
            print(f"List of Guideline protocols: {protocol_names}")

            # Retrieve and print the inserted Guideline data
            sample_guidelines = ['AUTOSAR', 'CERT-C']
            guidelines_records = list(table_guideline.find_guideline(*sample_guidelines))
            pprint(guidelines_records, indent=4)

            # 示例：搜索包含特定函数名的指南
            function_to_search = "strcpy"
            matching_guidelines = table_guideline.searchGuidelines(function_to_search)
            print(f"Guidelines containing function '{function_to_search}':")
            pprint(matching_guidelines, indent=4)

        if False:
            # Load main license data from JSON file
            main_data = json.load(open('/usr/local/share/appdata/oss/licenses-data.json', 'r', encoding='utf-8'))
            main_data_dict = {item['license']: {**item, 'reference': {}} for item in main_data}

            # Load CN and EN license data
            cn_data = json.load(open('/usr/local/share/appdata/oss/licenses-cn.json', 'r', encoding='utf-8'))
            en_data = json.load(open('/usr/local/share/appdata/oss/licenses-en.json', 'r', encoding='utf-8'))
            for cn_license, cn_item in cn_data.items():
                cn_item.pop('number', None)
                if cn_license in main_data_dict:
                    main_data_dict[cn_license]['reference']['cn'] = cn_item
                else:
                    main_data_dict[cn_license] =   {'reference': {'cn': cn_item}}
                    print(f"Warning: License {cn_license} in CN data not found in main data")

            for en_license, en_item in en_data.items():
                en_item.pop('number', None)
                if en_license in main_data_dict:
                    main_data_dict[en_license]['reference']['en'] = en_item
                else:
                    main_data_dict[en_license] =   {'reference': {'en': en_license}}
                    print(f"Warning: License {en_license} in EN data not found in main data")

            # 将合并后的数据插入或更新到数据库
            for license, item in main_data_dict.items():
                if not item.get('license_text', None):                
                    license_file_path = f"/usr/local/share/appdata/oss/licenses/{license}.txt"
                    try:
                        with open(license_file_path, 'r', encoding='utf-8') as file:
                            item['license_text'] = file.read()
                    except FileNotFoundError:
                        print(f"Warning: License text file for {license} not found.")
                        
                table_license.update(license, item.get('license_text', None), item.get('type', None), item.get('url', None), item.get('reference', None))
            table_license.commit()

        if False:
            # Load CN and EN license data
            cn_data = json.load(open('/usr/local/share/appdata/oss/licenses-cn2.json', 'r', encoding='utf-8'))
            en_data = json.load(open('/usr/local/share/appdata/oss/licenses-en2.json', 'r', encoding='utf-8'))

            references = {}
            for license, item in cn_data.items():
                item.pop('number', None)
                references[license] = {'cn': item}
                
            for license, item in en_data.items():
                item.pop('number', None)
                references.setdefault(license, {})
                references[license]['en'] = item
            pprint(references, indent=2)
            for license, item in references.items():
                table_license.update(license, reference=item)
            table_license.commit()

        if False:
            #示例查询，用于验证 find_license 函数
            print("验证 find_license 函数:")
            license_to_find = "gpl2.0"
            print(f"查找精确匹配的许可证: {license_to_find}")
            exact_match_records = list(table_license.find_license(license_to_find))
            pprint(exact_match_records, indent=4)

            fuzzy_license_to_find = "mi"
            print(f"查找模糊匹配的许可证: {fuzzy_license_to_find}")
            fuzzy_match_records = list(table_license.find_license(fuzzy_license_to_find))
            pprint(fuzzy_match_records, indent=4)

            partial_fuzzy_license_to_find = "it"
            print(f"查找部分模糊匹配的许可证: {partial_fuzzy_license_to_find}")
            partial_fuzzy_match_records = list(table_license.find_license(partial_fuzzy_license_to_find))
            pprint(partial_fuzzy_match_records, indent=4)


            #Retrieve and print the inserted license data
            sample_licenses = [item['license'] for item in main_data[:3]]
            license_records = list(table_license.find_license(*sample_licenses))
            pprint(license_records, indent=4)

        if True:
            print("With Reference Records:")
            idx = 0
            for record in table_license.find_all():
                reference = record.get(table_license.REFERENCE, {})
                if reference:
                    idx += 1
                    print("{}. {}".format(idx, record[table_license.LICENSE]))

            print("Missing Reference Records:")
            idx = 0
            for record in table_license.find_all():
                reference = record.get(table_license.REFERENCE, {})
                if not reference or not reference.get('cn', None) or not reference.get('en', None):
                    idx += 1
                    print("{}. {} {}".format(idx, record[table_license.LICENSE], reference))
