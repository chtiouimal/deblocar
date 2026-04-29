"use client";

import { CAR_DATA } from "@/constants/devis";
import { validateField } from "@/lib/validation/fieldValidation";
import { DevisFormData, StepInfoErrors } from "@/types/devis";
import { Grid, Select, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import styles from "./step.module.css";

type Props = {
  data: DevisFormData;
  updateClient: (client: Partial<DevisFormData["client"]>) => void;
  updateCar: (client: Partial<DevisFormData["client"]["car"]>) => void;
  stepErrors?: StepInfoErrors;
};

export default function StepInfo({
  data,
  updateClient,
  updateCar,
  stepErrors,
}: Props) {
  const selectedBrand = data.client.car.brand as keyof typeof CAR_DATA;
  const models = selectedBrand ? CAR_DATA[selectedBrand] : [];
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const getError = (field: string) =>
    stepErrors?.[field as keyof StepInfoErrors] || fieldErrors[field];

  const handleClientChange = (field: string, value: string) => {
    updateClient({ [field]: value });
    const error = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: error || "" }));
  };

  const handleCarChange = (field: string, value: string) => {
    updateCar({ [field]: value });
    const error = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: error || "" }));
  };

  return (
    <div className={styles.stepContainer}>
      {/* Row 1 — Personal info */}
      <Grid
        style={{ "--grid-gutter": "120px" } as React.CSSProperties}
        align="flex-start"
      >
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <div className={styles.stepContent}>
            <Text size="md" fw={500}>
              Informations personnelles
            </Text>
            <Text size="md">
              Nous recueillons vos informations de contact afin de vous
              recontacter rapidement et assurer le suivi de votre demande.
            </Text>
          </div>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }} offset={{ base: 0, md: 1 }}>
          <TextInput
            placeholder="Nom complet"
            value={data.client.name}
            onChange={(e) => handleClientChange("name", e.target.value)}
            error={getError("name")}
            style={{ marginBottom: 20 }}
          />
          <TextInput
            type="email"
            placeholder="Email"
            value={data.client.email}
            onChange={(e) => handleClientChange("email", e.target.value)}
            error={getError("email")}
            style={{ marginBottom: 20 }}
          />
          <TextInput
            type="tel"
            placeholder="Télephone"
            value={data.client.phone}
            onChange={(e) => handleClientChange("phone", e.target.value)}
            error={getError("phone")}
            style={{ marginBottom: 20 }}
          />
        </Grid.Col>
      </Grid>

      {/* Row 2 — Vehicle info */}
      <Grid
        style={{ "--grid-gutter": "120px" } as React.CSSProperties}
        align="flex-start"
      >
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <div className={styles.stepContent}>
            <Text size="md" fw={500}>
              Informations véhicule
            </Text>
            <Text size="md">
              Renseignez les caractéristiques de votre véhicule pour vérifier la
              compatibilité.
            </Text>
          </div>
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, sm: 6, md: 7 }}
          offset={{ base: 0, sm: 0, md: 1 }}
        >
          {/* Row 1: brand and model side by side */}
          <Grid style={{ "--grid-gutter": "32px" } as React.CSSProperties}>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Select
                comboboxProps={{ withinPortal: true }}
                data={Object.keys(CAR_DATA)}
                value={data.client.car.brand}
                onChange={(value) => {
                  if (value) {
                    updateCar({ brand: value, model: "" });
                    const error = validateField("brand", value);
                    setFieldErrors((prev) => ({
                      ...prev,
                      brand: error || "",
                      model: "",
                    }));
                  }
                }}
                placeholder="Sélectionner une marque"
                error={getError("brand")}
                style={{ marginBottom: 20 }}
              />
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, md: 5 }}
              offset={{ base: 0, sm: 0, md: 2 }}
            >
              <Select
                comboboxProps={{ withinPortal: true }}
                data={models}
                value={data.client.car.model}
                disabled={!data.client.car.brand}
                onChange={(value) => {
                  if (value) {
                    updateCar({ model: value });
                    const error = validateField("model", value);
                    setFieldErrors((prev) => ({ ...prev, model: error || "" }));
                  }
                }}
                placeholder="Sélectionner un modèle"
                error={getError("model")}
                style={{ marginBottom: 20 }}
              />
            </Grid.Col>
          </Grid>

          {/* Row 2: year and vin stacked on the left, empty on the right */}
          <Grid style={{ "--grid-gutter": "32px" } as React.CSSProperties}>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <TextInput
                placeholder="Année"
                value={data.client.car.year}
                onChange={(e) => handleCarChange("year", e.target.value)}
                error={getError("year")}
                style={{ marginBottom: 20 }}
              />
              <TextInput
                placeholder="VIN"
                value={data.client.car.vin}
                onChange={(e) => handleCarChange("vin", e.target.value)}
                error={getError("vin")}
                style={{ marginBottom: 20 }}
              />
            </Grid.Col>
            {/* <Grid.Col span={{ base: 0, md: 6 }} /> */}
          </Grid>
        </Grid.Col>
      </Grid>
    </div>
  );
}
