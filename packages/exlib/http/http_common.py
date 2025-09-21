from enum import Enum

class HTTPRequestType(object):
    GET = 'GET'
    POST = 'POST'
    DELETE = 'DELETE'

class MimeType(object):
    JSON = 'application/json'