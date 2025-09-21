import { getLoginInfo } from '@/utils/common';
import { request } from 'umi';
import type { VersionSummary } from './data';

export function selectVersionSummary(params: {
  version_id: string;
}) {
  return request<API.Response<VersionSummary>>('/api/versions/summary', {
    method: 'GET',
    params,
  });
}

export function exportVersion(uid: string, filetype: string, language: string) {
  const loginInfo = getLoginInfo();
  return request('/api/export', {
    method: 'GET',
    params: {
      uid,
      filetype,
      language,
      jwt: loginInfo?.auth?.access_token,
    },
    responseType: 'blob',
    getResponse: true,
  })
}