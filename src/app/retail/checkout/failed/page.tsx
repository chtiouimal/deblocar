import Link from "next/link";
import { Stack, Title, Text, Button } from "@mantine/core";

export default function Failed() {
  return (
    <Stack align="center" mt={80}>
      <Title order={2}>Paiement échoué</Title>

      <Text c="dimmed">
        Votre paiement n&apos;a pas été finalisé. Votre panier a été conservé.
      </Text>

      <Link href="/retail/checkout">
        <Button>Retour au panier</Button>
      </Link>
    </Stack>
  );
}
