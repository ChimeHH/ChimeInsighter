import { request } from 'umi';
import type { Version } from '../version/data';


export function selectThreats(params: { version_id: string; [key: string]: any }) {
  return request<
    API.Response<{
      tags: Tag[];
      threats: PublicThreat[];
      version: Version;
    }>
  >('/api/versions/threats', {
    method: 'GET',
    params,
  });
}

export function updateThreatStatus(data: { threat_id: string; work_status: string }) {
  return request<API.Response<any>>('/api/versions/update_threat_status', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}
