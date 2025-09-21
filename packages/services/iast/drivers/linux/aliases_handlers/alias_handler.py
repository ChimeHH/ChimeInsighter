class IncorrectAliasStringFormat(Exception):
    pass


class DeviceTypes:
    USB = 'usb'
    HID = 'hid'
    IEEE1394 = 'ieee1394'
    PCI = 'pci'
    CCW = 'ccw'
    AP = 'ap'
    CSS = 'css'
    SERIO = 'serio'
    ACPI = 'acpi'
    PCMCIA = 'pcmcia'
    VIO = 'vio'
    INPUT = 'input'
    EISA = 'eisa'
    PARISC = 'parisc'
    SDIO = 'sdio'
    SSB = 'ssb'
    BCMA = 'bcma'
    VIRTIO = 'virtio'
    VMBUS = 'vmbus'
    RPMSG = 'rpmsg'
    I2C = 'i2c'
    SPI = 'spi'
    DMI = 'dmi'
    PLATFORM = 'platform'
    MDIO = 'mdio'
    ZORRO = 'zorro'
    ISAPNP = 'isapnp'
    IPACK = 'ipack'
    AMBA = 'amba'
    MIPSCDMM = 'mipscdmm'
    X86CPU = 'x86cpu'
    CPU = 'cpu'
    MEI = 'mei'
    RAPIDIO = 'rapidio'
    ULPI = 'ulpi'
    HDAUDIO = 'hdaudio'
    SDW = 'sdw'
    FSLMC = 'fslmc'
    TBSVC = 'tbsvc'
    TYPEC = 'typec'
    TEE = 'tee'
    WMI = 'wmi'
    OF = 'of'
    PNP = 'pnp'
    PNP_CARD = 'pnp_card'


class Alias:
    def __init__(self, alias_string, alias_device_type=None, human_info=None, driver_class=None):
        self.alias_string = alias_string
        self.alias_device_type = alias_device_type
        self.human_info = human_info
        self.driver_class = driver_class


class AliasHandler:
    def __init__(self):
        pass

    def _pattern_match(self, alias_device_info, re_match_exp):
        alias_pattern_match = re_match_exp.match(alias_device_info)
        if alias_pattern_match is None:
            raise IncorrectAliasStringFormat()
        return alias_pattern_match.groupdict()

    def _remove_wildcards_values(self, match_dict):
        keys_to_remove = set()
        for key, val in match_dict.items():
            if val == '*':
                keys_to_remove.add(key)
        for key in keys_to_remove:
            match_dict.pop(key, None)

    def parse(self, alias_string, alias_device_info, alias_type):
        return Alias(alias_string, alias_type)