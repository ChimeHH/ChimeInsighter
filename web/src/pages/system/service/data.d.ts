// 定义单个版本信息的接口
export interface VersionInfo {
  path: string;
  timestamp: number;
}

// 定义项目版本的接口
export interface ProjectVersions {
  [versionId: string]: VersionInfo;
}

// 定义版本数据结构的接口
export interface VersionsData {
  [projectId: string]: ProjectVersions;
}

// 定义完整的 API 响应接口
export interface GetCachedResponse {
  data: {
    versions: VersionsData;
  };
  status_code: number;
}
