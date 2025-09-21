type Reference = {
  cn: {
    fullName: string;
    abbreviation: string;
    summary: string;
    usageSuggestion: string;
  };
  en: {
    fullName: string;
    abbreviation: string;
    summary: string;
    usageSuggestion: string;
  };
};

type LicenseDetail = {
  license: string;
  reference: Reference;
  type: string;
  url: string;
  text: string;
  comments: string;
};


type PackageDetail = {
  checksum: string;
  clone: null | string;
  copyrights: string[];
  downloadurl: null | string;
  filepath: string[];
  fullname: string;
  integrity: number;
  licenses: LicenseDetail[];
  release_time: string;
  scale: number;
  uid: string;
  version: string;
};


