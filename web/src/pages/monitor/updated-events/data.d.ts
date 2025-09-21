export interface Component {
  product: string;
  vendor: string;
  version: string;
}

export interface CPE {
  "<": string;
  product: string;
  type: string;
  update: string;
  vendor: string;
  version: string;
}

export interface Event {
  checksums: string[];
  comment: string;
  component: Component;
  cpe: CPE;
  description: string;
  exploits: Record<string, unknown>;
  last_modified_date: string;
  published_date: string;
}

export interface MonitorEventsResponse {
  data: {
    events: Event[];
  };
  status_code: number;
}
