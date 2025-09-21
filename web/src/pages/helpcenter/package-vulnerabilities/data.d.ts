export interface Vulnerability {
  _id: string;
  assigner: string;
  component: {
    product: string;
    vendor: string;
    version: string | null;
  };
  cpe: {
    "<": string;
    ">=": string;
    product: string;
    type: string;
    update: string;
    vendor: string;
    version: string;
  };
  cpes: {
    "<": string;
    ">=": string;
    product: string;
    type: string;
    update: string;
    vendor: string;
    version: string;
  }[];
  cve_id: string;
  description: string;
  last_modified_date: string;
  metrics: {
    baseMetricV2: {
      cvssV2: {
        accessComplexity: string;
        accessVector: string;
        authentication: string;
        availabilityImpact: string;
        baseScore: number;
        confidentialityImpact: string;
        integrityImpact: string;
        vectorString: string;
        version: string;
      };
      exploitabilityScore: number;
      impactScore: number;
      obtainAllPrivilege: boolean;
      obtainOtherPrivilege: boolean;
      obtainUserPrivilege: boolean;
      severity: string;
      userInteractionRequired: boolean;
    };
    baseMetricV3: {
      cvssV3: {
        attackComplexity: string;
        attackVector: string;
        availabilityImpact: string;
        baseScore: number;
        baseSeverity: string;
        confidentialityImpact: string;
        integrityImpact: string;
        privilegesRequired: string;
        scope: string;
        userInteraction: string;
        vectorString: string;
        version: string;
      };
      exploitabilityScore: number;
      impactScore: number;
    };
  };
  problem_types: string[];
  published_date: string;
  references: string[];
  source: string[];
}

export interface PackageVulnerabilitiesResponse {
  data: {
    results: Vulnerability[];
  };
  status_code: number;
}
