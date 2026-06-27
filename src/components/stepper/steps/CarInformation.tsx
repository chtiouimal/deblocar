import { CAR_DATA } from "@/constants/devis";
import { VIN_REQUIRED_BRANDS } from "@/lib/validation/devisValidation";
import { validateBrand, validateField, validateMPoste, validateVin, validateYear } from "@/lib/validation/fieldValidation";
import { DevisFormData, StepInfoErrors } from "@/types/devis";
import { Select, Stack, Text, TextInput } from "@mantine/core"

type CarInformationProps = {
  data: DevisFormData;
  updateCar: (client: Partial<DevisFormData["client"]["car"]>) => void;
  stepErrors?: StepInfoErrors;
  setStepErrors: React.Dispatch<React.SetStateAction<StepInfoErrors>>;
};

type CarField = "brand" | "year" | "vin" | "mPoste";

function CarInformation({
  data,
  updateCar,
  stepErrors,
  setStepErrors,
}: CarInformationProps) {
  const getError = (field: string) =>
    stepErrors?.[field as keyof StepInfoErrors];

  const handleCarChange = (field: CarField, value: string) => {
    updateCar({ [field]: value });

    const requiresVin = VIN_REQUIRED_BRANDS.includes(data.client.car.brand);

    let error: string | undefined;

    switch (field) {
      case "brand":
        error = validateBrand(value);
        break;

      case "year":
        error = validateYear(value);
        break;

      case "vin":
        if (requiresVin) error = validateVin(value);
        break;

      case "mPoste":
        if (!requiresVin) error = validateMPoste(value);
        break;
    }

    setStepErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  return (
    <Stack>
      <Text fz={14} opacity={0.6}>
        Quelques informations pour mieux comprendre votre configuration.
      </Text>
      <Stack>
        <Select
          comboboxProps={{ withinPortal: true }}
          data={Object.keys(CAR_DATA)}
          value={data.client.car.brand}
          onChange={(value) => {
            if (!value) return;

            const requiresVin = VIN_REQUIRED_BRANDS.includes(value);

            updateCar({
              brand: value,
              vin: requiresVin ? data.client.car.vin : "",
              mPoste: requiresVin ? "" : data.client.car.mPoste,
            });

            setStepErrors((prev) => ({
              ...prev,
              brand: validateBrand(value),
              vin: undefined,
              mPoste: undefined,
            }));
          }}
          placeholder="Marque"
          error={getError("brand")}
          style={{ marginBottom: 20 }}
        />

        <TextInput
          placeholder="Année"
          value={data.client.car.year}
          onChange={(e) => handleCarChange("year", e.target.value)}
          error={getError("year")}
          style={{ marginBottom: 20 }}
        />

        {data.client.car.brand === "BMW" ||
        data.client.car.brand === "Mercedes" ? (
          <TextInput
            placeholder="Numéro de châssis"
            value={data.client.car.vin}
            onChange={(e) => handleCarChange("vin", e.target.value)}
            error={getError("vin")}
            style={{ marginBottom: 20 }}
          />
        ) : (
          <TextInput
            placeholder="Modèle de poste"
            value={data.client.car.mPoste}
            onChange={(e) => handleCarChange("mPoste", e.target.value)}
            style={{ marginBottom: 20 }}
          />
        )}
      </Stack>
    </Stack>
  );
}

export default CarInformation