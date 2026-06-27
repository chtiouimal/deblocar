import { validateEmail, validateName, validatePhone } from "@/lib/validation/fieldValidation";
import { DevisFormData, StepInfoErrors } from "@/types/devis";
import { Stack, Text, TextInput } from "@mantine/core"


type Props = {
  data: DevisFormData;
  updateClient: (client: Partial<DevisFormData["client"]>) => void;
  stepErrors?: StepInfoErrors;
  setStepErrors: React.Dispatch<React.SetStateAction<StepInfoErrors>>;
};

function ClientInformation({
  data,
  updateClient,
  stepErrors,
  setStepErrors,
}: Props) {
  const getError = (field: string) =>
    stepErrors?.[field as keyof StepInfoErrors];

  const handleClientChange = (field: string, value: string) => {
    updateClient({ [field]: value });

    let error: string | undefined;

    switch (field) {
      case "name":
        error = validateName(value);
        break;

      case "email":
        error = validateEmail(value);
        break;

      case "phone":
        error = validatePhone(value);
        break;
    }

    setStepErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  return (
    <Stack>
      <Text fz={14} opacity={0.6}>
        Laissez vos coordonnées et nous vous recontacterons rapidement.
      </Text>
      <Stack>
        <TextInput
          placeholder="Nom complet"
          value={data.client.name}
          onChange={(e) => handleClientChange("name", e.target.value)}
          error={getError("name")}
          style={{ marginBottom: 20 }}
        />
        <TextInput
          type="email"
          placeholder="Email"
          value={data.client.email}
          onChange={(e) => handleClientChange("email", e.target.value)}
          error={getError("email")}
          style={{ marginBottom: 20 }}
        />
        <TextInput
          type="tel"
          placeholder="Télephone"
          value={data.client.phone}
          onChange={(e) => handleClientChange("phone", e.target.value)}
          error={getError("phone")}
          style={{ marginBottom: 20 }}
        />
      </Stack>
    </Stack>
  );
}

export default ClientInformation