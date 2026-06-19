import {
  DevisFormData,
  StepInfoErrors,
  StepServicesErrors,
} from "@/types/devis";

const VIN_REQUIRED_BRANDS = ["BMW", "Mercedes"];

export const validateStep1 = (data: DevisFormData) => {
  const errors: StepInfoErrors = {};

  const { client } = data;

  // Name
  if (!client.name.trim()) {
    errors.name = "Nom obligatoire";
  }

  // Email
  if (!client.email.includes("@")) {
    errors.email = "Email invalide";
  }

  // Phone (simple + robust enough)
  const phoneRegex = /^[0-9+ ]{8,15}$/;
  if (!phoneRegex.test(client.phone)) {
    errors.phone = "Téléphone invalide";
  }

  // Brand
  if (!client.car.brand.trim()) {
    errors.brand = "Marque obligatoire";
  }

  // Model
  // if (!client.car.model.trim()) {
  //   errors.model = "Modèle obligatoire";
  // }

  // Year
  if (!client.car.year.trim()) {
    errors.year = "Année obligatoire";
  }

  // VIN strict (17 chars)
  // VIN → ONLY for BMW / Mercedes
  const requiresVin = VIN_REQUIRED_BRANDS.includes(client.car.brand);

  if (requiresVin) {
    if (!client.car.vin || client.car.vin.length !== 17) {
      errors.vin = "VIN doit contenir 17 caractères";
    }
  }

  // mPoste → always optional → NO validation needed

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const validateStep2 = (data: DevisFormData) => {
  const errors: StepServicesErrors = {};

  if (data.services.length === 0) {
    errors.services = "Sélectionnez au moins un service";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export function validateDevisBackend(body: any) {
  const errors: Record<string, string> = {};

  const { name, email, phone, brand, year, vin, services } = body;

  // NAME
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.name = "Nom invalide";
  }

  // EMAIL (strong regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "Email invalide";
  }

  // PHONE (basic international-friendly)
  const phoneRegex = /^[0-9+ ]{8,15}$/;
  if (!phone || !phoneRegex.test(phone)) {
    errors.phone = "Téléphone invalide";
  }

  // BRAND
  if (!brand || brand.trim().length < 2) {
    errors.brand = "Marque invalide";
  }

  // MODEL
  // if (!model || model.trim().length < 1) {
  //   errors.model = "Modèle invalide";
  // }

  // YEAR
  const yearNum = Number(year);
  const currentYear = new Date().getFullYear();

  if (!yearNum || yearNum < 1980 || yearNum > currentYear + 1) {
    errors.year = "Année invalide";
  }

  // VIN (17 chars strict)
  // VIN → ONLY BMW / Mercedes
  const requiresVin = VIN_REQUIRED_BRANDS.includes(brand);

  if (requiresVin) {
    if (!vin || vin.length !== 17) {
      errors.vin = "VIN doit contenir 17 caractères";
    }
  }

  // SERVICES
  if (!Array.isArray(services) || services.length === 0) {
    errors.services = "Sélectionnez au moins un service";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
