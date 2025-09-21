import { request } from 'umi';

export async function changePassword(params: { current_password: string; new_password: string }) {
  const { current_password, new_password } = params;
  return request<API.Response<any>>('/api/users/change_password', {
    method: 'POST',
    requestType: 'form',
    data: {
      current_password,
      new_password,
    }
  });
}
