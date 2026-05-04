"use client";

import { CAR_DATA } from "@/constants/devis";
import { validateField } from "@/lib/validation/fieldValidation";
import { DevisFormData, StepInfoErrors } from "@/types/devis";
import { Grid, Select, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import styles from "./step.module.css";
import { useViewport } from "@/hooks/useViewport";

type Props = {
  data: DevisFormData;
  updateClient: (client: Partial<DevisFormData["client"]>) => void;
  updateCar: (client: Partial<DevisFormData["client"]["car"]>) => void;
  stepErrors?: StepInfoErrors;
};



export default function InformationStep({
  data,
  updateClient,
  updateCar,
  stepErrors,
}: Props) {
  const selectedBrand = data.client.car.brand as keyof typeof CAR_DATA;
  const models = selectedBrand ? CAR_DATA[selectedBrand] : [];
  const {width} = useViewport()
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
        <Grid.Col span={{ base: 12 }}>
          <div className={styles.stepContent}>
            <Text size="md" fw={500}>
              Informations personnelles
            </Text>
          </div>
        </Grid.Col>

        <Grid.Col span={{ base: 12 }}>
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
      <Grid
        style={{ "--grid-gutter": "120px" } as React.CSSProperties}
        align="flex-start"
      >
        <Grid.Col span={{ base: 12 }}>
          <div className={styles.stepContent}>
            <Text size="md" fw={500}>
              Informations véhicule
            </Text>
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12 }}>
          <Grid
            style={{ "--grid-gutter": "120px" } as React.CSSProperties}
          >
            <Grid.Col span={{ base: 12, md: 6 }}>
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
                placeholder="Marque"
                error={getError("brand")}
                style={{ marginBottom: 20 }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }} style={{marginTop: width > 991 ? 0 : -16 }}>
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
                placeholder="Modèle"
                error={getError("model")}
                style={{ marginBottom: 20 }}
              />
            </Grid.Col>
          </Grid>

          <Grid style={{ "--grid-gutter": "32px" } as React.CSSProperties}>
            <Grid.Col span={{ base: 12 }}>
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
          </Grid>
        </Grid.Col>
      </Grid>
    </div>
  );
}
