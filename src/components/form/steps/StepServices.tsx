"use client";

import { AVAILABLE_SERVICES } from "@/constants/devis";
import styles from "./step.module.css";
import { Checkbox, Grid, Text } from "@mantine/core";

type Props = {
  services: string[];
  setServices: (services: string[]) => void;
  stepError?: string;
};

export default function StepServices({
  services,
  setServices,
  stepError,
}: Props) {
  const toggleService = (service: string) => {
    const updated = services.includes(service)
      ? services.filter((s) => s !== service)
      : [...services, service];

    setServices(updated);
  };

  const isValid = services.length > 0;
  const col1 = AVAILABLE_SERVICES.slice(0, 7);
  const col2 = AVAILABLE_SERVICES.slice(7);

  return (
    <div className={styles.stepContainer}>
      <Grid
        style={{ "--grid-gutter": "120px" } as React.CSSProperties}
        align="flex-start"
      >
        {/* Col 1: text */}
        <Grid.Col span={{ base: 12, sm: 5, md: 4 }}>
          <div className={styles.stepContent}>
            <Text size="md">
              Sélectionnez les services adaptés à vos besoins, nous vérifions la
              compatibilité.
            </Text>
          </div>
        </Grid.Col>

        {/* Col 2: two sub-cols of services */}
        <Grid.Col
          span={{ base: 12, sm: 6, md: 7 }}
          offset={{ base: 0, sm: 1, md: 1 }}
        >
          <Grid style={{ "--grid-gutter": "32px" } as React.CSSProperties}>
            <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
              {col1.map((service) => (
                <Checkbox
                  key={service}
                  label={service}
                  checked={services.includes(service)}
                  onChange={() => toggleService(service)}
                  color="#DC1F26"
                  style={{ marginBottom: 32 }}
                />
              ))}
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
              {col2.map((service) => (
                <Checkbox
                  key={service}
                  label={service}
                  checked={services.includes(service)}
                  onChange={() => toggleService(service)}
                  color="#DC1F26"
                  style={{ marginBottom: 32 }}
                />
              ))}
            </Grid.Col>
          </Grid>

          {(stepError || !isValid) && (
            <p style={{ color: "red", fontSize: 12, marginTop: 8 }}>
              Sélectionnez au moins un service
            </p>
          )}
        </Grid.Col>
      </Grid>
    </div>
  );
}
