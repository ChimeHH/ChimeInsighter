import subprocess

import pathlib
import pickle

from exlib.settings import osenv

from exlib.concurrent.context import WorkerResult

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)  


def prescan(context, debug=0, **kwargs):
    try:      
        verbose_line = f"--debug_level {debug}" if debug else ""  
        outfilepath = context.filepath.parent / f"{context.filepath.name}_"
        command = f'python -m services.bast.bang prescan {verbose_line} "{context.filepath}" -o "{outfilepath}"'
        log.debug(command)
        p = subprocess.run(command, shell=True, check=True, capture_output=False)
    except Exception as e:
        errstr = f"bast failed to scan {context.version_id}: {context.filepath}, reason: {e}"
        log.exception(errstr)
        return -1

    if p.returncode < 0:
        log.debug(f"returncode: {p.returncode}, {p.stdout}, {p.stderr}")
        
    if outfilepath.is_file():
        context.filepath = outfilepath

    return 0

def scan(context, debug=0, jobs=0, job_wait=0, **kwargs):
    try:        
        verbose_line = f"--debug_level {debug}" if debug else ""
        max_jobs = f"--jobs {jobs}" if jobs>1 else ""
        job_wait_time = f"--job-wait-time {job_wait}" if job_wait>1 else ""

        command = f'python -m bang.cli scan {verbose_line} -f {max_jobs} {job_wait_time} -u "{context.version_path}" "{context.filepath}"'
        log.debug(command)
        p = subprocess.run(command, shell=True, check=True, capture_output=False)        
    except Exception as e:
        errstr = f"bast failed to scan {context.version_id}: {context.filepath}, reason: {e}"
        log.exception(errstr)
        return -1

    if p.returncode < 0:
        log.debug(f"returncode: {p.returncode}, {p.stdout}, {p.stderr}")
    return 0

def parse(context, debug=0, jobs=0, **kwargs):
    max_jobs = jobs if jobs else context.max_jobs

    try:        
        verbose_line = f"--debug_level {debug}" if debug else ""
        command = f'python -m services.bast.bang parse {verbose_line} -j {max_jobs} "{context.version_path}"'
        log.debug(command)
        p = subprocess.run(command, shell=True, check=True, capture_output=False)
    except Exception as e:
        errstr = f"bast failed to parse {context.version_id}, reason: {e}"
        log.exception(errstr)
        return -1

    if p.returncode < 0:
        log.debug(f"returncode: {p.returncode}, {p.stdout}, {p.stderr}")
    return 0

def files(context, debug=0, jobs=0, **kwargs):
    max_jobs = jobs if jobs else context.max_jobs

    if not context.scan_options.is_scan_enabled('sbom', True):
        log.debug(f"ignored sbom analysis because scan options does not contain sbom")
        return 0
    
    try:        
        verbose_line = f"--debug_level {debug}" if debug else ""
        command = f'python -m services.bast.bang files {verbose_line} -j {max_jobs} "{context.version_path}"'
        log.debug(command)
        p = subprocess.run(command, shell=True, check=True, capture_output=False)
    except Exception as e:
        errstr = f"bast failed to calculate {context.version_id}, reason: {e}"
        log.exception(errstr)
        return -1

    if p.returncode < 0:
        log.debug(f"returncode: {p.returncode}, {p.stdout}, {p.stderr}")
    return 0

def archives(context, debug=0, jobs=0, **kwargs):
    max_jobs = jobs if jobs else context.max_jobs

    if not context.scan_options.is_scan_enabled('sbom', True):
        log.debug(f"ignored sbom analysis because scan options does not contain sbom")
        return 0
    
    try:           
        verbose_line = f"--debug_level {debug}" if debug else ""     
        command = f'python -m services.bast.bang archives {verbose_line} -j {max_jobs} "{context.version_path}"'
        log.debug(command)
        p = subprocess.run(command, shell=True, check=True, capture_output=False)
    except Exception as e:
        errstr = f"bast failed to calculate {context.version_id}, reason: {e}"
        log.exception(errstr)
        return -1

    if p.returncode < 0:
        log.debug(f"returncode: {p.returncode}, {p.stdout}, {p.stderr}")
    return 0

def aggregate(context, debug=0, **kwargs):    
    try:
        verbose_line = f"--debug_level {debug}" if debug else ""
        command = f'python -m services.bast.bang aggregate {verbose_line} "{context.version_path}"'
        log.debug(command)
        p = subprocess.run(command, shell=True, check=True, capture_output=False)

        result = {'files': ['aggregate.pkl']}
        return WorkerResult(context, result)

    except Exception as e:
        errstr = f"bast failed to aggregate {context.version_id}, reason: {e}"
        log.exception(errstr)
        return -1

    if p.returncode < 0:
        log.debug(f"returncode: {p.returncode}, {p.stdout}, {p.stderr}")
    return 0


def p2j(context, debug=0, **kwargs):
    try:       
        verbose_line = f"--debug_level {debug}" if debug else "" 
        command = f'python -m services.bast.bang p2j {verbose_line} "{context.version_path}"'
        log.debug(command)
        p = subprocess.run(command, shell=True, check=True, capture_output=False)
    except Exception as e:
        errstr = f"bast failed to p2j {context.version_path}, reason: {e}"
        log.exception(errstr)
        return -1

    if p.returncode < 0:
        log.debug(f"returncode: {p.returncode}, {p.stdout}, {p.stderr}")
    return 0



if __name__ == "__main__":
    import click
    import addict

    from pprint import pp
    
    @click.group()
    def app():
        pass

    @app.command(short_help='test scan command')
    @click.argument('operation', type=click.Choice(["prescan", "scan", "parse", "calculate", "aggregate", "p2j", ]))
    @click.argument('version_id', type=click.STRING)
    @click.option('-i', '--filepath', type=click.STRING)
    @click.option('-p', '--priority', type=click.Choice([0, 1, 2]), default=1, help='priority') 
    def test(operation, version_id, filepath, priority):
        context = addict.Addict()        
        context.version_id = version_id
        context.filepath = filepath
        context.version_path = '/share/simple-test/output/{}'.format(version_id)
        context.priority = priority

        eval(operation)(context)

    app()

