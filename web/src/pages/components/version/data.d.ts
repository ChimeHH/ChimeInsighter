import type { UploadFile } from "antd";
import type { Moment } from "moment";

type Version = {
  securityScores?: {
    cvssSecurityScore: number;
    exploitabilitySecurityScore: number;
    impactSecurityScore: number;
    overallSecurityScore: number;
  };
  created_time: string;
  start_time: string;
  finish_time: string;
  status: string;
  
  version_date: string;
  version_id: string;
  version_name: string;
  percentage_completed: number;
  analysis_status: number;
};

type VersionFormData = {
    version_id?: string;
    version_name?: string;
    version_date?: Moment;
    description?: string;
    files?: UploadFile[];    
}