评分计算优化研究

-------------------------------------------------------------------------------------------------------
成分评分是基于分布（占比）实现的，需要让高分接近1，低分区域0，实现去噪，得到目的特征分对应的引用概率。
def real_score(est_score, full_score, minimum_score=10, precision=0.01):
    if est_score <= 0:
        return 0.0
    try:
        b = math.log(precision) / math.log(minimum_score / full_score)
        k = pow(minimum_score, b)
        score = 1.0 - k / pow(est_score, b)
        return max(0.0, min(1.0, score))  # 限制在 [0, 1]
    except:
        return 0.0 if est_score < minimum_score else 1.0


--------------------------------------------------------------------------------------------------------
实践中，大量组件被部分引用，编译成独立的.so文件，比如FreeRTOS, LwIP等，一般仅引用部分，并不会全打包进来。
此时前述的评分就会偏差。当前系统做法是用两个指标，分别考察。下面是改进的算法，综合两个指标，得到统一的评分。

def real_score_enhanced(est_score, full_score, file_score, total_file_score, 
                                      minimum_score=10, precision=0.01, weight_ratio=0.5):
    """
    增强版打分函数，融合“特征分”和“文件占比”
    
    Args:
        est_score: 组件特征分（如调用次数）
        full_score: 特征满分
        file_score: 该组件在文件中的“大小”（如字节数、指令数）
        total_file_score: 整个文件的总大小
        weight_ratio: 文件占比的权重（0~1），默认0.5表示两者同等重要
    """
    if est_score <= 0 or total_file_score <= 0:
        return 0.0
    
    try:
        # 1. 计算原始特征分（和原来一样）
        b = math.log(precision) / math.log(minimum_score / full_score)
        k = pow(minimum_score, b)
        score_feature = 1.0 - k / pow(est_score, b)
        score_feature = max(0.0, min(1.0, score_feature))
        
        # 2. 计算文件占比分（线性映射）
        ratio = file_score / total_file_score
        score_ratio = min(1.0, ratio * 2)  # 占比 > 50% 就给满分，避免过度放大
        
        # 3. 加权融合
        final_score = weight_ratio * score_ratio + (1 - weight_ratio) * score_feature
        
        return max(0.0, min(1.0, final_score))
        
    except:
        # 保守策略：如果特征分很低但占比很高，给中等分
        if est_score < minimum_score and file_score / total_file_score > 0.1:
            return 0.5
        return 0.0 if est_score < minimum_score else 1.0