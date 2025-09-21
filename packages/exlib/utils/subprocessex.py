import subprocess
import os
import traceback

def run_command(cmd_line, timeout=None, check=False, **kwargs):
    proc = subprocess.run(cmd_line, stderr=subprocess.STDOUT, shell=True, check=check, timeout=timeout, **kwargs)
    return proc


def check_output(cmd_line, timeout=None):
    # universal_newlines=True,
    output = subprocess.check_output(cmd_line, stderr=subprocess.STDOUT, shell=True,  timeout=timeout)
    return output

def check_returncode(cmd_line, capture_output=False, timeout=None):
    proc = subprocess.run(cmd_line, capture_output=capture_output, shell=True,  timeout=timeout)
    return proc.returncode, proc.stdout, proc.stderr



if __name__=="__main__":
    try:
        proc = run_command("xx -a", check=False) 
        print("returncode: {}".format(proc.returncode))
        print(proc.stdout)
        print(proc.stderr) 
    except:     
        traceback.print_exc()


    # returncode, stdout, stderr = check_returncode("ls -a", capture_output=False)
    # print("returncode: {}".format(returncode))
    # print(stdout)
    # print(stderr)