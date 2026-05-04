"use client"

import { useState } from "react";
import StepInfo from "./steps/StepInfo";
import StepServices from "./steps/StepServices";
import StepReview from "./steps/StepReview";

import { useFormStore } from "@/hooks/useFormStore";
import { validateStep1, validateStep2 } from "@/lib/validation/devisValidation";
import { initialDevisFormData } from "@/constants/devis";
import { StepInfoErrors, StepServicesErrors } from "@/types/devis";
import { Button } from "@mantine/core";
import styles from "./stepper.module.css";
import { colors } from "@/theme/colors";
import { CheckIcon } from "@phosphor-icons/react";
import { useViewport } from "@/hooks/useViewport";

type StepErrors = StepInfoErrors & StepServicesErrors;

export default function Stepper() {
  const { data, updateClient, updateCar, setData } = useFormStore();
  const { isMobile } = useViewport();
  const [step, setStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [loading, setLoading] = useState(false);
  const stepLabels = ["Informations client", "Services", "Finalisation"];

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
      const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_URL;

      if (!FORM_ENDPOINT) {
        throw new Error("Missing Formspree endpoint in env");
      }

      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Form submission failed");
      }

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
    <div className={styles.stepperContainer}>
      {isMobile ? (
        <div className={styles.stepperTabsMobile}>
          {/* vertical background line */}
          <span className={styles.verticalLine} />

          {/* vertical tick that moves */}
          <span
            className={styles.verticalTick}
            style={{
              transform: `translateY(${step * 100}%)`,
            }}
          />

          {stepLabels.map((label, index) => (
            <button
              key={label}
              type="button"
              className={`${styles.stepTabMobile} ${
                step === index ? styles.activeTabMobile : ""
              }`}
              style={{ color: step > index ? "#DC1F26" : undefined }}
            >
              {step > index && (
                <CheckIcon size={14} weight="thin" color={colors.primary} />
              )}
              {label}
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.stepperTabs}>
          {stepLabels.map((label, index) => (
            <button
              key={label}
              type="button"
              className={`${styles.stepTab} ${
                step === index ? styles.activeTab : ""
              }`}
              // onClick={() => {
              //   if (index <= step) setStep(index);
              // }}
              style={{ color: step > index ? "#DC1F26" : "#fff" }}
            >
              {step > index && (
                <CheckIcon size={16} weight="thin" color={colors.primary} />
              )}
              {label}
            </button>
          ))}

          {/* underline */}
          <span
            className={styles.activeLine}
            style={{
              transform: `translateX(${step * 100}%)`,
            }}
          >
            <span className={styles.activeLineTic} />
          </span>
        </div>
      )}
      <div className={styles.stepperContent}>{steps[step]}</div>

      <div className={styles.stepperFooter}>
        <Button
          onClick={back}
          disabled={step === 0}
          variant="transparent"
          style={{ backgroundColor: "transparent", padding: 0 }}
        >
          Précédant
        </Button>

        {step < steps.length - 1 ? (
          <Button
            onClick={next}
            variant="filled"
            style={{
              boxShadow: "0 0 30px 0 rgba(220, 31, 38, 0.4)",
            }}
          >
            Suivant
          </Button>
        ) : (
          <Button
            onClick={submitForm}
            disabled={loading}
            style={{
              boxShadow: "0 0 30px 0 rgba(220, 31, 38, 0.4)",
            }}
          >
            {loading ? "En cours..." : "Envoyer"}
          </Button>
        )}
      </div>
    </div>
  );
}
