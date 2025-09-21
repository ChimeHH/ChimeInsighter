import os
import collections
import re
import argparse
from .misconfigurations_def import *


from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class SSHCategory:
    DEPRECATED_PROTOCOL = 'Deprecated Protocol'
    DEFAULT_PORT = 'Default Port'
    GROUP_USER_PERMISSION = 'White\\Black List Users\\Groups'
    EMPTY_PASSWORDS = 'Empty Password Login'
    ROOT_LOGIN = 'Root Login'
    IDLE_SESSION = 'Idle Session'
    IGNORE_RHOSTS = 'Ignore Rhosts'


class SSHConfigMisconfiguration(MisconfigurationIdentifier):
    REGEXED_ESCAPED_SEPERATOR = os.sep + os.sep if os.sep == '\\' else os.sep
    KEYWORD_VALUE_REGX = re.compile('\s*(?P<prop_name>\S+)(?:\s*=\s*|\s+)(?P<value_name>\S+.*\S+|\S+)\s*')
    DEFAULT_SSH_PORT = '22'
    WHITE_BLACK_LIST_USESR = ['DENYUSERS', 'ALLOWUSERS', 'DENYGROUPS', 'ALLOWGROUPS']
    PERMIT_ROOT_LOGIN_ALLOWED_VALUES = ['NO', 'WITHOUT-PASSWORD']
    MINIMAL_IDLE_TIME = 0

    def __init__(self):
        super(SSHConfigMisconfiguration, self).__init__()
        self.sshd_paths_regex = [(re.compile(path_regex), path_handler) for path_regex, path_handler in [
            # SSH general config file
            ('(.*{})?({})$'.format(SSHConfigMisconfiguration.REGEXED_ESCAPED_SEPERATOR,
                                   ''.join(['etc', SSHConfigMisconfiguration.REGEXED_ESCAPED_SEPERATOR, 'ssh', SSHConfigMisconfiguration.REGEXED_ESCAPED_SEPERATOR, 'sshd?_config$'])),
             self._extract_general_config)
        ]]

    def get_misconfigurations(self, ssh_config_path):
        path_handler = None
        # Validate that the config matches the valid config paths
        for path_regex, conf_path_handler in self.sshd_paths_regex:
            if path_regex.match(ssh_config_path) is not None:
                path_handler = conf_path_handler
                break
        # If the config is in the wrong path format
        if path_handler is None:
            return None
            
        try:
            # Initialize the configurations
            configuration_dict = collections.defaultdict(list)
            # Handle the ssh config file and parse the configurations into the configuration dict
            path_handler(ssh_config_path, configuration_dict)
            # Calculate the final miscofigurations
            return self._calculate_misconfigurations(configuration_dict)
        except WrongConfigFormat:
            pass
        except BrokenFile:
            pass
        return None

    def _extract_general_config(self, file_path, configurations_dict):
        if self.is_broken_file(file_path):
            raise BrokenFile()
        with open(file_path, 'r') as config_path_handle:
            lines = config_path_handle.read().splitlines()
            for line in lines:
                if len(line) == 0 or line[:1] in ['#', ';'] or line.isspace():
                    continue
                config_line_match = SSHConfigMisconfiguration.KEYWORD_VALUE_REGX.match(line)
                if config_line_match is None:
                    raise WrongConfigFormat()
                key_word = config_line_match.group('prop_name').upper()
                argument = config_line_match.group('value_name')
                if key_word is None:
                    raise WrongConfigFormat()
                configurations_dict[key_word].append(argument)

    def _calculate_misconfigurations(self, configuration_dict):
        misconfiguraions = []
        # Check the protocol
        protocol = 'Protocol'
        protocol_values = configuration_dict.get(protocol.upper())
        protocol_value = None
        protocol_second_version = '2'
        protocol2_configured = False
        protocol_misconfig = False
        if protocol_values is None:
            protocol_misconfig = True
        else:
            for protocol_value_temp in protocol_values:
                if protocol_value_temp != protocol_second_version:
                    protocol_value = protocol_value_temp
                    protocol_misconfig = True
                    break
                else:
                    protocol2_configured = True
        if protocol_misconfig:
            misconfiguraions.append(MisconfigurationThreat(SSHCategory.DEPRECATED_PROTOCOL, protocol, protocol_value, protocol_second_version))
        # Check the port configuration
        port = 'Port'
        port_values = configuration_dict.get(port.upper())
        if port_values is not None:
            if SSHConfigMisconfiguration.DEFAULT_SSH_PORT in port_values:
                misconfiguraions.append(MisconfigurationThreat(SSHCategory.DEFAULT_PORT, port, SSHConfigMisconfiguration.DEFAULT_SSH_PORT, 'not {}'.format(SSHConfigMisconfiguration.DEFAULT_SSH_PORT)))
        # Check if there is a special users/groups permissions to access
        if not any(white_black_list_prop in configuration_dict for white_black_list_prop in SSHConfigMisconfiguration.WHITE_BLACK_LIST_USESR):
            misconfiguraions.append(MisconfigurationThreat(SSHCategory.GROUP_USER_PERMISSION, '|'.join(SSHConfigMisconfiguration.WHITE_BLACK_LIST_USESR), None, 'users/group names'))
        # Check the root login permission
        permit_root_login = 'PermitRootLogin'
        permit_root_login_values = configuration_dict.get(permit_root_login.upper())
        if permit_root_login_values is not None:
            for permit_root_login_value in permit_root_login_values:
                if not permit_root_login_value.upper() in SSHConfigMisconfiguration.PERMIT_ROOT_LOGIN_ALLOWED_VALUES:
                    misconfiguraions.append(MisconfigurationThreat(SSHCategory.ROOT_LOGIN, permit_root_login, permit_root_login_value, '|'.join(SSHConfigMisconfiguration.PERMIT_ROOT_LOGIN_ALLOWED_VALUES)))
                    break
        # Check for idle session - relevant only if the protocol is 2
        if protocol2_configured:
            client_alive_interval = 'ClientAliveInterval'
            client_alive_interval_values = configuration_dict.get(client_alive_interval.upper())
            client_alive_interval_value = None
            client_alive_interval_misconfig = False
            if client_alive_interval_values is None:
                client_alive_interval_misconfig = True
            else:
                for client_alive_interval_value_temp in client_alive_interval_values:
                    if client_alive_interval_value_temp.isdigit() and int(client_alive_interval_value_temp) < SSHConfigMisconfiguration.MINIMAL_IDLE_TIME:
                        client_alive_interval_value = client_alive_interval_value_temp
                        client_alive_interval_misconfig = True
                        break
            if client_alive_interval_misconfig:
                misconfiguraions.append(MisconfigurationThreat(SSHCategory.IDLE_SESSION, client_alive_interval, client_alive_interval_value, 'more than {}'.format(SSHConfigMisconfiguration.MINIMAL_IDLE_TIME)))
        # Check permission of empty passwords
        permit_empty_pass = 'PermitEmptyPasswords'
        empty_password_values = configuration_dict.get(permit_empty_pass.upper())
        empty_password_value = None
        empty_password_misconfig = False
        if empty_password_values is None:
            empty_password_misconfig = True
        else:
            for empty_password_value_temp in empty_password_values:
                if empty_password_value_temp.upper() != 'NO':
                    empty_password_value = empty_password_value_temp
                    empty_password_misconfig = True
                    break
        if empty_password_misconfig:
            misconfiguraions.append(MisconfigurationThreat(SSHCategory.EMPTY_PASSWORDS, permit_empty_pass, empty_password_value, 'no'))
        # Check the Rhost configurations
        rhosts_ignore = 'IgnoreRhosts'
        rhosts_ignore_values = configuration_dict.get(rhosts_ignore.upper())
        if rhosts_ignore_values is not None and 'no' in [rhosts_ignore_value.lower() for rhosts_ignore_value in rhosts_ignore_values]:
            misconfiguraions.append(MisconfigurationThreat(SSHCategory.IGNORE_RHOSTS, rhosts_ignore, 'no', 'yes'))
        return misconfiguraions


