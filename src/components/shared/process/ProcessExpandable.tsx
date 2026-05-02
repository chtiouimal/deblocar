"use client";

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Text,
  Title,
} from "@mantine/core";
import styles from "./process.module.css";
import { PROCESS } from "@/constants/process";
import { ArrowDownRightIcon } from "@phosphor-icons/react";

function ProcessExpandable() {
  return (
    <Accordion
      order={3}
      transitionDuration={500}
      classNames={{
        control: styles.accordionControl,
        item: styles.accordionItem,
        chevron: styles.accordionChevron,
        content: styles.accordionPanelContent,
        itemTitle: styles.accordionItemTitle,
      }}
      chevron={<ArrowDownRightIcon size={32} weight="regular" />}
    >
      {PROCESS.map((process) => (
        <AccordionItem value={process.id} key={process.id}>
          <AccordionControl>
            <div className={styles.accordionControlContent}>
              <Title
                order={2}
                style={{ opacity: 0.8, fontSize: 64, minWidth: 85 }}
              >
                {process.id}
              </Title>
              <Text
                size="xl"
                fw={400}
                style={{
                  opacity: 0.8,
                  fontSize: 24,
                  transition: "transform 0.35s ease",
                }}
              >
                {process.label}
              </Text>
            </div>
          </AccordionControl>
          <AccordionPanel className={styles.accordionPanel}>
            <Text size="md" fw={400} style={{ maxWidth: 488, opacity: 0.8 }}>
              {process.title}
            </Text>
            <Text size="sm" fw={400} style={{ maxWidth: 488, opacity: 0.6 }}>
              {process.description}
            </Text>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default ProcessExpandable;
