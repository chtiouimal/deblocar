"use client"

import { useFormStore } from "@/hooks/useFormStore";
import { colors } from "@/theme/colors";
import {
  Box,
  Button,
  Drawer,
  Flex,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { XIcon } from "@phosphor-icons/react";
import CarInformation from "./steps/CarInformation";
import { useEffect, useState } from "react";
import { StepInfoErrors, StepServicesErrors } from "@/types/devis";
import ServicesSelection from "./steps/ServicesSelection";
import ClientInformation from "./steps/ClientInformation";
import {
  validateCarInformation,
  validateClientInformation,
  validateServices,
} from "@/lib/validation/devisValidation";
import { initialDevisFormData } from "@/constants/devis";
import ConfirmationDevis from "./steps/ConfirmationDevis";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { notify } from "@/lib/notifications";

type StepErrors = StepInfoErrors & StepServicesErrors;

interface Service {
  _id: string;
  title: string;
  description: string;
}

const TOTAL_STEPS = 3;

function DevisStepper() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const { data, updateClient, updateCar, setData } = useFormStore();

  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
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

  useEffect(() => {
    fetchServices();
  }, []);

  const updateServices = (services: string[]) => {
    setData((prev) => ({ ...prev, services }));
  };

  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [step, setStep] = useState(1);
  const stepProgress = (step / TOTAL_STEPS) * 100;
  const stepContents = [
    {
      label: "Identifions votre véhicule",
      content: (
        <CarInformation
          data={data}
          updateCar={updateCar}
          stepErrors={stepErrors}
          setStepErrors={setStepErrors}
        />
      ),
    },
    {
      label: "Décrivez votre besoin",
      content: (
        <ServicesSelection
          initial={services}
          services={data.services}
          setServices={updateServices}
          stepError={stepErrors.services}
        />
      ),
    },
    {
      label: "Recevez votre devis personnalisé",
      content: (
        <ClientInformation
          data={data}
          updateClient={updateClient}
          stepErrors={stepErrors}
          setStepErrors={setStepErrors}
        />
      ),
    },
    {
      label: "Merci pour votre demande !",
      content: <ConfirmationDevis />,
    },
  ];

  const next = () => {
    let result;

    if (step === 1) {
      result = validateCarInformation(data);
    }

    if (step === 2) {
      result = validateServices(data);
    }

    if (step === 3) {
      result = validateClientInformation(data);
    }

    if (!result) return;

    setStepErrors(result.errors);

    if (!result.isValid) return;
    setStepErrors({});
    setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);

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
          year: data.client.car.year,
          vin: data.client.car.vin ?? null,
          mPoste: data.client.car.mPoste ?? null,
          services: data.services,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Form submission failed");
      }

      setData(initialDevisFormData);
      setStepErrors({});
      setStep(4);
      notify.success({
        message: "Devis créé avec succès",
      });
    } catch (err: any) {
      notify.error({
        message: err?.data?.message ?? "Une erreur est survenue.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = () => {
    router.push("/");
    setStep(1);
  };

  const message = `Bonjour Deblocar, j'ai soumis une demande de devis pour une ${data.client.car.brand} ${data.client.car.year}.`;

  return (
    <>
      <Button
        mah={55}
        w={330}
        onClick={open}
        style={{
          boxShadow: "0 0 30px 0 rgba(220, 31, 38, 0.4)",
        }}
      >
        Demander un devis
      </Button>
      <Drawer
        opened={opened}
        onClose={close}
        // title="Authentication"
        position="right"
        styles={{
          header: {
            backgroundColor: "rgb(21, 21, 23)",
          },
          body: {
            height: "100%",
            maxHeight: "calc(100vh - 60px)",
          },
        }}
      >
        <Flex h="100%" w="100%" p={16}>
          {/* <Paper
            bg="rgba(255, 255, 255, 0.07)"
            p={32}
            style={{
              boxShadow: "0 0 30px 0 rgba(220, 31, 38, 0.1)",
            }}
            m={16}
          > */}
          <Flex
            direction="column"
            justify="space-between"
            gap={32}
            style={{
              minHeight: "60vh",
            }}
          >
            <Flex direction="column" gap={16}>
              <Flex justify="center">
                <Title order={5} style={{ textTransform: "none" }}>
                  {stepContents[step - 1].label}
                </Title>
                {/* <XIcon weight="light" /> */}
              </Flex>
              {step !== 4 && (
                <Flex direction="column" gap={8}>
                  <Progress
                    style={{
                      boxShadow: "0 0 30px 0 rgba(220, 31, 38, 0.1)",
                    }}
                    color={colors.glowingRed[5]}
                    value={stepProgress}
                  />
                  <Text fz={10} opacity={0.4} ml="auto" mr="auto">
                    {`Etape ${step} sur 3`}
                  </Text>
                </Flex>
              )}
            </Flex>

            {stepContents[step - 1].content}

            <Flex
              justify={step === 4 ? "center" : "flex-end"}
              direction={step === 4 ? "column" : "row"}
              gap={16}
            >
              {step !== 4 && (
                <Button
                  onClick={back}
                  disabled={step === 1}
                  variant="transparent"
                  style={{ backgroundColor: "transparent", padding: 0 }}
                >
                  Précédant
                </Button>
              )}
              {step < 3 ? (
                <Button
                  onClick={next}
                  variant="filled"
                  style={{
                    boxShadow: "0 0 30px 0 rgba(220, 31, 38, 0.4)",
                  }}
                >
                  Suivant
                </Button>
              ) : step === 4 ? (
                <Button
                  onClick={handleConfirmation}
                  // disabled={loading}
                  style={{
                    boxShadow: "0 0 30px 0 rgba(220, 31, 38, 0.4)",
                  }}
                >
                  Retour à l’accueil
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
              {step === 4 && (
                <Button
                  component="a"
                  href={`https://wa.me/216${data.client.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  variant="transparent"
                  style={{ backgroundColor: "transparent", padding: 0 }}
                >
                  Nous contacter sur WhatsApp
                </Button>
              )}
            </Flex>
          </Flex>
          {/* </Paper> */}
        </Flex>
      </Drawer>
    </>
  );
}

export default DevisStepper