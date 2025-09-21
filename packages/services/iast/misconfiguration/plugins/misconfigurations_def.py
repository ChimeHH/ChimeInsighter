import logging
from abc import abstractmethod

from exlib.utils.filesystemex import is_regular_file,is_accessible

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class WrongConfigFormat(Exception):
    pass


class WrongConfigPath(Exception):
    pass


class BrokenFile(Exception):
    pass


class MisconfigurationThreat:
    def __init__(self, category, prop, configured, suggested, rule=None):
        self.category = category
        self.rule = None if rule is None else str(rule)
        self.prop = prop
        self.configured = None if configured is None else str(configured)
        self.suggested = None if suggested is None else str(suggested)

    def to_dict(self):
        return dict(category=self.category, rule=self.rule, prop=self.prop, configured=self.configured, suggested=self.suggested)

class MisconfigurationIdentifier:

    def __init__(self):
        self.logger = log

    @abstractmethod
    def get_misconfigurations(self, root_path):
        raise NotImplementedError()

    @classmethod
    def is_broken_file(cls, file_path):
        return (not is_regular_file(file_path, symlink_ok=True)) or (not is_accessible(file_path))
