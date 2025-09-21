export interface Cwe {
  cwe_id: string;
  description: string;
  name: string;
}

export interface CweListResponse {
  data: {
      count: number;
      cwes: Cwe[];
  };
  status_code: number;
}
