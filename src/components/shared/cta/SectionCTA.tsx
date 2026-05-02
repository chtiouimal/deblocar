"use client"

import { Title } from "@mantine/core";
import styles from "./cta.module.css";
import { useRouter } from "next/navigation";
import ButtonCTA from "./ButtonCTA";

function SectionCTA() {
  const router = useRouter();
  return (
    <section className={styles.ctaSection}>
      <div>
        <Title order={2} style={{ textAlign: "center" }}>
          Ne changez pas de voiture.
        </Title>
        <Title
          order={2}
          style={{
            textAlign: "center",
            color: "#DC1F26",
          }}
        >
          Activez-la
        </Title>
      </div>
      <ButtonCTA
        label="Demander un devis"
        onClick={() => router.push("/devis")}
      />
      <img
        src="/img/covered-car-showcase.png"
        alt="covered-car-showcase"
        height={376}
        width={564}
      />
    </section>
  );
}

export default SectionCTA;
