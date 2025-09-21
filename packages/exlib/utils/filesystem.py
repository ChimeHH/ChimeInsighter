import sys
import os
import os.path
import shutil
import stat
from .exceptions import DigitalTwinsOperationalError
import tarfile

ILLEGAL_FILENAME_CHARS = "/\\:*?\"<>|"


def _get_childs_from_folder(folder, is_file):
    """
       Returns the list of chils paths (folders/files) base on the parameter in the given folder

       :param folder: The folder to look the files in
       :param is_file: True if we search for files, False otherwise
       :return list of child paths
    """
    return [os.path.join(folder, the_file) for the_file in os.listdir(folder) if (is_file == os.path.isfile(os.path.join(folder, the_file)))]

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

def create_folder(root=".", folder=None):
    """
    Create directory.

    :param root: root path.
    :param folder: folder name to be created.
    :raise DigitalTwinsOperationalError: if fails to create folder.
    """
    if folder is None:
        folder = ""

    folder_path = os.path.join(root, folder)
    if not os.path.isdir(folder_path):
        try:
            os.makedirs(folder_path)
        except OSError as err:
            if not os.path.isdir(folder_path):
                raise DigitalTwinsOperationalError("Unable to create folder: {} with err {}".format(folder_path, err))

    return folder_path

def delete_folder(folder):
    """
    Delete a folder and all its subdirectories.

    :param folder: path to delete.
    :raise DigitalTwinsOperationalError: if fails to delete folder.
    """
    if not os.path.exists(folder):
        return

    try:
        shutil.rmtree(folder, onerror=_on_error_delete)
    except OSError as err:
        raise DigitalTwinsOperationalError("Unable to delete folder: {} with err {}".format(folder, err))

def delete_file(filepath):
    """
    Delete's a specific filepath, handles the errors
    :param filepath: The filepath to delete
    """
    if not os.path.exists(filepath):
        return

    try:
        os.remove(filepath)
    except OSError:
        _on_error_delete(os.remove, filepath, sys.exc_info())

def delete_content(path):
    """
    Deletes all the content of the folder in the path.

    :param path: path to delete.
    :raise DigitalTwinsOperationalError: if fails to delete folder.
    """
    if not os.path.exists(path):
        return

    try:
        for file_object in os.listdir(path):
            file_object_path = os.path.join(path, file_object)
            if os.path.isfile(file_object_path):
                delete_file(file_object_path)
            else:
                delete_folder(file_object_path)
    except OSError as err:
        raise DigitalTwinsOperationalError("Unable to delete folder: {} with err {}".format(path, err))

def safe_filename(filename):
    """
    Create a safe filename from the given filename
    :param filename: The filename string to handle
    :return: Safe filename string
    """
    return "".join(i for i in filename if i not in ILLEGAL_FILENAME_CHARS).rstrip()


def make_tarfile(filepath, source_dir, mode="w"):
    ''' raw: "w", compress: "w:gz" '''
    with tarfile.open(filepath, mode) as tar:
        tar.add(source_dir, arcname=os.path.basename(source_dir))