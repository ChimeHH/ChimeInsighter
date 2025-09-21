import { request } from 'umi';
import type { Version } from '../version/data';

export function getPackagesList(params: { version_id: string; [key: string]: any }) {
  return request<
    API.Response<{
      packages: PackageInfo[];
      version: Version;
    }>
  >('/api/versions/packages', {
    method: 'GET',
    params,
  });
}
