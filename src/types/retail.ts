export interface RetailParameters {
  displayName: string;
  shortName: string;
  tokenCost: string;
  price: number;
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

export type RetailPaymentMethod = "tokens" | "card";

export interface RetailOrderItem {
  _id: string;

  orderId: string;

  hu: string;

  ntgName: string;

  displayName?: string;

  region: string;

  regionName?: string;

  version: string;

  versionName?: string;

  vin: string;

  tokenCost: number;

  status: string;

  createdAt: string;

  updatedAt: string;
}

export interface RetailOrder {
  _id: string;

  retailUserId: string;

  transactionId?: string;

  totalItems: number;

  totalTokens: number;

  balanceBefore: number;

  balanceAfter: number;

  status: string;

  items?: RetailOrderItem[];

  createdAt: string;

  updatedAt: string;
}

export interface RetailTransaction {
  _id: string;

  retailUserId:
    | string
    | {
        _id: string;
        email: string;
        name: string;
      };

  type: RetailTransactionType;

  amount: number;

  balanceBefore: number;

  balanceAfter: number;

  note: string;

  // new
  orderId?: RetailOrder | null;

  createdAt: string;

  updatedAt: string;
}

export interface RetailTransactionAdmin {
  _id: string;

  retailUserId: {
    _id: string;
    email: string;
    name: string;
  };

  type: RetailTransactionType;

  amount: number;

  balanceBefore: number;

  balanceAfter: number;

  note: string;

  // new
  orderId?: RetailOrder | null;

  createdAt: string;

  updatedAt: string;
}

export interface CreateOrderItem {
  hu: string;
  region: string;
  version: string;
  vin: string;
}

export interface CreateOrderBody {
  items: CreateOrderItem[];

  paymentMethod: RetailPaymentMethod;
}

export interface CreateOrderResponse {
  message?: string;

  orderId: string;

  balance?: number;

  paymentRequired?: boolean;

  clientSecret?: string;
}