import { Schema, model, models, Types } from "mongoose";

export enum RetailOrderItemStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export interface IRetailOrderItem {
  orderId: Types.ObjectId;

  hu: string;
  ntgName: string;
  displayName: string;

  region: string;
  regionName: string;

  version: string;
  versionName: string;

  vin: string;

  tokenCost: number;

  pin?: string;

  status: RetailOrderItemStatus;

  error?: string;
}

const RetailOrderItemSchema = new Schema<IRetailOrderItem>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "RetailOrder",
      required: true,
      index: true,
    },

    hu: {
      type: String,
      required: true,
    },

    ntgName: {
      type: String,
      required: true,
    },

    displayName: {
      type: String,
      required: true,
    },

    region: {
      type: String,
      required: true,
    },

    regionName: {
      type: String,
      required: true,
    },

    version: {
      type: String,
      required: true,
    },

    versionName: {
      type: String,
      required: true,
    },

    vin: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    tokenCost: {
      type: Number,
      required: true,
    },

    pin: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(RetailOrderItemStatus),
      default: RetailOrderItemStatus.PENDING,
    },

    error: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const RetailOrderItem =
  models.RetailOrderItem ||
  model<IRetailOrderItem>("RetailOrderItem", RetailOrderItemSchema);

export default RetailOrderItem;
