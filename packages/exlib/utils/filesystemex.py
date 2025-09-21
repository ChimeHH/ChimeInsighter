import os
import errno
import uuid
import tempfile
import shutil
import threading
import time
import sys
import stat
import string
import unicodedata
import pathlib

import psutil
from .printers import *

def _get_childs_from_folder(folder, is_file=None):
    """
       Returns the list of chils paths (folders/files) base on the parameter in the given folder

       :param folder: The folder to look the files in
       :param is_file: True if we search for files, False otherwise. If set to None return file or folder
       :return list of child paths
    """
    if is_file is not None:
        return [os.path.join(folder, the_file) for the_file in os.listdir(folder) if
                (is_file == os.path.isfile(os.path.join(folder, the_file)))]
    else:
        return [os.path.join(folder, the_file) for the_file in os.listdir(folder)]


def get_folders_from_folder(folder):
    """
           Returns the list of folders in the given folder

           :param folder: The folder to look the files in
           :return list of folders paths
    """
    return _get_childs_from_folder(folder, False)


def get_files_from_folder(folder):
    """
    Returns the list of files in the given folder

    :param folder: The folder to look the files in
    :return list of files
    """
    return _get_childs_from_folder(folder, True)


def get_paths_from_folder(folder):
    """
    Returns the list of files in the given folder

    :param folder: The folder to look the files in
    :return list of files
    """
    return _get_childs_from_folder(folder, None)


def create_directory(path):
    """
    Creates the directory in the given path
    :param path: The direcotry to create
    """
    try:
        os.makedirs(path, exist_ok=True)
    except OSError as e:
        raise


def delete_folder(folder):
    """
    Delete a folder and all its subdirectories.

    :param folder: path to delete.
    :raise DigitalTwinsOperationalError: if fails to delete folder.
    """
    if not os.path.exists(folder):
        return

    shutil.rmtree(folder, onerror=_on_error_delete)


def copy_file(src, dest):
    """
    Copies the file from the source path to the dest path
    :param src: The source path
    :param dest: The dest path
    :return: None
    """
    shutil.copy2(src, dest)


def delete_file(filepath):
    """
    Delete's a specific filepath, handles the errors
    :param filepath: The filepath to delete
    """

    if not os.path.exists(filepath) and not os.path.islink(filepath):
        return

    try:
        os.remove(filepath)
    except OSError:
        _on_error_delete(os.remove, filepath, sys.exc_info())


def delete_file_async(file_path, interval):
    """
    Removes the given file in an asyncrounous manner. It dispatches a new thread that tries to remove
    the file every X seconds. It is good way to remove the file in case it is locked now - so it will be removed when
    the lock will be removed.
    :param file_path: the file path of the removed file
    """
    remove_thread = threading.Thread(target=_thread_remove_file, args=(file_path, interval,))
    remove_thread.start()


def _thread_remove_file(file_path, interval):
    """
    An auxilary function to the delete_file_async, the function that we be run by the thread
    :param file_path: the file path to remove
    :param interval: the intreval to sleep
    """
    while True:
        try:
            # If the file exists - try to delete it
            if os.path.exists(file_path):
                os.remove(file_path)
            break
        except Exception as error:
            # In case we had error - seems that the file is locked - try other time
            time.sleep(interval)


def _on_error_delete(func, path, exc_info):
    """
    Called when there's an error deleting a specific filepath

    :param func: The function which raised the exception
    :param path: Path contains the path of the file that couldn't be removed
    :param exc_info: Exception information return by sys.exc_info()
    :return The given func return value
    """
    # let's just assume that it's read-only and retry the function.
    os.chmod(path, stat.S_IWRITE)
    return func(path)


def get_temp_path(prefix=''):
    """
    Returns a temporary path (based on gui and the OS temp directory)
    :return: temporary path
    """
    return os.path.join(tempfile.gettempdir(), '{}{}'.format(prefix, str(uuid.uuid4())))


def create_temp_directory(prefix=''):
    """
    Creates a temporary directory
    :return: temporary created directory
    """
    temp_path = get_temp_path(prefix)
    create_directory(temp_path)
    return temp_path


def iterate_files_in_root(rel_path, callback_func, *args, **kwargs):
    """
    Iterates over the files in the given root path and executes the given callback for each one of the files
    :param rel_path: the root path to iterate
    :param callback_func: the callback function to run on each file path
    :param *args: the arguments for the callback function
    :param **kwargs: the arguments for the callback function
    :return: None
    """
    for root, dirs, filenames in os.walk(rel_path):
        for file_name in filenames:
            callback_func(os.path.join(root, file_name), rel_path, *args, **kwargs)


def _get_files_internal(full_path, rel_path, file_paths):
    """
    Internal function that is used in get_files_in_root in order to collect all the files paths
    :param full_path: the full path of the file to append
    :param rel_path: the root path of all the files
    :param file_paths: the file paths list to append to
    :return: None
    """
    file_paths.append(full_path)


def get_files_in_root(rel_path):
    """
    Returns a list of the files that are contained inside the given rel_path
    :param rel_path: The root path to iterate
    :return: list of file paths
    """
    file_paths = []
    iterate_files_in_root(rel_path, _get_files_internal, file_paths)
    return file_paths


def os_walk_leveled(rel_path, levels=None):
    """
    Runs the os.walk but until numerber of 'levels' top down.
    If the levels is not specified - runs regulary
    :param rel_path: THe root path from where to run
    :param levels: number of levels to run
    :return: generator of os.walk
    """
    rel_path = rel_path.rstrip(os.path.sep)
    num_sep = rel_path.count(os.path.sep)
    for root, dirs, files in os.walk(rel_path):
        yield root, dirs, files
        if levels is not None:
            num_sep_this = root.count(os.path.sep)
            if num_sep + levels <= num_sep_this:
                del dirs[:]


def get_file_size(file_path):
    st = os.stat(file_path)
    return st.st_size


def is_regular_file(file_path, symlink_ok=False):
    if not os.path.exists(file_path):
        return False
    mode = os.lstat(file_path).st_mode
    return stat.S_ISREG(mode) or (symlink_ok and stat.S_ISLNK(mode))


def is_accessible(file_path):
    return os.access(file_path, os.R_OK)


def drop_extension(path):
    """
    Returns the given path without its extensions if exists.
    If it doesn't exists - reuturns the original path
    """
    return os.path.splitext(path)[0]

def get_extension(path):
    """
    Returns the given path extension
    returns it including the "." character.
    if no extension - return ''
    """
    return os.path.splitext(path)[1]


def safe_filename(filename, replace=' '):
    valid_filename_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
    # replace spaces
    for r in replace:
        filename = filename.replace(r, '_')

    # keep only valid ascii chars
    cleaned_filename = unicodedata.normalize('NFKD', filename).encode('ASCII', 'ignore').decode()

    # keep only whitelisted chars
    cleaned_filename = ''.join(c for c in cleaned_filename if c in valid_filename_chars)

    #char_limit = 255
    # if len(cleaned_filename) > char_limit:
    #     print("Warning, filename truncated because it was over {}. Filenames may no longer be unique".format(char_limit))
    # return cleaned_filename[:char_limit]

    return cleaned_filename


def add_escape_chars_to_name(name):
    for ch in {'<', '>', '|', '(', ')', '&', ';', '?', '*'}:
        name = name.replace(ch, "\\" + ch)

    return name



def list_folder(root_dir, blacklist=None):
    if not os.path.exists(root_dir) or not os.path.isdir(root_dir):
        return []

    names = [root_dir]
    try:
        subpaths = os.listdir(root_dir)
        for subpath in subpaths:
            fullpath = os.path.join(root_dir, subpath)                
            if blacklist and subpath.startswith(blacklist):                    
                continue

            if os.path.isdir(fullpath):                    
                names.extend(list_folder(fullpath))
        return names
    except:
        print_red(traceback.format_exc())


def list_file(root_dir, extensions=None, blacklist=None):
    ''' Note, we don't check sub-folders. Refer to list_folder for that purpose. '''
    if not os.path.exists(root_dir) or not os.path.isdir(root_dir) or '__pycache__' in root_dir:
        return []

    names = list()
    try:
        filenames = os.listdir(root_dir)
        for filename in filenames:
            fullname = os.path.join(root_dir, filename)
            
            if blacklist and any(blackname in fullname for blackname in blacklist):
                continue                
            if not os.path.isfile(fullname):
                continue
            if(not extensions or fullname.endswith(extensions)):
                names.append(fullname)
            
        return names
    except:
        print_red(traceback.format_exc())


def list_all_files(root_dir, extensions=None, blacklist=None):    
    if not os.path.exists(root_dir):
        return []

    if not os.path.isdir(root_dir):
        return [root_dir,]

    files = []
    for path in list_folder(root_dir):
        print("searching {}".format(path), end='\r')
        files += list_file(path, extensions=extensions, blacklist=None)
    return files


def walk_path(root_path, *args, extensions=None, blacklist=None, fncall=None, **kwargs):
    count = 0
    for filepath in root_path.iterdir():                
        if filepath.is_dir():
            count += walk_path(filepath, *args, extensions=extensions, blacklist=blacklist, fncall=fncall, **kwargs)
        elif filepath.is_file():
            pathname = str(filepath) # full path name
            if blacklist and any(blackname in pathname for blackname in blacklist):
                continue
            if extensions and not pathname.endswith(extensions):
                continue
            
            if fncall:
                fncall(count, filepath, *args, **kwargs)
            count += 1
    return count

def look_for_file(root_path, *filenames):
    for filepath in root_path.iterdir(): 
        if filepath.is_dir():
            path = look_for_file(filepath, *filenames)
            if path:
                return path
        elif filepath.is_file():
            if filepath.name.endswith(tuple(filenames)):
                return filepath

    return None


def save_filepaths(root_path, filepath, mode='w', extensions=None, blacklist=None):
    def _save_filepath(index, filepath, file):
        print(str(filepath), file=file)
    with filepath.open(mode) as file:
        walk_path(root_path, file, extensions=extensions, blacklist=blacklist, fncall=_save_filepath)

def unlink_filepaths(root_path, extensions=None, blacklist=None):
    def _unlink_filepath(index, filepath):
        filepath.unlink(missing_ok=True)
    walk_path(root_path, extensions=extensions, blacklist=blacklist, fncall=_unlink_filepath)

def list_filepaths(root_path, extensions=None, blacklist=None):
    def _list_filepath(index, filepath, filepaths):
        filepaths.append(filepath)

    filepaths = []
    walk_path(root_path, filepaths, extensions=extensions, blacklist=blacklist, fncall=_list_filepath)
    return filepaths

def fs_type(mypath):
    bestMatch = ""
    fsType = ""
    for part in psutil.disk_partitions(all=True):
        print(part.mountpoint, part.fstype)
        if mypath.startswith(part.mountpoint) and len(bestMatch) < len(part.mountpoint):
            fsType = part.fstype
            bestMatch = part.mountpoint
    return fsType