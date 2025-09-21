import os
import re
import subprocess
from collections import defaultdict
from exlib import filesystemex
from driver_identifier.linux.aliases import AliasSearcher
from driver_identifier.drivers_classes import DriverClasses, DriverSubClasses, DriverCategory

class AliasSearcherSingelton:
    ALIAS_SEARCHER = None

    @staticmethod
    def get_searcher():
        if AliasSearcherSingelton.ALIAS_SEARCHER is None:
            AliasSearcherSingelton.ALIAS_SEARCHER = AliasSearcher()
        return AliasSearcherSingelton.ALIAS_SEARCHER


class LinuxDriver:
    def __init__(self, driver_name, driver_class=None):
        self.driver_name = driver_name
        self.driver_class = driver_class

    def __str__(self):
        driver_class_str = ''
        if self.driver_class is not None:
            driver_class_str = '\ndriver_class : {}\ndriver_sub_class: {}'.format(self.driver_class.driver_class, self.driver_class.driver_sub_class)
        return 'driver_name : {}{}'.format(self.driver_name, driver_class_str)


def get_driver_class_by_path(driver_path):
    driver_name = filesystemex.drop_extension(os.path.basename(driver_path))
    if 'bluetooth' in driver_path:
        return DriverCategory(DriverClasses.NETWORKING, DriverSubClasses.BLUETOOTH)
    if 'wireless' in driver_path:
        return DriverCategory(DriverClasses.NETWORKING, DriverSubClasses.OTHER_WIRELESS)
    if 'sound' in driver_path:
        return DriverCategory(DriverClasses.MULTIMEDIA, DriverSubClasses.AUDIO)
    if 'crypto' in driver_path:
        return DriverCategory(DriverClasses.OTHERS, DriverSubClasses.CRYPTO)
    if 'video' in driver_path:
        return DriverCategory(DriverClasses.OTHERS, DriverSubClasses.VIDEO)
    if 'gpio' in driver_path:
        return DriverCategory(DriverClasses.OTHERS, DriverSubClasses.GPIO)
    if any(hid_input in driver_path for hid_input in ['input', 'hid']):
        return DriverCategory(DriverClasses.HID, DriverSubClasses.UNCLASSIFIED)
    if 'radio' in driver_path:
        return DriverCategory(DriverClasses.NETWORKING, DriverSubClasses.RF)
    if 'scsi' in driver_path:
        return DriverCategory(DriverClasses.STORAGE, DriverSubClasses.UNCLASSIFIED)
    if re.match('(slcan|peak_pci|peak_usb|kvaser_pci|kvaser_usb|ems_pcmcia|ems_usb|ems_pci|usb_8dev|softing_cs|mcba_usb|ctucanfd|can4linux)', driver_name):
        return DriverCategory(DriverClasses.BUS, DriverSubClasses.CANBUS)
    if re.match('.*\Wusb/storage\W', driver_path) is not None:
        return DriverCategory(DriverClasses.STORAGE, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wpower\W', driver_path) is not None:
        return DriverCategory(DriverClasses.SYSTEM_HEALTH, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wthermal\W', driver_path) is not None:
        return DriverCategory(DriverClasses.SYSTEM_HEALTH, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wiio\W', driver_path) is not None:
        return DriverCategory(DriverClasses.IIO, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wblock\W', driver_path) is not None:
        return DriverCategory(DriverClasses.BLOCK_DEVICES, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wspi\W', driver_path) is not None:
        return DriverCategory(DriverClasses.SPI, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wmfd\W', driver_path) is not None:
        return DriverCategory(DriverClasses.MFD, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wcpufreq\W', driver_path) is not None:
        return DriverCategory(DriverClasses.CPU, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wcpu\W', driver_path) is not None:
        return DriverCategory(DriverClasses.CPU, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wchar\W', driver_path) is not None:
        return DriverCategory(DriverClasses.CHARACTER_DEVICES, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wgpu\W', driver_path) is not None:
        return DriverCategory(DriverClasses.GPU, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wusb\W', driver_path) is not None:
        return DriverCategory(DriverClasses.USB, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wcan\W', driver_path) is not None:
        return DriverCategory(DriverClasses.BUS, DriverSubClasses.CANBUS)
    if re.match('.*\Wfs\W', driver_path) is not None or any(storage in driver_path for storage in ['cdrom', 'memstick']):
        return DriverCategory(DriverClasses.STORAGE, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wieee802154\W', driver_path) is not None:
        return DriverCategory(DriverClasses.NETWORKING, DriverSubClasses.OTHER_WIRELESS)
    if re.match('.*\Wnet\W', driver_path) is not None:
        return DriverCategory(DriverClasses.NETWORKING, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wtty\W', driver_path) is not None:
        return DriverCategory(DriverClasses.GENERIC_SYSTEM_PERIPHERAL, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wi2c\W', driver_path) is not None:
        return DriverCategory(DriverClasses.BUS, DriverSubClasses.I2C)
    if re.match('.*\Wmedia\W', driver_path) is not None:
        return DriverCategory(DriverClasses.MULTIMEDIA, DriverSubClasses.UNCLASSIFIED)
    if re.match('.*\Wlib\W', driver_path) is not None:
        return DriverCategory(DriverClasses.GENERAL_PURPOSE_DRIVERS, DriverSubClasses.UNCLASSIFIED)
    return None


class LoadableLinuxDriver(LinuxDriver):
    MODINFO_REGEX = re.compile(r'\s*(?P<field>\w+)\s*:\s*(?P<value>.+)')

    def __init__(self, driver_name, relative_path, description=None, author=None, license=None, version=None, aliases=None, driver_class=None):
        super().__init__(driver_name, driver_class=driver_class)
        self.relative_path = relative_path
        self.description = description
        self.author = author
        self.license = license
        self.version = version
        self.aliases = aliases
        self.driver_class = driver_class

    def __str__(self):
        final_str = '{}\n'.format(super().__str__())
        attributes = ['relative_path', 'description', 'author', 'license', 'version']
        for att in attributes:
            val = getattr(self, att)
            if val is not None:
                final_str += '{} : {}\n'.format(att, val)
        if self.aliases is not None and len(self.aliases) > 0:
            final_str += 'aliases: \n'
            for alias in self.aliases:
                final_str += str(alias.__dict__)
        return final_str

    @staticmethod
    def _parse_driver(driver_path, rel_path):
        try:
            props_dict = defaultdict(list)
            # Load all he mod info output into the props dict
            mod_info_out_bytes = subprocess.check_output(['modinfo', driver_path])
            mod_info_out = mod_info_out_bytes.decode('utf-8')
            for line in mod_info_out.splitlines():
                parse_line = LoadableLinuxDriver.MODINFO_REGEX.match(line)
                if parse_line is None:
                    continue
                props_dict[parse_line.group('field')].append(parse_line.group('value'))

            driver_path = props_dict.get('filename', [None])[0]
            driver_name = filesystemex.drop_extension(os.path.basename(driver_path))
            description = props_dict.get('description', [None])[0]
            author = props_dict.get('author', [None])[0]
            license = props_dict.get('license', [None])[0]
            version = props_dict.get('vermagic', [None])[0]
            aliases = props_dict.get('alias', None)
            aliases_objects = None
            if aliases is not None:
                alias_searcher = AliasSearcherSingelton.get_searcher()
                temp_aliases_objs = []
                for alias_string in aliases:
                    temp_aliases_objs.append(alias_searcher.parse_alias_string(alias_string))
                if len(temp_aliases_objs) > 0:
                    aliases_objects = temp_aliases_objs

            # Set the driver class
            driver_class = None
            if aliases_objects is not None:
                for alias_obj in aliases_objects:
                    if alias_obj.driver_class is not None:
                        driver_class = alias_obj.driver_class
                        break
            if driver_class is None:
                driver_class = get_driver_class_by_path(rel_path)
            return LoadableLinuxDriver(driver_name, rel_path, description=description, author=author, license=license, version=version, aliases=aliases_objects, driver_class=driver_class)
        except subprocess.CalledProcessError as e:
            pass
        return None

    @staticmethod
    def parse_drivers(linux_drivers_root_path):
        drivers = []
        # Search within all files in those roots and try to .ko files modules by invoking
        for root, dirs, files in os.walk(linux_drivers_root_path):
            for potential_driver_file in files:
                full_path = os.path.join(root, potential_driver_file)
                # Try to parse the driver and add it to the list of the drivers
                rel_path = os.path.relpath(full_path, linux_drivers_root_path)
                driver = LoadableLinuxDriver._parse_driver(full_path, rel_path)
                if driver is not None:
                    drivers.append(driver)
        return drivers


class BuiltInLinuxDriver(LinuxDriver):
    BUILT_IN_DRIVERS_ROOT_PATH = 'modules.builtin'

    def __init__(self, kernel_path, driver_class=None):
        driver_name = filesystemex.drop_extension(os.path.basename(kernel_path))
        super().__init__(driver_name, driver_class = driver_class)
        self.kernel_path = kernel_path

    def __str__(self):
        final_str = '{}\n'.format(super().__str__())
        final_str += 'kernel_path : {}'.format(self.kernel_path)
        return final_str

    @staticmethod
    def parse_built_in_drivers(linux_drivers_root_path):
        built_in_drivers = []
        child_paths = [os.path.join(linux_drivers_root_path, child_dir) for child_dir in os.listdir(linux_drivers_root_path)]
        sub_dirs = [directory for directory in child_paths if os.path.isdir(directory)]
        built_in_drivers_potential_paths = [os.path.join(parent_dir, BuiltInLinuxDriver.BUILT_IN_DRIVERS_ROOT_PATH) for parent_dir in sub_dirs]
        for built_in_drivers_path in built_in_drivers_potential_paths:
            if os.path.exists(built_in_drivers_path):
                with open(built_in_drivers_path) as built_in_drivers_path_h:
                    drivers_paths = built_in_drivers_path_h.read().splitlines()
                for driver_path in drivers_paths:
                    if not driver_path.startswith('kernel'):
                        return []
                    driver_class = get_driver_class_by_path(driver_path)
                    built_in_drivers.append(BuiltInLinuxDriver(driver_path, driver_class=driver_class))
                break
        return built_in_drivers


class LinuxDriversGroup:
    def __init__(self, root_path, loadable_drivers=None, built_in_drivers=None):
        self.root_path = root_path
        self.loadable_drivers = loadable_drivers if loadable_drivers is not None else []
        self.built_in_drivers = built_in_drivers if built_in_drivers is not None else []


class LinuxDriversIdentifier:
    # The linux drivers path is /lib/modules/<linux version>
    LINUX_DRIVERS_PARENT_PATH = '/lib/modules'

    def __init__(self):
        pass

    def identify_drivers(self, root_path):
        drivers_groups = []
        # Get the drivers root paths
        drivers_root_paths = self._search_module_dirs_root_paths(root_path)
        for drivers_root_path in drivers_root_paths:
            # Get all the loadable linux drivers
            drivers = LoadableLinuxDriver.parse_drivers(drivers_root_path)
            # Get all the built in drivers
            built_in_drivers = BuiltInLinuxDriver.parse_built_in_drivers(drivers_root_path)
            if len(drivers) > 0 or len(built_in_drivers) > 0:
                # Add the drivers group
                drivers_groups.append(LinuxDriversGroup(drivers_root_path, drivers, built_in_drivers))
        return drivers_groups

    def _search_module_dirs_root_paths(self, root_path):
        found_paths = []
        # Iterate the root path and try to look for modules root path
        for root, dirs, files in os.walk(root_path):
            dirs_to_skip = set()
            for dir in dirs:
                dir_full_path = os.path.join(root, dir)
                if LinuxDriversIdentifier.LINUX_DRIVERS_PARENT_PATH in dir_full_path:
                    found_paths.append(dir_full_path)
                    dirs_to_skip.add(dir)
            # All the found dirs - skip them for the search
            if len(dirs_to_skip) > 0:
                dirs[:] = list(set(dirs) - dirs_to_skip)
        return found_paths
