import { Schema, model, models } from "mongoose";

export interface IRetailUser {
  email: string;
  name: string;
  password: string;
}

const RetailUserSchema = new Schema<IRetailUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const RetailUser =
  models.RetailUser || model<IRetailUser>("RetailUser", RetailUserSchema);

export default RetailUser;
