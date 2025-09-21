import os
import re


class IncorrectFormat(Exception):
    def __init__(self, format_obj, error_str):
        super().__init__('{} - {}'.format(format_obj, error_str))


class PCIClass:
    def __init__(self, class_string):
        parsed_class_match = re.match(r'C\s*(?P<class_id>\w+)\s+(?P<class_name>.+)', class_string)
        if parsed_class_match is None:
            raise IncorrectFormat(class_string, 'Cannot match PCI class')
        parsed_class = parsed_class_match.groupdict()
        try:
            self.id = int(parsed_class['class_id'], 16)
        except ValueError as e:
            raise IncorrectFormat(class_string, 'class id is not HEX')
        self.name = parsed_class['class_name']
        self.sub_classes = {}

    def add_sub_class(self, sub_class_string):
        sub_class = PCISubClass(sub_class_string)
        self.sub_classes[sub_class.id] = sub_class
        return sub_class


class PCISubClass:
    def __init__(self, sub_class_string):
        parsed_sub_class_match = re.match(r'\s+(?P<sub_class_id>\w+)\s+(?P<sub_class_name>.+)', sub_class_string)
        if parsed_sub_class_match is None:
            raise IncorrectFormat(sub_class_string, 'Cannot match PCI sub class')
        parsed_sub_class = parsed_sub_class_match.groupdict()
        try:
            self.id = int(parsed_sub_class['sub_class_id'], 16)
        except ValueError as e:
            raise IncorrectFormat(sub_class_string, 'class id is not HEX')
        self.name = parsed_sub_class['sub_class_name']
        self.programming_interfaces = {}

    def add_programming_interface(self, programming_interface_string):
        prog_int = PCIProgrammingInterface(programming_interface_string)
        self.programming_interfaces[prog_int.id] = prog_int
        return prog_int


class PCIProgrammingInterface:
    def __init__(self, programming_interface_string):
        parsed_prog_int_match = re.match(r'\s+(?P<prog_int_id>\w+)\s+(?P<prog_int_name>.+)', programming_interface_string)
        if parsed_prog_int_match is None:
            raise IncorrectFormat(programming_interface_string, 'Cannot match PCI programming interface')
        parsed_prog_int = parsed_prog_int_match.groupdict()
        try:
            self.id = int(parsed_prog_int['prog_int_id'], 16)
        except ValueError as e:
            raise IncorrectFormat(programming_interface_string, 'class id is not HEX')
        self.name = parsed_prog_int['prog_int_name']


class PCISubDevice:
    def __init__(self, sub_device_string):
        parsed_sub_device_match = re.match(r'\s+(?P<sub_device_vendor_id>\w+)\s+(?P<sub_device_id>\w+)\s+(?P<name>.*)', sub_device_string)
        if parsed_sub_device_match is None:
            raise IncorrectFormat(sub_device_string, 'Cannot match PCI sub device')
        parsed_sub_device = parsed_sub_device_match.groupdict()
        try:
            self.sub_vendor_id = int(parsed_sub_device['sub_device_vendor_id'], 16)
            self.sub_device_id = int(parsed_sub_device['sub_device_id'], 16)
        except ValueError as e:
            raise IncorrectFormat(sub_device_string, 'Sub device vendor or the sub device ids are not HEX')
        self.name = parsed_sub_device['name']


class PCIDevice:
    def __init__(self, device_string):
        parsed_device_match = re.match(r'\s+(?P<device_id>\w+)\s+(?P<device_name>.+)', device_string)
        if parsed_device_match is None:
            raise IncorrectFormat(device_string, 'Cannot match PCI device in {}'.format(device_string))
        parsed_device = parsed_device_match.groupdict()
        try:
            self.id = int(parsed_device['device_id'], 16)
        except ValueError as e:
            raise IncorrectFormat(device_string, 'class id is not HEX')
        self.name = parsed_device['device_name']
        self.sub_vendors = {}

    def add_sub_device(self, sub_device_string):
        pci_sub_device = PCISubDevice(sub_device_string)
        self.sub_vendors[pci_sub_device.sub_vendor_id, pci_sub_device.sub_device_id] = pci_sub_device
        return pci_sub_device


class PCIVendor:
    def __init__(self, vendor_str):
        parsed_vendor_match = re.match(r'(?P<vendor_id>\w+)\s+(?P<vendor_name>.+)', vendor_str)
        if parsed_vendor_match is None:
            raise IncorrectFormat(vendor_str, 'Cannot match PCI vendor')
        parsed_vendor = parsed_vendor_match.groupdict()
        try:
            self.id = int(parsed_vendor['vendor_id'], 16)
        except ValueError as e:
            raise IncorrectFormat(vendor_str, 'class id is not HEX')
        self.name = parsed_vendor['vendor_name']
        self.devices = {}

    def add_device(self, device_string):
        pci_device = PCIDevice(device_string)
        self.devices[pci_device.id] = pci_device
        return pci_device


class PCIInfo:
    def __init__(self):
        self.devices_dict = {}
        self.device_classes = {}
        # Parse the pci information
        self._parse_pci_information()

    def _handle_vendors_devices_parsing(self, current_vendor, current_device, line):
        # If its a sub vendor line
        if line.startswith('\t\t'):
            current_device.add_sub_device(line)
        # Device line
        elif line.startswith('\t'):
            current_device = current_vendor.add_device(line)
        # Vendor line
        else:
            current_vendor = PCIVendor(line)
            self.devices_dict[current_vendor.id] = current_vendor
        return current_vendor, current_device

    def _handle_device_classes(self, current_class, current_sub_class, line):
        # Programming interface
        if line.startswith('\t\t'):
            current_sub_class.add_programming_interface(line)
        # Sub class
        elif line.startswith('\t'):
            current_sub_class = current_class.add_sub_class(line)
        # Class
        else:
            current_class = PCIClass(line)
            self.device_classes[current_class.id] = current_class
        return current_class, current_sub_class

    def _parse_pci_information(self):
        vendor_information_read_mode = True
        device_class_read_mode = False
        with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pci.ids')) as ids_handle:
            current_vendor, current_device = None, None
            current_class, current_sub_class = None, None
            for line in ids_handle.readlines():
                # Skip comments
                if line.startswith('#') or line=='\n':
                    continue
                if vendor_information_read_mode:
                    # Check if we need to proceed to the next mode
                    if line.startswith('C '):
                        vendor_information_read_mode, device_class_read_mode = False, True
                    else:
                        current_vendor, current_device = self._handle_vendors_devices_parsing(current_vendor, current_device, line)

                # If we are at device class reading mode
                if device_class_read_mode:
                    current_class, current_sub_class = self._handle_device_classes(current_class, current_sub_class, line)

    def get_pci_info(self, vendor_id):
        """
        Returns a PCIVendor object
        """
        return self.devices_dict.get(vendor_id)

    def get_pci_class(self, class_id):
        """
        Return a PCIClass object
        """
        return self.device_classes.get(class_id)
