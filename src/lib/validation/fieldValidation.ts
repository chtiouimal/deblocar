export const validateField = (field: string, value: string): string | null => {
  switch (field) {
    case "name":
      return value.trim() ? null : "Nom obligatoire";

    case "email":
      return value.includes("@") ? null : "Email invalide";

    case "phone":
      return /^[0-9+ ]{8,15}$/.test(value) ? null : "Téléphone invalide";

    case "brand":
      return value ? null : "Marque obligatoire";

    case "model":
      return value ? null : "Modèle obligatoire";

    case "year":
      return value ? null : "Année obligatoire";

    case "vin":
      return value.length === 17 ? null : "VIN doit contenir 17 caractères";

    case "services":
      return value.length > 0 ? null : "Sélectionnez au moins un service";

    default:
      return null;
  }
};

export const validateName = (name: string) => {
  if (!name.trim()) return "Nom obligatoire";
};

export const validateEmail = (email: string) => {
  if (!email.includes("@")) return "Email invalide";
};

export const validatePhone = (phone: string) => {
  const phoneRegex = /^[0-9+ ]{8,15}$/;

  if (!phoneRegex.test(phone)) {
    return "Téléphone invalide";
  }
};

export const validateBrand = (brand: string) => {
  if (!brand.trim()) return "Marque obligatoire";
};

export const validateYear = (year: string) => {
  if (!year.trim()) return "Année obligatoire";
};

export const validateVin = (vin?: string) => {
  if (vin?.length !== 17) {
    return "VIN doit contenir 17 caractères";
  }
};

export const validateMPoste = (value?: string) => {
  // optional field → only validate if you WANT to enforce minimal input
  if (value && value.length < 2) {
    return "Modèle de poste est incorrect";
  }
};