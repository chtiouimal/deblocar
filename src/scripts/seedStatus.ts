import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "@/lib/mongodb";
import Status from "@/models/Status";

const statuses = [
  { label: "Nouveau", color: "blue" },
  { label: "à appeler", color: "yellow" },
  { label: "Appelé", color: "orange" },
  { label: "Faisable", color: "green" },
  { label: "Non faisable", color: "red" },
  { label: "Devis envoyé", color: "cyan" },
  { label: "RDV fixé", color: "violet" },
  { label: "Converti", color: "teal" },
  { label: "Perdu", color: "gray" },
];

async function seed() {
  await connectDB();

  await Status.deleteMany({});
  await Status.insertMany(statuses);

  console.log("Statuses seeded");
  process.exit(0);
}

seed();
