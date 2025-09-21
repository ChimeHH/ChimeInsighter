import json
from exlib.utils.encoder import JSONEncoder
from marshmallow import fields, ValidationError
from exlib.http.http_webargs_ex import NestedQueryFlaskParser, InvalidNestedParameterFlattening
import datetime
from datetime import datetime
import werkzeug
import flask
from werkzeug.exceptions import default_exceptions


# Response Code
class ResponseCode:
    SUCCESS = 0
    GENERAL_ERROR = 1


# Error codes
class API_ERROR_CODES:
    INVALID_PARAMETER = 1
    HTTP_ERROR = 2
    SERVER_INTERNAL_ERROR = 3


class ApiResponse(object):
    def __init__(self, http_code, response_code, additional_info):
        self.http_code = http_code
        self._response_dict = {'status_code': response_code}
        self._response_dict.update(additional_info)

    def generate_response(self, json_encoder=None):
        if json_encoder is None:
            json_encoder = JSONEncoder()
        response = flask.json.jsonify(json.loads(json_encoder.encode(self._response_dict)))
        response.status_code = self.http_code
        # This header is necessery for the front-end client if it makes different
        # requests to different targets, so it might need data from different origins
        # For more information - go here : https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response

class StreamResponse(ApiResponse):
    def __init__(self, additional_info=None):
        additional_info = {} if additional_info is None else additional_info
        super().__init__(200, ResponseCode.SUCCESS, {'data': additional_info})

    def generate_stream_response(self, generator, json_encoder=None):
        if json_encoder is None:
            json_encoder = JSONEncoder()

        def stream_generator():
            for item in generator:
                item_dict = {'status_code': self.http_code, 'data': {'answer': item}}
                yield json_encoder.encode(item_dict) + '\n'

        response = flask.Response(flask.stream_with_context(stream_generator()), mimetype='application/json')
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response


class SuccessResponse(ApiResponse):
    def __init__(self, additional_info=None):
        additional_info = {} if additional_info is None else additional_info
        super().__init__(200, ResponseCode.SUCCESS, {'data': additional_info})


class ErrorResponse(ApiResponse):
    def __init__(self, api_error):
        super().__init__(api_error.http_code(), ResponseCode.GENERAL_ERROR,
                         {'error': api_error.get_dict()})

class AcceptResponse(ApiResponse):
    def __init__(self, reason=None):        
        super().__init__(202, ResponseCode.SUCCESS, {'reason': reason})


class ApiError(Exception):
    ERROR_CODE = 'error_code'
    MESSAGE = 'message'

    def __init__(self, error_code, message):
        self.error_attributes = {}
        self.error_attributes[ApiError.ERROR_CODE] = error_code
        self.error_attributes[ApiError.MESSAGE] = message

    def get_dict(self):
        return self.error_attributes

    def http_code(self):
        raise NotImplementedError()


class HTTPException(ApiError):
    def __init__(self, http_code, message):
        super().__init__(API_ERROR_CODES.HTTP_ERROR, message)
        self.m_http_code = http_code

    def http_code(self):
        return self.m_http_code


class GeneralServerException(ApiError):
    def __init__(self, error_code, message):
        super().__init__(error_code, message)

    def http_code(self):
        return 500


class AuthenticationException(ApiError):
    def __init__(self, error_code, message, http_code=401):
        super().__init__(error_code, message)
        self.authentication_http_code = http_code

    def http_code(self):
        return self.authentication_http_code


class AuthorizationException(ApiError):
    def __init__(self, error_code, message):
        super().__init__(error_code, message)

    def http_code(self):
        return 403


class GeneralClientException(ApiError):
    def __init__(self, error_code, message):
        super().__init__(error_code, message)

    def http_code(self):
        return 400


class RequestParametersError(ApiError):
    FIELDS_ERRORS = 'fields_errors'

    def __init__(self, fields_names_messages_dict):
        super().__init__(API_ERROR_CODES.INVALID_PARAMETER, 'Invalid parameters of request')
        self.error_attributes[RequestParametersError.FIELDS_ERRORS] = fields_names_messages_dict

    def http_code(self):
        return 400


def general_logic_exception(error_code, message, e):
    """
    This function can be used for subscribing error handlers
    """
    return ErrorResponse(GeneralClientException(error_code, message)).generate_response()


def date_deserialization(date_str, *args, **kwargs):
    """
    This wrapper is necessary because the deserialization using webargs library have different behaviour when its used with Cython (its internal lambda functions doesnt support very nicely)
    So the Cython version may attach other parameters that will be caucth in the *args and **kwargs place holders.
    So if you are using the webargs Function field with the deserialization option - you must wrap this with the *args and **kwargs parameters.
    """
    return date_validate(date_str)


def datetime_deserialization(datetime_str, *args, **kwargs):
    """
    This wrapper is necessary because the deserialization using webargs library have different behaviour when its used with Cython (its internal lambda functions doesnt support very nicely)
    So the Cython version may attach other parameters that will be caucth in the *args and **kwargs place holders.
    So if you are using the webargs Function field with the deserialization option - you must wrap this with the *args and **kwargs parameters.
    """
    return datetime_validate(datetime_str)


def datetime_validate(date_str):
    try:
        return datetime.fromisoformat(date_str).replace(tzinfo=datetime.timezone.utc)
    except:
        raise ValidationError('The datetime is not in a ISO format')


def date_validate(date_str):
    try:
        return datetime.strptime(date_str, '%Y-%d-%m').replace(tzinfo=datetime.timezone.utc)
    except:
        raise ValidationError('The date is not in a ISO format')


def array_parameter_error(error_messages_of_values):
    return 'The values of the parameter had these errors: {}'.format(', '.join(list(error_messages_of_values)))


def _normalize_errors_structure(fields_messages_dict):
    normalized_error_messages = {}
    for field_name, error_object in fields_messages_dict.items():
        if type(error_object) == list:
            normalized_error_messages[field_name] = ', '.join(error_object)
        elif type(error_object) == dict:
            # If it's a list object that has errors in the different indexes (key is a integer) - this will be the error
            if any(isinstance(elem, int) for elem in list(error_object.keys())):
                error_messages = set()
                for parameter_list_index, error_messages_list in error_object.items():
                    error_messages.update(error_messages_list)
                normalized_error_messages[field_name] = array_parameter_error(error_messages)
            # Else it's a nested error field
            else:
                normalized_error_messages[field_name] = _normalize_errors_structure(error_object)
        else:
            normalized_error_messages[field_name] = error_object
    return normalized_error_messages


def parse_webargs(arguments_validator, request_object, location=None):
    if location is None:
        if request_object.method in ['GET', 'DELETE']:
            location = 'querystring'
        else:
            location = 'form'
    try:
        jsonex = NestedQueryFlaskParser().parse(arguments_validator, request_object, location=location)
        
        # printers.pprint(jsonex)
        return jsonex

    except (ValidationError, werkzeug.exceptions.UnprocessableEntity) as e:
        fields_messages_dict = None
        if type(e) is werkzeug.exceptions.UnprocessableEntity:
            fields_messages_dict = e.exc.messages.get(location, {})
        else:
            fields_messages_dict = e.messages.get(location, {})

        normalized_error_messages = _normalize_errors_structure(fields_messages_dict)

        # Convert the error to be in a flat position
        raise RequestParametersError(normalized_error_messages)
    except InvalidNestedParameterFlattening:
        raise GeneralClientException(API_ERROR_CODES.INVALID_PARAMETER, 'Parameters flattening is invalid')


def _handle_http_exception(e):
    try:
        response_object = e.get_response()
        return ErrorResponse(HTTPException(response_object.status_code, response_object.status)).generate_response()
    except Exception as r:
        return ErrorResponse(GeneralServerException(API_ERROR_CODES.SERVER_INTERNAL_ERROR,
                                                    'An http undetermined error')).generate_response()


def _handle_uncaught_server_internal_error(e):
    return ErrorResponse(GeneralServerException(API_ERROR_CODES.SERVER_INTERNAL_ERROR,
                                                'Undetermined internal error')).generate_response()


def _handle_api_errors(api_error):
    return ErrorResponse(api_error).generate_response()


def register_default_error_handlers(flask_app):
    for ex in default_exceptions:
        flask_app.register_error_handler(ex, _handle_http_exception)
    # Register the default ones
    flask_app.register_error_handler(ApiError, _handle_api_errors)
    flask_app.register_error_handler(500, _handle_uncaught_server_internal_error)


def load_json_parameter(args, parameter, error_msg):
    json_parameter_value = args.get(parameter)
    if json_parameter_value is None:
        return None
    try:
        json_obj = json.loads(json_parameter_value)
        return json_obj
    except Exception as e:
        raise RequestParametersError({parameter: error_msg})