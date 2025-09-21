import { request } from 'umi';
import type { Version } from '../version/data';

export function selectFileDetail(params: { uid: string }) {
  return request<API.Response<{ detail: FileDetail; version: Version }>>(
    '/api/versions/file',
    {
      params,
    },
  );
}


