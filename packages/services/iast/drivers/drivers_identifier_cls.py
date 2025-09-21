from driver_identifier.linux.linux_drivers_identifier import LinuxDriversIdentifier


class DriversIdentifier:
    def __init__(self):
        self.driver_identifiers = [LinuxDriversIdentifier()]

    def identify_drivers(self, root_path):
        drivers = []
        for identifier in self.driver_identifiers:
            drivers.extend(identifier.identify_drivers(root_path))
        return drivers
