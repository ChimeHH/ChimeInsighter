import os
import sys
import base64
import json
import pathlib
import hashlib
import subprocess
import psutil
import uuid
import time
import re
import random
import itertools
from datetime import datetime, timedelta
from datetime import timezone
from typing import final

from exlib.settings import osenv
from exlib.utils.printers import *
from exlib.utils.cryptoex import PublicKey, InvalidSignature

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)   


__all__ = ['SignedLicense', 'LicenseException', 'ExpiredLicense', 'NoLicenseFound', 'MachineClockMismatch', 'WrongLicenseFingerprint', 'WrongSignatureException'] 

class LicenseException(Exception):
    pass


class ExpiredLicense(LicenseException):
    pass

class NoLicenseFound(LicenseException):
    pass

class MachineClockMismatch(LicenseException):
    pass


class WrongLicenseFingerprint(LicenseException):
    pass

class WrongSignatureException(LicenseException):
    pass


@final
class ServerFingerprint:    
    @classmethod
    def __method__(cls, other_fingerprints=None):        
        def _p0():
            # sudo dmidecode -t processor | grep ID
            command = "{} {}{} -{} {}".format('sudo', 'dmi', 'decode', 't', 'processor')
            command += ' | ' + 'grep' + ' ' + 'ID'
            cpu_ids = subprocess.check_output(command, shell=True).decode()
            cpu_id = cpu_ids.split('\n')[0].strip()
            return [cpu_id,] # hashlib.md5(cpu_id.encode()).hexdigest()

        def _p1():
            # lscpu |grep "Model name" | md5sum
            command = "{} {}{}".format('sudo', 'ls', 'cpu')
            command += ' | ' + 'grep' + ' '
            model = subprocess.check_output('{} "{} {}"'.format(command, 'Model', 'name'), shell=True).decode()
            
            return [model,]

        def _p2():
            # sudo fdisk -l |grep identifier | grep -v 0x90909090 | md5sum
            command = "{} {}{} -{}".format('sudo', 'f', 'disk', 'l')
            command += ' | ' + 'grep' + ' ' + 'identifier' + ' | ' + 'grep' + ' -v ' + '0x90909090'
            disk = subprocess.check_output(command, shell=True).decode()
            return [disk, ]    

        def _p3():
            # sudo dmidecode -t system | grep UUID
            command = "{} {}{}{} -{}".format('sudo', 'd', 'mi', 'decode', 't')
            command += ' system' + ' | ' + 'grep' + ' ' + 'UUID'
            dmi = subprocess.check_output(command, shell=True).decode()

            return [dmi, ]


        def _combinations(text, sep):            
            strings = [ s.strip() for s in text.split(sep) if s.strip() ]

            result = []
            n = len(strings)

            #生成所有长度 ≥1 的有序组合
            for r in range(n, 0, -1):  # 从长度x到n的组合，
                for combo in itertools.combinations(strings, r):
                    result.append(sep.join(combo))
            return result

        # def _p4():            
        #     # arp -a | grep ".0.1" | grep "172.", note, sometimes, docker don't use 172.1x.0.1 as the network
        #     try:
        #         command = "{} {} ".format('arp', '-a')     
        #         hwaddr = subprocess.check_output(command + ' | ' + 'grep' + ' -v ' + 'docker' + ' | ' + 'grep' + ' ' + '.0.1' + ' | ' + 'grep' + ' ' + '172.', shell=True).decode()
        #         return [hwaddr, ]
        #     except:
        #         return []

        all_fingers = [ f.strip().replace(' ', '') for f in ( _p0() + _p1() + _p2() + _p3() )]
        fingerprint_text = ';'.join(all_fingers)        
        fingerprint_comb = _combinations(fingerprint_text, ";")

        # print(f"fingerprint text: {fingerprint_text}")

        public_key = PublicKey()
        
        exception = None

        if other_fingerprints is None:
            import random
            fingerprint_real = ""

            for text in fingerprint_comb:
                salt = random.randint(1000, 9999)            
                fingerprint_md5 = subprocess.check_output('echo -n "{}:{}" | md5sum'.format(salt, text), shell=True).decode().strip(' -\r\n')
                fingerprint_real += "{:04d}{:04d}-".format(salt, int(fingerprint_md5, 16) % 9973)

            # 计算一个冗余的信息，只是给人看的
            fingerprint_marks = "-".join([subprocess.check_output('echo -n "{}:{}" | md5sum'.format('chimelab', finger), shell=True).decode().strip(' -\r\n') for finger in all_fingers])
            fingerprint_real += "{}".format(fingerprint_marks)
                        
            return fingerprint_real

        else:
            if not isinstance(other_fingerprints, list):
                other_fingerprints2 = str(other_fingerprints)
            else:
                other_fingerprints2 = ",".join([ str(other) for other in other_fingerprints])            
            other_fingerprints = re.split(r'[^\d]+', other_fingerprints2)

            for text in fingerprint_comb:
                for val in other_fingerprints:
                    fingerprint = str(val)
                    if len(fingerprint) != 8:
                        continue

                    salt = fingerprint[:4]
                    fingerprint_md5 = subprocess.check_output('echo -n "{}:{}" | md5sum'.format(salt, text), shell=True).decode().strip(' -\r\n')
                    fingerprint_real = "{:04d}".format(int(fingerprint_md5, 16) % 9973)

                    # print("fingerprint: {}, salt: {}, real: {}".format(fingerprint, salt, fingerprint_real))

                    if fingerprint_real in fingerprint:
                        return True
        
        return None

    @classmethod
    def check_fingerprint(cls, other_fingerprints):
        try:
            # allow any machines without checking fingerprints
            if not other_fingerprints:
                return True

            if cls.__method__(other_fingerprints) == True:
                return True
        except: 
            log.exception("failed")           
            pass

        raise WrongLicenseFingerprint()
    
    @classmethod
    def generate_fingerprint(cls):
        try:
            return cls.__method__()
        except:
            if getattr(sys.modules["__main__"], "__file__", "")=="fingerprints.py":
                log.exception("failed")
            pass

        raise LicenseException()

@final
class SignedLicense:
    TO_WHOM = 'to'
    FROM_DATE = 'from date'
    EXPIRY_DATE = 'expiry date'
    COMMENTS = 'comments'
    MAX_PACKAGES = 'max_packages'
    MAX_FILES = 'max_files'
    MAX_FILESIZE_MEGA = 'max_filesize_mg'
    TOTAL_UPLOADS_MEGA = 'total_uploads_mg'
    TOTAL_UPLOADS = 'total_uploads'
    TOTAL_PRODUCTS = 'total_products'    
    SCAN_SCOPE = 'scan_scope'
    UPLOAD_HASHES = 'upload_hashes'
    FINGERPRINT = 'fingerprint'
    SIGNATURE = 'signature'
    FEATURE = 'feature'
    DATETIME_FORMATTER = '%m/%d/%Y %z'
    
    def __init__(self, to_whom, from_date, expiry_date, comments, 
                max_filesize_mg=None, total_uploads=None, total_uploads_mg=None, 
                total_products=None, max_packages=None, max_files=None,                
                scan_scope=None, upload_hashes=None, 
                fingerprints=None, signature=None, feature=True):
        self.to_whom = to_whom
        self.from_date = from_date
        self.expiry_date = expiry_date
        self.comments = comments
        self.max_filesize_mg = max_filesize_mg
        self.total_uploads = total_uploads
        self.total_uploads_mg = total_uploads_mg
        self.total_products = total_products
        self.max_packages = max_packages
        self.max_files = max_files
        self.scan_scope = scan_scope
        self.upload_hashes = upload_hashes
        self.fingerprints = fingerprints
        self.signature = signature
        self.feature = feature
        
        # 并不需要。我们传入的，就会使utc时间。
        self.from_date = self.from_date.replace(tzinfo=timezone.utc)
        self.expiry_date = self.expiry_date.replace(tzinfo=timezone.utc)

        self.from_date_str = self.from_date.strftime(SignedLicense.DATETIME_FORMATTER)
        self.expiry_date_str = self.expiry_date.strftime(SignedLicense.DATETIME_FORMATTER)

    def encode_license(self):
        license_params = dict(to_whom=self.to_whom, from_date=self.from_date_str, expiry_date=self.expiry_date_str,                             
                            scan_scope=self.scan_scope, upload_hashes=self.upload_hashes,
                            fingerprints=self.fingerprints, comments=self.comments)

        if self.max_filesize_mg:
            license_params[self.TOTAL_UPLOADS_MEGA] = self.max_filesize_mg,
        if self.total_uploads:
            license_params[self.TOTAL_UPLOADS] = self.total_uploads,
        if self.total_uploads_mg:
            license_params[self.TOTAL_UPLOADS_MEGA] = self.total_uploads_mg
        if self.total_products:
            license_params[self.TOTAL_PRODUCTS] = self.total_products

        # sbom versions and files
        if self.max_packages:
            license_params[self.MAX_PACKAGES] = self.max_packages
        if self.max_files:
            license_params[self.MAX_FILES] = self.max_files
                
        return json.dumps(license_params, sort_keys=True).encode('utf-8')

    # def to_dict(self):
    #     return dict(to_whom=self.to_whom, from_date=self.from_date, expiry_date=self.expiry_date, 
    #                         max_filesize_mg=self.max_filesize_mg, total_uploads=self.total_uploads,
    #                         total_uploads_mg=self.total_uploads_mg, total_products=self.total_products,
    #                         max_packages=self.max_packages, max_files=self.max_files,                            
    #                         scan_scope=self.scan_scope, upload_hashes=self.upload_hashes,
    #                         server_id=self.fingerprints, comments=self.comments)
    

    @classmethod
    def load_license(cls, license_file_path=None):
        try:
            if not license_file_path:
                license_filepath = osenv.license_path()
            else:
                license_filepath = pathlib.Path(license_file_path)

            if license_filepath.exists():
                with license_filepath.open('r', encoding='utf-8') as license_file:
                    license_dict = json.loads(license_file.read())

                return cls._load_license_from_json(license_dict)
        except:
            raise

        # if not returned yet, raise not found
        raise NoLicenseFound()

    @classmethod
    def _load_license_from_json(cls, json_dict):
        public_key = PublicKey()

        to_whom = json_dict.get(SignedLicense.TO_WHOM, '')
        from_date_str = json_dict.get(SignedLicense.FROM_DATE, '')
        expiry_date_str = json_dict.get(SignedLicense.EXPIRY_DATE, '')
        comments = json_dict.get(SignedLicense.COMMENTS, None)
        max_filesize_mg = json_dict.get(SignedLicense.MAX_FILESIZE_MEGA, None)
        total_uploads = json_dict.get(SignedLicense.TOTAL_UPLOADS, None)
        total_uploads_mg = json_dict.get(SignedLicense.TOTAL_UPLOADS_MEGA, None)
        total_products = json_dict.get(SignedLicense.TOTAL_PRODUCTS, None)
        
        max_packages = json_dict.get(SignedLicense.MAX_PACKAGES, None)
        max_files = json_dict.get(SignedLicense.MAX_FILES, None)

        scan_scope = json_dict.get(SignedLicense.SCAN_SCOPE, None)
        upload_hashes = json_dict.get(SignedLicense.UPLOAD_HASHES, None)
        fingerprints = json_dict.get(SignedLicense.FINGERPRINT, None)
        signature = base64.b64decode(json_dict.get(SignedLicense.SIGNATURE, '').encode('utf-8'))
        feature = json_dict.get(SignedLicense.FEATURE, None)

        from_date = datetime.strptime(from_date_str, SignedLicense.DATETIME_FORMATTER)
        expiry_date = datetime.strptime(expiry_date_str, SignedLicense.DATETIME_FORMATTER)
        signed_license = cls(to_whom, from_date, expiry_date, comments, 
                            max_filesize_mg=max_filesize_mg, total_uploads=total_uploads, total_uploads_mg=total_uploads_mg, 
                            total_products=total_products, max_packages=max_packages, max_files=max_files,
                            scan_scope=scan_scope, upload_hashes=upload_hashes, 
                            fingerprints=fingerprints, signature=signature, feature=feature)
        try:
            public_key.validate_signature(signed_license.encode_license(), signature)
            # print('license signature validate success.')
        except InvalidSignature:
            raise WrongSignatureException()

        return signed_license
        
    def verify_fingerprint(self):
        try:
            return ServerFingerprint.check_fingerprint(self.fingerprints)       
        except:
            pass

        raise WrongLicenseFingerprint()

    def verify_not_expired(self):
        p = pathlib.Path("/data") / "mongo" / "db"            

        last_update = datetime.fromtimestamp(max(f.stat().st_mtime for f in p.iterdir()), tz=timezone.utc)
        time_now = datetime.now(tz=timezone.utc)

        # 当前时间小于文件时间，表示发现时间篡改行为; 增加 n 天的容错秒
        if time_now + timedelta(hours=24) < last_update:
            raise MachineClockMismatch()

        if self.expiry_date < time_now:
            raise ExpiredLicense()

    @staticmethod
    def get_server_id():
        try:
            return ServerFingerprint.generate_fingerprint()
        except:
            pass

        raise LicenseException()

        
