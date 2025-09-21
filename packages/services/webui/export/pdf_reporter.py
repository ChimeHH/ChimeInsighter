from collections import OrderedDict

from pprint import pp

from exlib.settings import osenv
from database.core.mongo_db import mongo_client
from ..core.data_manager import DataManager

from exlib.export import pdf


from .rmldocs.overview import RmlOverview
from .rmldocs.summary import RmlSummary

from .rmldocs.component import RmlComponent
from .rmldocs.public import RmlPublic
from .rmldocs.zeroday import RmlZeroday
from .rmldocs.malware import RmlMalware
from .rmldocs.misconfiguration import RmlMisconfiguration
from .rmldocs.compliance import RmlCompliance

from .rmldocs.infoleak import RmlInfoleak
from .rmldocs.password import RmlPassword
# from .rmldocs.interface import RmlInterface
from .rmldocs.files import RmlFiles
from .rmldocs.security import RmlSecurity

from exlib.log.logger import MyLogger
logger = MyLogger.getLogger(__package__)


def generate_project_pdf_report(client, project_id, filepath, lang="en", maxrows=0):
    exporter = pdf.PdfExporter()
    data_manager = DataManager(client)

    RmlOverview.generate_report(exporter, data_manager, lang=lang)
    RmlSummary.generate_project_report(exporter, data_manager, project_id, lang=lang, including_versions=True)
    
    exporter.build(filepath, header="Chime Insight")

def generate_version_pdf_report(client, version_id, filepath, lang="en", maxrows=0):
    exporter = pdf.PdfExporter()
    data_manager = DataManager(client)

    RmlOverview.generate_report(exporter, data_manager, lang=lang)        
    RmlSummary.generate_version_report(exporter, data_manager, version_id, lang=lang) 

    RmlComponent.generate_report(exporter, data_manager, version_id, lang=lang, maxrows=maxrows)    
    RmlPublic.generate_report(exporter, data_manager, version_id, lang=lang, maxrows=maxrows)    
    RmlZeroday.generate_report(exporter, data_manager, version_id, lang=lang, maxrows=maxrows)       
    RmlPassword.generate_report(exporter, data_manager, version_id, lang=lang, maxrows=maxrows) 
    
    RmlMalware.generate_report(exporter, data_manager, version_id, lang=lang, maxrows=maxrows)    
    RmlMisconfiguration.generate_report(exporter, data_manager, version_id, lang=lang, maxrows=maxrows) 
    RmlCompliance.generate_report(exporter, data_manager, version_id, lang=lang, maxrows=maxrows)
    RmlFiles.generate_report(exporter, data_manager, version_id, lang=lang, maxrows=maxrows)

    RmlInfoleak.generate_report(exporter, data_manager, version_id, lang=lang, maxrows=maxrows)      

    RmlSecurity.generate_report(exporter, data_manager, version_id, lang=lang, maxrows=maxrows) 
        
    # RmlInterface.generate_report(exporter, data_manager, version_id, lang=lang, maxrows=maxrows)
   
    exporter.build(filepath, header="Chime Insight")

