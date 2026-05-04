import { Text, Title } from "@mantine/core";
import styles from "./page.module.css";
import Stepper from "@/components/form/Stepper";
import CustomTabs from "@/components/shared/tabs/CustomTabs";

export default function Devis() {
  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroSectionLeft}>
          <Title order={2}>
            Votre véhicule <br />
            est-il compatible ?
          </Title>
          <Text size="xl" fw={400} style={{ maxWidth: 464, opacity: 0.6 }}>
            Nous analysons votre véhicule et vous proposonsune solution adaptée.
          </Text>
          <ul className={styles.heroTagList}>
            <li>
              <Text size="sm" fw={400}>
                Services premium
              </Text>
            </li>
            <li>
              <Text size="sm" fw={400}>
                Devis gratuit
              </Text>
            </li>
            <li>
              <Text size="sm" fw={400}>
                Réponse rapide
              </Text>
            </li>
          </ul>
          <div className={styles.ratingContainer}>
            <Title order={2} fw={600}>
              4.7/5
            </Title>
            <div className={styles.ratingContent}>
              <img src="/rating.svg" alt="rating-stars" />
              <Text size="sm">avis clients</Text>
            </div>
          </div>
        </div>
        <div className={styles.heroSectionRight}>
          <Stepper />
        </div>
      </section>

      {/* <section className={styles.marqueSection}>
        <Title order={2} style={{ textAlign: "center" }}>
          Marques <br />
          compatibles
        </Title>
        <CustomTabs direction="horizontal" />
      </section> */}
    </div>
  );
}
