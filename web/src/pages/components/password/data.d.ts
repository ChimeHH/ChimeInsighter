type PasswordMetadata = {
  offset: number;
  text: string;
  type: string;
  password: string;
};

type PasswordThreat = {  
  threat_id: string;
  sub_type: string;
  severity: string;
  metadata: PasswordMetadata;
  filepath: string[];
  checksum: string;
  type: string;
};
