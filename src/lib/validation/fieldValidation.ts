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
