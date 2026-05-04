"use client";

import styles from "./grid.module.css";
import { VIDEOS } from "@/constants/videos";
import { useRef, useState } from "react";
import { VideoPlayer } from "../player/VideoPlayer";

const CARDS_PER_SLIDE = 4;

export default function VideoGrid() {
  const totalSlides = Math.ceil(VIDEOS.length / CARDS_PER_SLIDE);
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prev = () => setCurrent((s) => Math.max(s - 1, 0));
  const next = () => setCurrent((s) => Math.min(s + 1, totalSlides - 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const slides = Array.from({ length: totalSlides }, (_, i) =>
    VIDEOS.slice(i * CARDS_PER_SLIDE, i * CARDS_PER_SLIDE + CARDS_PER_SLIDE),
  );

  const tickWidth = 100 / totalSlides;

  return (
    <div className={styles.wrapper}>
      {/* Track */}
      <div
        className={styles.trackContainer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={styles.track}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div className={styles.slide} key={slideIndex}>
              {slide.map((video) => (
                <div className={styles.card} key={video.id}>
                  <VideoPlayer
                    url={video.url}
                    thumbnail={video.thumb}
                    // playButton={<MyCustomIcon />} optional
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination line */}
      {VIDEOS.length > 4 && (
        <div className={styles.pagination}>
          <div className={styles.line}>
            <span
              className={styles.tick}
              style={{
                width: `${tickWidth}%`,
                transform: `translateX(${current * 100}%)`,
              }}
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      {VIDEOS.length > 4 && (
        <div className={styles.controls}>
          <button
            className={styles.btn}
            onClick={prev}
            disabled={current === 0}
            aria-label="Précédent"
          >
            Précédent
          </button>
          <button
            className={styles.btn}
            onClick={next}
            disabled={current === totalSlides - 1}
            aria-label="Suivant"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}