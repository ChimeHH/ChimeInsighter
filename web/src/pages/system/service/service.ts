import { request } from 'umi';

// 获取活动 worker 列表的接口
export function getActiveEngineList() {
  return request<API.Response<any>>('/api/engines_info', {
    method: 'GET',
  });
}
