"use client"

import { VIDEOS } from "@/constants/videos";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import styles from "../shared/player/player.module.css";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Flex, Stack, Text, Title } from "@mantine/core";
import { useRef } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import { colors } from "@/theme/colors";

function VideoCarousel() {
  const [active, setActive] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const emblaRef = useRef<EmblaCarouselType | null>(null);

  const togglePlay = (i: number) => {
    if (active !== i) return;
    if (playingIndex === i) {
        setPlayingIndex(null);
    } else {
        setPlayingIndex(i);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div
        style={{
          maxWidth: 1440,
          width: "100%",
          margin: "0 auto",
          padding: "16px 32px",
        }}
      >
        {/* <div style={{ position: "absolute", top: 32, right: 64, zIndex: 2 }}> */}
        <Flex w="100%" wrap="wrap" justify="space-between" align="flex-end">
          <Stack>
            <Title order={2} style={{ maxWidth: 517 }}>
              Résultats visibles immédiatement
            </Title>
            <Text size="md" fw={400} style={{ maxWidth: 310, opacity: 0.6 }}>
              Des centaines de véhicules déjà optimisés avec succès.
            </Text>
          </Stack>
        </Flex>
      </div>
      <Carousel
        onSlideChange={(index) => {
          setHasInteracted(true);
          setActive(index);
          setPlayingIndex(null); // reset manual play when switching slides
        }}
        getEmblaApi={(api) => (emblaRef.current = api)}
        withControls={false}
        slideSize="75vw"
        height="60vh"
        styles={{
          viewport: {
            height: "60vh",
            paddingLeft: "32px",
            paddingRight: "10%",
          },
          container: {
            alignItems: "flex-end",
          },
        }}
        slideGap="md"
        controlsOffset="sm"
        controlSize={26}
        withIndicators={false}
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
              //   height: active === i ? "100%" : "40%",
              height: "100%",
              opacity: active === i ? 1 : 0.4,
            //   pointerEvents: active === i ? "auto" : "none",
            }}
            bg={colors.background}
          >
            <div
              style={{ width: "100%", height: "100%" }}
              onClick={() => {
                if (active !== i) return;
                togglePlay(i);
              }}
            >
              {mounted && (
                <ReactPlayer
                  url={video.url}
                  light={active !== i || !hasInteracted ? video.thumb : false}
                  playIcon={
                    !hasInteracted && active === 0 ? (
                      <div
                        className={styles.defaultPlayBtn}
                        onClick={() => setPlayingIndex(i)}
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 28 28"
                          fill="none"
                        >
                          <polygon points="6,2 26,14 6,26" fill="white" />
                        </svg>
                      </div>
                    ) : (
                      <span />
                    )
                  }
                  playing={
                    playingIndex === i ||
                    (active === i && hasInteracted && playingIndex !== i)
                  }
                  controls
                  width="100%"
                  height="100%"
                  config={{
                    file: { attributes: { controlsList: "nodownload" } },
                  }}
                />
              )}
            </div>
          </CarouselSlide>
        ))}
      </Carousel>
      <div
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
          // onClick={prev}
          onClick={() => emblaRef.current?.scrollPrev()}
          disabled={active === 0}
          aria-label="Précédent"
        >
          Précédent
        </button>
        <button
          className={styles.btn}
          // onClick={next}
          onClick={() => emblaRef.current?.scrollNext()}
          disabled={active === VIDEOS.length - 1}
          aria-label="Suivant"
        >
          Suivant
        </button>
      </div>
    </>
  );
}

export default VideoCarousel;
