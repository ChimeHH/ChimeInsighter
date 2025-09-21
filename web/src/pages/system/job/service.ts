import { request } from 'umi';

// 获取活动 worker 列表的接口
export function getActiveJobList() {
  return request<API.Response<any>>('/api/active_jobs', {
    method: 'GET',
  });
}

export function removeActiveJobs(jobIds?: string[]) {
  // 如果没有传入 jobIds，则返回一个默认的空请求
  if (!jobIds || jobIds.length === 0) {
    return request<API.Response<any>>('/api/active_jobs/remove', {
      method: 'DELETE',
    });
  }

  // 构建符合后端期望的参数格式
  const params = jobIds.reduce((acc, id, index) => {
    acc[`job_ids[${index}]`] = id;
    return acc;
  }, {} as Record<string, string>);

  return request<API.Response<any>>('/api/active_jobs/remove', {
    method: 'DELETE',
    params, // 将构建好的params作为查询参数
  });
}


// 获取活动版本状态的接口
export function getActiveVersionStatus(version_id: string) {
  return request<API.Response<API.ActiveVersionStatus>>('/api/active_versions/status', {
    method: 'GET',
    params: {
      version_id, // 将 version_id 作为查询参数
    },
  });
}

// 更新活动版本黑名单的接口
export function updateActiveVersionStatus(version_id: string, blacklist: string) {
  const formData = new FormData();
  formData.append('version_id', version_id);
  formData.append('blacklist', blacklist);
  return request<API.Response<any>>('/api/active_versions/update', {
    method: 'POST',    
    data: formData,
    requestType: 'form',
  });
}
