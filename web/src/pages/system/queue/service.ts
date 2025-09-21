import { request } from 'umi';

// 获取活动 worker 列表的接口
export function getActiveQueueList() {
  return request<API.Response<any>>('/api/queues_info', {
    method: 'GET',
  });
}
