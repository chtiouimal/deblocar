import { useRetailAuthDrawer } from "@/hooks/useRetailAuthDrawer";
import { notify } from "@/lib/notifications";
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
  List,
  ScrollArea,
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
      notify.success({
        message: "Le code a été généré avec succès.",
      });
    } catch (err: any) {
      const message =
        err?.data?.message || "Une erreur est survenue lors de la génération.";

      if (err?.data?.message === "Insufficient tokens") {
        notify.warning({
          title: "Solde insuffisant",
          message: "Vous n'avez pas assez de crédits pour générer ce code.",
        });
      } else {
        notify.error({
          title: "Erreur",
          message,
        });
      }
    }
  };

  return (
    <Grid overflow="hidden" mah="76vh">
      <GridCol span={{ base: 12, md: 7 }}>
        {data?.images[0] && (
          <img
            src={data?.images[0]}
            alt="NTG"
            width="100%"
            style={{ maxHeight: "75vh" }}
          />
        )}
      </GridCol>
      <GridCol span={{ base: 12, md: 5 }} p="0 32px 32px">
        <ScrollArea h="76vh">
          <Flex direction="column" justify="space-between" h="100%" pr={16}>
            <Flex direction="column" gap={16} mb={64}>
              <Title order={3}>{data?.ntgName}</Title>
              <Text fw={600}>{data?.price} TND</Text>
              <Text c="dimmed" size="xs">
                {data?.displayName}
              </Text>
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
                {isLoading ? "Génération en cours..." : "Générer le code"}
              </Button>
            </Stack>
            <Stack mt={32}>
              <Text>
                PIN d'activation des cartes de navigation Mercedes-Benz pour les
                systèmes NTG6 (MBUX – première génération).
              </Text>

              <Title order={6} mt={16}>
                Ce que vous recevrez par e-mail
              </Title>
              <List>
                <List.Item>
                  Un code PIN d'activation Mercedes-Benz, généré pour votre VIN
                  et la version de cartographie sélectionnée.
                </List.Item>
                <List.Item>
                  Mercedes Download Manager, l'outil officiel permettant de
                  télécharger la cartographie, d'extraire les fichiers, de
                  préparer la clé USB et de copier les données en une seule
                  étape (compatible Windows uniquement).
                </List.Item>
              </List>

              <Title order={6} mt={16}>
                Ce dont vous aurez besoin
              </Title>
              <List>
                <List.Item>
                  Une clé USB d'au moins 32 Go (64 Go recommandés pour les
                  cartographies les plus récentes), formatée en FAT32 ou exFAT.
                </List.Item>
                <List.Item>
                  Un ordinateur sous Windows (nécessaire pour utiliser Mercedes
                  Download Manager).
                </List.Item>
                <List.Item>
                  Votre Mercedes-Benz, avec le moteur en marche ou le contact
                  mis pendant toute la durée de la mise à jour.
                </List.Item>
              </List>

              <Title order={6} mt={16}>
                Installation
              </Title>
              <Text>
                L'installation dure environ une heure, dont la majeure partie
                est consacrée à la copie des fichiers. Aucun passage en atelier
                ni outil de programmation n'est nécessaire.
              </Text>

              <Title order={6} mt={16}>
                Compatibilité
              </Title>
              <List>
                <List.Item>Classe A W177 (à partir de 05/2018)</List.Item>
                <List.Item>Classe B W247 (à partir de 12/2018)</List.Item>
                <List.Item>CLA Coupé C118 (à partir de 03/2019)</List.Item>
                <List.Item>
                  CLA Shooting Brake X118 (à partir de 07/2019)
                </List.Item>
                <List.Item>EQC N293 (millésime 2019 et suivants)</List.Item>
                <List.Item>GLB X247 (à partir de 09/2019)</List.Item>
                <List.Item>GLC X253 (à partir de 2019)</List.Item>
                <List.Item>
                  GLE Coupé C167 / W167 (millésime 2019 et suivants)
                </List.Item>
                <List.Item>GLS X167 (millésime 2019 et suivants)</List.Item>
                <List.Item>Classe V W447 (à partir de 03/2020)</List.Item>
                <List.Item>Sprinter W907 / W910 (à partir de 2018)</List.Item>
              </List>
              <Text>
                Le code PIN est associé à votre numéro de châssis (VIN) à 17
                caractères ainsi qu'à la version de cartographie sélectionnée.
                Veuillez vérifier attentivement votre VIN avant de passer
                commande. Le PIN ne peut pas être transféré vers un autre
                véhicule ni utilisé avec une autre version de cartographie. Si
                votre modèle ne figure pas dans la liste ci-dessus,
                contactez-nous avec votre VIN avant de commander.
              </Text>

              <Title order={6} mt={16}>
                Zones de couverture des cartographies
              </Title>
              <List>
                <List.Item>Europe (V25 – 2026)</List.Item>
                <List.Item>Amérique du Nord (V25 – 2026)</List.Item>
                <List.Item>Amérique du Sud (V17 – 2026)</List.Item>
                <List.Item>Afrique / Moyen-Orient (V10 – 2025)</List.Item>
                <List.Item>Australie / Nouvelle-Zélande (V12 – 2025)</List.Item>
                <List.Item>Inde (V19 – 2025)</List.Item>
                <List.Item>Asie du Sud-Est (V19.1 – 2025)</List.Item>
              </List>
            </Stack>
          </Flex>
        </ScrollArea>
      </GridCol>
    </Grid>
  );
}

export default RetailForm;
