import { CAR_DATA } from "@/constants/devis";
import { VIN_REQUIRED_BRANDS } from "@/lib/validation/devisValidation";
import { validateBrand, validateField, validateMPoste, validateVin, validateYear } from "@/lib/validation/fieldValidation";
import { DevisFormData, StepInfoErrors } from "@/types/devis";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridCol,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { InfoIcon, QuestionIcon } from "@phosphor-icons/react";
import { useState } from "react";

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

  const [openVin, setOpenVin] = useState(false);
  const [openMPoste, setOpenMPoste] = useState(false);

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
          <Grid w="100%">
            <GridCol span={11}>
              <TextInput
                placeholder="Numéro de châssis"
                value={data.client.car.vin}
                onChange={(e) => handleCarChange("vin", e.target.value)}
                error={getError("vin")}
                style={{ marginBottom: 20 }}
              />
            </GridCol>
            <GridCol span={1} align="center">
              <Tooltip
                withArrow
                multiline
                w={260}
                opened={openVin}
                label="Ce numéro nous permet de vérifier les options disponibles sur votre véhicule."
              >
                <Button
                  onClick={() => setOpenVin((o) => !o)}
                  variant="transparent"
                  style={{ backgroundColor: "transparent", padding: 0 }}
                >
                  <InfoIcon
                    size={20}
                    weight="fill"
                    style={{ opacity: 0.6, cursor: "pointer" }}
                  />
                </Button>
              </Tooltip>
            </GridCol>
          </Grid>
        ) : (
          <Grid w="100%">
            <GridCol span={11}>
              <TextInput
                placeholder="Modèle de poste"
                value={data.client.car.mPoste}
                onChange={(e) => handleCarChange("mPoste", e.target.value)}
                style={{ marginBottom: 20 }}
              />
            </GridCol>
            <GridCol span={1} align="center">
              <Tooltip
                opened={openMPoste}
                withArrow
                multiline
                w={260}
                label="Si vous le connaissez, indiquez le modèle de votre poste multimédia. Sinon, notre équipe vous guidera par WhatsApp pour l’identifier."
              >
                <Button
                  onClick={() => setOpenMPoste((o) => !o)}
                  variant="transparent"
                  style={{ backgroundColor: "transparent", padding: 0 }}
                >
                  <InfoIcon
                    size={20}
                    weight="fill"
                    style={{ opacity: 0.6, cursor: "pointer" }}
                  />
                </Button>
              </Tooltip>
            </GridCol>
          </Grid>
        )}
      </Stack>
    </Stack>
  );
}

export default CarInformation