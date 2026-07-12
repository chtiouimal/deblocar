import { useRetailAuthDrawer } from "@/hooks/useRetailAuthDrawer";
import { useLazyGetGenerateCodeQuery } from "@/lib/retailApi/parametersApi";
import { updateBalance } from "@/retailStore/retailAuthSlice";
import { RootRetailState } from "@/retailStore/retailStore";
import {
  RetailParameters,
  RetailRegions,
  RetailVersions,
} from "@/types/retail";
import {
  Button,
  Flex,
  Grid,
  GridCol,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface RetailFormProps {
  data: RetailParameters | null;
}

function RetailForm({ data }: RetailFormProps) {
  const dispatch = useDispatch();
  const { open } = useRetailAuthDrawer();
  const { user } = useSelector((state: RootRetailState) => state.retailAuth);
  const [formData, setFormData] = useState({
    vin: "",
    hu: data?.shortName ?? "",
    region: "",
    version: "",
  });

  const [getGenerateCode, { data: generatedCode, isLoading, error }] =
    useLazyGetGenerateCodeQuery();

  const selectedRegion = data?.regions?.find(
    (region: any) => region.shortName === formData.region,
  );

  const regionOptions =
    data?.regions?.map((region: RetailRegions) => ({
      label: region.displayName,
      value: region.shortName,
    })) ?? [];

  const versionOptions =
    selectedRegion?.versions?.map((version: RetailVersions) => ({
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

      dispatch(updateBalance(result.balance));

      console.log("PIN:", result.pin);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid>
      <GridCol span={{ base: 12, md: 8 }}>
        {data?.images[0] && (
          <img
            src={data?.images[0]}
            alt="NTG"
            width="100%"
            style={{ maxHeight: "75vh" }}
          />
        )}
      </GridCol>
      <GridCol span={{ base: 12, md: 4 }} p="0 32px 32px">
        <Flex direction="column" justify="space-between" h="100%">
          <Flex direction="column" gap={16} mb={64}>
            <Title order={3}>{data?.ntgName}</Title>
            <Text fw={600}>{data?.tokenCost} tokens</Text>
            <Text>{data?.displayName}</Text>
          </Flex>
          <Stack>
            <TextInput
              label="VIN"
              name="vin"
              value={formData.vin}
              onChange={handleInputChange}
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
              {isLoading ? "En cours" : "Envoyer"}
            </Button>
          </Stack>
        </Flex>
      </GridCol>
    </Grid>
  );
}

export default RetailForm;
