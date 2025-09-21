import { request } from 'umi';

// 获取 CWE 列表的接口
export function getCweList() {
  return request<API.Response<CweListResponse>>('/api/help/cwes', {
    method: 'GET',
  });
}

// 假设 CweListResponse 类型在 data.d.ts 文件中定义
// 例如：
// export interface CweListResponse {
//   cwes: CweItem[];
// }
//
// export interface CweItem {
//   cwe_id: string;
//   description: string;
//   // 其他字段
// }
