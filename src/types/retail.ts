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
  versions: RetailVersions[];
}

export interface RetailVersions {
  shortName: string;
  displayName: string;
}

export type RetailTransactionType = "topup" | "consume";

export interface RetailTransaction {
  _id: string;
  retailUserId: string;
  type: RetailTransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}