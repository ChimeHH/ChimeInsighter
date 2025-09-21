
type MisconfigurationDetail = {
  threat_id: string;
  sub_type: string;
  severity: string;
  metadata: {
    category: string;
    prop: string;
    configured: string;
    suggested: number;
    rule: string;n
  };
  filepath: string[];
  checksum: string;
};

