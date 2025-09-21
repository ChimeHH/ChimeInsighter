import os
import sys
import multiprocessing
import subprocess
import time
import psutil
import re
import tempfile
import pathlib
import crypt

from itertools import repeat
from concurrent.futures import Executor,ProcessPoolExecutor,TimeoutError
from exlib.settings.osenv import appdata_path

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

JOHN_COMMAND = os.getenv("JOHN", default="/usr/local/john/john")

class LinuxIdentifierTimeout(Exception):
    pass


class LinuxIdentifier:
    def __init__(self, passwords_file=None, jobs=2, timeout=600, interval=5):
        self.TIMEOUT = timeout
        self.ALERT_LEFT = '[1-999] left'
        self.ALERT_CRACKED = '[1-999] password hash(:?es)? cracked'
        self.CHECK_INTERVAL = 5

        self.JOBS = multiprocessing.cpu_count()
        self.PASSWORDS_FILE = passwords_file if passwords_file else str( appdata_path() / "resource" / "credentials" / 'passwords' / 'passwords.list')

    def crack_password(self, file_path):
        log.info("Tries to word list with rules")
        results = self.execute_wordlist(file_path)
        if re.search(self.ALERT_LEFT, results.decode()):
            log.info(f'cant crack {str(results.decode())} from: {file_path}')
            results = self.execute_single_mode(file_path)
            if re.search(self.ALERT_LEFT, results.decode()):
                log.info(f'cant crack {str(results.decode())} from: {file_path}')
        cracked_password = self.get_cracked_password(results)
        log.info(f"Cracked password = {cracked_password}")

        return cracked_password

    def analyze(self, passwd_file, shadow_file):
        # Create temp file
        _, output_path = tempfile.mkstemp()

        # Fill the output file with password founded
        log.debug(f"unshadow {passwd_file} {shadow_file} => {output_path}")
        self.execute_unshadow(passwd_file, shadow_file, output_path)

        # Tries to word list with rules
        log.info("Tries to word list with rules")
        results = self.execute_wordlist(output_path)

        # If left password to crack
        if re.search(self.ALERT_LEFT, results.decode()):
            # Tries incremental mode
            log.info("Tries incremental attack")
            process = self.run_incremental_mode(output_path)
            timeout = time.time() + self.TIMEOUT

            # while left password to crack
            while re.search(self.ALERT_LEFT, results.decode()):
                time.sleep(self.CHECK_INTERVAL)
                # If timeout stop incremental mode
                if time.time() > timeout:
                    self.kill_process(process)
                    log.info("Time out stops cracking attempts")
                    break

                # Gets the results
                results = self.get_results(output_path)
                log.info(f"Meanwhile results = {str(results)}")
            # get any  cracked password if exist
            cracked_password = self.get_cracked_password(results)
            log.info(f"Cracked password = {cracked_password}")

        # If no hashes left collect the cracked password if has
        else:
            cracked_password = self.get_cracked_password(results)
            log.info(f"Cracked password = {cracked_password}")

        # Delete temp file
        # os.remove(output_path)

        return cracked_password

    def get_results(self, output_path):
        return subprocess.check_output(f'{JOHN_COMMAND} --show {output_path}', shell=True, stderr=subprocess.STDOUT)

    def run_incremental_mode(self, output_path):
        return subprocess.Popen(f'{JOHN_COMMAND} --incremental --fork={self.JOBS} {output_path}', shell=True)

    def execute_single_mode(self, output_path):
        subprocess.check_output(f'{JOHN_COMMAND} --fork={self.JOBS} {output_path}', shell=True, stderr=subprocess.STDOUT, timeout=300).decode()
        return self.get_results(output_path)

    def execute_wordlist(self, output_path):
        try:
            subprocess.check_output(f'{JOHN_COMMAND} --wordlist={self.PASSWORDS_FILE} --rules --fork={self.JOBS} {output_path}', shell=True,
                                    stderr=subprocess.STDOUT, timeout=300).decode()
        except subprocess.TimeoutExpired:
            raise LinuxIdentifierTimeout()

        return self.get_results(output_path)

    def execute_unshadow(self, passwd_file, shadow_file, output_path):
        with open(output_path, 'wb') as output_file:
            data = subprocess.check_output(['unshadow', passwd_file, shadow_file])
            print(f"writing to {output_path}, data={len(data)}")
            output_file.write(data)

    def kill_process(self, process):
        for child in psutil.Process(process.pid).children(recursive=True):  # or parent.children() for recursive=False
            child.kill()
        process.kill()

    def get_cracked_password(self, results):
        cracked_results = results.decode()
        log.debug(f"results:\n{cracked_results}")

        cracked_list = []
        if re.search(self.ALERT_CRACKED, cracked_results):
            cracked_split = cracked_results.split()
            for crack in cracked_split:
                cracked_password = crack.split(":")
                if len(cracked_password) > 2:
                    cracked_list.append((cracked_password[0], cracked_password[1]))
        return cracked_list

def crack_linux(passwd_file, shadow_file, jobs=2, timeout=600, interval=5):    
    if passwd_file and shadow_file:
        cracked_list = LinuxIdentifier(jobs=jobs, timeout=timeout, interval=interval).analyze(passwd_file, shadow_file)
        if cracked_list:
            return cracked_list

    return None


# def _crack_linux(args, **kwargs):
#     line, salt, password = args
#     if crypt.crypt(password, salt) in line:
#         log.info(f"cracked {line}")
#         return (line.strip(), password)

#     return None
# def crack_linux_solo(passwd_file, shadow_file):    

#     wordlist_file = str( appdata_path() / "resource" / "credentials" / 'passwords' / 'crackwords.list')

#     with open(wordlist_file, 'r', encoding='latin-1') as f:
#         wordlist = [ line.strip() for line in f.readlines() ]

#     with open(shadow_file, 'r') as f:
#         contents = f.readlines()

#     for line in contents:
#         try:
#             parts = line.split(':')
#             if len(parts[1]) < 3:
#                 continue
            
#             salt = parts[1][:parts[1].rfind("$")+1]
            
#             with ProcessPoolExecutor(max_workers=os.cpu_count()*2) as executor:    
#                 futures = executor.map(_crack_linux, zip(repeat(line), repeat(salt), wordlist), chunksize=20000)
#                 for i, future in enumerate(futures):
#                     if future:
#                         cracked_list.append(future)
#                         break

#         except TimeoutError:
#             log.info(f"timeout while cracking {line}")

#         except:
#             log.exception(f"failed to crack {line}")

#     return cracked_list



if __name__ == '__main__':
    cracked_list = crack_linux("/share/simple-test/john-test/passwd", "/share/simple-test/john-test/shadow") 
    print(cracked_list)
