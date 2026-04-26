"use client";

import { AVAILABLE_SERVICES } from "@/constants/devis";
import { useState } from "react";

type Props = {
  services: string[];
  setServices: (services: string[]) => void;
  stepError?: string;
};

export default function StepServices({ services, setServices, stepError }: Props) {
  const toggleService = (service: string) => {
    const updated = services.includes(service)
      ? services.filter((s) => s !== service)
      : [...services, service];

    setServices(updated);
  };

  const isValid = services.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h2>Services</h2>

      {AVAILABLE_SERVICES.map((service) => (
        <label
          key={service}
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={services.includes(service)}
            onChange={() => toggleService(service)}
          />
          {service}
        </label>
      ))}
      {stepError ||
        (!isValid && (
          <p style={{ color: "red", fontSize: 12 }}>
            Sélectionnez au moins un service
          </p>
        ))
      }
    </div>
  );
}
