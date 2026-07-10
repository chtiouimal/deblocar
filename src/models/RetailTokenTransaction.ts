import { Schema, model, models, Types } from "mongoose";

export enum TokenTransactionType {
  TOPUP = "topup",
  CONSUME = "consume",
}

export interface IRetailTokenTransaction {
  retailUserId: Types.ObjectId;

  type: TokenTransactionType;

  amount: number;

  balanceBefore: number;

  balanceAfter: number;

  note?: string;
}

const RetailTokenTransactionSchema = new Schema<IRetailTokenTransaction>(
  {
    retailUserId: {
      type: Schema.Types.ObjectId,
      ref: "RetailUser",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(TokenTransactionType),
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    balanceBefore: {
      type: Number,
      required: true,
    },

    balanceAfter: {
      type: Number,
      required: true,
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const RetailTokenTransaction =
  models.RetailTokenTransaction ||
  model<IRetailTokenTransaction>(
    "RetailTokenTransaction",
    RetailTokenTransactionSchema,
  );

export default RetailTokenTransaction;
