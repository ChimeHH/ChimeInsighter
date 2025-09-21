import { request } from 'umi';

export async function getLogs(params: {
  start_timestamp: number;
  end_timestamp: number;
}) {
  return request<Blob>('/api/logs/download', {
    params,
    responseType: 'blob',
    getResponse: true,
  });
}
