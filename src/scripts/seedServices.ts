import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";

const services = [
  {
    title: "Navigation",
    description:
      "Activation du système de navigation constructeur avec cartographie à jour et guidage intégré.",
    price: 240,
  },
  {
    title: "Apple CarPlay",
    description:
      "Accédez à vos applications essentielles directement depuis l'écran d'origine.",
    price: 240,
  },
  {
    title: "Android Auto",
    description:
      "Intégration fluide de vos applications Android au système multimédia.",
    price: 240,
  },
  {
    title: "Pack Sport",
    description:
      "Déverrouillage des modes de conduite et affichages dynamiques.",
    price: 240,
  },
  {
    title: "Aides à la conduite",
    description: "Activation des systèmes d'assistance avancés du véhicule.",
    price: 240,
  },
  {
    title: "Dashcam",
    description: "Enregistrement vidéo via les caméras d'origine du véhicule.",
    price: 240,
  },
  {
    title: "Vision 360°",
    description:
      "Activation des caméras périphériques pour une visibilité complète.",
    price: 240,
  },
  {
    title: "Alarme constructeur",
    description:
      "Activation du système antivol avec capteurs et alerte sonore.",
    price: 240,
  },
  {
    title: "Diagnostic électronique",
    description: "Lecture et suppression des défauts avec analyse complète.",
    price: 240,
  },
  {
    title: "Mise à jour système",
    description:
      "Installation des dernières versions logicielles constructeur.",
    price: 240,
  },
  {
    title: "Codage pièce",
    description: "Appairage électronique des composants remplacés.",
    price: 240,
  },
  {
    title: "Vérification kilométrage",
    description: "Analyse croisée des données pour un contrôle fiable.",
    price: 240,
  },
  {
    title: "Retrofit OEM",
    description: "Ajout d'options constructeur avec intégration d'origine.",
    price: 240,
  },
  {
    title: "Langue système",
    description: "Ajout de langues supplémentaires au système du véhicule.",
    price: 240,
  },
];

async function seedServices() {
  try {
    await connectDB();

    await Service.deleteMany({});

    await Service.insertMany(services);

    console.log("Services seeded");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedServices();
