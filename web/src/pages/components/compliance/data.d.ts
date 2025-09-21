type ComplianceMetadata = {
  description: string;
  linked_name: string;
  name?: string;
  state?: string;
};

type ComplianceThreat = {
  severity: string;
  threat_id: string;
  sub_type: string;
  filepath: string[];
  metadata: ComplianceMetadata;
};
