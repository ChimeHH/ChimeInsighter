import { request } from 'umi';

// 获取 CWE 详情的接口
export function getLicenseDetail(id: string) {
  return request<API.Response<LicenseDetailResponse>>(`/api/help/license?id=${id}`, {
    method: 'GET',
  });
}

// 假设 LicenseDetailResponse 类型在 data.d.ts 文件中定义
// 例如：
// export interface LicenseDetailResponse {
//   license_id: string;
//   description: string;
//   // 其他字段
// }
