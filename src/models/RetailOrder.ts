import { Schema, model, models, Types } from "mongoose";

export enum RetailOrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  PARTIAL = "partial",
  FAILED = "failed",
  ACTION_REQUIRED = "action_required",
}

export enum RetailPaymentMethod {
  TOKENS = "tokens",
  CARD = "card",
}

export interface IRetailOrder {
  retailUserId: Types.ObjectId;

  transactionId?: Types.ObjectId;

  totalItems: number;

  totalTokens: number;

  balanceBefore: number;

  balanceAfter: number;

  status: RetailOrderStatus;

  paymentMethod: RetailPaymentMethod;

  paymentId?: Types.ObjectId;
}

const RetailOrderSchema = new Schema<IRetailOrder>(
  {
    retailUserId: {
      type: Schema.Types.ObjectId,
      ref: "RetailUser",
      required: true,
      index: true,
    },

    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "RetailTokenTransaction",
      default: null,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "RetailPayment",
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(RetailPaymentMethod),
      default: RetailPaymentMethod.TOKENS,
    },

    totalItems: {
      type: Number,
      required: true,
    },

    totalTokens: {
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

    status: {
      type: String,
      enum: Object.values(RetailOrderStatus),
      default: RetailOrderStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

// ✅ Virtual populate Order -> OrderItems
RetailOrderSchema.virtual("items", {
  ref: "RetailOrderItem",
  localField: "_id",
  foreignField: "orderId",
});

RetailOrderSchema.set("toJSON", {
  virtuals: true,
});

RetailOrderSchema.set("toObject", {
  virtuals: true,
});

const RetailOrder =
  models.RetailOrder || model<IRetailOrder>("RetailOrder", RetailOrderSchema);

export default RetailOrder;
