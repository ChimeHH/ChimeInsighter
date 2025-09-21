import re
from driver_identifier.linux.aliases_handlers.alias_handler import AliasHandler, Alias
from driver_identifier.device_information.usb.usb_info import USBInfo
from driver_identifier.drivers_classes import DriverClasses, DriverSubClasses, DriverCategory


class USBHandler(AliasHandler):
    USB_RE = re.compile(r'v(?P<vendor_id>.*)'
                        'p(?P<device_id>.*)'
                        'd(?P<bcd_device>.*)'
                        'dc(?P<device_class>.*)'
                        'dsc(?P<device_sub_class>.*)'
                        'dp(?P<device_protocol>.*)'
                        'ic(?P<interface_class>.*)'
                        'isc(?P<interface_subclass>.*)'
                        'ip(?P<interface_protocol>.*)'
                        'in(?P<interface_number>.*)')

    DRIVER_TYPE_MAP = {1: ((DriverClasses.MULTIMEDIA, DriverSubClasses.AUDIO), {}),
                       2: ((DriverClasses.NETWORKING, DriverSubClasses.OTHER_COMMUNICATION_CONTROLLER), {6: (DriverSubClasses.ETHERNET, {}),
                                                                                                         8: (DriverSubClasses.OTHER_WIRELESS, {})}),
                       3: ((DriverClasses.HID, DriverSubClasses.UNCLASSIFIED), {}),
                       8: ((DriverClasses.STORAGE, DriverSubClasses.UNCLASSIFIED), {}),
                       14: ((DriverClasses.MULTIMEDIA, DriverSubClasses.VIDEO), {}),
                       224: ((DriverClasses.NETWORKING, DriverSubClasses.OTHER_WIRELESS), {1: (DriverSubClasses.OTHER_WIRELESS, {1: DriverSubClasses.BLUETOOTH,
                                                                                                                                 2: DriverSubClasses.RF,
                                                                                                                                 3: DriverSubClasses.RF})})
                       }

    def __init__(self):
        self.usb_info = USBInfo()

    def parse(self, alias_string, alias_device_info, alias_type):
        # Looks like: usb:vNpNdNdcNdscNdpNicNiscNipNinN
        alias_match = self._pattern_match(alias_device_info, USBHandler.USB_RE)
        # Remove the wildcards values
        self._remove_wildcards_values(alias_match)
        # Handle the vendor information
        human_readable_information = {}
        vendor_id = alias_match.get('vendor_id')
        device_id = alias_match.get('device_id')

        if vendor_id is not None:
            vendor_id = int(vendor_id, 16)
            human_readable_information['vendor'] = {'id': vendor_id}
        if device_id is not None:
            device_id = int(device_id, 16)
            human_readable_information['device'] = {'id': device_id}

        if vendor_id is not None:
            usb_vendor = self.usb_info.get_usb_info(vendor_id)
            if usb_vendor is not None and device_id is not None:
                human_readable_information['vendor']['name'] = usb_vendor.name
                usb_device = usb_vendor.devices.get(device_id)
                if usb_device is not None:
                    human_readable_information['device']['name'] = usb_device.name

        # Handle the class information (device class and interface class levels)
        self._handle_class_functionality(human_readable_information, alias_match, 'device_class', 'device_sub_class', 'device_protocol')
        self._handle_class_functionality(human_readable_information, alias_match, 'interface_class', 'interface_subclass', 'interface_protocol')

        base_class_id = alias_match.get('device_class')
        sub_class_id = alias_match.get('device_sub_class')
        protocol_id = alias_match.get('device_protocol')
        interface_class_id = alias_match.get('interface_class')
        interface_sub_class_id = alias_match.get('interface_subclass')
        interface_protocol_id = alias_match.get('interface_protocol')

        protocol_to_look = None
        sub_class_to_look = None
        class_to_look = None
        if interface_protocol_id is not None:
            protocol_to_look = int(interface_protocol_id, 16)
        elif protocol_id is not None:
            protocol_to_look = int(protocol_id, 16)

        if interface_sub_class_id is not None:
            sub_class_to_look = int(interface_sub_class_id, 16)
        elif sub_class_id is not None:
            sub_class_to_look = int(sub_class_id, 16)

        if interface_class_id is not None:
            class_to_look = int(interface_class_id, 16)
        elif base_class_id is not None:
            class_to_look = int(base_class_id, 16)

        driver_category = None
        if class_to_look is not None:
            driver_category = self.generate_driver_category(class_to_look, sub_class_to_look, protocol_to_look)

        return Alias(alias_string, alias_type, human_info=human_readable_information, driver_class=driver_category)

    def generate_driver_category(self, device_class_code, device_sub_class_code=None, device_protocol_code=None):
        assignemnts_info = USBHandler.DRIVER_TYPE_MAP.get(device_class_code)
        if assignemnts_info is None:
            return None
        class_assignemnt, sub_class_assignments = assignemnts_info
        device_class, default_sub_class = class_assignemnt
        final_sub_class = default_sub_class
        if device_sub_class_code is not None:
            device_sub_class_info = sub_class_assignments.get(device_sub_class_code)
            if device_sub_class_info is not None:
                sub_class_device, protocol_assignments = device_sub_class_info
                if device_protocol_code is not None:
                    final_sub_class = protocol_assignments.get(device_protocol_code)
                else:
                    final_sub_class = sub_class_device
        return DriverCategory(device_class, final_sub_class)

    def _handle_class_functionality(self, human_readable_information, alias_match, device_class_prop, device_sub_class_prop, device_protocol_prop):
        base_class_id = alias_match.get(device_class_prop)
        sub_class_id = alias_match.get(device_sub_class_prop)
        protocol_id = alias_match.get(device_protocol_prop)
        if base_class_id is not None:
            base_class_id = int(base_class_id, 16)
            human_readable_information[device_class_prop] = {'id': base_class_id}
        if sub_class_id is not None:
            sub_class_id = int(sub_class_id, 16)
            human_readable_information[device_sub_class_prop] = {'id': sub_class_id}
        if protocol_id is not None:
            protocol_id = int(protocol_id, 16)
            human_readable_information[device_protocol_prop] = {'id': protocol_id}

        if base_class_id is not None:
            device_class = self.usb_info.get_usb_class(base_class_id)
            if device_class is not None and sub_class_id is not None:
                human_readable_information[device_class_prop]['name'] = device_class.name
                device_sub_class = device_class.sub_classes.get(sub_class_id)
                if device_sub_class is not None and protocol_id is not None:
                    human_readable_information[device_sub_class_prop]['name'] = device_sub_class.name
                    device_protocol = device_sub_class.protocols.get(protocol_id)
                    if device_protocol is not None:
                        human_readable_information[device_protocol_prop]['name'] = device_protocol.name
