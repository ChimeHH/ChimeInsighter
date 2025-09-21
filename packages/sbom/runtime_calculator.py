import sys
import time
import re
import math
import pathlib
from pprint import pprint

from database.core.mongo_db import mongo_client
from database.sbom_database import DatabaseSbom, TableSbomTokens, TableSbomFiles, TableSbomPackages, TableSbomPackagesSummary, SymbolType
from .calculator import Calculator

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class RuntimeCalculator(Calculator):
    class MetaTokens:
        def __init__(self):
             self._tokens = {}
             self._promote = set()

        def promote(self, tokens):
            if tokens:
                self._promote.update(tokens)

        def add(self, stype, token):
            self._tokens[token] = stype

        def update(self, stype, tokens):
            if tokens:
                for token in tokens:
                    self._tokens[token] = stype

        def append(self, meta_tokens):
            self._tokens.update(meta_tokens._tokens)
        
        @property
        def major(self):
            return set([ k for k,v in self._tokens.items() if v in ('s', )]) | self._promote

        @property
        def minor(self):
            return set([ k for k,v in self._tokens.items() if v in ('n', 'c', 'e')])

        @property
        def tokens(self):
            return set(self._tokens.keys())

        def stype(self, token):
            return self._tokens.get(token)

    def _real_score(self, est_score, full_score):
        try:
            if full_score <= self._minimum_score:
                return 0

            b = math.log(self._precision)/math.log(self._minimum_score / full_score)
            k = pow(self._minimum_score, b)
            
            return max(0, 1.0 - k / pow(est_score, b))

        except (ZeroDivisionError, OverflowError):
            # log.exception("calculate real score overflow")
            return min(1, est_score/full_score)            
        except:
            log.exception("calculate real score failed")
            return 0

    
    def real_score(self, est_score, version_score):
        score = {}
        for k in est_score.keys():
            score[k] = self._real_score(self.to_float(est_score[k]), self.to_float(version_score[k]))        
        return score

    def _load_data(self, filepath, meta_tokens, meta_files):
        all_tokens = {}
        all_files = {}
        all_packages = {}

        tmp_token_set = meta_tokens.tokens
        log.debug(f"loading {filepath} all_tokens: {len(tmp_token_set)}")

        # 先查找已知文件，将已知文件的token添加到token列表；然后查询token列表的各score
        known_files = set()
        for fr in self.tableFiles.find_checksum(*meta_files, projection={TableSbomFiles.CHECKSUM: 1, TableSbomFiles.TOKENS: 1, TableSbomFiles.FILEPATH: 1, TableSbomFiles.WEIGHT: 1}):            
            known_files.add(fr[TableSbomFiles.CHECKSUM])

            fr_tokens = fr[TableSbomFiles.TOKENS]
            if fr_tokens:
                # 注意，这里我们必须添加已知文件到all_files清单；否则，后续用tokens去查文件时，部分文件因没有tokens而会缺席。
                all_files[fr[TableSbomFiles.CHECKSUM]] = dict(tokens=set(fr.get(TableSbomFiles.TOKENS, [])), filepath=fr.get(TableSbomFiles.FILEPATH, None), weight=fr.get(TableSbomFiles.WEIGHT) or 0)

                meta_tokens.promote(fr_tokens) # 这里更新后，将影响外部用到该变量的其它后续函数。
                tmp_token_set.add(fr_tokens) # 这里要注意，这部分tokens可能并不在解析出来的tokens列表，因此可能是没有stype的，对于评分计算没什么用

        for tr in self.tableTokens.find_token(*tmp_token_set, projection={TableSbomTokens.TOKEN: 1, TableSbomTokens.SCORE: 1, TableSbomTokens.STYPE: 1}):
            token = tr[TableSbomTokens.TOKEN]
            stype = tr.get(TableSbomTokens.STYPE)
            all_tokens[token] = dict(score= self.to_decimal(tr[TableSbomTokens.SCORE]))
            if stype:
                meta_tokens.add(stype, token)

        # 筛选出唯一token，这里不考虑长串出现1次而出现假的唯一
        uni_tokens = []
        for token, tr in all_tokens.items():
            if tr['score'] >= 1:
                uni_tokens.append(token)

        log.debug(f"loaded {filepath} all_tokens: {len(all_tokens)}, uni_tokens: {len(uni_tokens)}")

        for fr in self.tableFiles.find_token(*uni_tokens, projection={TableSbomFiles.CHECKSUM: 1, TableSbomFiles.TOKENS: 1, TableSbomFiles.FILEPATH: 1, TableSbomFiles.WEIGHT: 1}):  
            checksum = fr[TableSbomFiles.CHECKSUM]
            # 因为前面我们已经添加了已知文件，这里可以忽略已经添加的；当然，无所谓，覆盖一次也行
            if checksum not in all_files:                
                all_files[checksum] = dict(tokens=set(fr.get(TableSbomFiles.TOKENS, [])) & tmp_token_set, filepath=fr.get(TableSbomFiles.FILEPATH, None), weight=fr.get(TableSbomFiles.WEIGHT) or 0)

        # log.debug(f"loaded {filepath} all_files: {len(all_files)}")
        
        weight_matrix = {}
        uno_files = []
        for pr in self.tablePackages.find_file(*list(all_files.keys()), projection={TableSbomPackages.FULLNAME: 1, TableSbomPackages.VERSION: 1, TableSbomPackages.SCORE: 1, TableSbomPackages.FILES: 1}):
            fullname = pr[TableSbomPackages.FULLNAME]
            version = pr[TableSbomPackages.VERSION]
            files = set(pr[TableSbomPackages.FILES])

            weight_matrix.setdefault(fullname, set())            
            weight_matrix[fullname].add(version)

            all_packages[pr[TableSbomPackages.ID]] = dict(fullname=fullname, version=version, score= self.decimal_score(pr[TableSbomPackages.SCORE]), files=files)
            
            # 对于所有组件，我们不只要关心含有uni token的文件，还需要包括其它所有包含有相关token的文件
            if self._include_uno_files:                        
                for checksum in files:
                    if checksum not in all_files:  
                        uno_files.append(checksum)
                        
        if self._include_uno_files:
            for fr in self.tableFiles.find_checksum(*uno_files):                
                all_files[checksum] = dict(tokens=set(fr.get(TableSbomFiles.TOKENS, [])) & tmp_token_set, filepath=fr.get(TableSbomFiles.FILEPATH, None), weight=fr.get(TableSbomFiles.WEIGHT) or 0)
                    
        for _, package in all_packages.items():
            fullname = package["fullname"]
            version_count = len(weight_matrix[fullname])

            package["weight"] = 0            
            for checksum in (known_files & package["files"]):
                if checksum in all_files: # 这个判断似乎有些多余，因为已知文件清单，早就被添加到文件列表里了
                    package["weight"] += self.file_weight(all_files[checksum]["weight"], version_count)                
        
        return all_tokens, all_files, all_packages

    def _calculate_candicates(self, filepath, meta_tokens, all_tokens, all_files, all_packages):
        candicates = {}
        
        total_score = self.decimal_score(TableSbomPackages.init_score())
        for token, tr in all_tokens.items():
            stype = meta_tokens.stype(token)
            if stype:
                total_score[stype] += tr['score']
        
        # log.debug(f"{filepath} total_score: {total_score}")

        for _id, pr in all_packages.items():
            fullname = pr['fullname']
            version = pr['version']
            
            promote_tokens = set()
            promote_files = set()

            for checksum in pr.pop('files', []):       
                fr = all_files.get(checksum, {})
                if fr:
                    try:
                        if fr.get('weight') and fr.get('weight') > 1:
                            promote_tokens.update(fr["tokens"])
                            promote_files.add(checksum)
                            continue
                    except: # there're some bad weight in the table, to be fixed later
                        pass
                    
                    for token in fr["tokens"]:
                        if token not in all_tokens:
                            continue
                        promote_tokens.add(token)
                        promote_files.add(checksum)

            est_score = self.decimal_score(TableSbomPackages.init_score())

            for token in promote_tokens:
                tr = all_tokens.get(token, None)
                if tr:
                    stype = meta_tokens.stype(token)
                    if stype:                
                        est_score[stype] += tr['score']

            est_score_value = 0
            total_score_value = 0
            for k in est_score.keys():
                est_score_value += est_score[k]
                total_score_value += total_score[k]

            criteria = self.get_criteria(fullname)

            if not est_score_value or not total_score_value:
                if pr["weight"] < 1:
                    continue
                
                scale_percent = round(pr["weight"] / len(pr["files"]), 6)
                real_score = self.real_score(est_score, pr['score'])
            else:
                scale_percent = round(est_score_value / max(1, total_score_value), 6)
                real_score = self.real_score(est_score, pr['score'])
                if pr["weight"] < 1:
                    if (scale_percent < criteria._scale_percent_minimum) or all(x < criteria._real_score_minimum for x in real_score.values()):
                        continue

            meta = dict(fullname=fullname, version=version, weight=pr['weight'], real_score=real_score, est_score=est_score, score=pr['score'], criteria=criteria, promote_tokens=promote_tokens, promote_files=promote_files, scale_percent=scale_percent)

            uniname = fullname.split('@')[0]
            candicates.setdefault(uniname, [])
            candicates[uniname].append(meta)
            
        return total_score, candicates

    
    def _review_components(self, meta_tokens, components):
        # 计算已识别组件的开源代码比例，引用比例。因为是同一个文件包含多个组件，需要将开源代码比例相加，而引用比例，则是每个组件独立的。

        oss_percent = 0

        # log.debug(f"reviewing components: {len(components)}, {len(meta_tokens.major)} tokens vs. {len(meta_tokens.minor)} tokens")

        for component in components:
            records = self.tablePackages.find_package(component['fullname'], component['version'])            
            checksums = list(records)[0][TableSbomPackages.FILES] # package must be exist according to previous routines
            criteria = component['criteria']

            # log.debug(f"reviewing component {component['fullname']}-{component['version']} checksums: {len(checksums)}")

            promote_sources = []
            component_tokens = set()

            records = self.tableFiles.find_checksum(*checksums)            
            for file in records:
                filepath = file.get("filepath", None)
                if not filepath:
                    # log.debug(f"file {file[TableSbomFiles.CHECKSUM]} has no filepath, ignored")
                    continue

                tokens = set(file[TableSbomFiles.TOKENS] or [])
                
                # if the file has no tokens at all
                if not tokens:
                    promote_sources.append((pathlib.Path(filepath).name, -1))
                    continue

                component_tokens.update(tokens)

                percent = len(meta_tokens.major & tokens) / len(tokens)                
                if percent < criteria._file_tokens_percent_threshold:
                    continue

                # if the file has enough tokens
                promote_sources.append((pathlib.Path(filepath).name, percent))

            component['promote_sources'] = promote_sources
            
            if 'clone' not in component:
                oss_percent += max(1, len(meta_tokens.major & component_tokens)) / max(1, len(meta_tokens.major)) # 分母为当前被测文件的所有tokens

            component['integrity_percent'] = self.transform_percent(max(1, len((meta_tokens.major | meta_tokens.minor) & component_tokens)) / max(1, len(component_tokens))) # 分母为当前组件源的所有tokens

        return self.transform_percent(oss_percent)


    def calculate(self, filepath, *metadata_list):
        if not metadata_list:
            raise 

        file_strings = []

        all_meta_tokens = self.MetaTokens()
        all_meta_files = []
        

        for metadata in metadata_list:
            hashes = metadata['hashes']            
            all_meta_files.extend([ DatabaseSbom.to_index(v) for k, v in hashes.items() if k in ('md5', 'sha1', 'sha256')])
            file_strings.extend(metadata.get('strings', []))

            all_meta_tokens.append(self._build_tokens(metadata))
        
        all_tokens, all_files, all_packages = self._load_data(filepath, all_meta_tokens, all_meta_files)
        total_score, candicates = self._calculate_candicates(filepath, all_meta_tokens, all_tokens, all_files, all_packages)

        for uniname, ppr in candicates.items():
            for pr in ppr:
                fullname = pr['fullname']
                version  = pr['version']

                strings2 = []
                
                product_pattern = None
                product_name = None
                summary = self.tableSummary.getSummary(fullname)
                if summary:
                    product_regex = summary.get('product_regex', None)
                    if product_regex:
                        product_pattern = self.tableSummary.to_python_regex(product_regex)

                    if summary.get('name', None):
                        product_name = summary.get('name')
                
                for s in file_strings:
                    if version in s:
                        strings2.append(s)
                    
                    elif product_pattern and re.fullmatch(product_pattern, s):
                        strings2.append(s)
                
                    elif fullname.split('@')[0] in s or (product_name and product_name in s):
                        strings2.append(s)

                if strings2:
                    pr['promote_strings'] = strings2
                
        sorted_components = self.promote_components(candicates)
        
        for i in range(0, len(sorted_components)-1):
            c1 = sorted_components[i]

            for j in range(i+1, len(sorted_components)):
                c2 = sorted_components[j]

                if 'clone' in c2:
                    continue

                intersection = c1['promote_tokens'] & c2['promote_tokens']
                if len(intersection) / len(c2['promote_tokens']) >= c2['criteria']._clone_percent_threshold:
                    c2['clone'] = c1['fullname']

        # calculate promote promote_percent (percent of a component to the scanned file), import_percent ( percent of a component import from the original component)
        oss_percent = self._review_components(all_meta_tokens, sorted_components)

        for fullname, ppr in candicates.items():
            for pr in ppr: 
                pr.pop("promote_tokens", None)

                pr["score"] = self.float_score(pr["score"])
                pr["est_score"] = self.float_score(pr["est_score"])
                pr["scale_percent"] = self.to_float(pr["scale_percent"], precision=4)

        for c1 in sorted_components:
            c1.pop('score', None)
            c1.pop('criteria', None)
            c1.pop('promote_strings', None)
            c1.pop('promote_files', None)
            c1.pop('promote_tokens', None)

            c1["scale_percent"] = self.to_float(c1["scale_percent"], precision=4)

            c1['summary'] = self.tableSummary.getSummary(c1['fullname']) or {}
            pr = self.tablePackages.getPackage(c1['fullname'], c1['version'])
            if pr:
                c1['summary']['licenses'] = pr.get('licenses', None)
                c1['summary']['depends'] = pr.get('depends', None)
                c1['summary']['downloadurl'] = pr.get('downloadurl', None)
                c1['summary']['languages'] = pr.get('languages', None)
                c1['summary']['document'] = pr.get('document', None)
                c1['summary']['release_time'] = pr.get('release_time', None)                

        return oss_percent, total_score, candicates, sorted_components

    def compare_score(self, uniname, v0, v1): 
        # 如果有且仅一个版本存在确定的文件，返回确定关联的版本
        if v0['weight'] >= 1 and v1['weight'] < 1:
            return v0

        if v0['weight'] < 1 and v1['weight'] >= 1:
            return v1

        # log.debug("comparing est {} vs {}".format(v0, v1))
        est_score0 = v0['est_score']
        est_score1 = v1['est_score']
        
        # check if there's explict strings which specified package name and version; 当两个版本比较接近时，我们比较是否有特定的字符串特征；
        # 注意，如果两个都是没有token的，比如linux kernel，pe files，我们是通过特殊字符串来确认的，此时我们要保证不会出现0作为除数。
        est_s_gap = max(1, est_score0['s']) / max(1, est_score1['s'])
        if 0.95 < est_s_gap < 1.05:
            promotes0 = len(v0.get('promote_strings', []))
            promotes1 = len(v1.get('promote_strings', []))
            if promotes0 > promotes1:
                return v0
            elif promotes0 < promotes1:
                return v1

        for k in DatabaseSbom.ScoreType.prioritized_categories:
            if est_score0[k] > est_score1[k]:
                return v0
            elif est_score0[k] < est_score1[k]:
                return v1

        # more like something
        score0 = v0['score']
        score1 = v1['score']
        # log.debug("comparing original {} vs {}".format(v0, v1))

        for k in ('s', 'c'):
            if score0[k] < score1[k]:
                return v0
            elif score0[k] > score1[k]:
                return v1

        # 评分相同的情况下，返回weith值较大的
        if v0['weight'] > v1['weight']:
            return v0

        if v0['weight'] < v1['weight']:
            return v1

        version0 = v0['version']
        version1 = v1['version']
        # log.debug("comparing version {} vs {}".format(v0, v1))

        m0 = re.findall(r'([a-z]+|\d+)', re.sub(r'^[a-z]+|[a-z]+$', '', version0.lower()))
        m1 = re.findall(r'([a-z]+|\d+)', re.sub(r'^[a-z]+|[a-z]+$', '', version1.lower()))
        use_version = lambda x, y:  x if self._use_high_version else y

        while len(m0) < len(m1):
            m0.append('0')
        while len(m0) > len(m1):
            m1.append('0')
        if m0 == m1:
            return v0
    
        for i in range(min(len(m0), len(m1))):             
            try:
                if int(m0[i]) == int(m1[i]):
                    continue
                if int(m0[i]) > int(m1[i]):
                    return use_version(v0, v1)
                else:
                    return use_version(v1, v0)
            except:                
                if m0[i] in ('rc', 'alpha', 'belta', 'pre'):
                    # '0' means a formal release, it's a higher version than rc, alpha, or belta
                    if m0[i] == '0':
                        return use_version(v0, v1)
                    elif m1[i] == '0':
                        return use_version(v1, v0)
                    elif m0[i] < m1[i]:
                        return use_version(v0, v1)
                    else:
                        return use_version(v1, v0)
                
        return use_version(v1, v0)

    def _meet_score_threshold(self, real_score, threshold):        
        for k, s in real_score.items():
            s0 = threshold.get(k, 0)
            if s < s0:
                return False
        return True

    def promote_real_score(self, thresholds, real_score):        
        for threshold in thresholds:
            if self._meet_score_threshold(real_score, threshold):
                return True
        return False

    def promote_components(self, candicates):
        components = []

        # prune candicates based on thresholds
        for uniname in list(candicates.keys()):
            ppr = candicates[uniname]
            candicates[uniname] = []
            for pr in ppr:
                if pr['weight'] < 1:
                    if pr['scale_percent'] < pr['criteria']._scale_percent_threshold:
                        if not self.promote_real_score(pr['criteria']._thresholds, pr['real_score']):
                            continue

                candicates[uniname].append(pr)

            if not candicates[uniname]:
                candicates.pop(uniname, None)

        for uniname, ppr in candicates.items():
            pr0 = None
            
            for pr in ppr:                
                if not pr0:
                    pr0 = pr
                else:
                    pr0 = self.compare_score(uniname, pr0, pr)

            fullname = pr0['fullname']
            version = pr0['version']
            weight = pr0['weight']
            score = pr0['score']
            real_score = pr0['real_score']
            scale_percent = pr0['scale_percent']
            criteria = pr0['criteria']
            promote_strings = pr0.get('promote_strings', [])
            promote_files = pr0.get('promote_files', [])
            promote_tokens = pr0.get('promote_tokens', [])
            promote_sources = pr0.get('promote_sources', [])
                        
            components.append(dict(fullname=fullname, version=version, weight=weight, score=score, real_score=real_score, scale_percent=scale_percent, criteria=criteria,
                                   promote_strings=promote_strings, promote_files=promote_files, promote_tokens=promote_tokens, promote_sources=promote_sources))

        return sorted(components, key=lambda c: c['scale_percent'], reverse=True)

    @classmethod
    def _build_tokens(cls, metadata): 
        meta_tokens = cls.MetaTokens()

        lang = metadata.get('lang', None)
        filepath = metadata.get('filepath', None)
        strings = metadata.get('strings', [])
        classes = metadata.get('classes', [])
        symbols = metadata.get('symbols', [])
        needed = metadata.get('needed', [])

        # log.debug(f"{filepath} lang: {lang}, strings: {len(strings)}, symbols: {len(symbols)}, classes: {len(classes)}")

        try:
            if lang in ('python', ):
                if not filepath.name.startswith('setup.'):
                    meta_tokens.update('s', [ DatabaseSbom.to_index(DatabaseSbom.compute_token(s, SymbolType.STRING, lang)) for s in strings ])
                    meta_tokens.update('n', [ DatabaseSbom.to_index(DatabaseSbom.compute_token(s['name'], SymbolType.VARNAME, lang))  for s in symbols if s['size'] != 0 and s['type'] in ('func', 'object') ])

            else:
                meta_tokens.update('s', [ DatabaseSbom.to_index(DatabaseSbom.compute_token(s, SymbolType.STRING, lang)) for s in strings ])

                meta_tokens.update('n', [ DatabaseSbom.to_index(DatabaseSbom.compute_token(s['name'], SymbolType.FUNCTION, lang)) for s in symbols if s['size'] != 0 and s['type'] == 'func' ])
                meta_tokens.update('n', [ DatabaseSbom.to_index(DatabaseSbom.compute_token(s['name'], SymbolType.VARNAME, lang))  for s in symbols if s['size'] != 0 and s['type'] == 'object' ])

                meta_tokens.update('c', [ DatabaseSbom.to_index(DatabaseSbom.compute_token(s, SymbolType.CLASS, lang))  for s in classes ])     
                
                meta_tokens.update('e', [ DatabaseSbom.to_index(DatabaseSbom.compute_token(s['name'], SymbolType.EXFILE, lang))   for s in symbols if s['size'] != 0 and s['type'] == SymbolType.EXFILE ])
                meta_tokens.update('e', [ DatabaseSbom.to_index(DatabaseSbom.compute_token(s['name'], SymbolType.EXFUNC, lang))   for s in symbols if s['size'] != 0 and s['type'] == SymbolType.EXFUNC ])
                meta_tokens.update('e', [ DatabaseSbom.to_index(DatabaseSbom.compute_token(s['name'], SymbolType.EXOBJECT, lang)) for s in symbols if s['size'] != 0 and s['type'] == SymbolType.EXOBJECT ])
         
                meta_tokens.update('e', [ DatabaseSbom.to_index(DatabaseSbom.compute_token(s['name'], SymbolType.NEEDED, lang))   for s in needed if s['name'] ])
        except:
            log.exception(f"failed to build tokens of {filepath}")

        return meta_tokens

    def transform_percent(self, value, n=None, distribution_factor=None):
        """
        转换单个成分率值，以使其分布更加均匀，偏向于1。 原因在于，总会有一部分token缺失，即便是标准版本。

        参数：
            - value: 要转换的成分率，应该在0到1之间。
            - n: 幂次，控制偏移力度，默认为1.2。
            - distribution_factor: 转化速率，默认为0.6。        
        返回：
            - 转换后的成分率值
        """
        if not n:
            n = self._oss_percent_n

        if not distribution_factor:
            distribution_factor = self._oss_percent_factor
        
        # 规整输入值到0到1之间
        value = max(0, min(1, value))
        
        transformed_value = 1 - (1 - value) ** n
        return transformed_value ** (1 - (1 - value) * distribution_factor)

    def file_weight(self, np, nv):
        np = max(1, np)
        nv = max(1, nv)
        
        return 1/3**(np-1) + 0.1/3**(nv-1)
            
if __name__=='__main__':
    n = 1.2
    factor = 0.6
    print(f"n: {n}, factor: {factor}")
    for i in range(10):
        print(f"{i/10} -> {round(RuntimeCalculator(None).transform_percent(i/10), 3)}")

#     '''
#     digitaltwins@95d84cbad6d9:~$ python -m sbom.runtime_calculator
#     n: 1.2, factor: 0.6
#     0.0 -> 0.0
#     0.1 -> 0.014
#     0.2 -> 0.057
#     0.3 -> 0.129
#     0.4 -> 0.224
#     0.5 -> 0.339
#     0.6 -> 0.468
#     0.7 -> 0.603
#     0.8 -> 0.741
#     0.9 -> 0.875

#     '''









        

        
    
