import { useRetailAuthDrawer } from "@/hooks/useRetailAuthDrawer";
import { useLazyGetGenerateCodeQuery } from "@/lib/retailApi/parametersApi";
import { RootRetailState } from "@/retailStore/retailStore";
import { Button, Select, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { useSelector } from "react-redux";

interface RetailFormProps {
  data: any[];
}

function RetailForm({ data }: RetailFormProps) {
  const { open } = useRetailAuthDrawer();
  const { user } = useSelector((state: RootRetailState) => state.retailAuth);
  const [formData, setFormData] = useState({
    vin: "",
    hu: "",
    region: "",
    version: "",
  });

  const [selectedImage, setSelectedImage] = useState("");

  const [getGenerateCode, { data: generatedCode , isLoading, error }] =
    useLazyGetGenerateCodeQuery();

  const selectedNtg = data?.find((item) => item.shortName === formData.hu);

  const selectedRegion = selectedNtg?.regions?.find(
    (region: any) => region.shortName === formData.region,
  );

  const ngtOptions =
    data?.map((item) => ({
      value: item.shortName,
      label: item.ntgName,
    })) ?? [];

  const regionOptions =
    selectedNtg?.regions?.map((region: any) => ({
      label: region.displayName,
      value: region.shortName,
    })) ?? [];

  const versionOptions =
    selectedRegion?.versions?.map((version: any) => ({
      label: version.displayName,
      value: version.shortName,
    })) ?? [];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",

      // reset children when parent changes
      ...(name === "hu" && {
        region: "",
        version: "",
      }),

      ...(name === "region" && {
        version: "",
      }),
    }));

    if (name === "hu") {
      const selected = data.find((item) => item.shortName === value);

      setSelectedImage(selected?.images?.[0] ?? "");
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      open();
      return;
    }

  try {
    const result = await getGenerateCode({
      hu: formData.hu,
      region: formData.region,
      version: formData.version,
      // vin: formData.vin,
      vin: "XXXXXXXXXXXXXXXXX",
    }).unwrap();

    console.log("PIN:", result.pin);
  } catch (error) {
    console.error(error);
  }
  };

  return (
    <Stack>
      <TextInput
        label="VIN"
        name="vin"
        value={formData.vin}
        onChange={handleInputChange}
      />

      <Select
        label="NTG"
        data={ngtOptions}
        value={formData.hu}
        onChange={(value) => handleSelectChange("hu", value)}
      />

      <Select
        label="Region"
        data={regionOptions}
        value={formData.region}
        disabled={!formData.hu}
        onChange={(value) => handleSelectChange("region", value)}
      />

      <Select
        label="Version"
        data={versionOptions}
        value={formData.version}
        disabled={!formData.region}
        onChange={(value) => handleSelectChange("version", value)}
      />
      <Button mt={32} onClick={handleSubmit}>
        Envoyer
      </Button>
      {selectedImage && <img src={selectedImage} alt="NTG" width={200} />}
    </Stack>
  );
}

export default RetailForm;
