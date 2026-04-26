import { DevisFormData, StepInfoErrors, StepServicesErrors } from "@/types/devis";

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
  if (!client.car.model.trim()) {
    errors.model = "Modèle obligatoire";
  }

  // Year
  if (!client.car.year.trim()) {
    errors.year = "Année obligatoire";
  }

  // VIN strict (17 chars)
  if (client.car.vin.length !== 17) {
    errors.vin = "VIN doit contenir 17 caractères";
  }

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