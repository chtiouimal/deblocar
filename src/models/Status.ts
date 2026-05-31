import { Schema, model, models } from "mongoose";

const StatusSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      unique: true,
    },

    color: {
      type: String,
      default: "blue", // optional for UI badges
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Status = models.Status || model("Status", StatusSchema);

export default Status;
