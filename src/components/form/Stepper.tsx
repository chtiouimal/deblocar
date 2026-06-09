"use client"

import { useEffect, useState } from "react";
import StepInfo from "./steps/StepInfo";
import StepServices from "./steps/StepServices";
import StepReview from "./steps/StepReview";

import { useFormStore } from "@/hooks/useFormStore";
import { validateStep1, validateStep2 } from "@/lib/validation/devisValidation";
import { initialDevisFormData } from "@/constants/devis";
import { StepInfoErrors, StepServicesErrors } from "@/types/devis";
import { Button, Text } from "@mantine/core";
import styles from "./stepper.module.css";
import { colors } from "@/theme/colors";
import { CheckIcon } from "@phosphor-icons/react";
import { useViewport } from "@/hooks/useViewport";
import InformationStep from "./steps/InformationStep";
import ServiceStep from "./steps/ServiceStep";
import ReviewStep from "./steps/ReviewStep";

type StepErrors = StepInfoErrors & StepServicesErrors;

interface Service {
  _id: string;
  title: string;
  description: string;
}

export default function Stepper() {
  const { data, updateClient, updateCar, setData } = useFormStore();
  const { isMobile } = useViewport();
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [loading, setLoading] = useState(false);
  const stepLabels = ["Informations", "Services", "Finalisation"];

  const fetchServices = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/services`);

      const data = await res.json();

      setServices(data.services);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.client.name,
          email: data.client.email,
          phone: data.client.phone,
          brand: data.client.car.brand,
          // model: data.client.car.model,
          year: data.client.car.year,
          vin: data.client.car.vin,
          services: data.services,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Form submission failed");
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

  useEffect(() => {
    fetchServices();
  }, []);

  const steps = [
    <InformationStep
      key="info"
      data={data}
      updateClient={updateClient}
      updateCar={updateCar}
      stepErrors={stepErrors}
    />,

    <ServiceStep
      key="services"
      initial={services}
      services={data.services}
      setServices={updateServices}
      stepError={stepErrors.services}
    />,

    <ReviewStep key="review" data={data} initial={services} />,
  ];

  return (
    <div className={styles.stepperContainer}>
      {/* {isMobile ? (
        <div className={styles.stepperTabsMobile}>
          <span className={styles.verticalLine} />
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
              <Text size="md">{label}</Text>
            </button>
          ))}
        </div>
      ) : ( */}
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
              <CheckIcon
                size={16}
                weight="thin"
                color={colors.primary}
                className={styles.stepLabelIcon}
              />
            )}
            <Text size="md" fw={400}>
              {label}
            </Text>
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
      {/* )} */}
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
