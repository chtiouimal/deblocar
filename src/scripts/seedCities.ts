import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "@/lib/mongodb";
import City from "@/models/City";

const cities = [
  { name: "Tunis" },
  { name: "Ariana" },
  { name: "Ben Arous" },
  { name: "La Manouba" },

  { name: "Nabeul" },
  { name: "Zaghouan" },
  { name: "Bizerte" },

  { name: "Béja" },
  { name: "Jendouba" },
  { name: "Le Kef" },
  { name: "Siliana" },

  { name: "Sousse" },
  { name: "Monastir" },
  { name: "Mahdia" },
  { name: "Sfax" },

  { name: "Kairouan" },
  { name: "Kasserine" },
  { name: "Sidi Bouzid" },

  { name: "Gabès" },
  { name: "Médenine" },
  { name: "Tataouine" },

  { name: "Gafsa" },
  { name: "Tozeur" },
  { name: "Kébili" },
];

async function seedCities() {
  try {
    await connectDB();

    await City.deleteMany({});

    await City.insertMany(cities);

    console.log("Cities seeded");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedCities();
