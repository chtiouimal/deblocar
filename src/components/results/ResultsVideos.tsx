"use client"

import styles from "../shared/player/player.module.css";
import { VIDEOS } from "@/constants/videos";
import { Carousel, CarouselSlide } from "@mantine/carousel"
import { Box, Flex, Stack, Text, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import { useMediaQuery } from "@mantine/hooks";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { colors } from "@/theme/colors";
import ReactPlayer from "react-player";
import Autoplay from "embla-carousel-autoplay";

function ResultsVideos() {
  const [active, setActive] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  
  const emblaRef = useRef<EmblaCarouselType | null>(null);
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);

  const isLargeDesktop = useMediaQuery("(min-width: 1390px)");
  const isDesktop = useMediaQuery("(min-width: 1200px)");
  const isMobile = useMediaQuery("(max-width: 960px)");
  const isSmallMobile = useMediaQuery("(max-width: 630px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const togglePlay = (i: number) => {
    if (active !== i) return;
    if (playingIndex === i) {
      setPlayingIndex(null);
    } else {
      setPlayingIndex(i);
    }
  };

  useEffect(() => {
    if (!embla || !autoplay.current) return;

    if (playingIndex !== null) {
      autoplay.current.stop();
    } else {
      autoplay.current.play();
    }
  }, [playingIndex, embla]);

  return (
    <Box style={{ position: "relative", margin: "auto 0" }}>
      {isMobile ? (
        <Flex
          justify="space-between"
          align="flex-end"
          style={{ width: "100%", padding: 32 }}
        >
          <Stack>
            <Title order={2} style={{ maxWidth: 517 }}>
              Résultats visibles immédiatement
            </Title>
            <Text size="md" fw={400} style={{ maxWidth: 310, opacity: 0.6 }}>
              Des centaines de véhicules déjà optimisés avec succès.
            </Text>
          </Stack>
          {!isSmallMobile && (
            <Flex gap={16} mt={64}>
              <button
                className={styles.btn}
                onClick={() => emblaRef.current?.scrollPrev()}
                // disabled={!emblaRef.current?.canScrollPrev?.()}
                disabled={active === 0}
                aria-label="Précédent"
                // style={{ background: colors.glowingRed[5], aspectRatio: 1 }}
              >
                {/* Précédent */}
                <ArrowLeftIcon size={32} weight="thin" />
              </button>
              <button
                className={styles.btn}
                onClick={() => emblaRef.current?.scrollNext()}
                // disabled={!emblaRef.current?.canScrollNext?.()}
                disabled={active === VIDEOS.length - 1}
                aria-label="Suivant"
                style={{
                  background: colors.glowingRed[5],
                  aspectRatio: 1,
                  boxShadow: "0 0 30px 0 rgba(220, 31, 38, 0.4)",
                }}
              >
                {/* Suivant */}
                <ArrowRightIcon size={32} weight="thin" />
              </button>
            </Flex>
          )}
        </Flex>
      ) : (
        <Box style={{ position: "absolute", width: "100%" }}>
          <Flex
            direction="column"
            justify="space-between"
            style={{
              maxWidth: 1440,
              height: "70vh",
              margin: "auto",
              padding: 32,
            }}
          >
            <Stack>
              <Title order={isDesktop ? 2 : 3} style={{ maxWidth: 517 }}>
                Résultats visibles immédiatement
              </Title>
              <Text size="md" fw={400} style={{ maxWidth: 310, opacity: 0.6 }}>
                Des centaines de véhicules déjà optimisés avec succès.
              </Text>
            </Stack>
            <Flex gap={16} mt={64}>
              <button
                className={styles.btn}
                onClick={() => emblaRef.current?.scrollPrev()}
                // disabled={!emblaRef.current?.canScrollPrev?.()}
                disabled={active === 0}
                aria-label="Précédent"
                // style={{ background: colors.glowingRed[5], aspectRatio: 1 }}
              >
                {/* Précédent */}
                <ArrowLeftIcon size={32} weight="thin" />
              </button>
              <button
                className={styles.btn}
                onClick={() => emblaRef.current?.scrollNext()}
                // disabled={!emblaRef.current?.canScrollNext?.()}
                disabled={active === VIDEOS.length - 1}
                aria-label="Suivant"
                style={{
                  background: colors.glowingRed[5],
                  aspectRatio: 1,
                  boxShadow: "0 0 30px 0 rgba(220, 31, 38, 0.4)",
                }}
              >
                {/* Suivant */}
                <ArrowRightIcon size={32} weight="thin" />
              </button>
            </Flex>
          </Flex>
        </Box>
      )}
      <Box
        style={{
          maxWidth: isMobile ? "100%" : isLargeDesktop ? 800 : 600,
          width: "100%",
          margin: isMobile ? "0 auto" : "0 0 0 auto",
        }}
      >
        <Carousel
          getEmblaApi={(api) => {
            emblaRef.current = api;
            setEmbla(api);
          }}
          plugins={[autoplay.current]}
          onSlideChange={(index) => {
            // setHasInteracted(true);
            setActive(index);
            setPlayingIndex(null); // reset manual play when switching slides
          }}
          slideSize="clamp(260px, 40vw, 320px)"
          height="70vh"
          styles={{
            viewport: {
              height: "70vh",
              paddingLeft: "16px",
              paddingRight: "16px",
            },
            container: {
              alignItems: "center",
            },
          }}
          withControls={false}
          //   slideGap="xs"
          emblaOptions={{
            loop: false,
            dragFree: false,
            align: "center",
          }}
        >
          {VIDEOS.map((video, i) => (
            <CarouselSlide
              key={i}
              style={{
                height: "70vh",
                flex: "0 0 auto",
                margin: active === i ? "0 16px" : "0",
                transform:
                  active === i ? "scale(1)" : "scale(0.88) translateY(10px)",
                filter: active === i ? "none" : "blur(1px)",
                opacity: active === i ? 1 : 0.5,
                transition: "transform 300ms ease, opacity 300ms ease",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  aspectRatio: "720 / 1280",
                  position: "relative",
                }}
                onClick={() => {
                  if (active === i) togglePlay(i);
                }}
              >
                {/* <img
                  src={video.thumb}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                /> */}
                {mounted && (
                  <ReactPlayer
                    url={video.url}
                    light={playingIndex === i ? false : video.thumb}
                    // light={active !== i || !hasInteracted ? video.thumb : false}
                    // playIcon={
                    //   !hasInteracted && active === i ? (
                    //     <div
                    //       className={styles.defaultPlayBtn}
                    //       onClick={() => setPlayingIndex(i)}
                    //     >
                    //       <svg
                    //         width="28"
                    //         height="28"
                    //         viewBox="0 0 28 28"
                    //         fill="none"
                    //       >
                    //         <polygon points="6,2 26,14 6,26" fill="white" />
                    //       </svg>
                    //     </div>
                    //   ) : (
                    //     <span />
                    //   )
                    // }
                    // playing={
                    //   playingIndex === i ||
                    //   (active === i && hasInteracted && playingIndex !== i)
                    // }

                    playIcon={
                      <div className={styles.defaultPlayBtn}>
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 28 28"
                          fill="none"
                        >
                          <polygon points="6,2 26,14 6,26" fill="white" />
                        </svg>
                      </div>
                    }
                    playing={playingIndex === i}
                    onClickPreview={() => setPlayingIndex(i)}
                    controls={false}
                    width="100%"
                    height="100%"
                    style={{
                      position: "absolute",
                      inset: 0,
                    }}
                    config={{
                      file: { attributes: { controlsList: "nodownload" } },
                    }}
                  />
                )}
              </div>
            </CarouselSlide>
          ))}
        </Carousel>
      </Box>
      {/* <div
        className={styles.controls}
        style={{
          maxWidth: 1440,
          width: "100%",
          margin: "0 auto",
          padding: "16px 32px",
        }}
      >
        <button
          className={styles.btn}
          onClick={() => emblaRef.current?.scrollPrev()}
          disabled={!emblaRef.current?.canScrollPrev?.()}
          //   disabled={active === 0}
          aria-label="Précédent"
          style={{ marginLeft: "auto" }}
        >
          Précédent
        </button>
        <button
          className={styles.btn}
          onClick={() => emblaRef.current?.scrollNext()}
          disabled={!emblaRef.current?.canScrollNext?.()}
          //   disabled={active === VIDEOS.length - 1}
          aria-label="Suivant"
        >
          Suivant
        </button>
      </div> */}
    </Box>
  );
}

export default ResultsVideos