import inspect
import contextlib
import threading
import _thread as thread
import os.path
import pkgutil
import sys
from .exceptions import DigitalTwinsTimeoutError


##  Design patterns  ##
class Singleton(type):
    """
    Singleton meta class.
    :see: http://stackoverflow.com/questions/6760685/creating-a-singleton-in-python
    """
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


## Module functions ##
def load_modules_from_path(root_package_name, path, no_loaded=True):
    modules = []
    for importer, package_name, _ in pkgutil.iter_modules([path]):
        full_package_name = f"{root_package_name}.{os.path.basename(path)}.{package_name}"
        if no_loaded and full_package_name not in sys.modules:
            modules.append(importer.find_module(full_package_name).load_module(full_package_name))

    return modules


def get_classes_from_module(module, class_type):
    return inspect.getmembers(module, lambda x: inspect.isclass(x) and issubclass(x, class_type) and x != class_type)


##  runtime functions  ##
@contextlib.contextmanager
def time_limit(seconds, raise_timeout=True):
    """
    Limit the execution of your program by the given amount of seconds.
    For example:
    with time_limit(30):
        ... your code here ...
    .. will end after 30 seconds ...

    :param seconds: Number of seconds to limit the execution
    :param raise_timeout: Boolean flag that decides to raise the DigitalTwinsTimeoutError when a timeout is triggered
    :raises: DigitalTwinsTimeoutError if raise_timeout is True
    """
    timer = threading.Timer(seconds, thread.interrupt_main)
    timer.start()

    try:
        yield
    except KeyboardInterrupt:
        if raise_timeout:
            raise DigitalTwinsTimeoutError("Timed out")
    finally:
        # if the action ends in specified time, timer is cancelled
        timer.cancel()


##  classes functions  ##
def get_subclasses(cls):
    """
    Gets the class subclasses

    :param cls: The class to get the subclasses from
    :return: List of subclasses
    """
    try:
        subs = cls.__subclasses__()
    except TypeError:  # fails only when cls is type
        subs = cls.__subclasses__(cls)

    return subs

def itersubclasses(cls, _seen=None):
    """
    itersubclasses(cls)

    Generator over all subclasses of a given class, in depth first order.
    # >>> class A(object): pass
    # >>> class B(A): pass
    # >>> class C(A): pass
    # >>> class D(B,C): pass
    # >>> class E(D): pass
    # >>>
    # >>> for cls in itersubclasses(A):
    # ...     print(cls.__name__)
    # B
    # D
    # E
    # C
    # >>> # get ALL (new-style) classes currently defined
    # >>> [cls.__name__ for cls in itersubclasses(object)] #doctest: +ELLIPSIS
    ['type', ...'tuple', ...]
    """

    if not isinstance(cls, type):
        raise TypeError('itersubclasses must be called with '
                        'new-style classes, not %.100r' % cls)
    if _seen is None:
        _seen = set()

    subs = get_subclasses(cls)
    for sub in subs:
        if sub not in _seen:
            _seen.add(sub)
            yield sub

            for childsub in itersubclasses(sub, _seen):
                yield childsub

def iterleafclasses(cls, _seen=None):
    """
    Generator over all the leaf subclasses of a given class (meaning only the last inherited classes),
    in depth first order.
    """
    if not isinstance(cls, type):
        raise TypeError('Must be called with '
                        'new-style classes, not %.100r' % cls)
    if _seen is None:
        _seen = set()

    subs = get_subclasses(cls)
    for sub in subs:
        if sub in _seen:
            continue

        _seen.add(sub)

        children = get_subclasses(sub)
        if not children:
            yield sub
            continue

        for childsub in iterleafclasses(sub, _seen):
            yield childsub


def get_property_name(cls, property_object):
    """
    Return the property name of the given object.
    For example if we have a class X that has property y
    we should invoke this function this way:
    get_property_name(X, X.y)
    It will return the name of the property if found - otherwise returns None.
    :param cls: The class Object
    :param property_object: The property object - it must be invocation on the Class object itself and not on an instance (The property)
    :return: The property name (If not found - None)
    """
    members_dict = inspect.getmembers(cls)
    for member_name, object_ref in members_dict:
        if property_object == object_ref:
            return member_name
    return None

def get_enum_values(enum_cls):
    """
    Returns the enum values of a certain class that is built only from constant values.
    It will take only the values of the fields that doesn't start with double underscore: __
    :param enum_cls: the enum class with the values
    :return: the list of values
    """
    return [value for key,value in inspect.getmembers(enum_cls) if not key.startswith('__')]

