// 定义单个版本的状态信息接口
export interface VersionStatus {
  canceled: string;
  completed: string;
  create_time: string; // ISO 时间格式化为字符串
  failed: string;
  scans: string;
  unknown: string;
}

// 定义版本数据结构的接口
export interface VersionsData {
  [versionId: string]: VersionStatus;
}

// 定义完整的 API 响应接口
export interface GetVersionStatusResponse {
  data: {
    versions: VersionsData;
  };
  status_code: number;
}
