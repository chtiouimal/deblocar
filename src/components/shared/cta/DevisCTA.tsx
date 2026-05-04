"use client"

import { Text, Title } from "@mantine/core";
import ButtonCTA from "./ButtonCTA";
import styles from "./cta.module.css";

function DevisCTA() {
  return (
    <section
      className={styles.ctaSection}
      style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 120 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <Title order={2} style={{ textAlign: "center", maxWidth: 805 }}>
          Vérifiez maintenant si votre véhicule est compatible
        </Title>
        <Text size="md" fw={400} style={{ textAlign: "center", opacity: 0.8 }}>
          Recevez une réponse rapide selon votre marque, modèle et année.
        </Text>
      </div>
      <ButtonCTA
        label="Demander un devis"
        onClick={() => {
          document
            .getElementById("form")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        goUp
      />
    </section>
  );
}

export default DevisCTA