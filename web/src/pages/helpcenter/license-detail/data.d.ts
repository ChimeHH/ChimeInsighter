export interface LicenseReference {
  [languageCode: string]: {
    abbreviation?: string;
    fullName?: string;
    summary?: string;
    usageSuggestion?: string;
  };
}

export interface License {
  license: string;           // 许可证类型  
  reference: LicenseReference;    // 许可证的引用信息，支持多种语言
  text: string;              // 许可证文本
  type: string;              // 许可证类型（如：permissive）
  url: string;               // 许可证链接
}

export interface LicenseDetailResponse {
  data: {
      license: License;      // 许可证详细信息
  };
  statusCode: number;        // 状态码
}
