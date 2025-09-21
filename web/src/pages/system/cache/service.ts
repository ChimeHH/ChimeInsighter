import { request } from 'umi';

// 获取缓存版本列表的接口
export function getCachedVersionList() {
  return request<API.Response<any>>('/api/cached_versions', {
    method: 'GET',
  });
}

// 删除缓存版本的接口
export function removeCache(versionIds: string[]) {
  // 构建符合后端期望的参数格式
  const params = versionIds.reduce((acc, id, index) => {
    acc[`version_ids[${index}]`] = id;
    return acc;
  }, {} as Record<string, string>);

  return request<API.Response<any>>('/api/cached_versions/remove', {
    method: 'DELETE',
    params, // 将构建好的params作为查询参数
  });
}
