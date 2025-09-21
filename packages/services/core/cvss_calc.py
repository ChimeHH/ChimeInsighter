'''
方法1，文件大小加权平均
安全评分是基于一系列文件的 CVSS 分数、可利用性分数和影响分数来计算的，并且这些分数都会被转换（反转）以形成最终的安全评分。

如何评估评分变化
增加安全文件的影响：

如果您在文件列表中增加了一些 CVSS 分数较高（即潜在危害较大）但实际被认为是安全的文件，这些文件的原始分数会降低整个包的安全评分。
例如，新增的安全文件的 CVSS Score 较高（比如说 9.0），将会导致在计算反转安全分数时产生的值相应降低（10 - 9 = 1）。如果这种情况适度发生，将会影响整个评分。
调整文件的权重:

在函数中，您可以通过 cvss_weight，exploitability_weight 和 impact_weight 来调整各类评分在整体评分中的影响力。如果您认为某一项如可利用性分数更加重要，可以相应提高其权重。
'''

def calculate_inverted_score(raw_score):  
    """计算安全评分。越高越危险，反转其值形成安全评分"""  
    return max(10 - raw_score, 0)  

def calculate_security_scores(file_list, cvss_weight=0.5, exploitability_weight=0.25, impact_weight=0.25):  
    exploitability_scores = []  
    impact_scores = []  
    cvss_scores = []  

    for checksum, file in file_list.items():
        if 'metrics' in file:  
            for metric in file['metrics']:  
                # 获取 CVSS V3 或 V2 分数  
                cvss_score = None  
                if 'baseMetricV3' in metric and 'cvssV3' in metric['baseMetricV3']:  
                    cvss_score = metric['baseMetricV3']['cvssV3']['baseScore']  
                elif 'baseMetricV2' in metric and 'cvssV2' in metric['baseMetricV2']:  
                    cvss_score = metric['baseMetricV2']['cvssV2']['baseScore']  

                if cvss_score is not None:  
                    cvss_scores.append(cvss_score)  

                # 处理 exploitabilityScore 和 impactScore  
                if 'baseMetricV3' in metric:  
                    if 'exploitabilityScore' in metric['baseMetricV3']:  
                        exploitability_scores.append(metric['baseMetricV3']['exploitabilityScore'])  
                    if 'impactScore' in metric['baseMetricV3']:  
                        impact_scores.append(metric['baseMetricV3']['impactScore'])  

                if 'baseMetricV2' in metric:  
                    if 'exploitabilityScore' in metric['baseMetricV2']:  
                        exploitability_scores.append(metric['baseMetricV2']['exploitabilityScore'])  
                    if 'impactScore' in metric['baseMetricV2']:  
                        impact_scores.append(metric['baseMetricV2']['impactScore'])  

    # 计算冗余评分  
    avg_exploitability_score = sum(exploitability_scores) / len(exploitability_scores) if exploitability_scores else 0  
    avg_impact_score = sum(impact_scores) / len(impact_scores) if impact_scores else 0  
    avg_cvss_score = sum(cvss_scores) / len(cvss_scores) if cvss_scores else 0  

    # 计算反转后的评分  
    inverted_exploitability_score = calculate_inverted_score(avg_exploitability_score)  
    inverted_impact_score = calculate_inverted_score(avg_impact_score)  
    inverted_cvss_score = calculate_inverted_score(avg_cvss_score)  

    # 计算反转后的综合安全评分  
    overall_security_score = (  
        inverted_cvss_score * cvss_weight +  
        inverted_exploitability_score * exploitability_weight +  
        inverted_impact_score * impact_weight  
    )  
    
    # 确保综合评分在0到10之间  
    overall_security_score = min(max(overall_security_score, 0), 10)  

    overall_scores = {  
        "exploitabilitySecurityScore": inverted_exploitability_score,  
        "impactSecurityScore": inverted_impact_score,  
        "cvssSecurityScore": inverted_cvss_score,  
        "overallSecurityScore": overall_security_score  
    }  

    return overall_scores  

'''
方法 2，加和平均
程序逻辑概述
假设我们的程序结构如下：

输入文件大小和安全分数：从用户处获取文件的列表（大小和分数）。
分离安全与不安全文件：根据设定的安全分数阈值（例如8）分开文件。
计算总大小和加权安全分数：对安全文件与不安全文件分别计算加权分数，并结合文件大小进行整体评分。
假设情况：
如果包中增加的是多个较大的安全文件（例如：200MB、300MB等），它们的安全评分较高（≥8），则会提高整体的评分。
反之，如果增加的是不安全的文件，尤其是大文件，可能会拉低评分。
举例比较
原始包的分数计算（示例）：

总文件：10950MB
假设安全文件总大小：5550MB， 平均安全评分 9.25。
不安全文件总大小：3750MB， 平均安全评分 7.0。
如果增加了一个 1500MB 的安全文件（例如：1500MB， 安全评分10）：

新的安全文件总大小 = 5550MB + 1500MB = 7050MB
新的不安全文件总大小仍然是3750MB（假设没有新增不安全文件）。
新的总文件大小 = 10950MB + 1500MB = 12450MB。
计算新的加权评分：
新安全评分 =
新的总加权安全分数=(7050×9.25)+(3750×7.0)12450
新的总加权安全分数= 12450(7050×9.25)+(3750×7.0)
 
计算过程：
计算安全文件总和：
    7050×9.25=65137.5
    7050×9.25=65137.5
计算不安全文件总和：
    3750×7.0=26250
    3750×7.0=26250
新的加权安全评分：
加权安全分数=65137.5+2625012450≈7.94
加权安全分数= 12450
    65137.5+26250≈7.94
结论
    通过这样的方法，如果您在包中加入更多安全的大文件，确实会导致整体安全评分上升。反之，增加不安全文件则可能拉低整体评分。
'''

if __name__ == "__main__":  
    # 使用您提供的样本数据  
    file_list = { 
        '1' : {'size': 150, 'metrics': [{'baseMetricV2': {'cvssV2': {'baseScore': 3.5}, 'exploitabilityScore': 7.0, 'impactScore': 4.0}}]},  
        '2' : {'size': 200, 'metrics': [{'baseMetricV3': {'cvssV3': {'baseScore': 6.0}, 'exploitabilityScore': 2.5, 'impactScore': 3.5}}]},  
        '3' : {'size': 250, 'metrics': [{'baseMetricV2': {'cvssV2': {'baseScore': 7.0}, 'exploitabilityScore': 9.0, 'impactScore': 5.5}, 'baseMetricV3': {'cvssV3': {'baseScore': 8.5}, 'exploitabilityScore': 4.0, 'impactScore': 6.0}}]},  
        '4' : {'size': 300, 'metrics': [{'baseMetricV3': {'cvssV3': {'baseScore': 0.0}, 'exploitabilityScore': 3.0, 'impactScore': 2.0}}]},  
        '5' : {'size': 350, 'metrics': [{'baseMetricV3': {'cvssV3': {'baseScore': 4.0}, 'exploitabilityScore': 5.0, 'impactScore': 4.5}}]},  
        '6' : {'size': 400, 'metrics': [{}]},  
        '7' : {'size': 450, 'metrics': [{'baseMetricV2': {'cvssV2': {'baseScore': 4.5}, 'exploitabilityScore': 7.0, 'impactScore': 3.0}}]},  
        '8' : {'size': 500, 'metrics': [{'baseMetricV3': {'cvssV3': {'baseScore': 9.0}, 'exploitabilityScore': 8.0, 'impactScore': 9.5}}]},  
        '9' : {'size': 550, 'metrics': [{'baseMetricV2': {'cvssV2': {'baseScore': 2.0}, 'exploitabilityScore': 4.0, 'impactScore': 1.5}, 'baseMetricV3': {'cvssV3': {'baseScore': 3.0}, 'exploitabilityScore': 2.0, 'impactScore': 1.0}}]},  
        '10' : {'size': 600, 'metrics': [{'baseMetricV3': {'cvssV3': {'baseScore': 5.5}, 'exploitabilityScore': 3.5, 'impactScore': 4.0}}]},  
        '11' : {'size': 650, 'metrics': [{'baseMetricV2': {'cvssV2': {'baseScore': 5.0}, 'exploitabilityScore': 6.0, 'impactScore': 4.5}}]},  
        '12' : {'size': 700, 'metrics': [{'baseMetricV3': {'cvssV3': {'baseScore': 1.0}, 'exploitabilityScore': 1.0, 'impactScore': 0.5}}]},  
        '13' : {'size': 750, 'metrics': [{'baseMetricV3': {'cvssV3': {'baseScore': 2.5}, 'exploitabilityScore': 5.5, 'impactScore': 3.0}}]},  
        '14' : {'size': 800, 'metrics': [{'baseMetricV2': {'cvssV2': {'baseScore': 6.0}, 'exploitabilityScore': 6.5, 'impactScore': 5.0}}]},  
        '15' : {'size': 850, 'metrics': [{'baseMetricV3': {'cvssV3': {'baseScore': 7.5}, 'exploitabilityScore': 8.5, 'impactScore': 7.0}}]},  
        '16' : {'size': 900, 'metrics': [{'baseMetricV2': {'cvssV2': {'baseScore': 4.0}, 'exploitabilityScore': 5.0, 'impactScore': 3.0}, 'baseMetricV3': {'cvssV3': {'baseScore': 6.0}, 'exploitabilityScore': 4.0, 'impactScore': 5.0}}]},  
        '17' : {'size': 950, 'metrics': [{'baseMetricV3': {'cvssV3': {'baseScore': 8.0}, 'exploitabilityScore': 7.5, 'impactScore': 6.5}}]},  
        '18' : {'size': 1000, 'metrics': [{'baseMetricV2': {'cvssV2': {'baseScore': 3.0}, 'exploitabilityScore': 4.0, 'impactScore': 2.0}}]},  
        '19' : {'size': 1100, 'metrics': [{'baseMetricV3': {'cvssV3': {'baseScore': 9.5}, 'exploitabilityScore': 6.0, 'impactScore': 8.0}}]},  
        '20' : {'size': 1200, 'metrics': [{}]},  
    }

    # 计算并输出整体安全评分，传入权重  
    security_scores = calculate_security_scores(file_list, cvss_weight=0.5, exploitability_weight=0.25, impact_weight=0.25)  
    print("Security Scores:", security_scores)