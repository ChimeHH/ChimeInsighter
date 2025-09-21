import { request } from 'umi';

// 获取活动 worker 列表的接口
export function getSoftwareList() {
  return request<API.Response<any>>('/api/system_info', {
    method: 'GET',
  });
}
