import { Schema, model, models, Types } from "mongoose";
import "@/models/RetailUser";

export interface IRetailWallet {
  retailUserId: Types.ObjectId;
  balance: number;
}

const RetailWalletSchema = new Schema<IRetailWallet>(
  {
    retailUserId: {
      type: Schema.Types.ObjectId,
      ref: "RetailUser",
      required: true,
      unique: true,
      index: true,
    },

    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const RetailWallet =
  models.RetailWallet ||
  model<IRetailWallet>("RetailWallet", RetailWalletSchema);

export default RetailWallet;
