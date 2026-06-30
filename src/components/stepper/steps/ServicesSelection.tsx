import { colors } from "@/theme/colors";
import {
  CheckboxCard,
  CheckboxGroup,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import styles from "./steps.module.css";

interface Service {
  _id: string;
  title: string;
  description: string;
}

type Props = {
  services: string[];
  initial: Service[];
  setServices: (services: string[]) => void;
  stepError?: string;
};

function ServicesSelection({
  services,
  initial,
  setServices,
  stepError,
}: Props) {
  const cards = initial.map((item) => {
    const exists = services.some((service) => service === item._id);
    return (
      <GridCol span={{ base: 6, md: 4 }} key={item._id}>
        <CheckboxCard
          value={item._id}
          p={8}
          bg={exists ? "rgba(220, 31, 38, 0.1)" : "transparent"}
          style={{
            height: "100%",
            minHeight: 62,
            borderRadius: "var(--mantine-radius-sm)",
            border: "1px solid",
            borderColor: exists
              ? colors.glowingRed[5]
              : "rgba(255,255,255,0.2)",
          }}
          className={styles.serviceCard}
        >
          <Group wrap="nowrap" align="center" justify="center">
            {/* <CheckboxIndicator /> */}
            {/* <div> */}
            <Text fz={14} style={{ textAlign: "center" }}>
              {item.title}
            </Text>
            {/* </div> */}
          </Group>
        </CheckboxCard>
      </GridCol>
    );
  });

  return (
    <Stack>
      <Text fz={14} opacity={0.6}>
        Choisissez le service que vous souhaitez réaliser.
      </Text>
      <Stack>
        <CheckboxGroup value={services} onChange={setServices}>
          <Grid>{cards}</Grid>
        </CheckboxGroup>
      </Stack>
      {stepError && (
        <Text fz={12} c="red" mt={8}>
          {stepError}
        </Text>
      )}
    </Stack>
  );
}

export default ServicesSelection