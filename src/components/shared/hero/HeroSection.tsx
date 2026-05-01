"use client"

import { Text, Title } from "@mantine/core";
import styles from "./hero.module.css";
import ButtonCTA from "../cta/ButtonCTA";
import { useRouter } from "next/navigation";

function HeroSection() {
  const router = useRouter();
  return (
    <section className={styles.hero}>
      <div className={styles.heroContnet}>
        <div className={styles.heroIntro}>
          <Title order={1}>
            VOTRE VOITURE
            <br /> DÉBLOQUÉE.
          </Title>
          <Text size="md" fw={400} style={{ maxWidth: 310 }}>
            Activez Navigation, Apple CarPlay, Pack Sport et aides à la
            conduite.
          </Text>
        </div>
        <ButtonCTA
          label="Demander un devis"
          onClick={() => router.push("/devis")}
        />
        <ul className={styles.heroTagList}>
          <li>
            <Text size="sm" fw={400}>
              Sans ajout de matériel.
            </Text>
          </li>
          <li>
            <Text size="sm" fw={400}>
              Activation 100 % d’origine.
            </Text>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default HeroSection