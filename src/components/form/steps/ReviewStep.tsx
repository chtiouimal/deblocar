"use client";

import { DevisFormData } from "@/types/devis";
import styles from "./step.module.css";
import { Grid, Text } from "@mantine/core";
import { CheckIcon } from "@phosphor-icons/react";
import { colors } from "@/theme/colors";

interface Service {
  _id: string;
  title: string;
  description: string;
}

type Props = {
  initial: Service[];
  data: DevisFormData;
};

export default function ReviewStep({ data, initial }: Props) {
  const selectedServices = initial.filter((service) =>
    data.services.includes(service._id),
  );
  return (
    <div className={styles.stepContainer}>
      <Grid
        style={{ "--grid-gutter": "120px" } as React.CSSProperties}
        align="flex-start"
      >
        <Grid.Col span={{ base: 12 }} style={{ paddingBottom: 32 }}>
          <Grid.Col span={{ base: 12, sm: 12 }} style={{ paddingBottom: 32 }}>
            <Text size="md" fw={500}>
              Informations personnelles
            </Text>
          </Grid.Col>
          <Grid style={{ "--grid-gutter": "32px" } as React.CSSProperties}>
            <Grid.Col
              span={{ base: 12 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Text size="md" className={styles.infoLabel}>
                Nom:
              </Text>
              <Text size="sm">{data.client.name || "N/A"}</Text>
            </Grid.Col>
            <Grid.Col
              span={{ base: 12 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Text size="md" className={styles.infoLabel}>
                Email:
              </Text>
              <Text size="sm">{data.client.email || "N/A"}</Text>
            </Grid.Col>
            <Grid.Col
              span={{ base: 12 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Text size="md" className={styles.infoLabel}>
                Télephone:
              </Text>
              <Text size="sm">{data.client.phone || "N/A"}</Text>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={{ base: 12 }} style={{ paddingBottom: 32 }}>
          <Grid.Col span={{ base: 12, sm: 12 }}>
            <Text size="md" fw={500} style={{ paddingBottom: 32 }}>
              Informations véhicule
            </Text>
          </Grid.Col>
          <Grid style={{ "--grid-gutter": "20px" } as React.CSSProperties}>
            <Grid.Col
              span={{ base: 12 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Text size="md" className={styles.infoLabel}>
                Marque:
              </Text>
              <Text size="sm">{data.client.car.brand || "N/A"}</Text>
            </Grid.Col>
            {/* <Grid.Col
              span={{ base: 12 }}
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 16,
              }}
            >
              <Text size="md" className={styles.infoLabel}>
                Modèle:
              </Text>
              <Text size="sm">{data.client.car.model || "N/A"}</Text>
            </Grid.Col> */}
            <Grid.Col
              span={{ base: 12 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Text size="md" className={styles.infoLabel}>
                Année:
              </Text>
              <Text size="sm">{data.client.car.year || "N/A"}</Text>
            </Grid.Col>
            <Grid.Col
              span={{ base: 12 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Text size="md" className={styles.infoLabel}>
                Numéro de châssis:
              </Text>
              <Text size="sm">{data.client.car.vin || "N/A"}</Text>
            </Grid.Col>
          </Grid>
        </Grid.Col>

        <Grid.Col span={{ base: 12 }}>
          <Grid.Col span={{ base: 12 }} style={{ paddingBottom: 32 }}>
            <Text size="md" fw={500}>
              Services souhaités
            </Text>
          </Grid.Col>
          <div className={styles.selectedServices}>
            {selectedServices.map((s) => (
              <div
                key={s._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  paddingBottom: 10,
                }}
              >
                <CheckIcon size={14} weight="thin" color={colors.primary} />
                <Text size="md" className={styles.infoLabel}>
                  {s.title}
                </Text>
              </div>
            ))}
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
}
