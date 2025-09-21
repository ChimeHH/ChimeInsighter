import dateutil
from datetime import datetime, timezone


def seconds_to_start_run(hour):
    """
    Given an hour (integer) - the function will return the number of seconds that needs to pass until this
    hour will resached (based on utc timeline)
    """
    current_time = datetime.utcnow().replace(tzinfo=timezone.utc)
    the_hour_today = (current_time + dateutil.relativedelta(hour=hour, minute=0, second=0)).replace(tzinfo=timezone.utc)
    seconds_for_hour_today = (the_hour_today - current_time).total_seconds()
    if seconds_for_hour_today > 0:
        return seconds_for_hour_today
    the_hour_tommorow = (current_time + dateutil.relativedelta(hour=hour, minute=0, second=0, days=1)).replace(tzinfo=timezone.utc)
    seconds_for_hour_tommorow = (the_hour_tommorow - current_time).total_seconds()
    return max(seconds_for_hour_tommorow, 1)


def get_current_time_utc():
    return datetime.utcnow().replace(tzinfo=timezone.utc)


def parse_iso_format_datetime(iso_format_datetime_str):
    iso_datetime = dateutil.parser.isoparse(iso_format_datetime_str)
    if iso_datetime.tzinfo is None:
        return iso_datetime.replace(tzinfo=timezone.utc)

    aligned_iso_datetime = iso_datetime - iso_datetime.utcoffset()
    return aligned_iso_datetime.replace(tzinfo=timezone.utc)

def to_datetime(input_time, tz=timezone.utc):  
    if isinstance(input_time, datetime):  
        return input_time.astimezone(tz)  

    if isinstance(input_time, str):  
        # 尝试解析为 ISO 格式  
        try:  
            dt = datetime.fromisoformat(input_time)  
            return dt.astimezone(tz)  
        except ValueError:  
            pass  

        # 尝试解析为 ctime 格式  
        try:  
            dt = datetime.strptime(input_time, '%a %b %d %H:%M:%S %Y')  
            return dt.replace(tzinfo=tz)  
        except ValueError:  
            pass  

        # 尝试解析为 RFC 2822 格式  
        try:  
            from email.utils import parsedate_tz, mktime_tz  

            time_tuple = parsedate_tz(input_time)  
            if time_tuple is not None:  
                dt = datetime.fromtimestamp(mktime_tz(time_tuple), tz=tz)  
                return dt  
        except Exception:  
            pass  

        # 尝试解析为 UNIX 时间戳  
        try:  
            timestamp = float(input_time)  
            return datetime.fromtimestamp(timestamp, tz=tz)  
        except (ValueError, TypeError):  
            pass  

        # 尝试解析为自定义格式（示例）  
        try:  
            dt = datetime.strptime(input_time, '%Y-%m-%d %H:%M:%S')  
            return dt.astimezone(tz)  
        except ValueError:  
            pass  
        
        try:  
            dt = datetime.strptime(input_time, '%d/%m/%Y %H:%M:%S')  
            return dt.astimezone(tz)  
        except ValueError:  
            pass  
            
        try:  
            dt = datetime.strptime(input_time, '%m/%d/%Y')  
            return dt.astimezone(tz)  
        except ValueError:  
            pass  

    return None  # 如果都不匹配，返回 None  

# 示例  
# print(convert_to_utc('Tue, 14 Feb 2025 07:59:17 +0000'))  # RFC 2822 格式  
# print(convert_to_utc('1676359157'))  # UNIX 时间戳  
# print(convert_to_utc('2025-02-14 07:59:17'))  # 自定义格式示例  
# print(convert_to_utc('14/02/2025 07:59:17'))  # 日/月/年格式