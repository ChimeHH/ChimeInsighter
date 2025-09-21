import { request } from 'umi';

export async function getMenuTree() {
    return request<API.Response<API.MenuTree[]>>('/api/getMenuTree', {
        method: 'POST',
        data: {}
    });
};
