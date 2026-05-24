import { Schema, models, model } from "mongoose";

const DevisSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: String, required: true },

    vin: { type: String, required: true },
    services: { type: [String], required: true },
  },
  {
    timestamps: true,
  },
);

const Devis = models.Devis || model("Devis", DevisSchema);

export default Devis;
