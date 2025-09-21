import { request } from 'umi';
import { getToken } from '@/utils/common';

type fileResponse = {
    filename: string;
};

export const upLoadFile = async (params: FormData) => {
    return request<API.Response<fileResponse[]>>('/api/auth/uploadFile', {
        method: 'POST',
        data: params,
        headers: {
            'ContentType': 'multipart/form-data',
            'Authorization': getToken()!
        }
    });
};
