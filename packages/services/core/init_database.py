from database.core.mongo_db import mongo_client, UnauthorizedDataError

from database import master_database
from database import findings_database
from database import vuln_database
from database import sbom_database
from database import cache_database
from database import compliance_database

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


def InitDatabase():
    try:
        with mongo_client() as client: 
            # sbom tables
            sbom_database.TableSbomTokens(client).create_table()
            sbom_database.TableSbomFiles(client).create_table()
            sbom_database.TableSbomPackages(client).create_table()
            sbom_database.TableSbomPackagesSummary(client).create_table()

            # master tables
            master_database.TableUsers(client).create_table()
            master_database.TableProjects(client).create_table()
            master_database.TableVersions(client).create_table()

            # cache tables
            cache_database.TableCacheFiles(client).create_table()
            cache_database.TableCachePackages(client).create_table()
            cache_database.TableCacheThreats(client).create_table()

            # findings tables
            findings_database.TableFiles(client).create_table()
            findings_database.TablePackages(client).create_table()
            findings_database.TableThreats(client).create_table()

            # vulnabilities tables
            vuln_database.TableVulnCves(client).create_table()
            vuln_database.TableVulnCnnvds(client).create_table()
            vuln_database.TableVulnCnvds(client).create_table()
            vuln_database.TableVulnJvns(client).create_table()
            vuln_database.TableVulnCnnvds(client).create_table()

            compliance_database.TableComplianceLicenses(client).create_table()
            compliance_database.TableComplianceCwe(client).create_table()
            compliance_database.TableComplianceCweView(client).create_table()
        
    except UnauthorizedDataError as e:
        log.exception(f"init database failed due to: {str(e)}")
        return False