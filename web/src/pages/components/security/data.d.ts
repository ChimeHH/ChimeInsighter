
type Metadata = {
  data: string[];
};

type SecurityThreat = {
  severity: string;
  threat_id: string;
  sub_type: string;
  filepath: string[];
  metadata: Metadata;
};
