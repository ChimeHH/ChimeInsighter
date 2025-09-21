import { request } from 'umi';

export function getMonitorEvents(fromDatetime: string, toDatetime: string) {
  const params = new URLSearchParams();
  params.append('from_datetime', fromDatetime);
  params.append('to_datetime', toDatetime);

  return request<API.Response<any>>(`/api/monitor/events?${params.toString()}`, {
    method: 'GET',
  });
}
