"use client";

import { ReactNode } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripeClient";

interface Props {
  children: ReactNode;
  clientSecret: string;
}

export default function StripeProvider({ children, clientSecret }: Props) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,

        appearance: {
          theme: "night",
        },
      }}
    >
      {children}
    </Elements>
  );
}
