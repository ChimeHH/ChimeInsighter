import re
import pathlib
import IP2Location
from exlib.settings.osenv import appdata_path
from exlib.utils.abstract import Singleton

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class IP(metaclass=Singleton):
    def __init__(self, *args, **kwargs):
        filepath = appdata_path() / "resource" / "infoleaks" / "ip" / "IPv6.bin"
        self.database = IP2Location.IP2Location(str(filepath))
        self.iptool = IP2Location.IP2LocationIPTools()

    def get_info(self, rule, original):
        '''
        RFC 1918 name   IP address range    Largest CIDR block (subnet mask)
        24-bit block    10.0.0.0 – 10.255.255.255   10.0.0.0/8 (255.0.0.0)
        20-bit block    172.16.0.0 – 172.31.255.255 172.16.0.0/12 (255.240.0.0)
        16-bit block    192.168.0.0 – 192.168.255.255   192.168.0.0/16 (255.255.0.0)
        '''
        if re.match(r"^(192\.168\.|10\.|172.1[6789]\.|172\.2[0-9]\.|172\.3[01]\.|255\.|127\.)", original):
            return None

        try:
            if rule in ('IPv4', ):
                if self.iptool.is_ipv4(original) and not original.startswith(("0.", "255.", "127.")):
                    x = self.database.get_all(original)
                    if x:
                        return x.__dict__

            if rule in ('IPv6', ):
                if self.iptool.is_ipv6(original) and not original in ("::", ":") and len(original)>=8:
                    x = self.database.get_all(original)
                    if x:
                        return x.__dict__        
        except:
            log.warning(f"invalid ip address: {original}")

        return None


if __name__=="__main__":
    ips = [
        "10.1.1.2",
        "172.0.23.1",
        "192.168.0.3",
        "256.2.3.1",
        ]

    ip = IP()
    for n in ips:
        print("{}: {}".format(n, ip.get_info(n)))