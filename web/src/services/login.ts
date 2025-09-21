import { request } from 'umi';

export async function AccountLogin(params: {
  username: string;
  password: string;
}) {
  return request<API.Response<API.Token>>('/api/login', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function logout() {
  return request<API.Response<{ logout: boolean }>>('/api/logout', {
    method: 'POST',
  });
}

export async function refreshToken(refresh_token: string) {
  return request<API.Response<API.Token>>('/api/refresh_token', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${refresh_token}`,
    }
  });
}