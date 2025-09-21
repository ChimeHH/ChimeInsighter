from collections import namedtuple


class DriverClasses:
    NETWORKING = 'Networking'
    HID = 'HID'
    DISPLAY = 'Display'
    STORAGE = 'Storage'
    MULTIMEDIA = 'Multimedia'
    BUS = 'BUS'
    GENERIC_SYSTEM_PERIPHERAL = 'Generic System Peripheral'
    CHARACTER_DEVICES = 'Character Devices'
    USB = 'USB'
    SPI = 'SPI'
    BLOCK_DEVICES = 'Block Devices'
    OTHERS = 'Others'
    CPU = 'CPU'
    GPU = 'GPU'
    MFD = 'Multi Function Device'
    SYSTEM_HEALTH = 'System Health'
    GENERAL_PURPOSE_DRIVERS = 'General Purpose Drivers'
    IIO = 'Industrial IO'


class DriverSubClasses:
    AUDIO = 'Audio'
    VIDEO = 'Video'
    WIFI = 'Wifi'
    OTHER_WIRELESS = 'Other Wireless'
    BLUETOOTH = 'Bluetooth'
    MODEM = 'Modem'
    OTHER_COMMUNICATION_CONTROLLER = 'Other Communication Controller'
    OTHER_NETWORK_CONTROLLER = 'Other Network Controller'
    RF = 'RF'
    IR = 'IR'
    ETHERNET = 'Ethernet'
    Bridge = 'Bridge'
    SATELITE = 'Satellite'
    CRYPTO = 'Crypto'
    GPIO = 'GPIO'
    SIGNAL_PROCESSING = 'Signal Processing'
    CANBUS = 'CANBUS'
    OTHER_BUS = 'Other BUS'
    UNCLASSIFIED = 'Unclassified'
    I2C = 'I2C'


class DriverCategory:
    def __init__(self, driver_class, driver_sub_class=None):
        self.driver_class = driver_class
        self.driver_sub_class = DriverSubClasses.UNCLASSIFIED if driver_sub_class is None else driver_sub_class

    def to_dict(self):
        return {'class' : self.driver_class, 'sub_class': self.driver_sub_class}
