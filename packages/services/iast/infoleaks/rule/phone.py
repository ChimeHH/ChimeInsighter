import re
import pathlib
from exlib.settings.osenv import appdata_path
from exlib.utils.abstract import Singleton

class PhoneRE:
    MOVE_Card_RE = r'(\+86|0086|86)?0?1(3[4-9]|5[0-27-9]|8[2378]|47)\d{8}', '移动手机卡'
    UNICOM_Card_RE = r'(\+86|0086|86)?0?1(3[0126]|8[56]|66|45|5[56])\d{8}', '联通手机卡'
    TELECOM_Card_RE = r'(\+86|0086|86)?0?1(3(3\d|49)\d|53\d{2}|8[019]\d{2}|7([37]\d{2}|40[0-5])|9[19]\d{2})\d{6}', '电信手机卡'
    Maritime_Communications_RE = r'(\+86|0086|86)?0?1749\d{7}', '船舶通信导航海事卫星通信'
    Emergency_Communication_RE = r'(\+86|0086|86)?0?174(0[6-9]|1[0-2])\d{6}', '工业和信息化部应急通信保障中心'
    Move_Virtual_Operator_RE = r'(\+86|0086|86)?0?1(65\d|70[356])\d{7}', '移动虚拟运营商'
    UNICOM_Virtual_Operator_RE = r'(\+86|0086|86)?0?1(70[4789]|71\d|67\d)\d{7}', '联通虚拟运营商'
    TELECOM_Virtual_Operator_RE = r'(\+86|0086|86)?0?170[0-2]\d{7}', '电信虚拟运营商'
    Move_Internet_of_Things_Data_Card_RE = r'(\+86|0086|86)?0?14(40|8\d)\d{9}', '移动物联网数据卡'
    UNICOM_Internet_of_Things_Data_Card_RE = r'(\+86|0086|86)?0?146\d{10}', '联通物联网数据卡'
    TELECOM_Internet_of_Things_Data_Card_RE = r'(\+86|0086|86)?0?1410\d{9}', '电信物联网数据卡'
    MOVE_Wireless_Network_Card_RE = r'(\+86|0086|86)?0?147\d{8}', '移动上网卡'
    UNiCOM_Wireless_Network_Card_RE = r'(\+86|0086|86)?0?145\d{8}', '联通上网卡'
    TELECOM_Wireless_Network_Card_RE = r'(\+86|0086|86)?0?149\d{8}', '电信上网卡'
    FIXED_TELEPHONE_RE = r'(\+86|0086|86)?0[1-9][0-9]{1,2}-?[0-9]{8}', '固定电话'


class Phone(metaclass=Singleton):
    def __init__(self, *args, **kwargs):
        filepath = appdata_path() / "resource" / "infoleaks" / 'phone'

        self.region_codes = {}
        with (filepath / 'region_codes.txt').open('r') as f:
            for line in f:
                if line.startswith("#"):
                    continue
                region, numbers, code = line.split(',')

                for number in numbers.split('|'):
                    self.region_codes[number.replace('-', '').strip()] = dict(region=region.strip(), code=region.strip())

        self.telephones = {}
        with (filepath / 'telephones.txt').open('r') as f:
            for line in f:
                if line.startswith("#"):
                    continue
                mobile, province, city, vendor, areacode = line.split(',')
                self.telephones[mobile.strip()] = dict(province=province.strip(), city=city.strip(), vendor=vendor.strip())
                self.telephones[areacode.strip()] = dict(province=province.strip(), city=city.strip(), vendor=vendor.strip())
                

    def get_info(self, rule, original):
        cn_type = None
        number = original.replace('-', '').replace(' ', '')
        for s, rule in PhoneRE.__dict__.items():
            if s.startswith('_'):
                continue            
            m = re.fullmatch(rule[0], number)
            if m:
                cn_type = rule[1]
                if m.group(1):
                    number = number[len(m.group(1)):]
                break

        if cn_type:
            number.lstrip('-0')

            r = dict(id='86', region='China', code='CN/CHN', number=number, type=cn_type)
            x = self.telephones.get(number[:7], None) or self.telephones.get(number[:3], None) or self.telephones.get(number[:2], None)
            if x:
                r.update(x)
            
            return r

        m = re.match(r"^(\+|00)?(1-\d{3}-|\d{1,3}-|1 \d{3} |\d{1,3} )", original)
        if m:
            _id = m.group(2).strip('- ')
            region = self.region_codes.get(_id, None)
            if region:
                return dict(id=_id, region=region['region'], code=region['code'], number=number, type='international')

        return None


if __name__=="__main__":
    numbers = [
        "+86 15180865874",
        "0086015180865874",
        "86-15180865874",
        "02034032356",
        "0086015180865874",
        "8615180865874",
        "15180865874",
        "151808874",
        "001-51808874",
        "+1 51808874",
        ]

    phone = Phone()
    for n in numbers:
        print("{}: {}".format(n, phone.get_info(n)))



            









