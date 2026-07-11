export interface RetailParameters {
  displayName: string;
  shortName: string;
  tokenCost: string;
  ecu: string;
  images: string[];
  ntgName: string;
  order: number;
  regions: RetailRegions[];
}

export interface RetailRegions {
  shortName: string;
  displayName: string;
  versions: RetailVersions[]
}

export interface RetailVersions {
  shortName: string;
  displayName: string;
}