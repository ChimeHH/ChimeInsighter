
type ZerodayThreat = {
  threat_id: string;
  threat_type: string;
  sub_type: string;
  severity: string;
  work_status?: string;
    
  risks?: string[];  
  vulnerability_story?: {
    params: {
      values: {
        file_name: string;
      };
    };
  metadata: {
    additional_source_rvas: any[];
    callstack: {
      address: string;
      function_rva: string;
      is_exported: boolean;
      name: string;
    }[];
    cwes: string[];
    disassembly: {
      block_addr: number;
      function_name: string;
      block_ins: {
        address: number;
        instruction: string;
        type: string;
      }[];
    }[];
    function_name: string;
    is_verified: boolean;
    regs: Record<string, string>;
    rva: number;
    source: Record<string, {
      file_line: string;
      file_path: string;
      func_name: string;
    }>;
    vulnerability_sub_type: string;
    vulnerability_type: string;
  };
};
