"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetOrderStatusQuery } from "@/lib/retailApi/ordersApi";

import { Loader, Stack, Text, Title, Alert, Button } from "@mantine/core";

export default function ProcessingPage() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("orderId");

  const [timedOut, setTimedOut] = useState(false);

  const { data } = useGetOrderStatusQuery(orderId!, {
    skip: !orderId,
    pollingInterval: timedOut ? 0 : 3000,
  });

  /*
    Timeout protection

    We don't say failed.
    We simply stop waiting.
  */
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 90000); // 90 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!data) return;
    if (
      data.paymentStatus === "succeeded" &&
      (data.orderStatus === "completed" || data.orderStatus === "partial")
    ) {
      router.replace(`/retail/checkout/success?orderId=${orderId}`);
    }

    if (data.paymentStatus === "failed") {
      router.replace(`/retail/checkout/failed?orderId=${orderId}`);
    }

    if (data.paymentStatus === "succeeded" && data.orderStatus === "failed") {
      router.replace(`/retail/checkout/generation-failed?orderId=${orderId}`);
    }

    if (data.paymentStatus === "action_required") {
      router.replace(`/retail/checkout/action-required?orderId=${orderId}`);
    }
  }, [data, orderId, router]);

  if (timedOut) {
    return (
      <Stack align="center" mt={80}>
        <Alert color="yellow">
          <Title order={4}>Vérification en cours</Title>

          <Text mt="sm">
            Votre paiement prend plus de temps que prévu. Ne recommencez pas le
            paiement.
          </Text>
        </Alert>

        <Button
          onClick={() => {
            setTimedOut(false);
          }}
        >
          Vérifier à nouveau
        </Button>
      </Stack>
    );
  }

  return (
    <Stack align="center" mt={80}>
      <Loader />

      <Title order={3}>Vérification du paiement...</Title>

      <Text c="dimmed">
        Nous confirmons votre paiement et préparons votre commande.
      </Text>
    </Stack>
  );
}
