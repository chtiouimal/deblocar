"use client";

import { DevisFormData } from "@/types/devis";
import styles from "./step.module.css";
import { Grid, Text } from "@mantine/core";
import { CheckIcon } from "@phosphor-icons/react";
import { colors } from "@/theme/colors";

type Props = {
  data: DevisFormData;
};

export default function StepReview({ data }: Props) {
  return (
    <div className={styles.stepContainer}>
      <Grid
        style={{ "--grid-gutter": "120px" } as React.CSSProperties}
        align="flex-start"
      >
        <Grid.Col span={{ base: 12, sm: 5 }} style={{ paddingBottom: 32 }}>
          <Grid.Col span={{ base: 12, sm: 12 }} style={{ paddingBottom: 32 }}>
            <Text size="md" fw={500}>
              Informations personnelles
            </Text>
          </Grid.Col>
          <Grid style={{ "--grid-gutter": "32px" } as React.CSSProperties}>
            <Grid.Col
              span={{ base: 12, sm: 6 }}
              style={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: 20,
              }}
            >
              <Text
                size="md"
                className={styles.infoLabel}
                style={{ minWidth: 90 }}
              >
                Nom:
              </Text>
              <Text size="md">{data.client.name || "N/A"}</Text>
            </Grid.Col>
            <Grid.Col
              span={{ base: 12, sm: 6 }}
              style={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: 20,
              }}
            >
              <Text
                size="md"
                className={styles.infoLabel}
                style={{ minWidth: 90 }}
              >
                Email:
              </Text>
              <Text size="md">{data.client.email || "N/A"}</Text>
            </Grid.Col>
          </Grid>
          <Grid style={{ "--grid-gutter": "32px" } as React.CSSProperties}>
            <Grid.Col
              span={{ base: 12, sm: 6 }}
              style={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: 20,
              }}
            >
              <Text
                size="md"
                className={styles.infoLabel}
                style={{ minWidth: 90 }}
              >
                Télephone:
              </Text>
              <Text size="md">{data.client.phone || "N/A"}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }} />
          </Grid>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 5 }} offset={{ base: 0, sm: 2, md: 2 }}>
          <Grid.Col span={{ base: 12, sm: 12 }}>
            <Text size="md" fw={500} style={{ paddingBottom: 32 }}>
              Informations véhicule
            </Text>
          </Grid.Col>
          <Grid style={{ "--grid-gutter": "32px" } as React.CSSProperties}>
            <Grid.Col
              span={{ base: 12, sm: 6 }}
              style={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: 20,
              }}
            >
              <Text
                size="md"
                className={styles.infoLabel}
                style={{ minWidth: 90 }}
              >
                Marque:
              </Text>
              <Text size="md">{data.client.car.brand || "N/A"}</Text>
            </Grid.Col>
            <Grid.Col
              span={{ base: 12, sm: 6 }}
              style={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: 20,
              }}
            >
              <Text
                size="md"
                className={styles.infoLabel}
                style={{ minWidth: 90 }}
              >
                Modèle:
              </Text>
              <Text size="md">{data.client.car.model || "N/A"}</Text>
            </Grid.Col>
          </Grid>
          <Grid style={{ "--grid-gutter": "32px" } as React.CSSProperties}>
            <Grid.Col
              span={{ base: 12, sm: 6 }}
              style={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: 20,
              }}
            >
              <Text
                size="md"
                className={styles.infoLabel}
                style={{ minWidth: 90 }}
              >
                Année:
              </Text>
              <Text size="md">{data.client.car.year || "N/A"}</Text>
            </Grid.Col>
            <Grid.Col
              span={{ base: 12, sm: 6 }}
              style={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: 20,
              }}
            >
              <Text
                size="md"
                className={styles.infoLabel}
                style={{ minWidth: 90 }}
              >
                VIN:
              </Text>
              <Text size="md">{data.client.car.vin || "N/A"}</Text>
            </Grid.Col>
          </Grid>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 12 }}>
          <Grid.Col span={{ base: 12, sm: 12 }} style={{ paddingBottom: 32 }}>
            <Text size="md" fw={500}>
              Services souhaités
            </Text>
          </Grid.Col>
          <Grid style={{ "--grid-gutter": "32px" } as React.CSSProperties}>
            {data.services.map((s) => (
              <Grid.Col
                span={{ base: 12, sm: 3 }}
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  paddingBottom: 10,
                }}
              >
                <CheckIcon size={14} weight="thin" color={colors.primary} />
                <Text size="md" className={styles.infoLabel}>
                  {s}
                </Text>
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
      </Grid>
    </div>
  );
}
