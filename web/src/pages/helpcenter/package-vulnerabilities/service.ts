import { request } from 'umi';

// 获取包漏洞列表的接口
export function getPackageVulnerabilities(packageName: string, versionName: string, vendorName: string, fuzzy: boolean) {
  const params = {
    package: packageName,
    version: versionName,
    vendor: vendorName,
    fuzzy: fuzzy, // 新增 fuzzy 参数
  };
  return request<API.Response<PackageVulnerabilitiesResponse>>('/api/help/package/vulnerabilities', {
    method: 'GET',
    params,
  });
}

// 假设 PackageVulnerabilitiesResponse 类型在 data.d.ts 文件中定义
// 例如：
// export interface PackageVulnerabilitiesResponse {
//   vulnerabilities: VulnerabilityItem[];
// }
//
// export interface VulnerabilityItem {
//   id: string;
//   type: string;
//   year