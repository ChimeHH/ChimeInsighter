import { request } from 'umi';

// 获取监控版本事件的接口
export function getMonitorVersionEvents(versionId: string) {
  return request<API.Response<any>>('/api/monitor/version_events', {
    method: 'GET',
    params: {
      version_id: versionId,
    },
  });
}
