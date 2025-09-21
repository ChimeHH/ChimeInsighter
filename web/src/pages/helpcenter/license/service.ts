import { request } from 'umi';

// 获取 CWE 列表的接口
export function getLicenseList() {
  return request<API.Response<LicenseListResponse>>('/api/help/licenses', {
    method: 'GET',
  });
}

// 假设 LicenseListResponse 类型在 data.d.ts 文件中定义
// 例如：
// export interface LicenseListResponse {
//   licenses: LicenseItem[];
// }
//
// export interface LicenseItem {
//   cwe_id: string;
//   description: string;
//   // 其他字段
// }
