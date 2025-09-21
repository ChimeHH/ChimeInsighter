import hashlib
import pymongo
import argparse
import os
import json
import addict
import subprocess
from .config import MongoConfig
from contextlib import contextmanager
from pymongo import ASCENDING, DESCENDING
from exlib.settings import osenv

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class UnauthorizedDataError(Exception):
    pass

class MongoCliException(Exception):
    pass
class OSCliException(Exception):
    pass

@contextmanager
def mongo_client(group=None, instance=None):
    config = MongoConfig(group)

    client = MongoDB._mongo_client(config.credential(instance))    
    try:
        yield client
    finally:
        client.close()

class MongoDB:
    def __init__(self, db_name=None, col_name=None, group=None, instance=None):
        self._db_name = db_name
        self._col_name = col_name   
        self.db_client = None
        
        config = MongoConfig(group)

        self.db_client = self._mongo_client(config.credential(instance))
        
    def __enter__(self):
        return self

    def __exit__(self, exception_type, exception_value, traceback):        
        self.close()

    def close(self):
        if self.db_client:
            self.db_client.close()
        self.db_client = None

    
    @classmethod
    def _mongo_client(cls, credential=None):  
        if not credential:            
            return pymongo.MongoClient()
        else:
            return pymongo.MongoClient(host=credential.host, port=credential.port, username=credential.username, password=credential.password, 
                                        authSource=credential.auth_database, authMechanism=credential.auth_mechanism)

    def database(self, db_name=None):        
        if db_name:
            self._db_name = db_name

        if self._db_name:
            return self.db_client[self._db_name]
        else:
            return None

    def collection(self, col_name=None, db_name=None):
        if db_name:
            self._db_name = db_name
        if col_name:
            self._col_name = col_name

        if self._db_name and self._col_name:
            return self.db_client[self._db_name][self._col_name]

    def has_database(self, db_name):        
        if db_name in self.db_client.list_db_names():
            return True
        return False


    @classmethod
    def credential_parameters(cls, credential):    
        return ['--username', '\"{}\"'.format(credential.username),
                '--password', '\"{}\"'.format(credential.password),
                '--authenticationDatabase', '\"{}\"'.format(credential.auth_database),
                '--authenticationMechanism', '\"{}\"'.format(credential.auth_mechanism)]

    @classmethod
    def mongo_dump(cls, db_name, path_to_export, group=None, instance=None):
        mongo_dump_app = 'mongodump'
        
        config = MongoConfig(group)
        credential = config.credential(instance)

        host = credential.host
        port = credential.port

        parameters = [mongo_dump_app, '--host', host, '--port', str(port), '-d', db_name, '--out', path_to_export]
        
        credential_params = cls.credential_parameters(credential)
        parameters.extend(credential_params)

        # The shell parameter set to false because it causes errors in linux distributions
        mongo_instruction_script = f'{mongo_dump_app} --host {host} --port {str(port)} -d {db_name} --out {path_to_export}'
        mongo_lock = f'mongosh {db_name} --host {host} --port {str(port)} --eval "printjson(db.fsyncLock())"'
        mongo_unlock = f'mongosh {db_name} --host {host} --port {str(port)} --eval "printjson(db.fsyncUnlock())"'

        if credential_params is not None:
            credential_params_str = ' '.join(credential_params)
            mongo_lock = f'{mongo_lock} {credential_params_str}'
            mongo_instruction_script = f'{mongo_instruction_script} {credential_params_str}'
            mongo_unlock = f'{mongo_unlock} {credential_params_str}'

        database_dump_instruction = f'{mongo_lock}; {mongo_instruction_script}; {mongo_unlock};'
        process_ret_code = subprocess.call(['sh', '-c', database_dump_instruction])
        if process_ret_code != 0:
            # Check if its because the application is not properly installed
            try:
                if not osenv.has_app(mongo_dump_app):
                    raise MongoCliException('{} is not properly installed'.format(mongo_dump_app))
            except OSCliException:
                pass
            raise MongoCliException('failed to dump db with error code: {}'.format(str(process_ret_code)))

    @classmethod
    def mongo_restore(cls, root_path_of_db, to_db_name, group=None, instance=None):    
        mongo_restore_app = 'mongorestore'
        db_name = None
        paths = [path for path in os.listdir(root_path_of_db)]
        if len(paths) != 1:
            raise MongoCliException('Invalid Structure of the root path to the db to restore')

        full_path = os.path.join(root_path_of_db, paths[0])
        if os.path.isdir(full_path):
            db_name = os.path.basename(full_path)

        config = MongoConfig(group)
        credential = config.credential(instance)

        host = credential.host
        port = credential.port

        parameters = [mongo_restore_app, '--host', host, '--port', str(port), '--nsFrom', '\"{}.*\"'.format(db_name), '--nsTo', '\"{}.*\"'.format(to_db_name)]

        # Set the needed credential
        parameters.extend(cls.credential_parameters(credential))

        # Append the root path of the db
        parameters.append(root_path_of_db)

        # The shell parameter set to false because it causes errors in linux distributions
        process = subprocess.Popen(parameters, shell=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        process.wait()
        if process.returncode != 0:
            # Check if its because the application is not properly installed
            try:
                if not osenv.has_app(mongo_restore_app):
                    raise MongoCliException(' the {} is not properly installed'.format(mongo_restore_app))
            except OSCliException:
                pass
            raise MongoCliException('failed to restore db with error code: {}'.format(str(process.returncode)))

    @classmethod
    def import_collection(cls, file_path, db_name, col_name, group=None, instance=None, is_csv=False, with_drop=False):
        mongo_import_app = 'mongoimport'
        parameters = [mongo_import_app]
        if is_csv:
            parameters.extend(['--type', 'csv'])
        
        config = MongoConfig(group)
        credential = config.credential(instance)

        host = credential.host
        port = credential.port

        parameters.extend(['--host', host, '--port', str(port), '--db', db_name, '--collection', col_name])
        if is_csv:
            parameters.append('--headerline')

        if with_drop:
            parameters.append('--drop')

        # Set the needed credential
        parameters.extend(cls.credential_parameters(credential))

        # Add the source file
        parameters.extend(['--file', file_path])
        process = subprocess.Popen(parameters, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = process.communicate()
        if process.returncode != 0:
            # Check if its because the application is not properly installed
            try:
                if not osenv.has_app(mongo_import_app):
                    raise MongoCliException(' the {} is not properly installed'.format(mongo_import_app))
            except OSCliException:
                pass
            raise MongoCliException(f'failed to import collection with {err}\n'
                                   f'Error code: {str(process.returncode)}\n'
                                   f'Command line - {" ".join(parameters)}')

    @classmethod
    def export_collection(cls, json_dest_path, db_name, col_name, group=None, instance=None, csv_fields=None):
        mongo_export_app = 'mongoexport'
        parameters = [mongo_export_app]
        if csv_fields:
            parameters.extend(['--type', 'csv', f'--fields={",".join(csv_fields)}'])
        
        config = MongoConfig(group)
        credential = config.credential(instance)
        
        host = credential.host
        port = credential.port

        parameters.extend(['--host', host, '--port', str(port), '--db', db_name, '--collection', col_name])

        # Set the needed credential
        parameters.extend(cls.credential_parameters(credential))

        parameters.extend(['--out', json_dest_path])
        process = subprocess.Popen(parameters, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        process.wait()
        if process.returncode != 0:
            # Check if its because the application is not properly installed
            try:
                if not osenv.has_app(mongo_export_app):
                    raise MongoCliException(' the {} is not properly installed'.format(mongo_export_app))
            except OSCliException:
                pass
            raise MongoCliException('failed to export collection with error code: {}'.format(str(process.returncode)))