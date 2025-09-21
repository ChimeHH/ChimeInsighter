// 定义文件信息的接口
export interface FileInfo {
  checksum: string;
  create_time: string; // ISO 时间格式化为字符串
  filepath: string;
  routine: string;
  status: string;
  term_id?: string;
  update_time?: string; // ISO 时间格式化为字符串
  version_id: string;
  worker_id?: string;
  worker_name: string;
}

// 定义文件数据结构的接口
export interface FilesData {
  [fileId: string]: FileInfo;
}

// 定义进度信息的接口
export interface ProgressInfo {
  canceled: number;
  completed: number;
  failed: number;
  percent: number;
  scans: number;
  unknown: number;
}

// 定义完整的 API 响应接口
export interface ActiveVersionStatusResponse {
  data: {
    files: FilesData;
    progress: ProgressInfo;
  };
  status_code: number;
}
