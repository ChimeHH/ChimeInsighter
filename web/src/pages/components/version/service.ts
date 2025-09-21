import { getLoginInfo } from '@/utils/common';
import { request } from 'umi';
import type { Version } from './data';

export function selectVersions(params: { project_id: string }) {
  return request<API.Response<{ versions: Version[] }>>('/api/versions', {
    method: 'GET',
    params,
  });
}

export function scanVersion(data: {
  project_id: string;
  version_name: string;
  version_date: string;
  [key: string]: any;
}) {
  const formData = new FormData();
  Object.keys(data).forEach((item) => formData.append(item, data[item]));
  return request('/api/versions/scan', {
    method: 'POST',
    data: formData,
    timeout: 0,
  });
}

export function rescanVersion(data: {
  version_id: string;
  [key: string]: any;
}) {
  const formData = new FormData();
  Object.keys(data).forEach((item) => {
    if (data[item] !== undefined) { // 确保只添加定义了的字段
      formData.append(item, data[item]);
    }
  });
  return request('/api/versions/scan', {
    method: 'POST',
    data: formData,
    timeout: 0,
  });
}


export function updateVersion(data: {
  'filters.version_id': string;
  'updates.version_name': string;
  'updates.version_date': string;
  'updates.description'?: string;
}) {
  return request<API.Response<Version>>('/api/versions/update', {
    method: "POST",
    data,
    requestType: 'form',
  })
}

export function cancelVersions(version_ids: string[]) {
  const data = version_ids.reduce((acc, id, index) => {
    acc[`version_ids[${index}]`] = id;
    return acc;
  }, {} as Record<string, string>);

  return request('/api/versions/cancel', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}


export function deleteVersions(version_ids: string[]) {
  const queryParams = version_ids.map((id, index) => `version_ids[${index}]=${id}`).join('&');
  return request(`/api/versions?${queryParams}`, {
    method: 'DELETE',
  });
}

export function exportProject(uid: string, filetype: string) {
  const loginInfo = getLoginInfo();
  return request('/api/export', {
    method: 'GET',
    params: {
      uid,
      filetype,
      jwt: loginInfo?.auth?.access_token,
    },
    responseType: 'blob',
    getResponse: true,
  })
}
