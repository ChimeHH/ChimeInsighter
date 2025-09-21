#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# enable below line for python2.x
from __future__ import print_function

import traceback

class PrintStyle():
    _plain_mode_ = False
    _verbose_mode_ = False
    default=0
    highlight=1
    underline=4
    flashing=5
    reverse=7 

def enable_plain_mode(b_mode):   
    PrintStyle._plain_mode_ = b_mode

def enable_verbose_mode(b_mode=True):
    PrintStyle._verbose_mode_ = b_mode

def verbose_mode():
    return PrintStyle._verbose_mode_

def print_red(*args, **kwargs):
    style=kwargs.pop('style', PrintStyle.default)
    end=kwargs.pop('end', None)
    if PrintStyle._plain_mode_:
        return print(*args, end=end, **kwargs)
    for arg in args:
        print('\033[{};31m{}\033[0m'.format(style, arg), end='', **kwargs)
    print('', end=end)
def print_green(*args, **kwargs):
    style=kwargs.pop('style', PrintStyle.default)
    end=kwargs.pop('end', None)
    if PrintStyle._plain_mode_:
        return print(*args, end=end, **kwargs)
    for arg in args:
        print('\033[{};32m{}\033[0m'.format(style, arg), end='', **kwargs)
    print('', end=end)
def print_yellow(*args, **kwargs):
    style=kwargs.pop('style', PrintStyle.default)
    end=kwargs.pop('end', None)
    if PrintStyle._plain_mode_:
        return print(*args, end=end, **kwargs)
    for arg in args:
        print('\033[{};33m{}\033[0m'.format(style, arg), end='', **kwargs)
    print('', end=end)
def print_blue(*args, **kwargs):
    style=kwargs.pop('style', PrintStyle.default)
    end=kwargs.pop('end', None)
    if PrintStyle._plain_mode_:
        return print(*args, end=end, **kwargs)
    for arg in args:
        print('\033[{};34m{}\033[0m'.format(style, arg), end='', **kwargs)
    print('', end=end)
def print_fuch(*args, **kwargs):
    style=kwargs.pop('style', PrintStyle.default)
    end=kwargs.pop('end', None)
    if PrintStyle._plain_mode_:
        return print(*args, end=end, **kwargs)
    for arg in args:
        print('\033[{};35m{}\033[0m'.format(style, arg), end='', **kwargs)
    print('', end=end)
def print_cyan(*args, **kwargs):
    style=kwargs.pop('style', PrintStyle.default)
    end=kwargs.pop('end', None)
    if PrintStyle._plain_mode_:
        return print(*args, end=end, **kwargs)
    for arg in args:
        print('\033[{};36m{}\033[0m'.format(style, arg), end='', **kwargs)
    print('', end=end)


def print_red_bg(*args, **kwargs):
    style=kwargs.pop('style', PrintStyle.default)
    end=kwargs.pop('end', None)
    if PrintStyle._plain_mode_:
        return print(*args, end=end, **kwargs)
    for arg in args:
        print('\033[{};41m{}\033[0m'.format(style, arg), end='', **kwargs)
    print('', end=end)
def print_green_bg(*args, **kwargs):
    style=kwargs.pop('style', PrintStyle.default)
    end=kwargs.pop('end', None)
    if PrintStyle._plain_mode_:
        return print(*args, end=end, **kwargs)
    for arg in args:
        print('\033[{};42m{}\033[0m'.format(style, arg), end='', **kwargs)
    print('', end=end)
def print_yellow_bg(*args, **kwargs):
    style=kwargs.pop('style', PrintStyle.default)
    end=kwargs.pop('end', None)
    if PrintStyle._plain_mode_:
        return print(*args, end=end, **kwargs)
    for arg in args:
        print('\033[{};43m{}\033[0m'.format(style, arg), end='', **kwargs)
    print('', end=end)
def print_blue_bg(*args, **kwargs):
    style=kwargs.pop('style', PrintStyle.default)
    end=kwargs.pop('end', None)
    if PrintStyle._plain_mode_:
        return print(*args, end=end, **kwargs)
    for arg in args:
        print('\033[{};44m{}\033[0m'.format(style, arg), end='', **kwargs)
    print('', end=end)
def print_fuch_bg(*args, **kwargs):
    style=kwargs.pop('style', PrintStyle.default)
    end=kwargs.pop('end', None)
    if PrintStyle._plain_mode_:
        return print(*args, end=end, **kwargs)
    for arg in args:
        print('\033[{};45m{}\033[0m'.format(style, arg), end='', **kwargs)
    print('', end=end)
def print_cyan_bg(*args, **kwargs):
    style=kwargs.pop('style', PrintStyle.default)
    end=kwargs.pop('end', None)
    if PrintStyle._plain_mode_:
        return print(*args, end=end, **kwargs)
    for arg in args:
        print('\033[{};46m{}\033[0m'.format(style, arg), end='', **kwargs)
    print('', end=end)

def print_exc(exception=None, details=True, reason="NA"):    
    print_fuch("EXCEPTION: {}".format(reason))
    if exception:
        print_fuch('{}: {}'.format(exception.__class__.__name__, exception))
        return
    if details:
        print_fuch(traceback.format_exc())

def format_exc():
    return traceback.format_exc()


def print_stack():    
    print_fuch("STACK:")
    print_fuch(''.join(traceback.format_stack()))

def format_stack():
    return traceback.format_stack()

def format_class_obj(obj):
    return vars(obj)


def pformat(*args, **kwargs):
    import pprint
    indent = kwargs.pop('indent', 4)
    return pprint.pformat(*args, indent=indent, **kwargs)

def pprint(*args, **kwargs):
    file = kwargs.pop('file', None)
    print(pformat(*args, **kwargs), file=file)

def pprint_red(*args, **kwargs):
    file = kwargs.pop('file', None)
    print_red(pformat(*args, **kwargs), file=file)

def pprint_blue(*args, **kwargs):
    file = kwargs.pop('file', None)
    print_blue(pformat(*args, **kwargs), file=file)

def pprint_yellow(*args, **kwargs):
    file = kwargs.pop('file', None)
    print_yellow(pformat(*args, **kwargs), file=file)

def pprint_green(*args, **kwargs):
    file = kwargs.pop('file', None)
    print_green(pformat(*args, **kwargs), file=file)

# fuchsin粉色
def pprint_fuch(*args, **kwargs):
    file = kwargs.pop('file', None)
    print_fuch(pformat(*args, **kwargs), file=file)

# 青色
def pprint_cyan(*args, **kwargs):
    file = kwargs.pop('file', None)
    print_cyan(pformat(*args, **kwargs), file=file)


def vprint(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        print(*args, **kwargs)
def vprint_red(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        print_red(*args, **kwargs)
def vprint_yellow(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        print_yellow(*args, **kwargs)
def vprint_blue(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        print_blue(*args, **kwargs)
def vprint_green(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        print_green(*args, **kwargs)
def vprint_cyan(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        print_cyan(*args, **kwargs)
def vprint_fuch(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        print_fuch(*args, **kwargs)

def vpprint(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        pprint(*args, **kwargs)
def vpprint_red(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        pprint_red(*args, **kwargs)
def vpprint_yellow(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        pprint_yellow(*args, **kwargs)
def vpprint_blue(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        pprint_blue(*args, **kwargs)
def vpprint_green(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        pprint_green(*args, **kwargs)
def vpprint_cyan(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        pprint_cyan(*args, **kwargs)
def vpprint_fuch(*args, **kwargs):
    if PrintStyle._verbose_mode_:
        pprint_fuch(*args, **kwargs)


def pretty_print_request(req):
    """
    At this point it is completely built and ready
    to be fired; it is "prepared".

    prepared = req.prepare()

    However pay attention at the formatting used in 
    this function because it is programmed to be pretty 
    printed and may differ from the actual request.
    """
    print('{}\n{}\r\n{}\r\n\r\n{}'.format(
        '-----------START-----------',
        req.method + ' ' + req.url,
        '\r\n'.join('{}: {}'.format(k, v) for k, v in req.headers.items()),
        req.body,
    ))

if __name__ == '__main__':

    a = dict(a=(1, 2, 3), b=dict(c=dict(d=1)))

    print_red('...hahhaha', style=PrintStyle.highlight)        
    print_red('hello {}'.format('abc')) 
    print_red('hahhaha', style=PrintStyle.underline)        
    print_red('hello {}'.format('abc')) 
    print_green('hahhaha', style=PrintStyle.underline)  

    print_green('hello {}'.format('abc')) 
    print_yellow('hahhaha', style=PrintStyle.flashing)        
    print_yellow('hello {}'.format('abc')) 
    print_blue('...hahhaha', style=PrintStyle.reverse)        
    print_blue('hello {}'.format('abc')) 
    print_fuch('hahhaha', style=PrintStyle.default)        
    print_fuch('hello {}'.format('abc'), style=PrintStyle.underline) 
    print_cyan('hahhaha', style=PrintStyle.underline)        
    print_cyan('hello {}'.format('abc'), style=PrintStyle.underline) 

    print_red_bg('...hahhaha', style=PrintStyle.flashing)        
    print_red_bg('hello {}'.format('abc')) 

    print('\nBelow is testing exceptions::')
    try:
        raise SystemError('hello you')
    except Exception as e:
        print_exc(e, details=False)
    try:
        raise SystemError('hello you, details')
    except Exception as e:
        print_exc(e, details=True)

    pprint_red(a)

    enable_plain_mode(True)
    print('plain: {}'.format(PrintStyle._plain_mode_))
    print_red('...hahhahaasdfds', style=PrintStyle.highlight)        
    print_red('hello {}'.format('abc')) 
    print_red('hahhaha', style=PrintStyle.underline)        
    print_red('hello {}'.format('abc')) 
    print_green('hahhaha', style=PrintStyle.underline)  


    pprint(a)

    enable_verbose_mode(True)
    enable_plain_mode(False)
    print('vprint???')
    vprint('abc')
    vprint_red('abc')
    print('vpprint???')
    vpprint(a)
    vpprint_red(a)

    enable_verbose_mode(True)
    enable_plain_mode(True)
    print('vprint???')
    vprint('abc')
    vprint_red('abc')
    print('vpprint???')
    vpprint(a)
    vpprint_red(a)

    enable_verbose_mode(False)
    enable_plain_mode(False)
    print('vprint???')
    vprint('abc')
    vprint_red('abc')
    print('vpprint???')
    vpprint(a)
    vpprint_red(a)


