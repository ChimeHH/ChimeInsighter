import { request } from 'umi';

// 获取 CWE 详情的接口
export function getCweDetail(id: string) {
  return request<API.Response<CweDetailResponse>>(`/api/help/cwe?id=${id}`, {
    method: 'GET',
  });
}

// 假设 CweDetailResponse 类型在 data.d.ts 文件中定义
// 例如：
// export interface CweDetailResponse {
//   cwe_id: string;
//   description: string;
//   // 其他字段
// }
