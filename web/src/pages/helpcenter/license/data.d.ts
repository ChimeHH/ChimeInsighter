export interface LicenseReference {
  [languageCode: string]: {
    abbreviation?: string;
    fullName?: string;
    summary?: string;
    usageSuggestion?: string;
  };
}

export interface License {
  license: string;                // 许可证的名称  
  type: string;                   // 许可证类型
  reference: LicenseReference;    // 许可证的引用信息，支持多种语言
  url: string;                    // 许可证的 URL
}

export interface LicenseListResponse {
  data: {
      count: number;            // 许可证的数量
      licenses: License[];      // 许可证数组
  };
  status_code: number;            // 状态码
}
