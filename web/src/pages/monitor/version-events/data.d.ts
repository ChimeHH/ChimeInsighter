export interface Component {
  product: string;
  vendor: string;
  version: string;
}

export interface CPE {
  "<=": string;
  product: string;
  type: string;
  update: string;
  vendor: string;
  version: string;
}

export interface EventDetails {
  checksums: string[];
  component: Component;
  cpe: CPE;
  description: string;
  exploits: Record<string, string>;
  last_modified_date: string;
  published_date: string;
  reason: string;
}

export interface MonitorVersionEventsResponse {
  data: {
    events: Record<string, EventDetails>;
  };
  status_code: number;
}
