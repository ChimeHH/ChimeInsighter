import { request } from 'umi';
import type { Version } from '../version/data';

export function selectPackageDetail(params: { uid: string }) {
  return request<API.Response<{ detail: PackageDetail; version: Version }>>(
    '/api/versions/package',
    {
      params,
    },
  );
}


