type LeakageMetadata = {
  length: number;
  offset: number;
  text: string;
};

type LeakageThreat = {
  threat_id: string;
  sub_type: string;
  severity: string;
  metadata: LeakageMetadata;
  filepath: string[];
  checksum: string;
};
