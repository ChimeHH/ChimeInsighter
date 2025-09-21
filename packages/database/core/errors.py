class FileNotFound(Exception):
    pass
class PackageNotFound(Exception):
    pass
class ThreatNotFound(Exception):
    pass
class VersionFileNotFound(Exception):
    pass


class DuplicatedUserName(Exception):
    pass

class InvalidPassword(Exception):
    pass

class InvalidUserNameOrPassword(Exception):
    pass

class InvalidUserName(Exception):
    pass

class InvalidProjectId(Exception):
    pass

class ProjectAddFailed(Exception):
    pass

class ProjectAlreayExists(Exception):
    pass

class ProjectUpdateFailed(Exception):
    pass

class ProjectNotAccessable(Exception):
    pass

class ProjectNotFound(Exception):
    pass


class VersionAlreadyExists(Exception):
    pass

class VersionAddFailed(Exception):
    pass

class VersionDeleteFailed(Exception):
    pass

class VersionUpdateFailed(Exception):
    pass

class VersionNotFound(Exception):
    pass