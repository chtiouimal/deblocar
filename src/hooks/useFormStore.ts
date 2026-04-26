import { useState } from "react";
import { DevisFormData } from "@/types/devis";
import { initialDevisFormData } from "@/constants/devis";

export const useFormStore = () => {
  const [data, setData] = useState<DevisFormData>(initialDevisFormData);

  const updateClient = (client: Partial<DevisFormData["client"]>) => {
    setData((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        ...client,
      },
    }));
  };

  const updateCar = (car: Partial<DevisFormData["client"]["car"]>) => {
    setData((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        car: {
          ...prev.client.car,
          ...car,
        },
      },
    }));
  };

  return {
    data,
    setData,
    updateClient,
    updateCar,
  };
};
