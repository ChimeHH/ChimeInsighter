from exlib.http.http_common import *
import requests
from requests_toolbelt.multipart import encoder
from exlib.http.http_serializers import MsgPackPickleSerializer
import exlib.http.http_requests_ex as requestsex
import pickle
import base64
import functools


class HTTPClient:
    def __init__(self, ip, port, http_client_response=None, retrying_params=None):
        self.ip = ip
        self.port = port
        self.server_url = 'http://{}:{}'.format(ip, port)
        if http_client_response is None:
            http_client_response = HttpClientResponse
        self.http_client_response = http_client_response
        self._init_retrier(retrying_params)

    def _init_retrier(self, retrying_params=None):
        request_methods = ['GET', 'POST', 'DELETE', 'PUT']
        retries = 20
        backoff_factor = 0.3
        status_forcelist = requestsex.ERROR_HTTP_CODES
        if retrying_params is not None:
            retries = retrying_params.get('retries')
            backoff_factor = retrying_params.get('backoff_factor')
            status_forcelist = retrying_params.get('status_forcelist')
        self.requests_retrier = functools.partial(
            requestsex.requests_retry_session, request_methods, retries, backoff_factor, status_forcelist)
        if backoff_factor is None:
            backoff_factor = 0.1
        if retries is None:
            retries = 3
        self.post_retrier_function = functools.partial(
            requestsex.requests_retrier_function, backoff_factor, retries, self.post_request)

    def _generate_multidict(self, fields):
        generate_multidict = []
        for key, value in fields.items():
            generate_multidict.append((key, value))
        return generate_multidict

    def get_request(self, request_name, fields=None, headers=None, with_retry = True):
        # Set the parameters
        parameters = None
        if fields is not None:
            parameters = self._generate_multidict(fields)

        # Set the URI
        uri = '{}/{}'.format(self.server_url, request_name)
        if with_retry:
            result = self.requests_retrier().get(uri, params=parameters, headers=headers)
        else:
            result = requests.get(uri, params=parameters, headers=headers)
        return self.http_client_response(result)

    def delete_request(self, request_name, fields=None, headers=None):
        # Set the parameters
        parameters = None
        if fields is not None:
            parameters = self._generate_multidict(fields)

        # Set the URI
        uri = '{}/{}'.format(self.server_url, request_name)
        result = self.requests_retrier().delete(uri, params=parameters, headers=headers)
        return self.http_client_response(result)


    def progress_callback(self, monitor):
        #print(monitor.bytes_read * 1.0 / 1024 / 1024)
        # currently don't do anything
        pass

    @requestsex.requests_retrier(backoff_factor=0.3, retries=5)
    def post_request(self, request_name, fields=None, headers=None, files=None, objects=None):
        # Set the parameters
        parameters = []
        opened_files = []
        try:
            if fields is not None:
                parameters = self._generate_multidict(fields)

            # Set the files
            if files is not None:
                for file_key, file_path in files.items():
                    file_handle = open(file_path, 'rb')
                    opened_files.append(file_handle)
                    parameters.append((file_key, (file_path, file_handle, 'text/plain')))

            if objects is not None:
                for object_key, obj in objects.items():
                    obj_base64 = base64.b64encode(pickle.dumps(obj)).decode()
                    parameters.append((object_key, obj_base64))

            # Set the data multipart
            data = encoder.MultipartEncoder(fields=parameters)

            monitor = encoder.MultipartEncoderMonitor(data, self.progress_callback)

            # Update the headers
            if headers is None:
                headers = {}
            headers['Content-Type'] = monitor.content_type

            # Set the URI
            uri = '{}/{}'.format(self.server_url, request_name)

            # Call the post
            result = requests.post(uri, data=monitor, headers=headers)
            if result.status_code in requestsex.ERROR_HTTP_CODES:
                raise requestsex.WrongHTTPCodeError()

            # Return a http client response
            return self.http_client_response(result)
        finally:
            for open_file in opened_files:
                open_file.close()


class HttpClientResponse(object):
    def __init__(self, requests_response):
        self.inner_response = requests_response

    def get_http_code(self):
        self.inner_response.status_code

    def get_content(self):
        return self.inner_response.content


class PickledMsgPackHttpResponse(HttpClientResponse):
    def __init__(self, requests_response):
        super().__init__(requests_response)
        self.unpacker = MsgPackPickleSerializer()

    def get_content(self):
        return self.unpacker.unpack(self.inner_response.content)
