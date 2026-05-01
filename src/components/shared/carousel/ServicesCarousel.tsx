"use client";

import { useState, useRef } from "react";
import { Title, Text } from "@mantine/core";
import { services } from "@/constants/services";
import styles from "./carousel.module.css";

const CARDS_PER_SLIDE = 4;

function ServiceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className={styles.card}>
      <Title order={4} style={{textTransform: "initial"}}>{title}</Title>
      <Text size="md" fw={400}>{description}</Text>
    </div>
  );
}

export default function ServicesCarousel() {
  const totalSlides = Math.ceil(services.length / CARDS_PER_SLIDE);
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
    services.slice(i * CARDS_PER_SLIDE, i * CARDS_PER_SLIDE + CARDS_PER_SLIDE),
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
              {slide.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination line */}
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

      {/* Buttons */}
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
    </div>
  );
}
