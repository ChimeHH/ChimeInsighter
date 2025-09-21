import { request } from 'umi';

// 获取活动版本状态的接口
export function getActiveVersionStatus(versionId: string) {
  return request<API.Response<any>>(`/api/active_version_status?version_id=${versionId}`, {
    method: 'GET',
  });
}
