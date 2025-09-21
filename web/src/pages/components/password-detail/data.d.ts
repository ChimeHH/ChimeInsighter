
type PasswordDetailMetadata = {
  offset: number;
  password: string;
  text: string;
  type: string;
};

type PasswordDetail = {
  _id: string;
  checksum: string;
  filepath: string[];
  metadata: PasswordDetailMetadata;
  severity: string;
  sub_type: string;
  threat_id: string;
  type: string;
  version_id: string;
};
