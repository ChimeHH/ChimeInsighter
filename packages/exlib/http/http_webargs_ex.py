import re
import json
from webargs.flaskparser import FlaskParser
from marshmallow import EXCLUDE, fields, ValidationError
from exlib.utils import jsonex, timex
from datetime import datetime
from datetime import timezone


class InvalidNestedParameterFlattening(Exception):
    pass


class GeneralMetaSchema:
    # In case we have "unsupported" fields by the schema - so we ignore them (marshmallow)
    class Meta:
        unknown = EXCLUDE


class NestedQueryFlaskParser(FlaskParser):
    """Parses nested query args

    This parser handles nested query args. It expects nested levels
    delimited by a period and then deserializes the query args into a
    nested dict.

    For example, the URL query params `?name.first=Great&name.last=China`
    will yield the following dict:

        {
            'name': {
                'first': 'Great',
                'last': 'China',
            }
        }
    """

    def load_querystring(self, req, schema):
        try:
            return jsonex.unflatten_json(req.args)
        except Exception:
            raise InvalidNestedParameterFlattening()

    def load_form(self, req, schema):
        try:
            return jsonex.unflatten_json(req.form)
        except Exception:
            raise InvalidNestedParameterFlattening()


class NoneMixin(object):

    def _deserialize(self, value, attr, data, **kwargs):
        if value == '':
            if hasattr(self, 'allow_none') and self.allow_none == False:
                raise ValidationError('Field may not be empty')
            return None
        return super(NoneMixin, self)._deserialize(value, attr, data, **kwargs)


class NullableString(NoneMixin, fields.String):
    pass


class NullableBool(NoneMixin, fields.Bool):
    pass


class NullableNested(NoneMixin, fields.Nested):
    pass


class NullableList(NoneMixin, fields.List):
    pass


class NullableDecimal(NoneMixin, fields.Decimal):
    pass


class NullableInt(NoneMixin, fields.Int):
    pass


class Json(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        if value is None:
            return ''
        return json.dumps(value)

    def _deserialize(self, value, attr, data, **kwargs):
        try:
            if value == '':
                return None
            return json.loads(value)
        except Exception as e:
            raise ValueError('Incorrect Json Format')


class ISODateTime(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        if value is None:
            return ''
        return value.replace(tzinfo=timezone.utc).isoformat()

    def _deserialize(self, value, attr, data, **kwargs):
        try:
            if value == '':
                return None
            return timex.parse_iso_format_datetime(value)
        except Exception as e:
            raise ValueError('The datetime is not in a ISO format')


class SortList(fields.List):
    def _deserialize(self, value, attr, data, **kwargs):
        deserialized_list = super()._deserialize(value, attr, data, **kwargs)

        if value == '':
            return None
        return super(NoneMixin, self)._deserialize()
