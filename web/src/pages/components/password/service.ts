import { request } from 'umi';
import type { Version } from '../version/data';

export function selectThreats(params: { version_id: string; [key: string]: any }) {
  return request<
    API.Response<{
      threats: PasswordThreat[];
      version: Version;
    }>
  >('/api/versions/threats', {
    method: 'GET',
    params,
  });
}
