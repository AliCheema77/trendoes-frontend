import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from .constant import HEX_COLOR_REGEX

def validate_hex_color(value):
    """
    Validates that the given value is a valid hexadecimal color code.
    Allows both #RRGGBB and #RGB formats.
    """
    if not re.match(HEX_COLOR_REGEX, value):
        raise ValidationError(
            _('%(value)s is not a valid hexadecimal color code (e.g., #RRGGBB or #RGB).'),
            params={'value': value},
            code='invalid_hex_color'
        )