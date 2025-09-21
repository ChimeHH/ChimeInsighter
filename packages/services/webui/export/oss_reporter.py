import pathlib
import time

from lib4sbom.sbom import SBOM
from lib4sbom.data.package import SBOMPackage
from lib4sbom.data.document import SBOMDocument
from lib4sbom.data.file import SBOMFile
from lib4sbom.generator import SBOMGenerator

from exlib.utils.dataex import get_value
from database.core.mongo_db import mongo_client

from ..core.data_manager import DataManager

from pprint import pprint

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class SbomExporter:
    def __init__(self, project, version, files, components):
        self.project = project
        self.version = version
        self.components = components
        self.files = files

    def _generate_sbom_data(self):
        sbom = SBOM()

        project_name = self.project['project_name']
        version_name = self.version['version_name']

        sbom_doc = SBOMDocument()
        sbom_doc.set_name(project_name)
        sbom_doc.set_type("spdx")
        sbom_doc.set_version(version_name)
        sbom.add_document(sbom_doc.get_document())


        sbom_files = {}
        _file_index = 0

        for file in self.files:
            if file['size'] <= 0 or not file['labels']:
                continue

            filepathes = file['filepath_r']

            _file = SBOMFile()
            _file_index += 1
            _file.set_id(str(_file_index))

            labels = file['labels']
            _file.set_name("/"+str(filepathes[0]))
            _file.set_filetype(labels[0])

            comment = ""
            for p in filepathes:
                comment += f"\n\t{labels} {p}"
            _file.set_comment(comment)

            checksum = file['checksum']            
            for k, v in file.get('hashes', {}).items():
                _file.set_checksum(k, v)
            
            sbom_files[(checksum, _file_index)] = _file.get_file()

        sbom_packages = {}
        _package_index = 0
        for package in self.components:            
            license_data = package.get('license_data', [{},])
            for license_info in license_data:
                _package = SBOMPackage()
                _package_index += 1
                _package.set_id(str(_package_index))

                fullname = package['fullname']
                version = package['version']

                summary_info = package.get('package_summary', {})
                _package.set_name(summary_info.get('name', fullname))
                _package.set_version(version)            
                _package.set_filesanalysis(True)



                _package.set_supplier("organisation", get_value(summary_info, "vendor", ''))
                _package.set_licensedeclared(get_value(license_info, 'license', ""))
                _package.set_downloadlocation(get_value(summary_info, "website", ''))

                _package.set_copyrighttext(get_value(license_info, 'text', "")[:128])
                _package.set_attribution(get_value(license_info, 'type', ""))

                file_info = package['file_info']
                
                filepath = file_info['filepath_r']
                filetype = file_info.get('filetype', 'Unknown')            
                labels = file_info.get('labels', [])

                if filetype:
                    if filetype in (('shared', )):
                        _package.set_type('LIBRARY')
                    elif filetype in (('executable', )):
                        _package.set_type('APPLICATION')
                    elif 'kernel' in labels: # kernel must has higher priority than os names
                        _package.set_type('FIRMWARE')
                    elif 'linux' in labels or 'windows' in labels:
                        _package.set_type('OPERATING-SYSTEM')
                    else:
                        _package.set_type('FILE')
                else:
                        _package.set_type('FILE')
                
                for k, v in file_info.get('hashes', {}).items():
                    _package.set_checksum(k, v)
                
                sbom_packages[(fullname, _package_index)] = _package.get_package()

        sbom.add_files(sbom_files)
        sbom.add_packages(sbom_packages)

        return sbom

    @classmethod
    def _export_sbom_to_file(cls, data_manager, version_id, filepath, sbom_type, extended=False):
        version = data_manager.get_version(version_id)        
        project = data_manager.get_project(version['project_id'])
        
        components = data_manager.get_components(version_id)
        files = data_manager.get_files(version_id)

        project_name = project['project_name']
        version_name = version['version_name']

        exporter = SbomExporter(project, version, files, components)
        sbom = exporter._generate_sbom_data()

        gen = SBOMGenerator(sbom_type=sbom_type, application=project_name, version=version_name)
        
        project_name = f"{project_name}-{version_name}"
        gen.generate(project_name, sbom.get_sbom(), filename=filepath)

    @classmethod
    def export_sbom_to_spdx(cls, client, version_id, filepath, lang="en", maxrows=0, extended=False):
        data_manager = DataManager(client)
        cls._export_sbom_to_file(data_manager, version_id, filepath, 'spdx', extended=extended)

    @classmethod
    def export_sbom_to_cyclonedx(cls, client, version_id, filepath, lang="en", maxrows=0, extended=False):
        data_manager = DataManager(client)
        cls._export_sbom_to_file(data_manager, version_id, filepath, 'cyclonedx', extended=extended)
        