"use client";

import styles from "./page.module.css";
import { Grid, GridCol, Text, Title } from "@mantine/core";
import CustomTabs from "@/components/shared/tabs/CustomTabs";
import ServicesCarousel from "@/components/shared/carousel/ServicesCarousel";
import HeroSection from "@/components/shared/hero/HeroSection";
import ProcessExpandable from "@/components/shared/process/ProcessExpandable";
import SectionCTA from "@/components/shared/cta/SectionCTA";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    if (!section) return;

    const tryScroll = () => {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", "/");
      } else {
        requestAnimationFrame(tryScroll);
      }
    };

    setTimeout(tryScroll, 300);
  }, []);

  return (
    <div className={styles.page}>
      <HeroSection />
      <div className={styles.leftBg}>
        <section
          id="marques"
          className={`${styles.splitSection} ${styles.marqueSection}`}
        >
          <div className={styles.splitSectionLeft} style={{ alignSelf: "end" }}>
            <Title order={2} style={{ maxWidth: 350 }}>
              Marques compatibles
            </Title>
            <Text size="md" fw={400} style={{ maxWidth: 310, opacity: 0.6 }}>
              Nous intervenons exclusivement sur des marques premium équipées de
              systèmes électroniques activables.
            </Text>
          </div>
          <div className={styles.splitSectionRight}>
            <CustomTabs />
          </div>
        </section>

        <section
          id="services"
          className={`${styles.splitSection} ${styles.serviceSection}`}
        >
          <div className={styles.carouselContainer}>
            <ServicesCarousel />
          </div>
          <div
            className={`${styles.splitSectionLeft} ${styles.serviceSectionIntro}`}
          >
            <Title order={2} style={{ maxWidth: 350 }}>
              Potentiel activé
            </Title>
            <Text size="md" fw={400} style={{ maxWidth: 310, opacity: 0.6 }}>
              Activez les fonctionnalités déjà présentes dans votre véhicule.
            </Text>
          </div>
        </section>
      </div>

      {/* <div className={styles.centerBg}> */}
      <section className={styles.centeredSection}>
        <div className={styles.centeredSectionContent}>
          <Title order={2} style={{ textAlign: "center" }}>
            Votre voiture
            <br /> est capable de plus.
          </Title>
          <div className={styles.firstSubSection}>
            <Grid className={styles.problemGird}>
              <GridCol
                span={{ base: 12, md: 4 }}
                className={styles.problemGirdText}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 40,
                }}
              >
                <Text
                  size="md"
                  fw={400}
                  style={{ maxWidth: 360, opacity: 0.8 }}
                >
                  Les véhicules modernes possèdent déjà des modules complets
                  installés.
                  <br /> Pourtant, beaucoup restent désactivés.
                </Text>
                <Text
                  size="md"
                  fw={400}
                  style={{ maxWidth: 360, opacity: 0.8 }}
                >
                  Ce n’est pas un manque d’équipement.
                  <br /> C’est une limitation logicielle.
                </Text>
              </GridCol>

              <GridCol span={{ base: 12, md: 8 }}>
                <Grid>
                  <GridCol span={{ base: 12, xs: 6 }} />
                  <GridCol span={{ base: 12, xs: 6 }}>
                    <ul
                      className={styles.heroTagList}
                      style={{ flexDirection: "column", gap: 40 }}
                    >
                      <li>
                        <Text
                          size="sm"
                          fw={400}
                          style={{ maxWidth: 250, opacity: 0.8 }}
                        >
                          Vous utilisez votre téléphone à la place d’un écran
                          premium.
                        </Text>
                      </li>
                      <li>
                        <Text
                          size="sm"
                          fw={400}
                          style={{ maxWidth: 250, opacity: 0.8 }}
                        >
                          Vous conduisez sans exploiter les performances
                          disponibles.
                        </Text>
                      </li>
                      <li>
                        <Text
                          size="sm"
                          fw={400}
                          style={{ maxWidth: 250, opacity: 0.8 }}
                        >
                          Vous pensez que certaines options n’existent pas.
                        </Text>
                      </li>
                    </ul>
                  </GridCol>
                </Grid>
              </GridCol>
            </Grid>
          </div>
        </div>
        <div className={styles.secondSubSection}>
          <div className={styles.carContainer}>
            <div className={styles.carTextContainer}>
              <Title
                order={2}
                style={{ textAlign: "center", textTransform: "initial" }}
              >
                Votre voiture est bridée.
              </Title>
              <Title
                order={2}
                style={{
                  textAlign: "center",
                  textTransform: "initial",
                  color: "#DC1F26",
                }}
              >
                Nous la libérons.
              </Title>
            </div>
            <img src="/img/covered-car.png" alt="covered-car" />
          </div>
        </div>
      </section>
      {/* </div> */}

      <div className={styles.rightBg}>
        <section id="process" className={styles.processSection}>
          <Title order={2} style={{ padding: 32 }}>
            Un processus clair,
            <br />
            précis et entièrement maîtrisé.
          </Title>
          <ProcessExpandable />
        </section>

        <SectionCTA />
      </div>
    </div>
  );
}
