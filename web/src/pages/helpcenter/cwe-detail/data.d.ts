export interface ObservedExample {
  Description: string;
  Link: string;
  Reference: string;
}

export interface PotentialMitigation {
  Description: string;
  Phase: string;
}

export interface RelatedWeakness {
  // 这里可以添加相关弱点的属性
}

export interface Audience {
  Description: string;
  Type: string;
}

export interface View {
  audience: Audience[];
  mapping_notes: {
      Comments: string;
      Rationale: string;
      Usage: string;
  };
  members: string[];
  name: string;
  objective: string;
  status: string;
  type: string;
  view_id: string;
}

export interface CweDetail {
  abstraction: string;
  applicable_platforms: any[];
  cwe_id: string;
  demonstrative_examples: any[];
  description: string;
  extended_description: string;
  name: string;
  observed_examples: ObservedExample[];
  potential_mitigations: PotentialMitigation[];
  related_weaknesses: RelatedWeakness[];
  status: string;
  structure: string;
  web_link: string;
}

export interface CweDetailResponse {
  data: {
      cwe: CweDetail;
      view: View[];
  };
  status_code: number;
}
