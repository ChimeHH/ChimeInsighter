import click
import pickle
import pathlib
import time
import psutil
import queue
import multiprocessing
import traceback
import tarfile
import magic
import shutil
import re
import json

from pprint import pprint

from exlib.utils.psutilex import wait_processes
from exlib.utils.subprocessex import run_command
from exlib.parsers import guess_file
from database.core.mongo_db import mongo_client
from sbom.runtime_calculator import RuntimeCalculator

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

@click.group()
def app():
    pass


@app.command(short_help='Aggregate scan results')
@click.argument('metadir', type=click.Path(path_type=pathlib.Path))
@click.option('-d', '--debug_level', type=click.INT, default=20, help='Debug level')
def aggregate(metadir, debug_level):
    verbose = True if debug_level <= 10 else False
    results = aggregate_results(metadir, verbose=verbose)

    dumpfile = metadir / "aggregate.pkl"
    with dumpfile.open('wb') as f:
        pickle.dump(results, f)

def aggregate_results(metadir, root='root', verbose=False):
    results = dict()
    pathes = dict()
    checksums = dict()

    for subdir in metadir.iterdir():
        try:
            pathname = subdir / 'pathname'
            info_pkl = subdir / 'info.pkl'
            if not pathname.is_file() or not info_pkl.is_file():
                continue
            
            with info_pkl.open('rb') as f1:
                filedata = pickle.load(f1)
                filedata['filepath_p'] = subdir.name
            with pathname.open('r') as f2:
                filepath = pathlib.Path(f2.readline())
                if subdir.name == root:
                    filepath_r = pathlib.Path(filepath.name)
                else:
                    filepath_r = pathlib.Path(filepath)

            metadata = filedata.get('metadata', {})
            if not metadata:
                continue

            hashes = metadata.get('hashes', {})
            if not hashes:
                continue

            checksum = hashes.get('sha256', None)
            if not checksum:
                continue # not a file, but a section of centain file
            
            if not verbose:
                filedata.pop("candicates", None)
                metadata.pop("strings", None)

            checksums[subdir.name] = checksum

            if checksum in results:
                results[checksum]['filepath_r'].append(filepath_r)
            else:            
                filedata['filepath_r'] = [filepath_r,]
                filedata['filepath'] = filepath
                results[checksum] = filedata
                
            pathes[subdir.name] = filepath
        except:
            log.exception(f"failed to aggregate {subdir}")
            continue
    
    for checksum, filedata in results.items():
        for i, filepath_r in enumerate(filedata['filepath_r']):            
            new_path = _flat_path(pathes, filepath_r) 
            filedata['filepath_r'][i] = new_path
            
        unpacked = filedata.get('unpacked_relative_files', filedata.get('extracted_files', None))
        if unpacked:
            for k in unpacked:
                unpacked[k] = checksums.get(unpacked[k].name, None)

    if not verbose:
        for checksum, filedata in results.items():
            for k in ('dynamic_symbols', 'section_names', 'sections', 'strings'):
                filedata.get('metadata', {}).pop(k, None)  

    for checksum, filedata in results.items():
        if "extracted_files" not in filedata or filedata.get('pruned'):
            continue

        components = filedata.get('components', [])
        names = []
        for c in components:            
            names.append(c.get('name', c.get('fullname')).split('@')[0])

        if names:
            _prune_components(results, names, filedata.get('extracted_files', {}))    

    return results

def _prune_components(results, names, extracted_files):
    for _, checksum in extracted_files.items():
        filedata = results.get(checksum, None)
        if not filedata:
            continue

        components = filedata.get('components', [])
        if not components:
            continue

        for c in components:
            name = c.get('name', c.get('fullname')).split('@')[0]
            if name in names:
                c['pruned'] = True

        if "extracted_files" in filedata:
            _prune_components(results, names, filedata.get('extracted_files', {}))
        if "unpacked_relative_files" in filedata:
            _prune_components(results, names, filedata.get('unpacked_relative_files', {}))

def _flat_path(pathes, path, root='root'):        
    _l = path.parts[0]
    _r = path.relative_to(_l)
    
    if str(_l) and str(_l) in pathes:
        if _r.parts[0] == 'rel':
            _r = _r.relative_to('rel')

        if str(_l) == root:
            return pathes[_l].name / _r

        return _flat_path(pathes, pathes[_l]) / _r
    return path




def convert_pickle2json(filepath_r):
    try:
        with filepath_r.open('rb') as fr:
            doc = pickle.load(fr)

        filepath2 = filepath_r.parent / (filepath_r.name + '.j')
        with filepath2.open('w') as fw:
            pprint(doc, stream=fw, indent=4)
    except:
        print("failed to decode pickle {}.".format(filepath_r))

@app.command(short_help='convert pickle to json')
@click.argument('input_path', type=click.Path(path_type=pathlib.Path))
@click.option('-d', '--debug_level', type=click.INT, default=20, help='Debug level')
def p2j(input_path, debug_level):
    if input_path.is_dir():
        for path in input_path.iterdir():
            if not path.is_dir():
                if path.is_file() and path.name.endswith('.pkl'):                    
                    convert_pickle2json(path)
                continue

            for filepath_r in path.iterdir():
                if filepath_r.is_file() and filepath_r.name.endswith('.pkl'):
                    convert_pickle2json(filepath_r)


def _parse_file(scan_queue):
    with mongo_client() as client:
        while True:
            try:
                path = scan_queue.get(timeout=5)
                if path == '__exit__':
                    break

                pkl_file = path / 'info.pkl'
                pathname_file = path / 'pathname'
                if not pkl_file.is_file() or not pathname_file.is_file():
                    continue

                with pkl_file.open('rb') as f:
                    filedata = pickle.load(f)
                with pathname_file.open('r') as f:
                    pathname = f.readline()

                metadata = filedata.get('metadata', {})
                if not metadata or 'hashes' not in metadata:
                    continue

                guess_file.guess(path.parent, pathname, filedata)
                
                with pkl_file.open('wb') as f:
                    pickle.dump(filedata, f)

            except queue.Empty:
                break

            except BrokenPipeError:
                break
                
            except KeyboardInterrupt:
                break

            except:
                log.exception(f"failed to parse {path}")
                pass


@app.command(short_help='parse scan results')
@click.argument('metadir', type=click.Path(path_type=pathlib.Path))
@click.option('-j', '--max_jobs', type=click.IntRange(1, 128), default=min(128, multiprocessing.cpu_count()*4), help='Number of max jobs running simultaneously')
@click.option('-d', '--debug_level', type=click.INT, default=20, help='Debug level')
def parse(metadir, max_jobs, debug_level):
    if not max_jobs:
        max_jobs = min(32, max(psutil.cpu_count()*3, 10))
    
    scan_queue = multiprocessing.Manager().Queue(maxsize=0)

    # create $max_jobs processes
    processes = [multiprocessing.Process(target=_parse_file, args=(scan_queue,)) for i in range(max_jobs)]
    for p in processes:
        p.start()

    total_count = 0
    for path in metadir.iterdir():
        if path.is_dir():
            total_count += 1
            scan_queue.put(path)

    # to ensure all jobs will receive at least one exit signal
    for i in range(max_jobs):
        scan_queue.put('__exit__')

    ret = wait_processes(scan_queue, processes, timeout=600)
    if ret != 0:
        log.warning(f"part of tasks failed, return code: {ret}")

def _calculate_virtual_components(filename, doc):
    results = []
    
    try:
        
        if filename.endswith('.json'):
            jdoc = json.loads(doc)

            components =jdoc.get('components', [])

            for line in components:
                cs = re.split(r'\s*,\s*', line)
                if len(cs) > 1:
                    results.append(dict(name=cs[0].lower(), version=cs[1]))

        else:
            lines = doc.split("\n")
            components_start = False
            for line in lines:
                line = line.strip()

                if line.startswith('components:'):
                    components_start = True
                    continue

                if not components_start:
                    continue

                if line.endswith(":"):
                    break

                cs = re.split(r'\s*,\s*', line)
                if len(cs) > 1:
                    results.append(dict(name=cs[0].lower(), version=cs[1]))

    except:
        log.exception(f"failed to calculate virtual components from {filename}")

    return results


def _calculate_file(scan_queue, virtualscan=True):
    with mongo_client() as client:
        while True:
            try:
                path = scan_queue.get(timeout=5)
                if path == '__exit__':
                    break

                pkl_file = path / 'info.pkl'
                pathname_file = path / 'pathname'
                if not pkl_file.is_file() or not pathname_file.is_file():
                    continue

                with pkl_file.open('rb') as f:
                    filedata = pickle.load(f)
                with pathname_file.open('r') as f:
                    filepath = pathlib.Path(f.readline())

                # .so might be extracted out .debug files. However, those files shall be ignored
                if filepath.name.endswith((".debug", ".gnu_debugdata", )):
                    log.debug(f"ignored {filepath}: extracted .debug")
                    continue

                log.debug(f"calculating {filepath}, {filepath}")

                metadata = filedata.get('metadata', {})
                filetype = metadata.get('type', None)
                filemime = filedata.get('filemime', "")

                # log.debug(f"reset previous result before calculating {path}")
                filedata.pop('total_score', None)
                filedata.pop('candicates', None)
                filedata.pop('components', None)
                filedata.pop('oss_percent', None)

                if filetype == 'linux':
                    filedata['components'] = [{ 'name': "linux",  "checksum": metadata['hashes']['sha256'], "version": metadata.get('version', "unknown"), 
                                                "mrule_precision": metadata.get('mrule_precision', 0), "promote_strings": metadata.get('promote_strings', []),}, ]

                elif filetype == 'androidimage':
                    filedata['components'] = [{ "name": "android", "checksum": metadata['hashes']['sha256'], "version": metadata.get('version', "unknown"), }, ]

                elif virtualscan and filepath.name.endswith((".json", ".txt")):
                    with (path.parent / filepath).open('r', encoding='utf-8', errors='ignore') as f:
                        if not f.readline().startswith("#virtual scan#"):
                            continue
                        doc = f.read()

                    filedata['components'] = _calculate_virtual_components(filepath.name, doc)

                else:
                    metadata_list = []

                    if filetype in ('shared', 'executable', 'kernelmod', 'pe'):
                        lang = metadata.get('lang', None)
                        if not metadata or 'hashes' not in metadata:
                            log.debug(f"ignored {filepath}: missing metadata or hashes")
                            continue

                        metadata_list.append(metadata) 

                    if metadata_list:
                        calculator = RuntimeCalculator(client)
                        oss_percent, total_score, candicates, components = calculator.calculate(filepath, *metadata_list)                                        
                        if candicates:
                            filedata['oss_percent'] = oss_percent
                            filedata['total_score'] = total_score
                            filedata['candicates'] = candicates

                        if components:
                            filedata['components'] = components

                with pkl_file.open('wb') as f:
                    pickle.dump(filedata, f)

            except BrokenPipeError:
                break
            except KeyboardInterrupt:
                break

            except queue.Empty:
                break

            except:
                log.exception(f"failed to calculate file {path}")
                pass

@app.command(short_help='calculate extracted files components results')
@click.argument('metadir', type=click.Path(path_type=pathlib.Path))
@click.option('-j', '--max_jobs', type=click.IntRange(1, 64), default=min(64, multiprocessing.cpu_count()), help='Number of max jobs running simultaneously')
@click.option('-v', '--virtualscan', is_flag=True, default=True, help='flag to active virtual scan')
@click.option('-d', '--debug_level', type=click.INT, default=20, help='Debug level')
def files(metadir, max_jobs, virtualscan, debug_level):    
    if not max_jobs:
        max_jobs = min(32, max(psutil.cpu_count()*3, 10))

    scan_queue = multiprocessing.Manager().Queue(maxsize=0)

    # create $max_jobs processes
    processes = [ multiprocessing.Process(target=_calculate_file, args = (scan_queue, ), kwargs = {"virtualscan": virtualscan} ) for i in range(max_jobs)]
    for p in processes:
        p.start()

    total_count = 0
    for path in metadir.iterdir():
        if path.is_dir():
            total_count += 1
            scan_queue.put(path)

    # to ensure all jobs will receive at least one exit signal
    for i in range(max_jobs):
        scan_queue.put('__exit__')

    ret = wait_processes(scan_queue, processes, timeout=1800)
    if ret != 0:
        log.warning(f"part of tasks failed, return code: {ret}")

def _calculate_archive(scan_queue):
    with mongo_client() as client:
        while True:
            try:
                path = scan_queue.get(timeout=5)
                if path == '__exit__':
                    break

                pkl_file = path / 'info.pkl'
                pathname_file = path / 'pathname'
                if not pkl_file.is_file() or not pathname_file.is_file():
                    continue

                with pkl_file.open('rb') as f:
                    filedata = pickle.load(f)

                if ('unpacked_relative_files' not in filedata) and ('extracted_files' not in filedata):
                    continue

                with pathname_file.open('r') as f:
                    filepath = pathlib.Path(f.readline())

                # .so might be extracted out .debug files. However, those files shall be ignored
                if filepath.name.endswith((".debug", ".gnu_debugdata", )):
                    log.debug(f"ignored {filepath}: extracted .debug")
                    continue

                log.debug(f"calculating {filepath}, {filepath}")

                metadata = filedata.get('metadata', {})
                filetype = metadata.get('type', None)
                
                file_list = filedata.get('unpacked_relative_files', [])
                if not file_list:
                    file_list = filedata.get('extracted_files', [])

                if not file_list:
                    continue

                ignore_components = []
                metadata_list = []

                for k, p in file_list.items():
                    try:
                        sub_file = path.parent / p.name / 'info.pkl' 
                        if not sub_file.is_file():
                            log.warning(f"Ignored {k} - {p}: missing info.pkl")
                            continue

                        with sub_file.open('rb') as f:
                            sub_data = pickle.load(f)

                            filemime = sub_data.get('filemime', '')
                            if any( x in filemime for x in ('text/xml','openxmlformats', 'officedocument') ):
                                continue

                            sub_components = sub_data.get('components', {})
                            if sub_components:
                                log.debug(f"ignored {sub_file.parent}: components already identified")
                                continue

                            sub_meta = sub_data.get('metadata', {})
                            
                            if not sub_meta or 'hashes' not in sub_meta:
                                log.debug(f"ignored {sub_file.parent}: missing metadata or hashes")
                                continue
                            metadata_list.append(sub_meta)
                    except:
                        log.exception(f"failed to process {k} - {p}")
                        continue

                if metadata_list:
                    calculator = RuntimeCalculator(client)
                    oss_percent, total_score, candicates, components = calculator.calculate(filepath, *metadata_list)                                        
                    if candicates:
                        filedata['oss_percent'] = oss_percent
                        filedata['total_score'] = total_score
                        filedata['candicates'] = candicates
                    
                    # make sure we do merging components instead of replacing, because some packed files has already been calculated in files stage
                    if components:                    
                        filedata.setdefault('components', [])
                        filedata['components'].extend(components)

                with pkl_file.open('wb') as f:
                    pickle.dump(filedata, f)

            except queue.Empty:
                break

            except BrokenPipeError:
                break

            except KeyboardInterrupt:
                break

            except:
                log.exception(f"failed to calculate archive {path}")
                pass

@app.command(short_help='calculate archived files components results')
@click.argument('metadir', type=click.Path(path_type=pathlib.Path))
@click.option('-j', '--max_jobs', type=click.IntRange(1, 64), default=min(64, multiprocessing.cpu_count()), help='Number of max jobs running simultaneously')
@click.option('-d', '--debug_level', type=click.INT, default=20, help='Debug level')
def archives(metadir, max_jobs, debug_level):
    if not max_jobs:
        max_jobs = min(32, max(psutil.cpu_count()*3, 10))

    scan_queue = multiprocessing.Manager().Queue(maxsize=0)

    # create $max_jobs processes
    processes = [ multiprocessing.Process(target=_calculate_archive, args = (scan_queue, )) for i in range(max_jobs)]
    for p in processes:
        p.start()

    total_count = 0
    for path in metadir.iterdir():
        if path.is_dir():
            total_count += 1
            scan_queue.put(path)

    # to ensure all jobs will receive at least one exit signal
    for i in range(max_jobs):
        scan_queue.put('__exit__')

    ret = wait_processes(scan_queue, processes, timeout=1800)
    if ret != 0:
        log.warning(f"part of tasks failed, return code: {ret}")


@app.command(short_help='pre-scan')
@click.argument('filepath', type=click.Path(path_type=pathlib.Path))
@click.option('-o', '--outfilepath', type=click.Path(path_type=pathlib.Path))
@click.option('-d', '--debug_level', type=click.INT, default=20, help='Debug level')
def prescan(filepath, outfilepath, debug_level):    
    tmpoutput = pathlib.Path('/tmp') / f"{filepath.name}_"
    if not outfilepath:
        outfilepath = filepath.parent / f"{filepath.name}_"

    shutil.rmtree(tmpoutput, ignore_errors=True)
    shutil.rmtree(outfilepath, ignore_errors=True)

    try:
        if filepath.is_file():
            mime = magic.from_file(str(filepath), mime=False)
            if "PE32 executable (GUI)" in mime:
                command = '7z x "{}" -o"{}" -y'.format(filepath, tmpoutput)
                log.debug(f"running command: {command}")
                p = run_command(command)
                if p.returncode < 0:
                    log.error(f"failed to extract: {filepath}, {mime}")
                    return -1

                with tarfile.open(str(outfilepath), "w") as tar:
                    tar.add(tmpoutput, arcname="_")

                log.debug(f"archived {outfilepath}, and returns 1")
                return 1

        if filepath.is_dir():                        
            with tarfile.open(str(outfilepath), "w") as tar:
                tar.add(filepath, arcname="_")

            log.debug(f"archived {outfilepath}, and returns 1")
            return 1

        return 0
    finally:
        if tmpoutput:
            shutil.rmtree(tmpoutput, ignore_errors=True)





if __name__=="__main__":
    app()


'''
python -m bang.cli scan -u xxx xxx.zip
python -m services.bast.bang parse xxx
python -m services.bast.bang aggregate xxx
python -m services.bast.bang p2j xxx


'''