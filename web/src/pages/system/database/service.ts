import { request } from 'umi';

export async function backupDatabase() {
  return request<Blob>('/api/database/dump', {
    responseType: 'blob',
    getResponse: true,
  });
}

export async function restoreDatabase(data: any) {
  const formData = new FormData();
  Object.keys(data).forEach((item) => formData.append(item, data[item]));
  return request<API.Response<{ task_id: string }>>('/api/database/restore', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}
