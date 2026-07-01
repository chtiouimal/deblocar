import { BackgroundImage, Button, Flex, Text, Title } from "@mantine/core";
import styles from "./page.module.css";
import Stepper from "@/components/form/Stepper";
import CustomTabs from "@/components/shared/tabs/CustomTabs";
import VideoGrid from "@/components/shared/grid/VideoGrid";
import DevisCTA from "@/components/shared/cta/DevisCTA";
import DevisStepper from "@/components/stepper";
import VideoCarousel from "@/components/videos/VideoCarousel";
import ResultsVideos from "@/components/results/ResultsVideos";

export default function Devis() {
  return (
    <div className={styles.page}>
      <div className={styles.bgTop}>
        {/* <section className={styles.heroSection}>
          <div className={styles.heroSectionLeft}>
            <Title order={2}>
              Votre véhicule <br />
              est-il compatible ?
            </Title>
            <Text size="xl" fw={400} style={{ maxWidth: 464, opacity: 0.6 }}>
              Nous analysons votre véhicule et vous proposonsune solution
              adaptée.
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
          <div className={styles.heroSectionRight} id="form">
            <DevisStepper />
          </div>
        </section> */}
        <section className={styles.subHero}>
          <div
            className={styles.howItWorksIntro}
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              padding: "64px 32px 32px",
            }}
          >
            <Title order={2}>
              Votre véhicule <br />
              est-il compatible ?
            </Title>
            <Flex direction="column" gap={32}>
              <Text size="md" fw={400} style={{ maxWidth: 360, opacity: 0.6 }}>
                Nous analysons votre véhicule et vous proposonsune solution
                adaptée.
              </Text>
              <DevisStepper />
            </Flex>
          </div>
          <BackgroundImage src="/bg/subhero.jpg" h="50vh" p="64px 0">
            {/* <Flex
              justify="space-between"
              align="flex-end"
              wrap="wrap"
              h="100%"
              style={{
                maxWidth: 1440,
                margin: "0 auto",
                padding: "0 32px",
              }}
            >
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
            </Flex> */}
            <Flex
              justify="space-between"
              align="flex-end"
              wrap="wrap"
              h="100%"
              style={{
                maxWidth: 1440,
                margin: "0 auto",
                padding: "0 32px",
                gap: "16px",
              }}
            >
              {/* LEFT GROUP */}
              <ul
                className={styles.heroTagList}
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <li>
                  <Text size="sm">Services premium</Text>
                </li>
                <li>
                  <Text size="sm">Devis gratuit</Text>
                </li>
                <li>
                  <Text size="sm">Réponse rapide</Text>
                </li>
              </ul>

              {/* RIGHT GROUP */}
              <div className={styles.ratingContainer}>
                <Title order={2} fw={600}>
                  4.7/5
                </Title>
                <div className={styles.ratingContent}>
                  <img src="/rating.svg" />
                  <Text size="sm">avis clients</Text>
                </div>
              </div>
            </Flex>
          </BackgroundImage>
        </section>
      </div>

      <div className={styles.leftBg}>
        <section className={styles.marqueSection}>
          <Title order={2} style={{ textAlign: "center" }}>
            Marques <br />
            compatibles
          </Title>
          <CustomTabs direction="horizontal" />
        </section>

        {/* <section className={`${styles.splitSection} ${styles.serviceSection}`}>
          <div className={styles.carouselContainer}>
            <VideoGrid />
          </div>
          <div
            className={`${styles.splitSectionLeft} ${styles.serviceSectionIntro}`}
          >
            <Title order={2} style={{ maxWidth: 517 }}>
              Résultats visibles immédiatement
            </Title>
            <Text size="md" fw={400} style={{ maxWidth: 310, opacity: 0.6 }}>
              Des centaines de véhicules déjà optimisés avec succès.
            </Text>
          </div>
        </section> */}

        <section className={styles.resultsVideos}>
          <ResultsVideos />
        </section>

        {/* <section style={{ margin: "120px 0" }}>
          <Flex direction="column" gap={16}>
            <VideoCarousel />
          </Flex>
        </section> */}

        <section className={styles.howItWorks}>
          <div className={styles.howItWorksIntro}>
            <Title order={2} style={{ maxWidth: 456 }}>
              Comment <br />
              ça fonctionne ?
            </Title>
            <Text size="md" fw={400} style={{ maxWidth: 360, opacity: 0.6 }}>
              Nous activons certaines fonctionnalités disponibles sur votre
              véhicule grâce à une intervention logicielle sécurisée.
            </Text>
          </div>
          <div className={styles.howItWorksIntro}>
            <ul className={styles.howItWorksTagList}>
              <li>
                <Text size="sm" fw={400}>
                  Sans modification physique.
                </Text>
              </li>
              <li>
                <Text size="sm" fw={400}>
                  Sans démontage.
                </Text>
              </li>
              <li>
                <Text size="sm" fw={400}>
                  Sans risque lorsque compatible.
                </Text>
              </li>
            </ul>
            <img src="/img/covered-car.png" alt="covered-car" />
          </div>
        </section>
      </div>

      <DevisCTA />
    </div>
  );
}
