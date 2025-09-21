import os
import logging
import subprocess
import pathlib
from .misconfigurations_def import *
from collections import defaultdict


from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class WindowsRegistryMisconfigsProp:
    def __init__(self, name, required_value, bad_value, paths=None):
        self.name = name
        self.required_value = required_value
        self.bad_value = bad_value
        self.paths = paths


class WindowsRegistryMisconfigsCategories:
    SHARES_ACCESS = 'Shares Access'
    AUTO_PLAY_AND_RUN = 'Auto Play and Run'
    SAM = 'SAM'
    PASSWORD_POLICY = 'Password Policy'
    LAN_MANAGER = 'LAN Manager'
    ASLR = 'ASLR'
    DEP = 'DEP'
    ACCOUNTS_ACCESS = 'Accounts Access'
    RESOURCE_MANAGEMENT = 'Resource Management'
    WIRELESS_SETTINGS = 'Wireless Settings'
    UNC_PATHS = 'UNC Paths'
    P2P_NETWORKING_SERVICES = 'P2P Networking Services'
    SOURCE_ROUTING = 'Source Routing'
    WDIGEST_AUTHENTICATION = 'WDigest Authentication'

class Properties:
    def __init__(self):
        # SHARES_ACCESS
        self.restrict_anon = WindowsRegistryMisconfigsProp('RestrictAnonymous', '1', None,
                                                           ['CurrentControlSet\Control\Lsa',
                                                            'ControlSet001\Control\Lsa'])

        # AUTOPLAY
        self.no_autoplay = WindowsRegistryMisconfigsProp('NoAutoplayfornonVolume', '1', None,
                                                         ['Policies\Microsoft\Windows\Explorer'])
        self.no_autorun = WindowsRegistryMisconfigsProp('NoAutorun', '1', None,
                                                        ['Microsoft\Windows\CurrentVersion\Policies\Explorer'])
        self.no_drive = WindowsRegistryMisconfigsProp('NoDriveTypeAutoRun', '255', None,
                                                      ['Microsoft\Windows\CurrentVersion\Policies\Explorer'])

        # SAM
        self.restrict_anon_sam = WindowsRegistryMisconfigsProp('RestrictAnonymousSAM', '1', None,
                                                               ['CurrentControlSet\Control\Lsa',
                                                                'ControlSet001\Control\Lsa'])

        # PASSWORD POLICY
        self.blank_password = WindowsRegistryMisconfigsProp('LimitBlankPasswordUse', '1', None,
                                                            ['CurrentControlSet\Control\Lsa',
                                                             'ControlSet001\Control\Lsa'])

        # LAN MANAGER
        self.no_lm_hash = WindowsRegistryMisconfigsProp('NoLMHash', '1', None,
                                                        ['CurrentControlSet\Control\Lsa', 'ControlSet001\Control\Lsa'])
        self.lm_compat = WindowsRegistryMisconfigsProp('LmCompatibilityLevel', '5', None,
                                                       ['CurrentControlSet\Control\Lsa', 'ControlSet001\Control\Lsa'])

        # ASLR
        self.aslr = WindowsRegistryMisconfigsProp('ASLR', '3', None, ['Policies\Microsoft\EMET\SysSettings'])

        # DEP
        self.dep = WindowsRegistryMisconfigsProp('DEP', '2', None, ['Policies\Microsoft\EMET\SysSettings'])

        # ACCOUNTS ACCESS
        self.enum_local_users = WindowsRegistryMisconfigsProp('EnumerateLocalUsers', '0', None,
                                                              ['Policies\Microsoft\Windows\System'])

        # RESOURCE MANAGEMENT
        self.fmininize_connections = WindowsRegistryMisconfigsProp('fMinimizeConnections', '1', None,
                                                                   ['Policies\Microsoft\Windows\WcmSvc\GroupPolicy'])

        # WIRELESS SETTINGS
        self.disable_flash_conf_reg = WindowsRegistryMisconfigsProp('DisableFlashConfigRegistrar', '0', None,
                                                                    ['Policies\Microsoft\Windows\WCN\Registrars'])
        self.disable_in_band_80211_reg = WindowsRegistryMisconfigsProp('DisableInBand802DOT11Registrar', '0', None,
                                                                       ['Policies\Microsoft\Windows\WCN\Registrars'])
        self.disable_upnp_reg = WindowsRegistryMisconfigsProp('DisableUPnPRegistrar', '0', None,
                                                              ['Policies\Microsoft\Windows\WCN\Registrars'])
        self.disable_wpd_reg = WindowsRegistryMisconfigsProp('DisableWPDRegistrar', '0', None,
                                                             ['Policies\Microsoft\Windows\WCN\Registrars'])
        self.enable_regs = WindowsRegistryMisconfigsProp('EnableRegistrars', '0', None,
                                                         ['Policies\Microsoft\Windows\WCN\Registrars'])

        # ACCOUNTS ACCESS
        self.enum_local_users = WindowsRegistryMisconfigsProp('EnumerateLocalUsers', '2', None,
                                                              ['Policies\Microsoft\Windows\System'])

        # UNC PATHS
        self.netlogon = WindowsRegistryMisconfigsProp('\\\\*\\NETLOGON',
                                                      'RequireMutualAuthentication=1, RequireIntegrity=1', None,
                                                      ['Policies\\Microsoft\\Windows\\NetworkProvider\\HardenedPaths'])
        self.sysvol = WindowsRegistryMisconfigsProp('\\*\\SYSVOL', 'RequireMutualAuthentication=1, RequireIntegrity=1',
                                                    None,
                                                    ['Policies\\Microsoft\\Windows\\NetworkProvider\\HardenedPaths'])

        # P2P NETWORKING
        self.peernet_disabled = WindowsRegistryMisconfigsProp('Disabled', '1', None, ['Policies\Microsoft\Peernet'])

        # SOURCE ROUTING
        self.disable_source_routing = WindowsRegistryMisconfigsProp('DisableIPSourceRouting', '2', None,
                                                                    ['CurrentControlSet\Services\Tcpip\Parameters'])

        # WDIGEST AUTHENTICATION
        self.use_logon_creds = WindowsRegistryMisconfigsProp('UseLogonCredential', '0', None,
                                                             ['Policies\Microsoft\Peernet'])


keys = Properties()


class WindowsRegistryHandlers:
    def __init__(self):
        pass

    @staticmethod
    def _get_reg_hivegx(file_path, reg_path, key):
        try:
            command = f"hivexget '{file_path}' '{reg_path}' {key}"
            val = subprocess.check_output(command, shell=True).strip().decode('utf-8')
            return val
        except subprocess.CalledProcessError as e:
            # property not in hive
            return None
        except Exception as e:
            logging.exception()
            return None

    def _obj_registry_attr_val_check(self, obj, file_path, misconfig_category, misconfigs):
        for path in obj.paths:
            val = self._get_reg_hivegx(file_path, path, obj.name)

        if val != obj.required_value:
            misconfigs.append(MisconfigurationThreat(misconfig_category, obj.name, val, obj.required_value))

    def aslr_handler(self, file_path):
        misconfigs = []
        for path in keys.aslr.paths:
            val = self._get_reg_hivegx(file_path, path, keys.aslr.name)
            if val != None:
                misconfigs.append(
                    MisconfigurationThreat(WindowsRegistryMisconfigsCategories.ASLR, keys.aslr.name, val))

        # TODO: complete ASLR logic
        return misconfigs

    def dep_handler(self, file_path):
        misconfigs = []
        for path in keys.dep.paths:
            val = self._get_reg_hivegx(file_path, path, keys.dep.name)
            if val != None:
                misconfigs.append(
                    MisconfigurationThreat(WindowsRegistryMisconfigsCategories.DEP, keys.dep.name, val))

        # TODO: complete ASLR logic
        return misconfigs

    def auto_play_handler(self, file_path):
        misconfigs = []
        self._obj_registry_attr_val_check(keys.no_autoplay, file_path,
                                          WindowsRegistryMisconfigsCategories.AUTO_PLAY_AND_RUN, misconfigs)
        self._obj_registry_attr_val_check(keys.no_autorun, file_path,
                                          WindowsRegistryMisconfigsCategories.AUTO_PLAY_AND_RUN, misconfigs)
        self._obj_registry_attr_val_check(keys.no_drive, file_path,
                                          WindowsRegistryMisconfigsCategories.AUTO_PLAY_AND_RUN, misconfigs)
        return misconfigs

    def shares_access_handler(self, file_path):
        misconfigs = []
        self._obj_registry_attr_val_check(keys.restrict_anon, file_path,
                                          WindowsRegistryMisconfigsCategories.SHARES_ACCESS, misconfigs)
        return misconfigs

    def sam_handler(self, file_path):
        misconfigs = []
        self._obj_registry_attr_val_check(keys.restrict_anon_sam, file_path, WindowsRegistryMisconfigsCategories.SAM,
                                          misconfigs)
        return misconfigs

    def password_policy_handler(self, file_path):
        misconfigs = []
        self._obj_registry_attr_val_check(keys.blank_password, file_path,
                                          WindowsRegistryMisconfigsCategories.PASSWORD_POLICY, misconfigs)
        return misconfigs

    def lan_manager_handler(self, file_path):
        misconfigs = []
        self._obj_registry_attr_val_check(keys.no_lm_hash, file_path, WindowsRegistryMisconfigsCategories.LAN_MANAGER,
                                          misconfigs)
        self._obj_registry_attr_val_check(keys.lm_compat, file_path, WindowsRegistryMisconfigsCategories.LAN_MANAGER,
                                          misconfigs)
        return misconfigs

    def accounts_access_handler(self, file_path):
        misconfigs = []
        self._obj_registry_attr_val_check(keys.enum_local_users, file_path,
                                          WindowsRegistryMisconfigsCategories.ACCOUNTS_ACCESS, misconfigs)
        return misconfigs

    def resource_manager_handler(self, file_path):
        misconfigs = []
        self._obj_registry_attr_val_check(keys.fmininize_connections, file_path,
                                          WindowsRegistryMisconfigsCategories.RESOURCE_MANAGEMENT, misconfigs)
        return misconfigs

    def wireless_settings_handler(self, file_path):
        misconfigs = []
        self._obj_registry_attr_val_check(keys.disable_flash_conf_reg, file_path,
                                          WindowsRegistryMisconfigsCategories.WIRELESS_SETTINGS, misconfigs)
        self._obj_registry_attr_val_check(keys.disable_in_band_80211_reg, file_path,
                                          WindowsRegistryMisconfigsCategories.WIRELESS_SETTINGS, misconfigs)
        self._obj_registry_attr_val_check(keys.disable_upnp_reg, file_path,
                                          WindowsRegistryMisconfigsCategories.WIRELESS_SETTINGS, misconfigs)
        self._obj_registry_attr_val_check(keys.disable_wpd_reg, file_path,
                                          WindowsRegistryMisconfigsCategories.WIRELESS_SETTINGS, misconfigs)
        self._obj_registry_attr_val_check(keys.enable_regs, file_path,
                                          WindowsRegistryMisconfigsCategories.WIRELESS_SETTINGS, misconfigs)
        return misconfigs

    def unc_paths_handler(self, file_path):
        misconfigs = []
        self._obj_registry_attr_val_check(keys.netlogon, file_path, WindowsRegistryMisconfigsCategories.UNC_PATHS,
                                          misconfigs)
        self._obj_registry_attr_val_check(keys.sysvol, file_path, WindowsRegistryMisconfigsCategories.UNC_PATHS,
                                          misconfigs)
        return misconfigs

    def p2p_networking_handler(self, file_path):
        misconfigs = []
        self._obj_registry_attr_val_check(keys.peernet_disabled, file_path,
                                          WindowsRegistryMisconfigsCategories.P2P_NETWORKING_SERVICES, misconfigs)
        return misconfigs

    def source_routing_handler(self, file_path):
        misconfigs = []
        self._obj_registry_attr_val_check(keys.disable_source_routing, file_path,
                                          WindowsRegistryMisconfigsCategories.SOURCE_ROUTING, misconfigs)
        return misconfigs

    def wdigest_authentication_handler(self, file_path):
        misconfigs = []
        self._obj_registry_attr_val_check(keys.use_logon_creds, file_path,
                                          WindowsRegistryMisconfigsCategories.WDIGEST_AUTHENTICATION, misconfigs)
        return misconfigs


handlers = WindowsRegistryHandlers()
system_hive_misconfigs = [
    handlers.wdigest_authentication_handler,
    handlers.source_routing_handler,
    handlers.shares_access_handler,
    handlers.sam_handler,
    handlers.password_policy_handler,
    handlers.lan_manager_handler,
]

software_hive_misconfigs = [
    handlers.p2p_networking_handler,
    handlers.unc_paths_handler,
    handlers.wireless_settings_handler,
    handlers.resource_manager_handler,
    handlers.accounts_access_handler,
    handlers.dep_handler,
    handlers.aslr_handler,
    handlers.auto_play_handler,
]

class WindowsRegistryMisconfigurations(MisconfigurationIdentifier):

    def _search_reg_hive_files(self, root_path):
        hives = defaultdict(list)
        for root, dirs, files in os.walk(root_path):
            for file_name in files:
                full_path = os.path.join(root, file_name)
                for hive_name in ['system', 'software']:
                    if full_path.lower().endswith(f'system32/config/{hive_name}'):
                        hives[root].append(full_path)

        return hives

    def _get_hive_registry_misconfigs(self, file_path, hive_name):
        hive_misconfigs = []
        if hive_name == 'SYSTEM':
            for handler in system_hive_misconfigs:
                reg_misconfigs = handler(file_path)
                hive_misconfigs.extend(reg_misconfigs)

        elif hive_name == 'SOFTWARE':
            for handler in software_hive_misconfigs:
                reg_misconfigs = handler(file_path)
                hive_misconfigs.extend(reg_misconfigs)

        return hive_misconfigs

    def get_misconfigurations(self, hive_file):
        try:
            return self._get_hive_registry_misconfigs(hive_file, os.path.basename(hive_file))
            
        except Exception as e:
            logging.exception()
            
        return None


def main():
    # need to create a main function to return results when run independently
    win_reg = WindowsRegistryMisconfigurations()

    for filepath in pathlib.Path('/share/simple-test/output/integration-test-quick/configurations/win_test/system32/config').iterdir():
        misconfigurations = win_reg.get_misconfigurations(str(filepath))
        for ms in misconfigurations:
            print(ms.to_dict())


if __name__ == '__main__':
    main()
