import { Stack, Title, Text, Button } from "@mantine/core";
import Link from "next/link";

export default function ActionRequired() {
  return (
    <Stack align="center" mt={80}>
      <Title order={2}>Action nécessaire</Title>

      <Text c="dimmed" ta="center">
        Votre banque demande une confirmation supplémentaire pour finaliser le
        paiement.
      </Text>

      <Text c="dimmed">Veuillez retourner au paiement et réessayer.</Text>

      <Link href="/retail/checkout">
        <Button>Retour au panier</Button>
      </Link>
    </Stack>
  );
}
