import { request } from 'umi';
import type { Version } from '../version/data';

export function selectThreats(params: {  [key: string]: any }) {
  return request<
    API.Response<{
      threats: SecurityThreat[];
      version: Version;
    }>
  >('/api/versions/threats', {
    method: 'GET',
    params,
  });
}
