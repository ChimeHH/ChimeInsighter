import os
import requests
import time
import json
import pathlib

from exlib.parsers.filemeta import guess_file_mime

from exlib.log.logger import MyLogger, exception_log
log = MyLogger.getLogger(__package__)


class MobSFScanner:
    ALLOWED_EXTENSIONS = {
        '.txt': 'text/plain',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.zip':  'application/zip',
        '.tar':  'application/x-tar',
        '.pcap': 'application/vnd.tcpdump.pcap',
        '.appx': 'application/vns.ms-appx',
        '.jar':  'application/java-archive',
        '.apk':  'application/octet-stream',
        '.apks': 'application/octet-stream',
        '.xapk': 'application/octet-stream',
        '.aab':  'application/octet-stream',
        '.ipa':  'application/octet-stream',
        '.aar':  'application/octet-stream',
        '.so':   'application/octet-stream',
        '.dylib':'application/octet-stream',
    }

    # =============ALLOWED MIMETYPES=================
    APK_MIME = [
        'application/vnd.android.package-archive',        
        'application/java-archive',
        'application/x-authorware-bin',
    ]
    IPA_MIME = [
        'application/iphone',
        'application/x-itunes-ipa',
        'application/x-ar',
        'text/vnd.a',
    ]
    APPX_MIME = [     
        'application/vns.ms-appx',     
    ]
    ZIP_MIME = [
        'application/zip',
        'application/octet-stream',
        'application/x-zip-compressed',
        'binary/octet-stream',
    ]

    def __init__(self):
        self.api_key = "2797b165fc4fa2dbe1b2762fae1ff62bba26747033f862008d1d729a232433a3"
        self.api_url = "http://msf:8000"

    @classmethod
    def trueFileName(cls, filepath):
        filepath = pathlib.Path(filepath)
        mime = guess_file_mime(filepath)
        filename = filepath.name
        ext = filepath.suffix

        for ext0 in cls.ALLOWED_EXTENSIONS:
            if ext0 in filename:
                return filename + ext0

        for ext0, mimes in zip(['apk', 'ipa', 'appx'], [cls.APK_MIME, cls.IPA_MIME, cls.APPX_MIME]):
            if mime != 'application/octet-stream' and mime in mimes:
                return filename + ext0

        if mime in cls.ZIP_MIME:
            return filename + '.zip'

        return filename
    
    def upload(self, filepath, mime=None, timeout=600):
        log.debug(f"Uploading file: {filepath}")
        headers = {'Authorization': self.api_key}

        try:
            with filepath.open('rb') as file:
                files = {'file': (self.trueFileName(filepath), file, 'application/octet-stream')}
                log.debug(f"uploading files: {files}")
                response = requests.post(f'{self.api_url}/api/v1/upload', files=files, headers=headers, timeout=timeout)

            if response.status_code != 200: 
                log.warning(f"Failed to scan {filepath}: {response.status_code}, Response: {response.text}")
                return None

            return json.loads(response.text)['hash']
        except Exception as e:
            log.exception(f"Failed to upload {filepath}: {e}")
            return None

    def scan(self, scan_id, timeout=600):
        log.debug(f"Scanning file: {scan_id}")
        headers = {'Authorization': self.api_key}
        try:
            response = requests.post(f'{self.api_url}/api/v1/scan', data={'hash': scan_id}, headers=headers, timeout=timeout)
            return json.loads(response.text)        
        except Exception as e:
            log.exception(f"Failed to scan {scan_id}: {e}")
            return None

    def report_json(self, scan_id, timeout=600):
        log.debug("Generate JSON report")

        try:
            headers = {'Authorization': self.api_key}
            response = requests.post(f'{self.api_url}/api/v1/report_json', data={"hash": scan_id}, headers=headers, timeout=timeout)
            if response.status_code != 200: 
                log.warning(f"Failed to generate JSON report for {scan_id}: {response.status_code}, Response: {response.text}")
                return None

            return json.loads(response.text)
        except Exception as e:
            log.exception(f"Failed to generate JSON report for {scan_id}: {e}")
            return None


    def delete(self, scan_id, timeout=600):
        """Delete Scan Result"""
        log.debug(f"Deleting scan: {scan_id}")

        try:
            headers = {'Authorization': self.api_key}
            response = requests.post(f'{self.api_url}/api/v1/delete_scan', data={"hash": scan_id}, headers=headers, timeout=timeout)
            if response.status_code != 200:  
                log.warning(f"Failed to delete scan {scan_id}: {response.status_code}, Response: {response.text}")  
                return None 
            return json.loads(response.text)

        except Exception as e:
            log.exception(f"Failed to delete scan {scan_id}: {e}")
            return None
    
    def search(self, scan_id, timeout=600): 
        log.debug(f"Searching scan: {scan_id}") 

        try:
            headers = {'Authorization': self.api_key}  
            response = requests.post(f'{self.api_url}/api/v1/search', headers=headers, data={"query": scan_id}, timeout=timeout)  
            if response.status_code != 200:  
                log.warning(f"Failed to search scan {scan_id}: {response.status_code}, Response: {response.text}")  
                return None  
            return json.loads(response.text)

        except Exception as e:
            log.exception(f"Failed to search scan {scan_id}: {e}")
            return None

    def recent_scans(self, timeout=600): 
        log.debug(f"List of recent scans") 

        try:
            headers = {'Authorization': self.api_key}  
            response = requests.get(f'{self.api_url}/api/v1/recent_scans/', headers=headers, timeout=timeout)  
            if response.status_code != 200:  
                log.warning(f"Failed to list recent scan: {response.status_code}, Response: {response.text}")  
                return None  
            return json.loads(response.text)

        except Exception as e:
            log.exception(f"Failed to list recent scan: {e}")
            return None

