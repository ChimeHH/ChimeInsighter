import { request } from 'umi';

// 获取活动版本列表的接口
export function getActiveVersionList() {
  return request<API.Response<any>>('/api/active_versions', {
    method: 'GET',
  });
}
