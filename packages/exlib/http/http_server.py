from abc import abstractmethod
import flask
from flask import *
from flask_socketio import SocketIO
from exlib.http.http_serializers import MsgPackPickleSerializer
import pickle
import base64


class ParameterNotExistsException(Exception):
    pass


class ParameterLocation:
    BODY = 0
    QUERY = 1


class HTTPServer:
    def __init__(self):
        self.app = flask.Flask(__name__.split('.')[0])
        self.socketio = SocketIO(self.app, cors_allowed_origins="*")

    def start_server(self, port):
        print("Starting HTTP SocketIO server on port " + str(port))
        # self.app.run(host='0.0.0.0', port=port, threaded=True)
        self.socketio.run(self.app, host='0.0.0.0', port=port)

    def get_server(self):
        return self.app

    def add_request_handler(self, request_name, request_types, handler):
        if type(request_types) != list:
            request_types = [request_types]
        self.app.add_url_rule('/' + request_name, methods=request_types, view_func=handler)

    def add_exception_handler(self, exception_cls, exception_handler):
        # If its the generic exception - we should remove all the other exception hanlers and set this exception
        if type(exception_cls) == Exception:
            for ex in default_exceptions:
                self.app.register_error_handler(ex, exception_handler)
        # Add the exception handler to the specific class
        self.app.register_error_handler(exception_cls, exception_handler)

    def get_file(self, request, key, raise_if_not_exists=False):
        ret_file = request.files.get(key)
        if raise_if_not_exists and ret_file is None:
            raise ParameterNotExistsException()
        return ret_file

    def _get_parameter_locaiton_obj(self, request, parameter_location):
        if parameter_location == ParameterLocation.BODY:
            return request.form
        else:
            return request.args

    def get_object(self, request, key, parameter_location, raise_if_not_exists=False):
        packed_obj = self._get_parameter_locaiton_obj(request, parameter_location).get(key)
        if raise_if_not_exists and packed_obj is None:
            raise ParameterNotExistsException()
        if packed_obj is None:
            return None
        return pickle.loads(base64.b64decode(packed_obj))

    def get_field(self, request, key, parameter_location, raise_if_not_exists=False):
        value = self._get_parameter_locaiton_obj(request, parameter_location).get(key)
        if raise_if_not_exists and value is None:
            raise ParameterNotExistsException()
        return value


class HTTPServerResponse(flask.Response):
    def __init__(self, response_object, http_status_code=None, headers=None):
        super().__init__(self.pack_response(response_object), http_status_code, headers)

    def set_mime_type(self, mime_type):
        self.mimetype = mime_type

    def pack_response(self, response_object):
        return response_object


class PickledServerResponse(HTTPServerResponse):
    def __init__(self, response_object, http_status_code=None, headers=None):
        # Set the packer
        self.packer = MsgPackPickleSerializer()
        super().__init__(response_object, http_status_code, headers)

    def pack_response(self, response_object):
        return self.packer.pack(response_object)
