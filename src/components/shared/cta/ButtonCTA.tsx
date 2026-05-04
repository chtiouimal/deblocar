"use client"

import { Button, Text } from "@mantine/core";
import styles from "./cta.module.css";
import { ArrowUpIcon, ArrowUpRightIcon } from "@phosphor-icons/react";

interface ButtonCTAProps {
  label: string;
  onClick: () => void;
  goUp?: boolean;
}

function ButtonCTA({ label, onClick, goUp = false }: ButtonCTAProps) {
  return (
    <button className={styles.ctaContainer} onClick={onClick}>
      <div className={styles.ctaInnerContainer}>
        <div className={styles.ctaTextContainer}>
          <Text size="md" fw={400}>
            {label}
          </Text>
        </div>
        <div className={styles.ctaIconContainer}>
          {goUp ? (
            <ArrowUpIcon size={20} weight="regular" />
          ) : (
            <ArrowUpRightIcon size={20} weight="regular" />
          )}
        </div>
      </div>
    </button>
  );
}

export default ButtonCTA;
