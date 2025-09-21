import os
import re


class IncorrectFormat(Exception):
    def __init__(self, format_obj, error_str):
        super().__init__('{} - {}'.format(format_obj, error_str))


class USBClass:
    def __init__(self, class_string):
        parsed_class_match = re.match(r'C\s*(?P<class_id>\w+)\s+(?P<class_name>.+)', class_string)
        if parsed_class_match is None:
            raise IncorrectFormat(class_string, 'Cannot match USB class')
        parsed_class = parsed_class_match.groupdict()
        try:
            self.id = int(parsed_class['class_id'], 16)
        except ValueError as e:
            raise IncorrectFormat(class_string, 'class id is not HEX')
        self.name = parsed_class['class_name']
        self.sub_classes = {}

    def add_sub_class(self, sub_class_string):
        sub_class = USBSubClass(sub_class_string)
        self.sub_classes[sub_class.id] = sub_class
        return sub_class


class USBSubClass:
    def __init__(self, sub_class_string):
        parsed_sub_class_match = re.match(r'\s+(?P<sub_class_id>\w+)\s+(?P<sub_class_name>.+)', sub_class_string)
        if parsed_sub_class_match is None:
            raise IncorrectFormat(sub_class_string, 'Cannot match USB sub class')
        parsed_sub_class = parsed_sub_class_match.groupdict()
        try:
            self.id = int(parsed_sub_class['sub_class_id'], 16)
        except ValueError as e:
            raise IncorrectFormat(sub_class_string, 'class id is not HEX')
        self.name = parsed_sub_class['sub_class_name']
        self.protocols = {}

    def add_protocol(self, protocol_string):
        protocol = USBProtocol(protocol_string)
        self.protocols[protocol.id] = protocol
        return protocol


class USBProtocol:
    def __init__(self, protocol_string):
        protocol_string_match = re.match(r'\s+(?P<protocol_id>\w+)\s+(?P<protocol_name>.+)', protocol_string)
        if protocol_string_match is None:
            raise IncorrectFormat(protocol_string, 'Cannot match USB protocol')
        protocol_dict = protocol_string_match.groupdict()
        try:
            self.id = protocol_dict['protocol_id']
        except ValueError as e:
            raise IncorrectFormat(protocol_string, 'class id is not HEX')
        self.name = protocol_dict['protocol_name']


class USBDevice:
    def __init__(self, device_string):
        parsed_device_match = re.match(r'\s+(?P<device_id>\w+)\s+(?P<device_name>.+)', device_string)
        if parsed_device_match is None:
            raise IncorrectFormat(device_string, 'Cannot match USB device in {}'.format(device_string))
        parsed_device = parsed_device_match.groupdict()
        try:
            self.id = int(parsed_device['device_id'], 16)
        except ValueError as e:
            raise IncorrectFormat(device_string, 'class id is not HEX')
        self.name = parsed_device['device_name']


class USBVendor:
    def __init__(self, vendor_str):
        parsed_vendor_match = re.match(r'(?P<vendor_id>\w+)\s+(?P<vendor_name>.+)', vendor_str)
        if parsed_vendor_match is None:
            raise IncorrectFormat(vendor_str, 'Cannot match USB vendor')
        parsed_vendor = parsed_vendor_match.groupdict()
        try:
            self.id = int(parsed_vendor['vendor_id'], 16)
        except ValueError as e:
            raise IncorrectFormat(vendor_str, 'class id is not HEX')
        self.name = parsed_vendor['vendor_name']
        self.devices = {}

    def add_device(self, device_string):
        pci_device = USBDevice(device_string)
        self.devices[pci_device.id] = pci_device
        return pci_device


class USBInfo:
    def __init__(self):
        self.devices_dict = {}
        self.device_classes = {}
        # Parse the usb information
        self._parse_usb_information()

    def _handle_vendors_devices_parsing(self, current_vendor, current_device, line):
        # If its a sub vendor line
        if line.startswith('\t\t'):
            pass
        # Device line
        elif line.startswith('\t'):
            current_device = current_vendor.add_device(line)
        # Vendor line
        else:
            current_vendor = USBVendor(line)
            self.devices_dict[current_vendor.id] = current_vendor
        return current_vendor, current_device

    def _handle_device_classes(self, current_class, current_sub_class, line):
        # Protocol
        if line.startswith('\t\t'):
            current_sub_class.add_protocol(line)
        # Sub class
        elif line.startswith('\t'):
            current_sub_class = current_class.add_sub_class(line)
        # Class
        else:
            current_class = USBClass(line)
            self.device_classes[current_class.id] = current_class
        return current_class, current_sub_class

    def _parse_usb_information(self):
        section_match = re.compile(r'^(C|AT|HID|R|BIAS|HUT|L|HCC|VT) ')
        vendor_information_read_mode = True
        ignore_section_mode = False
        device_class_read_mode = False
        with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'usb.ids')) as ids_handle:
            current_vendor, current_device = None, None
            current_class, current_sub_class = None, None
            for line in ids_handle.readlines():
                # Skip comments
                if line.startswith('#') or line=='\n':
                    continue
                # Check if we need to proceed to the next mode
                if section_match.match(line):
                    if line[0] == 'C':
                        vendor_information_read_mode, device_class_read_mode, ignore_section_mode = False, True, False
                    else:
                        vendor_information_read_mode, device_class_read_mode, ignore_section_mode = False, False, True
                # Vendor information reading mode
                if vendor_information_read_mode:
                        current_vendor, current_device = self._handle_vendors_devices_parsing(current_vendor, current_device, line)
                # If we are at device class reading mode
                if device_class_read_mode:
                    current_class, current_sub_class = self._handle_device_classes(current_class, current_sub_class, line)

    def get_usb_info(self, vendor_id):
        """
        Returns a USBVendor object
        """
        return self.devices_dict.get(vendor_id)

    def get_usb_class(self, class_id):
        """
        Return a USBClass object
        """
        return self.device_classes.get(class_id)
