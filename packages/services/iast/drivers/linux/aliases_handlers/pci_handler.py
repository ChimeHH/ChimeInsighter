import re
from driver_identifier.linux.aliases_handlers.alias_handler import AliasHandler, Alias
from driver_identifier.device_information.pci.pci_info import PCIInfo
from driver_identifier.drivers_classes import DriverClasses, DriverSubClasses, DriverCategory


class PCIHandler(AliasHandler):
    PCI_RE = re.compile('v(?P<vendor_id>.*)'
                        'd(?P<device_id>.*)'
                        'sv(?P<subsystem_vendor>.*)'
                        'sd(?P<sub_system_device>.*)'
                        'bc(?P<base_class>.*)'
                        'sc(?P<sub_class>.*)'
                        'i(?P<programming_interface>.*)')

    DRIVER_TYPE_MAP = {1: ((DriverClasses.STORAGE, DriverSubClasses.UNCLASSIFIED), {}),
                       2: ((DriverClasses.NETWORKING, DriverSubClasses.OTHER_NETWORK_CONTROLLER), {0: DriverSubClasses.ETHERNET}),
                       3: ((DriverClasses.DISPLAY, DriverSubClasses.UNCLASSIFIED), {}),
                       4: ((DriverClasses.MULTIMEDIA, DriverSubClasses.UNCLASSIFIED), {0: DriverSubClasses.VIDEO,
                                                                                       1: DriverSubClasses.AUDIO,
                                                                                       3: DriverSubClasses.AUDIO}),
                       6: ((DriverClasses.OTHERS, DriverSubClasses.Bridge), {}),
                       7: ((DriverClasses.NETWORKING, DriverSubClasses.OTHER_COMMUNICATION_CONTROLLER), {3: DriverSubClasses.MODEM}),
                       8: ((DriverClasses.GENERIC_SYSTEM_PERIPHERAL, DriverSubClasses.UNCLASSIFIED), {}),
                       9: ((DriverClasses.HID, DriverSubClasses.UNCLASSIFIED), {}),
                       12: ((DriverClasses.BUS, DriverSubClasses.OTHER_BUS), {9 : DriverSubClasses.CANBUS}),
                       13: ((DriverClasses.NETWORKING, DriverSubClasses.OTHER_WIRELESS), {0: DriverSubClasses.IR,
                                                                                          1: DriverSubClasses.IR,
                                                                                          16: DriverSubClasses.RF,
                                                                                          17: DriverSubClasses.BLUETOOTH,
                                                                                          32: DriverSubClasses.WIFI,
                                                                                          33: DriverSubClasses.WIFI}),
                       15: ((DriverClasses.NETWORKING, DriverSubClasses.SATELITE), {}),
                       16: ((DriverClasses.OTHERS, DriverSubClasses.CRYPTO), {}),
                       17: ((DriverClasses.OTHERS, DriverSubClasses.SIGNAL_PROCESSING), {})
                       }


    def __init__(self):
        self.pci_info = PCIInfo()

    def generate_driver_category(self, device_class_code, device_sub_class_code=None):
        assignemnts_info = PCIHandler.DRIVER_TYPE_MAP.get(device_class_code)
        if assignemnts_info is None:
            return None
        class_assignemnt, sub_class_assignments = assignemnts_info
        device_class, default_sub_class = class_assignemnt
        device_sub_class = default_sub_class
        if device_sub_class_code is not None:
            device_sub_class = sub_class_assignments.get(device_sub_class_code, default_sub_class)
        return DriverCategory(device_class, device_sub_class)

    def parse(self, alias_string, alias_device_info, alias_type):
        # Looks like: pci:vNdNsvNsdNbcNscNiN
        alias_match = self._pattern_match(alias_device_info, PCIHandler.PCI_RE)
        # Remove the wildcards values
        self._remove_wildcards_values(alias_match)
        # Handle the vendor information
        human_readable_information = {}
        vendor_id = alias_match.get('vendor_id')
        device_id = alias_match.get('device_id')
        subsystem_vendor = alias_match.get('subsystem_vendor')
        sub_system_device = alias_match.get('sub_system_device')
        if vendor_id is not None:
            vendor_id = int(vendor_id, 16)
            human_readable_information['vendor'] = {'id': vendor_id}
        if device_id is not None:
            device_id = int(device_id, 16)
            human_readable_information['device'] = {'id': device_id}
        if subsystem_vendor is not None and sub_system_device is not None:
            subsystem_vendor = int(subsystem_vendor, 16)
            sub_system_device = int(sub_system_device, 16)
            human_readable_information['sub_system'] = {'sub_vendor_id': subsystem_vendor, 'sub_device_id': sub_system_device}

        if vendor_id is not None:
            pci_vendor = self.pci_info.get_pci_info(vendor_id)
            if pci_vendor is not None and device_id is not None:
                human_readable_information['vendor']['name'] = pci_vendor.name
                pci_device = pci_vendor.devices.get(device_id)
                if pci_device is not None and subsystem_vendor is not None and sub_system_device is not None:
                    human_readable_information['device']['name'] = pci_device.name
                    sub_system = pci_device.sub_vendors.get([subsystem_vendor, sub_system_device])
                    if sub_system is not None:
                        human_readable_information['sub_system']['name'] = sub_system.name

        # Handle the classes information
        base_class_id = alias_match.get('base_class')
        sub_class_id = alias_match.get('sub_class')
        programming_interface_id = alias_match.get('programming_interface')
        if base_class_id is not None:
            base_class_id = int(base_class_id, 16)
            human_readable_information['device_class'] = {'id': base_class_id}
        if sub_class_id is not None:
            sub_class_id = int(sub_class_id, 16)
            human_readable_information['device_sub_class'] = {'id': sub_class_id}
        if programming_interface_id is not None:
            programming_interface_id = int(programming_interface_id, 16)
            human_readable_information['device_programming_interface'] = {'id': programming_interface_id}

        if base_class_id is not None:
            device_class = self.pci_info.get_pci_class(base_class_id)
            if device_class is not None and sub_class_id is not None:
                human_readable_information['device_class']['name'] = device_class.name
                device_sub_class = device_class.sub_classes.get(sub_class_id)
                if device_sub_class is not None and programming_interface_id is not None:
                    human_readable_information['device_sub_class']['name'] = device_sub_class.name
                    device_programming_interface = device_sub_class.programming_interfaces.get(programming_interface_id)
                    if device_programming_interface is not None:
                        human_readable_information['device_programming_interface']['name'] = device_programming_interface.name

        device_class_information = None
        if base_class_id is not None:
            device_class_information = self.generate_driver_category(base_class_id, sub_class_id)
        return Alias(alias_string, alias_type, human_info=human_readable_information, driver_class=device_class_information)
