"use client"

import { useState } from "react";
import styles from "./tabs.module.css";
import { Title } from "@mantine/core";
import GlowingLogo from "@/components/cars/GlowingLogo";
import { CARS_LOGO } from "@/constants/carsLogo";
import { useViewport } from "@/hooks/useViewport";

function CustomTabs() {
  const { isMobile } = useViewport();
  const [step, setStep] = useState(0);
  const stepLabels = CARS_LOGO.map((e) => {
    return {
      label: e.name,
      icon: (color: string, active: boolean) => (
        <GlowingLogo
          color={color}
          active={active}
          path={e.default}
          activePath={e.active}
        />
      ),
    };
  });

  const DesktopTabs = () => {
    return (
      <div className={styles.stepperTabsDesktop}>
        {/* vertical background line */}
        <span className={styles.verticalLine} />

        {/* vertical tick that moves */}
        <span
          className={styles.verticalTickContainer}
          style={{
            transform: `translateY(${step * 100}%)`,
          }}
        >
          <span className={styles.verticalTick} />
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 64,
            padding: "32px 0",
          }}
        >
          {stepLabels.map((item, index) => (
            <div
              key={index}
              className={styles.stepItem}
              onMouseEnter={() => setStep(index)}
            >
              <div
                className={styles.stepIcon}
                style={{ transform: step === index ? "Scale(2)" : "Scale(1)" }}
              >
                {item.icon(
                  step === index ? "#DC1F26" : "#302D2D",
                  step === index ? true : false,
                )}
              </div>
              <Title
                order={3}
                fw={600}
                className={`${styles.stepTabDesktop} ${
                  step === index ? styles.activeTabDesktop : ""
                }`}
                style={{ color: step === index ? "#DC1F26" : undefined }}
              >
                {item.label}
              </Title>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MobileTabs = () => {
    return (
      <div className={styles.stepperTabsMobile}>
        {stepLabels.map((item, index) => (
          <div className={styles.stepItemMobile}>
            <div className={styles.stepItemIconMobile}>
              {item.icon("#302D2D", false)}
            </div>
            <Title order={5} fw={600} className={styles.stepTabMoile}>
              {item.label}
            </Title>
          </div>
        ))}
      </div>
    );
  };

  return isMobile ? <MobileTabs /> : <DesktopTabs />;
}

export default CustomTabs