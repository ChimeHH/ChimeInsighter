# The alias string is a way to represent to which devices a certain driver
# Is suitable
# This modalias id parsing logic is based on the
# linux file from here : https://github.com/torvalds/linux/blob/master/scripts/mod/file2alias.c
import re
from driver_identifier.linux.aliases_handlers.alias_handler import DeviceTypes, Alias
from driver_identifier.linux.aliases_handlers.pci_handler import PCIHandler
from driver_identifier.linux.aliases_handlers.usb_handler import USBHandler
from driver_identifier.linux.aliases_handlers.alias_handler import AliasHandler


class AliasSearcher:
    ALIAS_STRING_PATTERN = re.compile(r'(?P<device_type>.*):(?P<device_info>.*)')

    def __init__(self):
        self.alias_string_handlers = {DeviceTypes.PCI: PCIHandler(), DeviceTypes.USB: USBHandler()}
        self.default_handler = AliasHandler()

    def parse_alias_string(self, alias_string):
        # Parse the alias string
        pattern_match = AliasSearcher.ALIAS_STRING_PATTERN.match(alias_string)
        if pattern_match is None:
            return Alias(alias_string)
        alias_pattern_fields = pattern_match.groupdict()
        # Get the alias parsing handler
        alias_handler = self.alias_string_handlers.get(alias_pattern_fields['device_type'], self.default_handler)
        # Generate the alias object with the handler of the specific type
        try:
            return alias_handler.parse(alias_string, alias_pattern_fields['device_info'], alias_pattern_fields['device_type'])
        except Exception as e:
            return Alias(alias_string, alias_pattern_fields['device_type'])
