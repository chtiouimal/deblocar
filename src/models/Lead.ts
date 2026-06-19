import mongoose, { Schema, models, model } from "mongoose";

const LeadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    vin: {
      type: String,
      default: null,
    },
    mPoste: { type: String, default: null },

    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      default: null,
    },

    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      required: true,
    },

    score: {
      type: String,
      enum: ["Chaud", "Tiède", "Froid"],
      default: "Tiède",
    },

    date: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Lead = models.Lead || model("Lead", LeadSchema);

export default Lead;
