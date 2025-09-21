import re
import io
import pathlib
from exlib.utils.abstract import Singleton

import reverse_geocoder as rg

class GPS(metaclass=Singleton):
    def __init__(self, *args, **kwargs):
        pass

    def get_info(self, rule, original):
        # The numbers are in decimal degrees format and range from -90 to 90 for latitude and -180 to 180 for longitude.        
        try:
            max_latitude = 90
            max_longitude = 180
            vs = re.findall(r"(lat|lon)\s*[=:]\s*\"?(-?\d+\.?\d*)\"", original)
            lat = 360
            lon = 360
            
            for v in vs:
                if v[0] in ('lat', 'latitude'):
                    lat = float(v[1])
                if v[0] in ('lon', 'longitude'):
                    lon = float(v[1])
            
            if abs(lat) > max_latitude or lon > max_longitude:
                return None

            loc = rg.search((lat, lon),)
            if loc: 
                return loc[0]
            else:
                return {'lat': lat, 'lon': lon, }

        except:
            return None