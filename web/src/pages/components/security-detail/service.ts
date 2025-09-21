import { request } from 'umi';
import type { Version } from '../version/data';


export function selectThreatDetail(params: { threat_id: string }) {
  return request<API.Response<{ detail: SecurityDetail; version: Version }>>(
    '/api/versions/threat',
    {
      params,
    },
  );
}
