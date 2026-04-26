import { DevisFormData } from "@/types/devis";

export const initialDevisFormData: DevisFormData = {
  client: {
    name: "",
    phone: "",
    email: "",
    car: {
      brand: "",
      model: "",
      year: "",
      vin: "",
    },
  },
  services: [],
};

export const CAR_DATA = {
  BMW: ["M3", "M4", "X5", "i8"],
  Mercedes: ["C-Class", "E-Class", "S-Class", "AMG GT"],
  Mazda: ["CX-5", "Mazda 3", "Mazda 6"],
  Kia: ["Sportage", "Sorento", "Picanto"],
};

export const AVAILABLE_SERVICES = [
  "Navigation",
  "Apple CarPlay",
  "Android Auto",
  "Pack Sport",
  "Aides à la conduite",
  "Dashcam",
  "Vision 360°",
  "Alarme constructeur",
  "Diagnostic électronique",
  "Mise à jour système",
  "Codage pièce",
  "Vérification kilométrage",
  "Retrofit OEM",
  "Langue système",
];