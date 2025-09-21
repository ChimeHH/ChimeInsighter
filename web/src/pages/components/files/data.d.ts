export interface FileInfo {
  _id: string;
  checksum: string;
  file_id: string;
  filepath: string;
  filepath_r: string[];
  filetype: string;
  oss_percent: number;
  hashes: {
    md5: string;
    sha1: string;
    sha256: string;
    tlsh?: string;
  };
  labels: string[];
  size: number;
  version_id: string;
}

