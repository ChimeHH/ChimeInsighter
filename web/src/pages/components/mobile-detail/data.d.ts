type MetadataC = {  
  cwes?: string[]; // 用可选属性来处理可能存在的cwes属性
  cwe?: string; // 用可选属性来处理可能存在的cwe属性
  additional_source_rvas?: number[];
  buffer_definition_rva?: number;
  buffer_size?: number;
  callstack?: {
    address: string;
    function_rva: string;
    is_exported: string;
    name: string;
  }[];
  file_line?: number | null;
  file_path?: string | null;
  func_name?: string;
  disassembly?: {
    block_addr: number;
    block_ins: {
      address: number;
      instruction: string;
      type: string;
    }[];
    function_name: string;
  }[];
  function_name?: string;
  is_verified?: boolean;
  operation?: string;
  operation_size?: number;
  operation_size_definitions_rva?: number[];
  regs?: {
    pc: string;
    r0: string;
    r1: string;
    r10: string;
    r11: string;
    r2: string;
    r3: string;
    r4: string;
    r5: string;
    r6: string;
    r7: string;
    r8: string;
    r9: string;
    sp: string;
  };
  rva?: number;
  source?: {
    [key: string]: {
      file_line: number | null;
      file_path: string | null;
      func_name: string;
    };
  };
  vulnerability_sub_type?: string;
  vulnerability_type?: string;
};

type MetadataM = {
  cwe?: string;
  description?: string;
  files?: {
    file_path: string;
    match_lines: number[];
    match_position: number[];
    match_string: string;
  }[];
  masvs?: string;
  owasp_mobile?: string;
  reference?: string;
  severity?: string;
  vulnerability_sub_type?: string;
  vulnerability_type?: string;
};

type MetadataQ = {
  apk_exploit_dict?: { [key: string]: any }; 
  category?: string;
  description?: string;
  file_object?: string;
  line_number?: string;
  severity?: string;
  vulnerability_sub_type?: string;
  vulnerability_type?: string;
};

type SourceLineType = {
  classname?: string;
  end?: string;      
  endBytecode?: string; 
  sourcefile?: string;   
  sourcepath?: string;   
  start?: string;    
  startBytecode?: string;       
} | {
  classname?: string;
  end?: string;      
  endBytecode?: string; 
  sourcefile?: string;   
  sourcepath?: string;   
  start?: string;    
  startBytecode?: string;       
}[]; // 可以是对象数组或单个对象

type ClassType = {
  SourceLine?: SourceLineType; 
  classname?: string;   
};

type MethodType = {
  SourceLine?: SourceLineType; 
  classname?: string;   
  isStatic?: string;   
  name?: string;   
  signature?: string;  
};

type MetadataS = {
  Class?: ClassType;        
  Method?: MethodType;      
  SourceLine?: SourceLineType;  
  abbrev?: string;          
  category?: string;        
  rank?: string;            
  severity?: string;        
  vulnerability_sub_type?: string;      
  vulnerability_type?: string;  
};


type ZerodayDetail = {  
  checksum: string;
  filepath: string[];
  metadata?: MetadataC | MetadataM | MetadataQ | MetadataS; // 使用联合类型表示可能存在的四种metadata
  severity: string;
  sub_type: string;
  threat_id: string;
  type: string;
  version_id: string;
};
