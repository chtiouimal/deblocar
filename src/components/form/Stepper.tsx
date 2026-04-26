"use client"

import { useState } from "react";
import StepInfo from "./steps/StepInfo";
import StepServices from "./steps/StepServices";
import StepReview from "./steps/StepReview";

import { useFormStore } from "@/hooks/useFormStore";
import { validateStep1, validateStep2 } from "@/lib/validation/devisValidation";
import { initialDevisFormData } from "@/constants/devis";
import { StepInfoErrors, StepServicesErrors } from "@/types/devis";

type StepErrors = StepInfoErrors & StepServicesErrors;

export default function Stepper() {

  const { data, updateClient, updateCar, setData } = useFormStore();
  const [step, setStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [loading, setLoading] = useState(false);

  const next = () => {
    let result;

    if (step === 0) {
        result = validateStep1(data);
    }

    if (step === 1) {
        result = validateStep2(data);
    }

    if (!result) return;

    setStepErrors(result.errors);

    if (!result.isValid) return;

    setStepErrors({});
    setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);

  const updateServices = (services: string[]) => {
    setData((prev) => ({ ...prev, services }));
  };

  const submitForm = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", data.client.name);
      formData.append("email", data.client.email);
      formData.append("phone", data.client.phone);
      formData.append("brand", data.client.car.brand);
      formData.append("model", data.client.car.model);
      formData.append("year", data.client.car.year);
      formData.append("vin", data.client.car.vin);
      formData.append("services", data.services.join(", "));

      const res = await fetch("https://formspree.io/f/mdayjjqz", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      // ⚠️ IMPORTANT: don’t assume JSON always exists
      if (!res.ok) {
        throw new Error("Form submission failed");
      }

      // success
      setData(initialDevisFormData);
      setStepErrors({});
      setStep(0);
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    <StepInfo
      key="info"
      data={data}
      updateClient={updateClient}
      updateCar={updateCar}
      stepErrors={stepErrors}
    />,

    <StepServices
      key="services"
      services={data.services}
      setServices={updateServices}
      stepError={stepErrors.services}
    />,

    <StepReview key="review" data={data} />,
  ];

  return (
    <div>
      {steps[step]}

      <div style={{ marginTop: 20 }}>
        <button onClick={back} disabled={step === 0}>
          Back
        </button>

        {step < steps.length - 1 ? (
          <button onClick={next}>Next</button>
        ) : (
          <button onClick={submitForm} disabled={loading}>
            {loading ? "Sending..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}
