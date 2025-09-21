import click
import pickle
import pathlib
import psutil
import traceback
import tarfile
import os
import sys
import magic
import shutil
import yara
import re
import time
import queue
import multiprocessing
from datetime import datetime


from pprint import pprint
from exlib.utils.pathsearch import PathSearch
from exlib.utils.psutilex import wait_processes

from exlib.settings import osenv

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)
log.setProcessName('infoleak-cli')


INFOLEAK_RES_PATH = osenv.appdata_path() / "resource" / "infoleaks"

@click.group()
def app():
    pass
        
@app.command(short_help='index infoleak rules')
@click.argument('input_path', type=click.Path(path_type=pathlib.Path, exists=True), default=pathlib.Path("/share/digitaltwins-3.04lts/yara/infoleaks/"))
@click.option('-o', '--output_path', type=click.Path(path_type=pathlib.Path, exists=False), help='output index')
def index(input_path, output_path):
    if not output_path:
        output_path = INFOLEAK_RES_PATH
        output_path.mkdir(exist_ok=True, parents=True)

    with (output_path / "index.yar").open('w') as fo:
        print("/*\nGenerated at: {}\n*/\n".format(datetime.utcnow()), file=fo)

        all_files = PathSearch.AllFiles(input_path, filter=('.yar', '.yara'))
        for filepath in all_files:                    
            print("include \"{}\"".format(filepath), file=fo)
    

@app.command(short_help='compile infoleak rules')
@click.option('-i', '--input_path', type=click.Path(path_type=pathlib.Path, exists=True), help='input index')
@click.option('-o', '--output_path', type=click.Path(path_type=pathlib.Path, exists=False), help='output rules')
@click.option('--test_compile', '-t', is_flag=True, help="test compiling rules.")
def compile(input_path, output_path, test_compile):
    if test_compile:
        if input_path and input_path.is_file():
            yara.compile(str(input_path), includes=True)
        else:
            data_path = INFOLEAK_RES_PATH
            for filepath in data_path.iterdir():
                if filepath.name == "index.yar" or not filepath.name.endswith(('.yar', '.yara')):
                    continue
                try:
                    yara.compile(str(filepath), includes=True)
                except Exception as e:
                    print(f"{filepath.name}: {e}")

        return

    if not input_path:
        input_path = INFOLEAK_RES_PATH / "index.yar"

    if not output_path:
        output_path = INFOLEAK_RES_PATH / "rules.dat"
        output_path.parent.mkdir(exist_ok=True, parents=True)

    rules = yara.compile(str(input_path), includes=True)
    rules.save(str(output_path))


 



if __name__=="__main__":
    app()