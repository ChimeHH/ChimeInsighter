import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
import time


class NetworkError(Exception):
    pass


class WrongHTTPCodeError(Exception):
    pass


# HTTP codes the defines errors
ERROR_HTTP_CODES = [500, 502, 504]


def requests_retrier(backoff_factor=0.1, retries=3):
    def wraps(func):
        request_exceptions = (
            requests.exceptions.Timeout,
            requests.exceptions.ConnectionError,
            requests.exceptions.HTTPError,
            WrongHTTPCodeError)

        def inner(*args, **kwargs):
            for i in range(retries):
                try:
                    result = func(*args, **kwargs)
                    return result
                except request_exceptions:
                    time.sleep(backoff_factor * (2 ^ i))
            raise NetworkError

        return inner

    return wraps


def requests_retrier_function(backoff_factor, retries, func, *args, **kwargs):
    request_exceptions = (
        requests.exceptions.Timeout,
        requests.exceptions.ConnectionError,
        requests.exceptions.HTTPError,
        WrongHTTPCodeError)
    for i in range(retries):
        try:
            result = func(*args, **kwargs)
            return result
        except request_exceptions:
            time.sleep(backoff_factor * (2 ^ i))
    raise NetworkError


def requests_retry_session(request_methods=['GET'], retries=20, backoff_factor=0.3, status_forcelist=ERROR_HTTP_CODES,
                           session=None):
    session = session or requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
        method_whitelist=frozenset(request_methods)
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session


def download_file(dest_file_path, location):
    file_response = requests.get(location, stream=True)
    with open(dest_file_path, 'wb') as dest_file:
        for chunk in file_response:
            dest_file.write(chunk)

