import os
import collections
import re
import argparse
from .misconfigurations_def import *

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class Configurations:
    MINLEN = 0
    PASS_COMPLEXITY = 1
    PASS_HISTORY = 2
    ENCHANCED_MECHANISM  = 3


class PasswordPolicyCategory:
    PASSWORD_AGE = 'Password Age'
    WEAK_PASSWORD = 'Weak Password'
    LACK_OF_ENCHANCED_MECHANISM = 'Lack Of Enhanced Mechanism'
    BLANK_PASS_PERMITTED = 'Blank Pass Permitted'
    PREVIOUS_PASSWORDS_COMPARISON = 'Weak Check Against Previous Passwords'


class LinuxPasswordPolicyMisconfiguration(MisconfigurationIdentifier):
    REGEXED_ESCAPED_SEPERATOR = os.sep + os.sep if os.sep == '\\' else os.sep
    ERROR_REPORT_PERCENTAGE_THRESHOLD = 0.95
    ERROR_REPORT_ABSOLUTE_THRESHOLD = 30
    PAM_UNIX = 'pam_unix'
    CRACKLIB = 'pam_cracklib'
    PWQUALITY = 'pam_pwquality'
    PWHISTORY = 'pam_pwhistory'
    LOGIN_DEFS = 'login.defs'
    GENERAL = 'general'
    ENHANCED_ENCRYPTION_MECHANISM = [CRACKLIB, PWQUALITY]
    GENERAL_PASSWORD_CONFIG_LINE_REGEX = re.compile('^password\s+(?P<control>[^\[]\S*|\[.*\])\s+(?P<module_path>\".*\"|[^\"]\S*)(?:\s+(?P<module_args>\S+.*\S+|\S+))?\s*')
    PROPERTY_VALUE_REGEX = re.compile('\s*(?P<prop_name>\S|\S.*\S)\s*=\s*(?P<value_name>\S$|\S.*\S)\s*')
    LOGIN_DEFS_REGEX = re.compile('(?P<prop_name>\S+)\s+(?P<value_name>\S*)\s*')
    PROPERTY_VALUE_INLINE_REGEX = re.compile('(?:(?P<prop_name>\S+)=(?P<value_name>[^\"]\S*|\".*\")\s*)|(?P<flag>\S+)')
    MINIMUM_MIN_LEN = 6
    REMEMBER_PASSWORD_NUMBER = 10
    MAX_PASS_DAYS_NUMBER = 999

    def __init__(self):
        super(LinuxPasswordPolicyMisconfiguration, self).__init__()
        self.password_policy_path_regex = [(re.compile(path_regex), path_handler, supported_configs) for path_regex, path_handler, supported_configs in [
            # RPM based linux system
            ('(.*{})?({})$'.format(LinuxPasswordPolicyMisconfiguration.REGEXED_ESCAPED_SEPERATOR,
                                   ''.join(['etc', LinuxPasswordPolicyMisconfiguration.REGEXED_ESCAPED_SEPERATOR, 'pam.d', LinuxPasswordPolicyMisconfiguration.REGEXED_ESCAPED_SEPERATOR, 'system-auth$'])),
             self._extract_general_config, [Configurations.MINLEN,Configurations.PASS_COMPLEXITY, Configurations.PASS_HISTORY, Configurations.ENCHANCED_MECHANISM]),
            # Debian based linux system
            ('(.*{})?({})$'.format(LinuxPasswordPolicyMisconfiguration.REGEXED_ESCAPED_SEPERATOR,
                                   ''.join(['etc', LinuxPasswordPolicyMisconfiguration.REGEXED_ESCAPED_SEPERATOR, 'pam.d', LinuxPasswordPolicyMisconfiguration.REGEXED_ESCAPED_SEPERATOR, 'common-password$'])),
             self._extract_general_config, [Configurations.MINLEN,Configurations.PASS_COMPLEXITY, Configurations.PASS_HISTORY, Configurations.ENCHANCED_MECHANISM]),
            # The pam_pwquality external configuration file
            ('(.*{})?({})$'.format(LinuxPasswordPolicyMisconfiguration.REGEXED_ESCAPED_SEPERATOR,
                                   ''.join(['etc', LinuxPasswordPolicyMisconfiguration.REGEXED_ESCAPED_SEPERATOR, 'security', LinuxPasswordPolicyMisconfiguration.REGEXED_ESCAPED_SEPERATOR, 'pwquality\.conf'])),
             self._extract_pwquality_config, [Configurations.MINLEN, Configurations.PASS_COMPLEXITY, Configurations.ENCHANCED_MECHANISM]),
            # The login.defs external configuration file
            ('(.*{})?({})$'.format(LinuxPasswordPolicyMisconfiguration.REGEXED_ESCAPED_SEPERATOR,
                                   ''.join(['etc', LinuxPasswordPolicyMisconfiguration.REGEXED_ESCAPED_SEPERATOR, 'login\.defs'])),
             self._extract_login_defs_config, [])
        ]]

    
    def get_misconfigurations(self, password_config_path):
        path_handler = None
        path_supported_configs = None
        # Validate that the config matches the valid config paths
        for path_regex, conf_path_handler, supported_configurations in self.password_policy_path_regex:
            if path_regex.match(password_config_path) is not None:
                path_handler = conf_path_handler
                path_supported_configs = supported_configurations
                break
        # If the config is in the wrong path format
        if path_handler is None:
            return None
            
        try:
            total_supported_configs = []
            # Initialize the configurations
            configuration_dict = collections.defaultdict(list)
            # Handle the password policy file and parse the configurations into the configuration dict
            path_handler(password_config_path, configuration_dict, path_supported_configs, total_supported_configs)

            # Calculate the final miscofigurations            
            return self._calculate_misconfigurations(configuration_dict, total_supported_configs)    
                    
        except WrongConfigFormat:
            pass
        except BrokenFile:
            pass
        except Exception as err:
            self.logger.exception(f"Unexpected error for {password_config_path} with {err}")
        return None

    def _extract_generic_params(self, params):
        result_dict = {}
        if params is None:
            return result_dict
        for match in LinuxPasswordPolicyMisconfiguration.PROPERTY_VALUE_INLINE_REGEX.finditer(params):
            if match.group('prop_name') is not None:
                result_dict[match.group('prop_name')] = match.group('value_name')
            elif match.group('flag') is not None:
                result_dict[match.group('flag')] = True
        return result_dict

    def _extract_cracklib_params(self, params):
        return self._extract_generic_params(params)

    def _extract_pwquality_params(self, params):
        return self._extract_generic_params(params)

    def _extract_pwhistory_params(self, params):
        return self._extract_generic_params(params)

    def _extract_pam_unix_params(self, params):
        return self._extract_generic_params(params)

    def _extract_general_config(self, file_path, configuration_dict, path_supported_configs, total_supported_configs):
        if self.is_broken_file(file_path):
            raise BrokenFile()
        with open(file_path, 'r') as config_path_handle:
            lines = config_path_handle.read().splitlines()
            for line in lines:
                if len(line) == 0 or line[:1] in ['#', ';'] or line.isspace():
                    continue
                password_config_match = LinuxPasswordPolicyMisconfiguration.GENERAL_PASSWORD_CONFIG_LINE_REGEX.match(line)
                if password_config_match is None:
                    continue
                module_path = password_config_match.group('module_path')
                module_params = password_config_match.group('module_args')
                if module_path is None:
                    continue
                if re.match('.*pam_unix2?\.so$', module_path):
                    module_config_params = self._extract_pam_unix_params(module_params)
                    configuration_dict[LinuxPasswordPolicyMisconfiguration.PAM_UNIX].append(module_config_params)
                elif re.match('.*pam_cracklib\.so$', module_path):
                    module_config_params = self._extract_cracklib_params(module_params)
                    configuration_dict[LinuxPasswordPolicyMisconfiguration.CRACKLIB].append(module_config_params)
                elif re.match('.*pam_pwquality\.so$', module_path):
                    module_config_params = self._extract_pwquality_params(module_params)
                    configuration_dict[LinuxPasswordPolicyMisconfiguration.PWQUALITY].append(module_config_params)
                elif re.match('.*pam_pwhistory\.so$', module_path):
                    module_config_params = self._extract_pwhistory_params(module_params)
                    configuration_dict[LinuxPasswordPolicyMisconfiguration.PWHISTORY].append(module_config_params)

            total_supported_configs.extend(path_supported_configs)

    def _extract_login_defs_config(self, file_path, configuration_dict, path_supported_configs, total_supported_configs):
        props_and_vals = {}
        if self.is_broken_file(file_path):
            raise BrokenFile()
        with open(file_path, 'r') as config_path_handle:
            lines = config_path_handle.read().splitlines()
            for line in lines:
                if len(line) == 0 or line[:1] in ['#', ';'] or line.isspace():
                    continue
                match = LinuxPasswordPolicyMisconfiguration.LOGIN_DEFS_REGEX.match(line)
                if match is None:
                    raise WrongConfigFormat()
                try:
                    prop, value = match.group('prop_name'), match.group('value_name')
                    props_and_vals[prop] = value
                except:
                    raise WrongConfigFormat()
        if len(props_and_vals) > 0:
            configuration_dict[LinuxPasswordPolicyMisconfiguration.LOGIN_DEFS].append(props_and_vals)
            total_supported_configs.extend(path_supported_configs)

    def _extract_pwquality_config(self, file_path, configuration_dict, path_supported_configs, total_supported_configs):
        props_and_vals = {}
        if self.is_broken_file(file_path):
            raise BrokenFile()
        with open(file_path, 'r') as config_path_handle:
            lines = config_path_handle.read().splitlines()
            for line in lines:
                if len(line) == 0 or line[:1] in ['#', ';'] or line.isspace():
                    continue
                match = LinuxPasswordPolicyMisconfiguration.PROPERTY_VALUE_REGEX.match(line)
                if match is None:
                    raise WrongConfigFormat()
                try:
                    prop, value = match.group('prop_name'), match.group('value_name')
                    props_and_vals[prop] = value
                except:
                    raise WrongConfigFormat()
        if len(props_and_vals) > 0:
            configuration_dict[LinuxPasswordPolicyMisconfiguration.PWQUALITY].append(props_and_vals)
            total_supported_configs.extend(path_supported_configs)


    def _get_min_len_param_misc(self, rule, params_list):
        min_len_misc_found = False
        misconfig = None
        configured = None
        min_len_val = None
        for params_session in params_list:
            min_len = params_session.get('minlen')
            if min_len is not None:
                min_len_val = int(min_len)
                if min_len_val < LinuxPasswordPolicyMisconfiguration.MINIMUM_MIN_LEN:
                    min_len_misc_found = True
                    break
        if min_len_misc_found or min_len_val is not None:
            configured = Configurations.MINLEN
            if min_len_misc_found:
                misconfig = MisconfigurationThreat(PasswordPolicyCategory.WEAK_PASSWORD, 'minlen', min_len_val, LinuxPasswordPolicyMisconfiguration.MINIMUM_MIN_LEN, rule=rule)
        return (misconfig, configured)

    def _get_pass_complexity_param_misc(self, rule, params_list, complexity_params):
        pass_complexity_misconfigured = True
        configured = None
        for params_session in params_list:
            if not all(params_session.get(parameter) is None for parameter in complexity_params):
                pass_complexity_misconfigured = False
                break
        if not pass_complexity_misconfigured:
            configured = Configurations.PASS_COMPLEXITY
        return (None, configured)

    def _check_pwquality_misconfigurations(self, params_list):
        misconfigurations_list = []
        configs_list = []
        if params_list is not None:
            # Append min-len misconfiguration - if found
            min_len_misconfig, config = self._get_min_len_param_misc(LinuxPasswordPolicyMisconfiguration.PWQUALITY, params_list)
            if min_len_misconfig is not None:
                misconfigurations_list.append(min_len_misconfig)
            if config is not None:
                configs_list.append(config)
            # Append password complexity misconfiguration - if found
            pass_complexity_misconfig, config = self._get_pass_complexity_param_misc(LinuxPasswordPolicyMisconfiguration.PWQUALITY, params_list, ['minclass', 'dcredit', 'ucredit', 'lcredit', 'maxclassrepeat'])
            if pass_complexity_misconfig is not None:
                misconfigurations_list.append(pass_complexity_misconfig)
            if config is not None:
                configs_list.append(config)
        return misconfigurations_list, configs_list

    def _check_cracklib_misconfigurations(self, params_list):
        misconfigurations_list = []
        configs_list = []
        if params_list is not None:
            # Append min-len misconfiguration - if found
            min_len_misconfig, config = self._get_min_len_param_misc(LinuxPasswordPolicyMisconfiguration.CRACKLIB, params_list)
            if min_len_misconfig is not None:
                misconfigurations_list.append(min_len_misconfig)
            if config is not None:
                configs_list.append(config)
            # Append password complexity misconfiguration - if found
            pass_complexity_misconfig, config = self._get_pass_complexity_param_misc(LinuxPasswordPolicyMisconfiguration.CRACKLIB, params_list,
                                                                                     ['minclass', 'dcredit', 'ucredit', 'lcredit', 'maxclassrepeat', 'maxsequence'])
            if pass_complexity_misconfig is not None:
                misconfigurations_list.append(pass_complexity_misconfig)
            if config is not None:
                configs_list.append(config)
        return misconfigurations_list, configs_list

    def _check_pwhistory_misconfigurations(self, params_list):
        misconfigurations_list = []
        configs_list = []
        if params_list is not None:
            # Check the remember parameter
            remember_num = None
            remember_not_set_correctly = False
            for param_session in params_list:
                remember_parameter = param_session.get('remember')
                if remember_parameter is not None:
                    remember_num = int(remember_parameter)
                    if remember_num < LinuxPasswordPolicyMisconfiguration.REMEMBER_PASSWORD_NUMBER:
                        remember_not_set_correctly = True
                        break
            # If the remember parameter was not set correctly or the wasn't set at all, create an incident
            if remember_not_set_correctly or remember_num is not None:
                configs_list.append(Configurations.PASS_HISTORY)
                if remember_not_set_correctly:
                    misconfigurations_list.append(MisconfigurationThreat(PasswordPolicyCategory.PREVIOUS_PASSWORDS_COMPARISON, 'remember', remember_num,
                                                                                 LinuxPasswordPolicyMisconfiguration.REMEMBER_PASSWORD_NUMBER, rule=LinuxPasswordPolicyMisconfiguration.PWHISTORY))
        return misconfigurations_list, configs_list

    def _check_login_refs_misconfigurations(self, params_list):
        misconfigurations_list = []
        configs_list = []
        if params_list is not None:
            # Check the pass max days parameter
            pass_max_days_num = None
            pass_max_days_not_set_correctly = False
            for param_session in params_list:
                pass_max_days_parameter = param_session.get('PASS_MAX_DAYS')
                if pass_max_days_parameter is not None:
                    pass_max_days_num = int(pass_max_days_parameter)
                    if pass_max_days_num > LinuxPasswordPolicyMisconfiguration.MAX_PASS_DAYS_NUMBER:
                        pass_max_days_not_set_correctly = True
                        break
            # If the pass max days was not set correctly create an incident
            if pass_max_days_not_set_correctly:
                misconfigurations_list.append(MisconfigurationThreat(PasswordPolicyCategory.PASSWORD_AGE, 'PASS_MAX_DAYS', pass_max_days_num,
                                                                             'below {}'.format(LinuxPasswordPolicyMisconfiguration.MAX_PASS_DAYS_NUMBER), rule=LinuxPasswordPolicyMisconfiguration.LOGIN_DEFS))

        return misconfigurations_list, configs_list

    def _check_pam_unix_misconfigurations(self, params_list):
        misconfigurations_list = []
        configs_list = []
        if params_list is not None:
            # Check the nullok parameter
            nullok_set = False
            for param_session in params_list:
                if any(blank_pass_param in param_session for blank_pass_param in ['nullok', 'nullok_secure']):
                    nullok_set = True
                    break
            if nullok_set:
                misconfigurations_list.append(MisconfigurationThreat(PasswordPolicyCategory.BLANK_PASS_PERMITTED, 'nullok', 'true',
                                                                             'false', LinuxPasswordPolicyMisconfiguration.PAM_UNIX))
            # Check the remember parameter
            remember_num = None
            remember_not_set_correctly = False
            for param_session in params_list:
                remember_parameter = param_session.get('remember')
                if remember_parameter is not None:
                    remember_num = int(remember_parameter)
                    if remember_num < LinuxPasswordPolicyMisconfiguration.REMEMBER_PASSWORD_NUMBER:
                        remember_not_set_correctly = True
                        break
            # If the remember parameter was not set correctly or the wasn't set at all, create an incident
            if remember_not_set_correctly or remember_num is not None:
                configs_list.append(Configurations.PASS_HISTORY)
                if remember_not_set_correctly:
                    misconfigurations_list.append(MisconfigurationThreat(PasswordPolicyCategory.PREVIOUS_PASSWORDS_COMPARISON, 'remember', remember_num,
                                                                                 LinuxPasswordPolicyMisconfiguration.REMEMBER_PASSWORD_NUMBER, rule=LinuxPasswordPolicyMisconfiguration.PAM_UNIX))
        return misconfigurations_list, configs_list

    def _calculate_misconfigurations(self, configuration_dict, total_supported_configs):
        misconfiguration_objs = []
        configs_objs = []
        # Generate the misconfiguration for the login defs
        misconfigs, configs = self._check_login_refs_misconfigurations(configuration_dict.get(LinuxPasswordPolicyMisconfiguration.LOGIN_DEFS))
        misconfiguration_objs.extend(misconfigs)
        configs_objs.extend(configs)
        # Generate the misconfiguration for the pwquality
        misconfigs, configs = self._check_pwquality_misconfigurations(configuration_dict.get(LinuxPasswordPolicyMisconfiguration.PWQUALITY))
        misconfiguration_objs.extend(misconfigs)
        configs_objs.extend(configs)
        # Generate the misconfiguration for the cracklib
        misconfigs, configs = self._check_cracklib_misconfigurations(configuration_dict.get(LinuxPasswordPolicyMisconfiguration.CRACKLIB))
        misconfiguration_objs.extend(misconfigs)
        configs_objs.extend(configs)
        # Generate the misconfiguration for the pam_pwhistory
        misconfigs, configs = self._check_pwhistory_misconfigurations(configuration_dict.get(LinuxPasswordPolicyMisconfiguration.PWHISTORY))
        misconfiguration_objs.extend(misconfigs)
        configs_objs.extend(configs)
        # Generate the misconfiguration for the pam_unix
        misconfigs, configs = self._check_pam_unix_misconfigurations(configuration_dict.get(LinuxPasswordPolicyMisconfiguration.PAM_UNIX))
        misconfiguration_objs.extend(misconfigs)
        configs_objs.extend(configs)

        # Generate the Cross-Module misconfigurations - where the configurations were not defined (apposed to wrong definition)
        if Configurations.PASS_HISTORY in total_supported_configs and  (Configurations.PASS_HISTORY not in configs_objs):
            misconfiguration_objs.append(MisconfigurationThreat(PasswordPolicyCategory.PREVIOUS_PASSWORDS_COMPARISON, 'remember', None,
                                                                        LinuxPasswordPolicyMisconfiguration.REMEMBER_PASSWORD_NUMBER, rule=LinuxPasswordPolicyMisconfiguration.PAM_UNIX))
        if Configurations.ENCHANCED_MECHANISM in total_supported_configs and (not any(machanism in configuration_dict for machanism in LinuxPasswordPolicyMisconfiguration.ENHANCED_ENCRYPTION_MECHANISM)):
            misconfiguration_objs.append(MisconfigurationThreat(PasswordPolicyCategory.LACK_OF_ENCHANCED_MECHANISM, 'enhanced security rule', None,
                                                                        'pam_cracklib|pam_pwquality', rule=LinuxPasswordPolicyMisconfiguration.GENERAL))
        else:
            if Configurations.MINLEN in total_supported_configs and (Configurations.MINLEN not in configs_objs):
                misconfiguration_objs.append(
                    MisconfigurationThreat(PasswordPolicyCategory.WEAK_PASSWORD, 'minlen',None, 
                        LinuxPasswordPolicyMisconfiguration.MINIMUM_MIN_LEN, rule='{}|{}'.format(LinuxPasswordPolicyMisconfiguration.CRACKLIB, LinuxPasswordPolicyMisconfiguration.PWQUALITY)))
            if Configurations.PASS_COMPLEXITY in total_supported_configs and (Configurations.PASS_COMPLEXITY not in configs_objs):
                misconfiguration_objs.append(
                    MisconfigurationThreat(PasswordPolicyCategory.WEAK_PASSWORD, '|'.join(['minclass', 'dcredit', 'ucredit', 'lcredit']), 
                        None, 'definition', rule='{}|{}'.format(LinuxPasswordPolicyMisconfiguration.CRACKLIB, LinuxPasswordPolicyMisconfiguration.PWQUALITY)))

        return misconfiguration_objs


