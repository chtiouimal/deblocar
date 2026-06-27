import { List, ListItem, Stack, Text } from "@mantine/core"
import styles from "../../../app/(main)/devis/page.module.css";

function ConfirmationDevis() {
  return (
    <Stack>
      <Text fz={14} opacity={0.6}>
        Votre véhicule va être pris en charge par notre équipe pour
        vérification.
      </Text>
      <Stack>
        <Text fz={14} opacity={0.8}>
          Nous vous recontacterons rapidement avec :
        </Text>
        {/* <List>
          <ListItem>
            <Text fz={14} opacity={0.8}>
              la faisabilité de l’intervention
            </Text>
          </ListItem>
          <ListItem>
            <Text fz={14} opacity={0.8}>
              les options disponibles
            </Text>
          </ListItem>
          <ListItem>
            <Text fz={14} opacity={0.8}>
              le tarif estimé
            </Text>
          </ListItem>
          <ListItem>
            <Text fz={14} opacity={0.8}>
              les prochaines disponibilités
            </Text>
          </ListItem>
        </List> */}
        <ul className={styles.heroTagList}>
          <li>
            <Text size="sm" fw={400}>
              la faisabilité de l’intervention
            </Text>
          </li>
          <li>
            <Text size="sm" fw={400}>
              les options disponibles
            </Text>
          </li>
          <li>
            <Text size="sm" fw={400}>
              le tarif estimé
            </Text>
          </li>
          <li>
            <Text size="sm" fw={400}>
              les prochaines disponibilités
            </Text>
          </li>
        </ul>
        <Text fz={14} opacity={0.8}>
          À très vite,
        </Text>
        <Text fz={14}>
          L’équipe Deblocar
        </Text>
      </Stack>
    </Stack>
  );
}

export default ConfirmationDevis