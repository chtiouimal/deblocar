import { Schema, model, models, Types } from "mongoose";

export enum RetailPaymentStatus {
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  CANCELED = "canceled",
}

export interface IRetailPayment {
  retailUserId: Types.ObjectId;

  orderId: Types.ObjectId;

  stripePaymentIntentId: string;

  amount: number;

  currency: string;

  status: RetailPaymentStatus;
}

const RetailPaymentSchema = new Schema<IRetailPayment>(
  {
    retailUserId: {
      type: Schema.Types.ObjectId,
      ref: "RetailUser",
      required: true,
      index: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "RetailOrder",
      required: true,
    },

    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "tnd",
    },

    status: {
      type: String,
      enum: Object.values(RetailPaymentStatus),
      default: RetailPaymentStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

const RetailPayment =
  models.RetailPayment ||
  model<IRetailPayment>("RetailPayment", RetailPaymentSchema);

export default RetailPayment;
