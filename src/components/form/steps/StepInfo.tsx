"use client";

import { CAR_DATA } from "@/constants/devis";
import { validateField } from "@/lib/validation/fieldValidation";
import { DevisFormData, StepInfoErrors } from "@/types/devis";
import { useState } from "react";

type Props = {
  data: DevisFormData;
  updateClient: (client: Partial<DevisFormData["client"]>) => void;
  updateCar: (client: Partial<DevisFormData["client"]["car"]>) => void;
  stepErrors?: StepInfoErrors;
};

export default function StepInfo({ data, updateClient, updateCar, stepErrors }: Props) {
  const selectedBrand = data.client.car.brand as keyof typeof CAR_DATA;
  const models = selectedBrand ? CAR_DATA[selectedBrand] : [];
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const getError = (field: string) =>
    stepErrors?.[field as keyof StepInfoErrors] || fieldErrors[field];

  const handleClientChange = (field: string, value: string) => {
    updateClient({ [field]: value });

    const error = validateField(field, value);

    setFieldErrors((prev) => ({
      ...prev,
      [field]: error || "",
    }));
  };

  const handleCarChange = (field: string, value: string) => {
    updateCar({ [field]: value });

    const error = validateField(field, value);

    setFieldErrors((prev) => ({
      ...prev,
      [field]: error || "",
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h2>Informations</h2>

      {/* Client */}
      <input
        placeholder="Nom complet"
        value={data.client.name}
        onChange={(e) => handleClientChange("name", e.target.value)}
      />
      {getError("name") && (
        <p style={{ color: "red", fontSize: 12 }}>{getError("name")}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={data.client.email}
        onChange={(e) => handleClientChange("email", e.target.value)}
      />
      {getError("email") && (
        <p style={{ color: "red", fontSize: 12 }}>{getError("email")}</p>
      )}

      <input
        type="tel"
        placeholder="+216 XX XXX XXX"
        value={data.client.phone}
        onChange={(e) => handleClientChange("phone", e.target.value)}
      />
      {getError("phone") && (
        <p style={{ color: "red", fontSize: 12 }}>{getError("phone")}</p>
      )}

      {/* Car */}
      {/* BRAND SELECT */}
      <select
        value={data.client.car.brand}
        onChange={(e) => {
          const brand = e.target.value;

          updateCar({
            brand,
            model: "", // reset model
          });

          const error = validateField("brand", brand);

          setFieldErrors((prev) => ({
            ...prev,
            brand: error || "",
            model: "", // clear model error when brand changes
          }));
        }}
      >
        <option value="">Select brand</option>
        {Object.keys(CAR_DATA).map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      {getError("brand") && (
        <p style={{ color: "red", fontSize: 12 }}>{getError("brand")}</p>
      )}

      {/* MODEL SELECT */}
      <select
        value={data.client.car.model}
        disabled={!data.client.car.brand}
        onChange={(e) => {
          const model = e.target.value;

          updateCar({ model });

          const error = validateField("model", model);

          setFieldErrors((prev) => ({
            ...prev,
            model: error || "",
          }));
        }}
      >
        <option value="">Select model</option>
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
      {getError("model") && (
        <p style={{ color: "red", fontSize: 12 }}>{getError("model")}</p>
      )}

      <input
        placeholder="Année"
        value={data.client.car.year}
        onChange={(e) => handleCarChange("year", e.target.value)}
      />
      {getError("year") && (
        <p style={{ color: "red", fontSize: 12 }}>{getError("year")}</p>
      )}

      <input
        placeholder="VIN"
        value={data.client.car.vin}
        onChange={(e) => handleCarChange("vin", e.target.value)}
      />
      {getError("vin") && (
        <p style={{ color: "red", fontSize: 12 }}>{getError("vin")}</p>
      )}
    </div>
  );
}
