"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Stack, Title, Text, Button } from "@mantine/core";
import Link from "next/link";

import { clearCart } from "@/retailStore/retailCartSlice";

export default function SuccessPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <Stack align="center" mt={80} gap="md">
      <Title order={2}>Commande confirmée</Title>

      <Text c="dimmed" ta="center">
        Votre paiement a été accepté et votre commande est en cours de
        traitement.
      </Text>

      <Text c="dimmed" ta="center">
        Vous recevrez un email de confirmation avec les détails de votre
        commande.
      </Text>

      <Link href="/retail">
        <Button>Retour à la boutique</Button>
      </Link>
    </Stack>
  );
}
