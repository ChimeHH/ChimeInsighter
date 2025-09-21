import os
import re
import math
import copy
import json

import decimal
import pathlib

from exlib.classes.base import BaseClass
from database.core.mongo_db import mongo_client
from database.sbom_database import DatabaseSbom, TableSbomTokens, TableSbomFiles, TableSbomPackages, TableSbomPackagesSummary

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


class Criteria:
    def __init__(self, calc, component_name):
        name = component_name.split('@')[0]
        criterias = calc._config.get("criterias", [])

        self._criteria = {}
        for criteria in criterias:
            components = criteria.get('components')
            
            # find a default or the name in the list
            if not components or name in components:
                self._criteria = criteria
                break

    @property
    def _thresholds(self):
        return self._criteria.get('thresholds', {})
    @property
    def _scale_percent_minimum(self):
        return self._criteria.get('scale_percent_minimum', 0.2)
    @property
    def _real_score_minimum(self):
        return self._criteria.get('real_score_minimum', 0.3)
    @property
    def _scale_percent_threshold(self):
        return self._criteria.get('scale_percent_threshold', 0.2)
    @property
    def _clone_percent_threshold(self):
        return self._criteria.get('clone_percent_threshold', 0.7)
    @property
    def _file_tokens_percent_threshold(self):
        return self._criteria.get('file_tokens_percent_threshold', 0.5)

class Calculator(BaseClass):
    MINIMUM_STRING_THRESHOLD = 0.4 # smaller precision, higher threshold
    def __init__(self, db_client, config_file=pathlib.Path(__file__).parent / "config.json"):
        super().__init__()
        
        with config_file.open("r") as f:
            self._config = json.load(f)

        self.tableTokens = TableSbomTokens(db_client)
        self.tableFiles = TableSbomFiles(db_client)
        self.tablePackages =TableSbomPackages(db_client)  
        self.tableSummary =TableSbomPackagesSummary(db_client)

        decimal.getcontext().prec = 48 # 160bits??? 39dec == 128bits

    @property
    def _alpha_t(self):
        return self._config.get('alpha1', 3.14159)
    @property
    def _alpha_f(self):
        return self._config.get('alpha2', 3.14159)
    @property
    def _precision(self):
        return self._config.get('precision', 0.6)
    @property
    def _minimum_score(self):
        return self._config.get('minimum_score', 100)
    @property
    def _use_high_version(self):
        return self._config.get('use_high_version', True)    
    @property
    def _oss_percent_n(self):
        return self._config.get('oss_percent_n', 1.2)
    @property
    def _oss_percent_factor(self):
        return self._config.get('oss_percent_factor', 0.6)
    @property
    def _include_uno_files(self):
        return self._config.get('include_uno_files', False)


    def get_criteria(self, component_name):
        return Criteria(self, component_name)

    @staticmethod
    def decimal_score(score):
        if not score:
            score = {}
        return { k: decimal.Decimal(v) for k, v in score.items() }

    @staticmethod
    def float_score(score, precision=2):
        if not score:
            score = {}
        return { k: round(float(v), precision) for k, v in score.items() }

    @staticmethod
    def to_float(v, precision=2):
        if not v:
            v = 0
        return round(float(v), precision)

    @staticmethod
    def to_decimal(v):
        if not v:
            v = 0
        return decimal.Decimal(v)

