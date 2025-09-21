import { request } from 'umi';
import type { Version } from '../version/data';

export function getFiles(params: { version_id: string; [key: string]: any }) {
  return request<
    API.Response<{
      files: FileInfo[];
      version: Version;
    }>
  >('/api/versions/files', {
    method: 'GET',
    params,
  });
}
