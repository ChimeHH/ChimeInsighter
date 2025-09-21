const threat_type = {
  'public': 'Public Vulnerabilities', 
  'zeroday': '0Day Vulnerabilities',
  'mobile': 'Mobile Vulnerabilities', 
  'compliance': 'Compliance',
  'infoleak': 'Information Leakage',
  'hardening': 'Hardening',

  'encryption': 'Encryption',
  'uncategorized': 'Uncategorized',
  'deprecated': 'Unsafe Function',
  'misconfiguration': 'Security Misconfigurations',
};

const analysis_status = {
  0: 'queued ', // When the version files are queued before being analyzed
  1: 'processing ', // When the version files are still being analyzed
  2: 'finished', // When all the version files finished the analysis
  3: 'error', // When there was an error during the analysis stage
  4: 'final analysis', // When the scan is its final analysis stage
};

const severityMap = {
  '': 'Not Defined',
  '*': 'Not Defined',
  'critical': 'Critical',
  'high': 'High',
  'medium': 'Medium',
  'low': 'Low',
  'none': 'None', 
  'advice': 'Advice',
};

// 定义颜色映射
const severityColorMap = {
  '': '#ADD8E6', // 浅蓝色
  '*': '#B0E0E6', // 浅蓝色
  'critical': '#8B0000', // 深红色
  'high': '#FF4500', // 红色 （亮红）
  'medium': '#FFA500', // 橙色
  'low': '#FFFF00', // 黄色
  'none': '#D3D3D3', // 浅灰色
  'advice': '#D3D3D3', // 浅灰色
};


const workStatusMap = {
  'NoStatus': 'No Status',
  'Ignored': 'Ignored',
  'InProgress': 'In Progress',
  'Fixed': 'Fixed',
  'Mitigated': 'Mitigated',
  'FalsePositive': 'False Positive',
}

// 定义工作状态颜色映射
const workStatusColorMap = {
  'NoStatus': '#FFD700',     // 黄色
  'Ignored': '#bfbfbf',      // 灰色
  'InProgress': '#1890ff',   // 蓝色
  'Fixed': '#52c41a',        // 绿色
  'Mitigated': '#A3D8A0',    // 浅绿色
  'FalsePositive': '#bfbfbf', // 灰色
};

const infoleakTypeMap = {
  'base_64': 'Base64 Encoded Data',
  'cid': 'CID',
  'crypto': 'Cryptographic Key',
  'domain': 'Domain',
  'email': 'Email',
  'gps': 'GPS Location',
  'ip': 'IPv4/IPv6 Address',
  'path': 'File SystemPath',
  'phone': 'Mobile Number',
  'ssl': 'SSL Certificate',
  'url': 'URL and Domain',  
};

const complianceTypeMap = {
  'AUTOSAR': 'AUTOSAR',
  'CERT-C': 'CERT',
  'CERT-C++': 'CERT',
  'CERT-Go': 'CERT',
  'CERT-Java': 'CERT',
  'CERT-JavaScript': 'CERT',
  'CERT-PHP': 'CERT',
  'CERT-Perl': 'CERT',
  'CERT-Python': 'CERT',
  'CERT-Ruby': 'CERT',
  'CERT-Rust': 'CERT',
  'CERT-SHELL': 'CERT',
  'CERT-Swift': 'CERT',
  'CIS_Controls': 'CIS Controls',
  'CWE_Top_25': 'CWE Top 25',
  'ESCR-IPA': 'ESCR-IPA',
  'MISRA': 'MISRA',
  'MISRA-2012': 'MISRA',
  'Deprecated': 'Deprecated Function',
  'Dangerous': 'Dangerous Function',
  'ISO21434-C': 'ISO21434',
  'ISO21434-C++': 'ISO21434',
  'ISO21434-J': 'ISO21434',
  'ISO21434-PHP': 'ISO21434',
  'ISO21434-Perl': 'ISO21434',
  'ISO21434-Python': 'ISO21434',
  'ISO21434-Ruby': 'ISO21434',
  'ISO26262': 'ISO26262',
  'ISO_27002': 'ISO 27002',
  'ISO_27017': 'ISO 27017',
  'ISO_27018': 'ISO 27018',
  'NIST_SP_800-171': 'NIST SP 800-171',
  'NIST_SP_800-172': 'NIST SP 800-172',
  'NIST_SP_800-53': 'NIST SP 800-53',
  'OWASP_Top_10': 'OWASP Top 10',
  'PCI_DSS': 'PCI DSS',
  'PCI_DSS_3.2.1': 'PCI DSS',
  'SANS_Top_25': 'SANS Top 25'
};



const securityTypeMap = {
  'functions': 'Functions',
  'varnames': 'Variables',
  'hardening': 'Hardening',
  'linked libs': 'Linked Libs',
  'external functions': 'External Functions',
  'external varnames': 'External Variables',
  'entries': 'General Entries',
};

const misconfigurationTypeMap = {
  'linux_kernel': 'Linux Kernel',
  'linux_password': 'Linux Password',
  'ssh': 'SSH Server',
  'web_server': 'Web Server',
  'win_registry': 'Microsoft Windows Registry',
};

const zerodayTypeMap = {
  'qscan' : 'Apk & Java Scan',
  'mscan' : 'Java, Js, Swift, Kotlin... Scan',
  'sscan' : 'Apk & Jar & Java Scan',
  'cscan' : 'C/C++ Binary Scan',
};

const zerodayMetaTypeMap = {
  'Buffer Overflow': 'Buffer Overflow',
  'Heap Overflow': 'Heap Overflow',
  'Stack Overflow': 'Stack Overflow',
  'Use After Free': 'Use After Free',
  'Double Free': 'Double Free',
  'Format String': 'Format String',
  'Format String Overflow': 'Format String Overflow',
  'Dangerous Function Use': 'Dangerous Function Use',
  'Unchecked Return Value': 'Unchecked Return Value',
  'Null Dereference': 'Null Dereference',
  'Return of Stack Variable': 'Return of Stack Variable',
  'Free Non-Heap Object': 'Free Non-Heap Object',
  'Uninitialized Data': 'Uninitialized Data',
  'String Corruption': 'String Corruption',
  'Network Deadlock': 'Network Deadlock',
  'Command Injection': 'Command Injection',
  'Resource Consumption': 'Resource Consumption',
  'Path Traversal': 'Path Traversal',
  'Use of Obsolete Function': 'Use of Obsolete Function',
  'Incorrect Check of Return Value': 'Incorrect Check of Return Value',
  'Race Condition': 'Race Condition',
  'Divide by Zero': 'Divide by Zero',
  'Memory Leak': 'Memory Leak',
  'Untrusted Search Path': 'Untrusted Search Path',
  'Pointer Subtraction for Size': 'Pointer Subtraction for Size',
  'Undefined Behaviour': 'Undefined Behaviour',
  'Missing Default Case in Switch-Case': 'Missing Default Case in Switch-Case',
  'Reentrant Violation Vulnerability': 'Reentrant Violation Vulnerability',
  'Wrong Operation on Resource': 'Wrong Operation on Resource',
  'Improper Locking': 'Improper Locking',
  'Recursion': 'Recursion',
  'Improper Handle Use': 'Improper Handle Use',
  'Infinite Loop': 'Infinite Loop',
  'Signed Unsigned Overflow': 'Signed Unsigned Overflow',
  'Use of Forbidden function': 'Use of Forbidden Function',
  'Weak Cryptography': 'Weak Cryptography',
};

const zerodayMetaSubTypeMap = {
  'null-dereference': 'Null Dereference',
  'return-of-stack-variable': 'Return of Stack Variable',
  'unchecked-return-value': 'Unchecked Return Value',
  'use-after-free': 'Use After Free',
  'double-free': 'Double Free',
  'free-non-heap-obj': 'Free Non-Heap Object',
  'deadlock': 'Deadlock',
  'forbidden-function': 'Forbidden Function',
  'input-analysis': 'Input Analysis',
  'invalid-argument': 'Invalid Argument',
  'invalid-memory-buffer': 'Invalid Memory Buffer',
  'uninitialized-input': 'Uninitialized Input',
  'uninitialized-return': 'Uninitialized Return',
  'wrong-size-memset': 'Wrong Size Memset',
  'format-string-overflow': 'Format String Overflow',
  'heap-overflow-string': 'Heap Overflow String',
  'string-corruption': 'String Corruption',
  'mutex-deadlock': 'Mutex Deadlock',
  'signed-unsigned-overflow': 'Signed Unsigned Overflow',
  'command-injection': 'Command Injection',
  'obsolete-function': 'Obsolete Function',
  'information-exposure': 'Information Exposure',
  'information-exposure-via-error': 'Information Exposure via Error',
  'code-complexity': 'Code Complexity',
  'recursion': 'Recursion',
  'copy-to-static-overflow': 'Copy to Static Overflow',
  'infinite-loop': 'Infinite Loop',
  'missing-default-case': 'Missing Default Case',
  'forbidden-mktemp-call': 'Forbidden mktemp Call',
  'forbidden-function-used': 'Forbidden Function Used',
  'weak-crypto-method': 'Weak Crypto Method',
  'toc-tou': 'TOC-TOU',
  'format-string': 'Format String',
};


export { threat_type, analysis_status, severityMap, severityColorMap, workStatusMap, workStatusColorMap, 
         infoleakTypeMap, complianceTypeMap, securityTypeMap, misconfigurationTypeMap, 
         zerodayTypeMap, zerodayMetaTypeMap, zerodayMetaSubTypeMap };
