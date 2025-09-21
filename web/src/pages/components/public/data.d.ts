type Tag = Record<string, string[]>;

type PublicThreat = {
  threat_id: string;
  threat_type: string;
  sub_type: string;
  severity: string;
  work_status?: string;
  
  metadata: {
    cve_id: string;
    description: string;
    assigner: string;
    references: string[];
    last_modified_date: string;
    published_date: string;
    problem_types: string[];

    os_filtered?: string;
    source_filtered?: {
      [key: string]: number;
    };
  
    cpe?: {
      product: string;
      vendor: string;
      version: string;
      vulnerable: string;
    };

    metrics?: {
      baseMetricV2?: {
        cvssV2?: {
          accessComplexity: string;
          accessVector: string;
          authentication: string;
          availabilityImpact: string;
          baseScore: number;
          confidentialityImpact?: string;
          integrityImpact?: string;
          vectorString?: string;
          version?: string;
        };
      };

      baseMetricV3?: {
        cvssV3?: {
            attackComplexity: string;
            attackVector: string;
            availabilityImpact: string;
            baseScore: number,
            baseSeverity: string;
            confidentialityImpact?: string;
            integrityImpact?: string;
            privilegesRequired?: string;
            scope?: string;
            userInteraction?: string;
            vectorString?: string;
            version?: number;
        };
      };
    };
  };
};
