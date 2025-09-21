import os
import collections
import re
from pprint import pprint

from .misconfigurations_def import *

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

# The kernel configurations are loaded from different files:
# /etc/sysctl.conf
# /etc/sysctl.d/*.conf
# /run/sysctl.d/*.conf
# /usr/lib/sysctl.d/*.conf
# The configuration files contain a list of variable assignments, separated by newlines. Empty lines and lines whose first non-whitespace character is "#" or ";" are ignored.
# Configuration files are read from directories in /etc/, /run/, and /lib/, in order of precedence. Each configuration file in these configuration directories shall be named in the style of filename.conf. Files in /etc/ override files with the same name in /run/ and /lib/. Files in /run/ override files with the same name in /lib/.
# Packages should install their configuration files in /lib/. Files in /etc/ are reserved for the local administrator, who may use this logic to override the configuration files installed by vendor packages. All configuration files are sorted by their filename in lexicographic order, regardless of which of the directories they reside in. If multiple files specify the same option, the entry in the file with the lexicographically latest name will take precedence. It is recommended to prefix all filenames with a two-digit number and a dash, to simplify the ordering of the files.
# If the administrator wants to disable a configuration file supplied by the vendor, the recommended way is to place a symlink to /dev/null in the configuration directory in /etc/, with the same filename as the vendor configuration file. If the vendor configuration file is included in the initrd image, the image has to be regenerated.
#
# Important information about the etc/sysctl.conf:
# Note: From version 207 and 21x, systemd only applies settings from /etc/sysctl.d/*.conf and /usr/lib/sysctl.d/*.conf. If you had customized /etc/sysctl.conf, you need to rename it as /etc/sysctl.d/99-sysctl.conf. If you had e.g. /etc/sysctl.d/foo, you need to rename it to /etc/sysctl.d/foo.conf.
# The sysctl preload/configuration file can be created at /etc/sysctl.d/99-sysctl.conf. For systemd, /etc/sysctl.d/ and /usr/lib/sysctl.d/ are drop-in directories for kernel sysctl parameters. The naming and source directory decide the order of processing, which is important since the last parameter processed may override earlier ones. For example, parameters in a /usr/lib/sysctl.d/50-default.conf will be overriden by equal parameters in /etc/sysctl.d/50-default.conf and any configuration file processed later from both directories.
#
# For more information refere to those references:
# https://manpages.debian.org/stretch/systemd/sysctl.d.5.en.html
# https://manpages.debian.org/stretch/procps/sysctl.conf.5.en.html
# https://wiki.archlinux.org/index.php/sysctl
# Good source for precedence explanation:
# https://forum.manjaro.org/t/etc-sysctl-d-gets-applied-before-usr-lib-sysctl-d/34151/6


class KernelMisconfigurationCategory:
    ASLR = 'ASLR'
    EXEC_SHIELD_PROTECTION = 'ExecShield Protection'
    ICMP_BROADCAST = 'ICMP Broadcast'
    IP_SOURCE_ROUTING_PACKETS = 'IP Source Routing Packets'
    IP_REVERSE_PATH_FORWARDING = 'IP Reverse Path Forwarding'
    KERNEL_SYSRQ = 'Kernel SysRQ'


class KernelCorrectConfiguration:
    def __init__(self, config_name, legal_values):
        self.config_name = config_name
        self.legal_values = legal_values

    def is_legal_value(self, actual_value):
        return actual_value in self.legal_values

    def required_values_str(self):
        return '|'.join(self.legal_values)


class LinuxKernelParametersMisconfiguration(MisconfigurationIdentifier):
    # Kernel parameters relative path
    REGEXED_ESCAPED_SEPERATOR = os.sep + os.sep if os.sep == '\\' else os.sep
    KERNEL_PARAMETERS_PATHS_REGEXES = [re.compile(path_regex) for path_regex in [
        '(.*{})?({})$'.format(REGEXED_ESCAPED_SEPERATOR, ''.join(['etc', REGEXED_ESCAPED_SEPERATOR, 'sysctl\.conf'])),
        '(.*{})?({})$'.format(REGEXED_ESCAPED_SEPERATOR, ''.join(['etc', REGEXED_ESCAPED_SEPERATOR, 'sysctl\.d', REGEXED_ESCAPED_SEPERATOR, '.*\.conf'])),
        '(.*{})?({})$'.format(REGEXED_ESCAPED_SEPERATOR, ''.join(['run', REGEXED_ESCAPED_SEPERATOR, 'sysctl\.d', REGEXED_ESCAPED_SEPERATOR, '.*\.conf'])),
        '(.*{})?({})$'.format(REGEXED_ESCAPED_SEPERATOR, ''.join(['usr', REGEXED_ESCAPED_SEPERATOR, 'lib', REGEXED_ESCAPED_SEPERATOR, 'sysctl\.d', REGEXED_ESCAPED_SEPERATOR, '.*\.conf']))
    ]]
    SYSCTL_CONF = os.path.join('etc', 'sysctl.conf')
    PATHS_PRECEDENCE = {os.path.join('usr', 'lib', 'sysctl.d'): 1,
                        os.path.join('run', 'sysctl.d'): 2,
                        os.path.join('etc', 'sysctl.d'): 3,
                        'etc': 4}

    # Sysctl config parser
    SYSCTL_ROW_REGEX = re.compile('\s*(\S|\S.*\S)\s*=\s*(\S$|\S.*\S)\s*')
    # Correct Configurations
    CORRECT_CONFIGURATIONS = {
        # Enable ASLR
        'kernel.randomize_va_space': KernelCorrectConfiguration(KernelMisconfigurationCategory.ASLR, ['1', '2']),
        # Enable ExecShield protection
        'kernel.exec-shield': KernelCorrectConfiguration(KernelMisconfigurationCategory.EXEC_SHIELD_PROTECTION, ['1']),
        # Ignore all ICMP ECHO and TIMESTAMP requests sent to it via broadcast/multicast
        'net.ipv4.icmp_echo_ignore_broadcasts': KernelCorrectConfiguration(KernelMisconfigurationCategory.ICMP_BROADCAST, ['1']),
        'net.ipv4.icmp_ignore_bogus_error_messages': KernelCorrectConfiguration(KernelMisconfigurationCategory.ICMP_BROADCAST, ['1']),
        # Accept packets with SRR option? No (Disable IP source routing)
        # Another explanation here : https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security_guide/sect-security_guide-server_security-disable-source-routing
        'net.ipv4.conf.all.accept_source_route': KernelCorrectConfiguration(KernelMisconfigurationCategory.IP_SOURCE_ROUTING_PACKETS, ['0']),
        'net.ipv6.conf.all.accept_source_route': KernelCorrectConfiguration(KernelMisconfigurationCategory.IP_SOURCE_ROUTING_PACKETS, ['0']),
        # Enable source validation by reversed path, as specified in RFC1812 (Spoofing protection)
        'net.ipv4.conf.default.rp_filter': KernelCorrectConfiguration(KernelMisconfigurationCategory.IP_REVERSE_PATH_FORWARDING, ['1', '2']),
        'net.ipv6.conf.default.rp_filter': KernelCorrectConfiguration(KernelMisconfigurationCategory.IP_REVERSE_PATH_FORWARDING, ['1', '2']),
        'net.ipv4.conf.all.rp_filter': KernelCorrectConfiguration(KernelMisconfigurationCategory.IP_REVERSE_PATH_FORWARDING, ['1', '2']),
        'net.ipv6.conf.all.rp_filter': KernelCorrectConfiguration(KernelMisconfigurationCategory.IP_REVERSE_PATH_FORWARDING, ['1', '2']),
        # Controls the System Request debugging functionality of the kernel
        'kernel.sysrq': KernelCorrectConfiguration(KernelMisconfigurationCategory.KERNEL_SYSRQ, ['0'])}

    def _path_precedence(self, full_path):
        for precede_path, precedence in LinuxKernelParametersMisconfiguration.PATHS_PRECEDENCE.items():
            if os.path.dirname(full_path).endswith(precede_path):
                return precedence

    def _parse_configuration_line(self, line):
        match = LinuxKernelParametersMisconfiguration.SYSCTL_ROW_REGEX.match(line)
        if match is None:
            raise WrongConfigFormat()
        try:
            prop, value = match.group(1), match.group(2)
            return prop, value
        except:
            raise WrongConfigFormat()

    def _parse_config_path(self, config_path, props_dict):
        if self.is_broken_file(config_path):
            raise BrokenFile()
        with open(config_path, 'r') as config_path_handle:
            lines = config_path_handle.read().splitlines()
            for line in lines:
                if len(line) == 0 or line[:1] in ['#', ';'] or line.isspace():
                    continue

                try:
                    prop, value = self._parse_configuration_line(line)
                    props_dict[prop] = value

                except WrongConfigFormat:
                    continue

                except:
                    log.exception(f"failed to handle {config_path} / {line}")


    def _calculate_kernel_misconfigs(self, actual_props_dict):
        ms = []
        for configuration, kernel_correct_configuration in LinuxKernelParametersMisconfiguration.CORRECT_CONFIGURATIONS.items():
            actual_value = actual_props_dict.get(configuration)
            if not kernel_correct_configuration.is_legal_value(actual_value):
                ms.append(MisconfigurationThreat(kernel_correct_configuration.config_name, configuration, actual_value, kernel_correct_configuration.required_values_str()))

        return ms

    def get_misconfigurations(self, kernel_config_path):
        props_dict = {}
        kernel_params_config_path = None
        for path_regex in LinuxKernelParametersMisconfiguration.KERNEL_PARAMETERS_PATHS_REGEXES:
            match_obj = path_regex.match(kernel_config_path)
            if match_obj is not None:
                kernel_params_config_path = match_obj.group(0)
                break
        # If the config is in the wrong path format
        if kernel_params_config_path is None:
            return None

        # Parse the config path and update the props_dict
        self._parse_config_path(kernel_config_path, props_dict)
        # Calculate the kernel misconfigs
        return self._calculate_kernel_misconfigs(props_dict)
        
    
