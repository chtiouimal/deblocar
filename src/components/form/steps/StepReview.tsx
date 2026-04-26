"use client";

import { DevisFormData } from "@/types/devis";

type Props = {
  data: DevisFormData;
};

export default function StepReview({ data }: Props) {
  return (
    <div>
      <h2>Review</h2>

      <h3>Client</h3>
      <p>{data.client.name}</p>
      <p>{data.client.email}</p>
      <p>{data.client.phone}</p>

      <h3>Car</h3>
      <p>{data.client.car.brand}</p>
      <p>{data.client.car.model}</p>
      <p>{data.client.car.year}</p>
      <p>{data.client.car.vin}</p>

      <h3>Services</h3>
      <ul>
        {data.services.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
