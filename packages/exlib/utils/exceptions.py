class DigitalTwinsException(Exception):
    pass


class DigitalTwinsUnauthorizedError(DigitalTwinsException):
    pass


class DigitalTwinsReportError(DigitalTwinsException):
    pass


class DigitalTwinsPackageError(DigitalTwinsException):
    pass


class DigitalTwinsOperationalError(DigitalTwinsException):
    pass


class DigitalTwinsTimeoutError(DigitalTwinsException):
    pass


class DigitalTwinsDuplicateError(DigitalTwinsException):
    pass


class DigitalTwinsPackageInvalid(DigitalTwinsException):
    pass


class DigitalTwinsScanError(DigitalTwinsException):
    pass
