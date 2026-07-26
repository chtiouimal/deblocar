import { Stack, Title, Text, Button } from "@mantine/core";
import Link from "next/link";

export default function GenerationFailed() {
  return (
    <Stack align="center" mt={80}>
      <Title order={2}>Commande en erreur</Title>

      <Text c="dimmed" ta="center">
        Votre paiement a bien été reçu, mais nous n'avons pas pu générer votre
        commande.
      </Text>

      <Text c="dimmed">
        Notre équipe va vérifier la situation. Votre panier a été conservé.
      </Text>

      <Link href="/retail/profile">
        <Button>Voir mes commandes</Button>
      </Link>
    </Stack>
  );
}
