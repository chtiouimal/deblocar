import { Schema, models, model } from "mongoose";

const CitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const City = models.City || model("City", CitySchema);

export default City;
