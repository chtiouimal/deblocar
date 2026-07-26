"use client";

import { useState } from "react";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { Button, Stack, Text } from "@mantine/core";

import { notify } from "@/lib/notifications";

interface Props {
  onSuccess: () => void;
}

function StripePaymentForm({ onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,

      confirmParams: {
        return_url: window.location.href,
      },

      redirect: "if_required",
    });

    if (error) {
      notify.error({
        title: "Paiement échoué",
        message: error.message || "Une erreur est survenue.",
      });

      setLoading(false);
      return;
    }

    notify.success({
      message: "Paiement effectué avec succès.",
    });

    onSuccess();

    setLoading(false);
  };

  return (
    <Stack>
      <PaymentElement
        options={{
          paymentMethodOrder: ["card"],
        }}
      />

      <Button
        loading={loading}
        disabled={!stripe || !elements}
        onClick={handleSubmit}
      >
        Payer
      </Button>
    </Stack>
  );
}

export default StripePaymentForm;
