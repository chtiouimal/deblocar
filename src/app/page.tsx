import styles from "./page.module.css";
import { Grid, GridCol, Text, Title } from "@mantine/core";
import CustomTabs from "@/components/shared/tabs/CustomTabs";
import ServicesCarousel from "@/components/shared/carousel/ServicesCarousel";
import HeroSection from "@/components/shared/hero/HeroSection";
import ProcessExpandable from "@/components/shared/process/ProcessExpandable";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <section className={styles.splitSection}>
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
        className={styles.splitSection}
        // style={{ justifyContent: "flex-start", gap: 120 }}
      >
        <div className={styles.carouselContainer}>
          <ServicesCarousel />
        </div>
        <div
          className={styles.splitSectionLeft}
          style={{
            alignSelf: "end",
            paddingBottom: 120,
          }}
        >
          <Title order={2} style={{ maxWidth: 350 }}>
            Potentiel activé
          </Title>
          <Text size="md" fw={400} style={{ maxWidth: 310, opacity: 0.6 }}>
            Activez les fonctionnalités déjà présentes dans votre véhicule.
          </Text>
        </div>
      </section>

      <section className={styles.centeredSection}>
        <div className={styles.centeredSectionContent}>
          <Title order={2} style={{ textAlign: "center" }}>
            Votre voiture
            <br /> est capable de plus.
          </Title>
          <div className={styles.firstSubSection}>
            <Grid className={styles.problemGird}>
              {/* First column — single item */}
              <GridCol
                span={{ base: 12, md: 4 }}
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

              {/* Second column — inner grid */}
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
          <div>
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
          <div className={styles.secondSubSectionBg}></div>
        </div>
      </section>

      <section
        style={{
          minHeight: "100vh",
          height: "100%",
          paddingTop: 64,
          maxWidth: 1440,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <Title order={2} style={{ padding: 32 }}>
          Un processus clair,
          <br />
          précis et entièrement maîtrisé.
        </Title>
        <ProcessExpandable />
      </section>
    </div>
  );
}
