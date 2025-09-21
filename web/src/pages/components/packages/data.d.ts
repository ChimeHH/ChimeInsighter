export interface PackageInfo {
  uid: string;
  checksum: string;
  clone: string | null;
  copyrights: string[] | null;
  fullname: string;
  licenses: string[];
  version: string;
  scale: number;
  integrity: number;
  downloadurl: string | null;
  release_time: string | null;
}
