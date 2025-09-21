import os
import collections
import re
import argparse
import functools
# The apache parser https://github.com/etingof/apacheconfig
import apacheconfig

from .misconfigurations_def import *

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class WebServerMisconfigCategory:
    WEB_SERVER_INFORMATION = 'Web Server Information'
    DIRECTORY_LISTING = 'Directory Listing'
    TAG_INFORMATION = 'FileETag Information'
    USER_AUTHORIZATIONS = 'User Authorizations'
    TRACE_ENABLED = 'Trace Enabled'
    CLICKJACKING = 'ClickJacking'


class ApacheWebServerMisconfiurations(MisconfigurationIdentifier):
    REGEXED_ESCAPED_SEPERATOR = os.sep + os.sep if os.sep == '\\' else os.sep
    DEFAULT_SSH_PORT = '22'
    WHITE_BLACK_LIST_USESR = ['DENYUSERS', 'ALLOWUSERS', 'DENYGROUPS', 'ALLOWGROUPS']
    PERMIT_ROOT_LOGIN_ALLOWED_VALUES = ['NO', 'WITHOUT-PASSWORD']
    MINIMAL_IDLE_TIME = 0

    def __init__(self):
        super().__init__()
        self.apache_parser_default_options = {
            'includerelative': True,
            'useapacheinclude': True,
            'includedirectories': True,
            'includeagain': True,
            'mergeduplicateoptions': True,
            'autotrue': False,
            'interpolatevars': False,
            'allowsinglequoteinterpolation': False,
            'strictvars': False,
            'interpolateenv': False,
            'includeglob': True,
            'lowercasenames': True
        }
        self.apache_config_paths_regex = [(re.compile(path_regex), path_handler) for path_regex, path_handler in [
            # Different places of the apache configuration file location
            ('(.*{})?({})$'.format(self.REGEXED_ESCAPED_SEPERATOR,
                                   ''.join(['etc', self.REGEXED_ESCAPED_SEPERATOR,
                                            'apache2?',
                                            self.REGEXED_ESCAPED_SEPERATOR,
                                            'httpd\.conf$'])),
             self._extract_general_config),
            ('(.*{})?({})$'.format(self.REGEXED_ESCAPED_SEPERATOR,
                                   ''.join(['etc', self.REGEXED_ESCAPED_SEPERATOR,
                                            'apache2?',
                                            self.REGEXED_ESCAPED_SEPERATOR,
                                            'apache2?\.conf$'])),
             self._extract_general_config),
            ('(.*{})?({})$'.format(self.REGEXED_ESCAPED_SEPERATOR,
                                   ''.join(['etc', self.REGEXED_ESCAPED_SEPERATOR,
                                            'httpd',
                                            self.REGEXED_ESCAPED_SEPERATOR,
                                            'httpd.conf$'])),
             self._extract_general_config),
            ('(.*{})?({})$'.format(self.REGEXED_ESCAPED_SEPERATOR,
                                   ''.join(['etc', self.REGEXED_ESCAPED_SEPERATOR,
                                            'httpd',
                                            self.REGEXED_ESCAPED_SEPERATOR,
                                            'conf',
                                            self.REGEXED_ESCAPED_SEPERATOR,
                                            'httpd.conf$'])),
             self._extract_general_config)
        ]]

    def _pre_read_func(self, root_path, include_path_set, source_file_path, content):
        include_path_set.add(source_file_path)
        updated_content = content
        if os.path.isabs(content):
            updated_content = 'Include {}'.format(content)
        else:
            parent = os.path.dirname(source_file_path)
            path_to_include = os.path.join(parent, content)
            try:
                with open(path_to_include, 'r'):
                    updated_content = 'Include {}'.format(os.path.relpath(path_to_include, root_path))
            except Exception:
                pass
        return [True, source_file_path, updated_content]

    def _parse_apache_config(self, root_path, config_path, included_paths_set):
        include_path_set_temp = set()
        options = self.apache_parser_default_options.copy()
        options['configpath'] = [os.path.dirname(config_path)]
        options['plug'] = {'pre_read': functools.partial(self._pre_read_func, root_path, include_path_set_temp)}
        config = None

        with apacheconfig.make_loader(**options) as loader:
            config = loader.load(config_path)
        included_paths_set.update(include_path_set_temp)
        return config

    def get_misconfigurations(self, apache_config_path):
        path_handler = None
        # Validate that the config matches the valid config paths
        for path_regex, conf_path_handler in self.apache_config_paths_regex:
            if path_regex.match(apache_config_path) is not None:
                path_handler = conf_path_handler
                break
        # If the config is in the wrong path format
        if path_handler is None:
            return None

        try:
            # Initialize the configurations
            configuration_dict = collections.defaultdict(list)
            # Set the included paths set
            included_paths_set = set()
            # Handle the apache config file and parse the configurations into the configuration dict
            path_handler(os.path.dirname(apache_config_path), apache_config_path, configuration_dict,
                         included_paths_set)
            # Calculate the final miscofigurations
            return self._calculate_misconfigurations(configuration_dict)
            
        except WrongConfigFormat:
            pass
        except BrokenFile:
            pass
        return None

    def _extract_general_config(self, root_path, file_path, configurations_dict, already_included_paths_set):
        # If we already included that path in previous configuration file loading - so ignore it
        if file_path in already_included_paths_set:
            return
        # Extract the apache config
        apache_config = self._parse_apache_config(root_path, file_path, already_included_paths_set)
        for prop, value in apache_config.items():
            if type(value) == list:
                configurations_dict[prop].extend(value)
            else:
                configurations_dict[prop].append(value)

    def _validate_exists_with_value(self, configuration_dict, misconfigurations, category, field_name, expected_value):
        field_vals = configuration_dict.get(field_name.lower(), [])
        if expected_value not in field_vals:
            misconfigurations.append(
                MisconfigurationThreat(category, field_name,
                                          ','.join(set(field_vals)), expected_value))

    def _calculate_misconfigurations(self, configuration_dict):
        misconfiguraions = []
        # Check the web server version configurations
        self._validate_exists_with_value(configuration_dict, misconfiguraions,
                                         WebServerMisconfigCategory.WEB_SERVER_INFORMATION, 'ServerTokens', 'Prod')
        self._validate_exists_with_value(configuration_dict, misconfiguraions,
                                         WebServerMisconfigCategory.WEB_SERVER_INFORMATION, 'ServerSignature', 'Off')
        data_directory_values = configuration_dict.get('directory', [])
        # Check the directory listings
        directories_to_test = ['/var/www/']
        directory_listing_regex = re.compile('.*-Indexes.*', re.IGNORECASE)
        for data_directory_dirs in data_directory_values:
            for important_directory in directories_to_test:
                directories_dict = data_directory_dirs.get(important_directory)
                if directories_dict is None:
                    continue
                options = directories_dict.get('options')
                if options is None or directory_listing_regex.match(options) is None:
                    misconfiguraions.append(MisconfigurationThreat(WebServerMisconfigCategory.DIRECTORY_LISTING,
                                                                      'Directory {} Options'.format(
                                                                          important_directory), options, '* -Indexes'))
        # Check that the FileETag is disabled - the file etag is usually used on the configuration root or in the different directories
        etag = 'FileETag'
        inode_prop_regex = re.compile('.*\s[^-]INode(\s+|$)', re.IGNORECASE)
        data_directory_values = configuration_dict.get('directory', [])
        for data_directory_dirs in data_directory_values:
            for directory, props in data_directory_dirs.items():
                file_etags = props.get(etag.lower(), [])
                for value in file_etags:
                    if inode_prop_regex.match(value) is not None:
                        misconfiguraions.append(
                            MisconfigurationThreat(WebServerMisconfigCategory.TAG_INFORMATION, etag,
                                                      'directory {}, {} : {}'.format(directory, etag, value),
                                                      '-INode|None'))
        file_etags = configuration_dict.get(etag.lower(), [])
        for value in file_etags:
            if inode_prop_regex.match(value) is not None:
                misconfiguraions.append(
                    MisconfigurationThreat(WebServerMisconfigCategory.TAG_INFORMATION, etag, value, '-INode|None'))
        # Check the user and the group authorizations
        user = 'User'
        group = 'Group'
        for category, values in {user: configuration_dict.get(user.lower(), []),
                                 group: configuration_dict.get(group.lower(), [])}.items():
            if 'nobody' in [user_or_group.lower() for user_or_group in values]:
                misconfiguraions.append(
                    MisconfigurationThreat(WebServerMisconfigCategory.USER_AUTHORIZATIONS, category,
                                              ','.join(values), 'not nobody'))
        # Check that the TraceEnable is off
        trace = 'TraceEnable'
        trace_values = configuration_dict.get(trace.lower(), [])
        if 'Off' not in trace_values and 'off' not in trace_values:
            misconfiguraions.append(
                MisconfigurationThreat(WebServerMisconfigCategory.TRACE_ENABLED, trace, ','.join(set(trace_values)),
                                          'Off'))

        # Check Clickjacking mitigation
        header = 'Header'
        x_frame_option_regex = re.compile('.*X-Frame-Options.*(SAMEORIGIN|DENY|ALLOW-FROM).*', re.IGNORECASE)
        if not any(x_frame_option_regex.match(header_value) is not None for header_value in
                   configuration_dict.get(header.lower(), [])):
            misconfiguraions.append(
                MisconfigurationThreat(WebServerMisconfigCategory.CLICKJACKING, 'Header X-Frame-Options',
                                          None, 'sameorigin|none'))
        return misconfiguraions


if __name__ == '__main__':
    main()
