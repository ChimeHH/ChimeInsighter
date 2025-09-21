type Metadata = {
  data: string[];
};

type SecurityDetail = {
  severity: string;
  threat_id: string;
  sub_type: string;
  filepath: string[];
  metadata: Metadata;
};
