import os
import traceback

class PathSearch(object):
    def __init__(self): 
        pass

    @classmethod
    def PathContains(cls, filepath, keynames):
        if isinstance(keynames, str):
            if keynames in filepath:
                return keynames
        elif isinstance(keynames, list):
            for keyname in keynames:
                if keyname in filepath:
                    return keyname
        return None


    @classmethod
    def ListPath(cls, root_dir, blacklist=None):
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
                    names.extend(cls.ListPath(fullpath))
            return names
        except:
            traceback.print_exc()

    @classmethod
    def ListFile(cls, root_dir, filter=None, blacklist=None):
        ''' Note, we don't check sub-folders. Refer to ListPath for that purpose. '''
        if not os.path.exists(root_dir) or not os.path.isdir(root_dir):
            return []

        names = list()
        try:
            filenames = os.listdir(root_dir)
            for filename in filenames:
                fullname = os.path.join(root_dir, filename)
                if blacklist and filename.startswith(blacklist):
                    continue
                if not os.path.isfile(fullname):
                    continue
                if(not filter or fullname.endswith(filter)):
                    names.append(fullname)
            return names
        except:
            traceback.print_exc()
    
    @classmethod
    def AllFiles(cls, root_path, filter=None):
        files = []
        for path in cls.ListPath(root_path):
            files += cls.ListFile(path, filter=filter)
        return files


def search_files(root, blacklist=(".", ), ignore_symlink=True):
    for filepath in root.iterdir():                
        if ignore_symlink and filepath.is_symlink():
            continue
            
        if filepath.name.startswith(blacklist):
            continue

        if filepath.is_dir():
            for p in search_files(filepath, blacklist=blacklist):
                yield p

        elif filepath.is_file():
            yield filepath