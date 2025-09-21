import { request } from 'umi';

export function installLicense(file: File) {
  const formData = new FormData();
  formData.append('file', file); // 将文件添加到formData中
  return request<API.Response<{ status: string }>>('/api/install_license', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

export function getLicenseInfo() {
  return request<API.Response<{ license_info: any }>>('/api/license', {
    method: 'GET',
  });
}

export function getServerId() {
  return request<API.Response<{ server_id: string }>>('/api/server_id', {
    method: 'GET',
  });
}
