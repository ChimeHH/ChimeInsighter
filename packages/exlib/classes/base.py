import logging


class EnumClass():
    @classmethod
    def enums(cls):
        return { k: v for k, v in cls.__dict__.items() if isinstance(v, (str, int)) and not k.startswith("_") }

    @classmethod
    def values(cls):
        return list(cls.enums().values())

    @classmethod
    def names(cls):
        return list(cls.enums().keys())


class BaseClass():
    def __init__(self):
        self._name = None

    @property
    def name(self):
        return self.__class__.__name__ if not self._name else self._name

    @name.setter
    def name(self, s):
        self._name = s

class ContextClass(BaseClass):
    def __init__(self, context={}):                
        self._context = context

    @property
    def context(self):
        return self._context

class IdentifierClass(ContextClass):
    pass

class ServiceClass(ContextClass):
    pass

