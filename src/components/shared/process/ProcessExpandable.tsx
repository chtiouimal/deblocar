import { Accordion, AccordionControl, AccordionItem, AccordionPanel, Text, Title } from '@mantine/core';
import styles from "./process.module.css";
import { PROCESS } from '@/constants/process';

function ProcessExpandable() {
  return (
    <Accordion
      order={3}
      transitionDuration={500}
      classNames={{ control: styles.accordionControl }}
      // style={{
      //   display: "flex",
      //   justifyContent: "space-between",
      // }}
      // add in inspect these styles it works but not here in the accordian m_fe19b709 m_9bd7b098 mantine-Accordion-item
    >
      {PROCESS.map((process) => (
        <AccordionItem value={process.id} key={process.id}>
          <AccordionControl>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginRight: "40%",
              }}
            >
              <Title order={2} style={{ opacity: 0.8, fontSize: 64 }}>
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
          <AccordionPanel style={{ minWidth: 500 }}>
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

export default ProcessExpandable