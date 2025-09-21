
type LeakageDetail = {
  checksum: string;
  filepath: string[];
  sub_type: string;
  severity: string;
  threat_id: string;
  metadata?: {
    text: string;
    offset: number;
    length: number;
    pattern: string;
    rule: string;
    
    reference?: [key: string]: any;
  };
};