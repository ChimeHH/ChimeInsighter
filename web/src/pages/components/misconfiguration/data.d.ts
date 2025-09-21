
type MisconfigurationThreat = {
  threat_id: string;
  sub_type: string;
  severity: string;
  metadata: {
    category: string;
    prop: string;
    configured: string;
    suggested: number;
    rule: string;
  };
  filepath: string[];
  checksum: string;
};
