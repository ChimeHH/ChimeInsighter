import { request } from 'umi';
import type { TableListItem, MenuList } from './data';

//查
export async function queryRule(params: Partial<API.QueryParams>) {
    return request<API.PagingResponse<TableListItem[]>>('/api/getRole', {
        method: 'POST',
        data: {
            ...params
        }
    });
};

//增-改
export async function postRule(params: TableListItem) {
    params.menuIds = (params.menuIds as number[]).join(',');
    if (params.visibilityIds) {
        params.visibilityIds = (params.visibilityIds as number[]).join(',');
    }

    return request<API.Response<API.postRuleRespone[]>>('/api/postRole', {
        method: 'POST',
        data: params
    });
};

//删
export async function removeRule(params: TableListItem[]) {
    const ids = params.map((row) => row.id).join(',');
    const updatedAts = params.map((row) => row.updatedAt).join(',');

    return request<API.PagingResponse<API.RemoveResponse[]>>('/api/deleteRole', {
        method: 'POST',
        data: {
            ids,
            updatedAts
        }
    });
};

//下拉
export async function getMenu() {
    return request<API.PagingResponse<MenuList[]>>('/api/getMenu', {
        method: 'POST',
        data: {}
    });
};
