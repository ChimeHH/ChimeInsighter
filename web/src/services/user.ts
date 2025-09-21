import { request } from 'umi';

export async function selectUsers() {
  return request<
    API.Response<{
      users: API.User[];
    }>
  >('/api/users', {
    params: {
    },
  });
}

export async function insertUser(data: { 
  'username': string; 
  'password': string; 
  'role': string; 
  total_uploads: number;  // 这里修正了拼写
  total_uploads_mg: number; 
  max_filesize_mg: number; 
  active: boolean 
  }) {
  return request<API.Response<API.User>>('/api/users/create_user', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}

export async function updateUser(data: { 
  'username': string; 
  'password': string; 
  'role': string; 
  total_uploads: number;  // 这里修正了拼写
  total_uploads_mg: number; 
  max_filesize_mg: number; 
  active: boolean 
  }) {
  return request<API.Response<API.User>>('/api/users/update_user', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}

export async function resetPassword(data: { username: string; new_password: string }) {
  return request<API.Response<any>>('/api/users/reset_password', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}

export async function changePassword(data: { current_password: string; new_password: string }) {
  return request<API.Response<any>>('/api/users/change_password', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}

export async function deleteUser(usernames: string[]) {
  const params = usernames.map((username, index) => `usernames[${index}]=${encodeURIComponent(username)}`).join('&');

  return request<API.Response<any>>(`/api/users/remove?${params}`, {
    method: 'DELETE',
  });
}



