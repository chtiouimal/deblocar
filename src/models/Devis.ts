import mongoose, { Schema, models, model } from "mongoose";

const DevisSchema = new Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    brand: { type: String, required: true },
    // model: { type: String, required: true },
    year: { type: String, required: true },

    vin: { type: String, default: null },
    mPoste: { type: String, default: null },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: null,
    },

    location: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Devis = models.Devis || model("Devis", DevisSchema);

export default Devis;
