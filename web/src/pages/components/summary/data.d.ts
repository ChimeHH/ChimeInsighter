import type { Version } from '../version/data';

// 定义每个威胁级别的结构
interface ThreatLevelStats {
  [level: string]: number;
}

// 定义每个威胁类别的结构
interface ThreatSubTypeStats {
  [subtype: string]: ThreatLevelStats;
}

// 定义全部威胁类别的结构
export interface ThreatTypeStats {
  [type: string]: ThreatSubTypeStats;
}

// 定义安全评分的结构
export interface SecurityScores {
  cvssSecurityScore: number;
  exploitabilitySecurityScore: number;
  impactSecurityScore: number;
  overallSecurityScore: number;
}

// 定义文件统计的结构
export interface FileStats {
  [fileType: string]: number; // 文件类型及其计数
}

// 定义许可证统计的结构
export interface LicenseStats {
  [license: string]: number; // 许可证及其计数
}

// 定义软件包统计的结构
export interface PackageStats {
  [packageName: string]: {
    [version: string]: number; // 包名称及其多个版本的计数
  };
}

// 定义版本摘要的结构
export type VersionSummary = {
  project: {
    project_name: string;
    project_id: string;
  };
  version: Version;
  scores: SecurityScores; // 使用 SecurityScores 类型
  threats: ThreatTypeStats;
  files: FileStats; // 使用 FileStats 类型
  licenses: LicenseStats; // 使用 LicenseStats 类型
  packages: PackageStats; // 使用 PackageStats 类型
};

export type ThreatCount = {
  key: string;
  title: string;
  type: string; // 改为 string，因为 type 应该是一个字符串（例如 'zeroday'）
  total?: number;
  path: string;
};
