import { MERCEDES_NTG_MODELS } from "@/constants/retail";
import { useRetailAuthDrawer } from "@/hooks/useRetailAuthDrawer";
import { notify } from "@/lib/notifications";
import { useLazyGetGenerateCodeQuery } from "@/lib/retailApi/parametersApi";
import { updateBalance } from "@/retailStore/retailAuthSlice";
import { addToCart } from "@/retailStore/retailCartSlice";
import { RootRetailState } from "@/retailStore/retailStore";
import {
  RetailParameters,
  RetailRegions,
  RetailVersions,
} from "@/types/retail";
import {
  Blockquote,
  Box,
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
import { WarningIcon } from "@phosphor-icons/react";
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

  function formatVersion(value: string) {
    const match = value.match(/^(\d{4})\s*\(([^)]+)\)$/);

    if (!match) return value;

    const [, year, version] = match;

    return `${year} - ${version}`;
  }

  function getNTGModels(displayName: string) {
    const ntg = MERCEDES_NTG_MODELS.find((item) =>
      displayName.startsWith(item.ntg),
    );

    return ntg?.models ?? [];
  }

  const models = getNTGModels(data?.displayName ?? "");

  const handleSubmit = async () => {
    if (!user) {
      open({ isGeneration: true });
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

  const handleAddToCart = () => {
    const item = {
      id: `${formData.hu}-${formData.region}-${formData.version}-${formData.vin}`,

      hu: formData.hu,

      ntgName: data?.ntgName ?? "",

      region: formData.region,

      version: formData.version,

      vin: formData.vin,

      tokenCost: Number(data?.tokenCost ?? 0),

      price: data?.price ?? 0,
    };

    dispatch(addToCart(item));

    console.log("ADDING:", item);

    notify.success({
      message: "Produit ajouté au panier.",
    });
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
      <GridCol span={{ base: 12, md: 5 }} p="0 0 32px 32px">
        <ScrollArea h="76vh">
          <Flex direction="column" justify="space-between" h="100%" pr={20}>
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
              {/* <Button mt={32} onClick={handleSubmit}>
                {isLoading ? "Génération en cours..." : "Générer le code"}
              </Button> */}
              <Button mt={32} onClick={handleAddToCart}>
                Ajouter au panier
              </Button>
            </Stack>
            <Stack mt={64}>
              <Text fz="sm">
                PIN d'activation des cartes de navigation Mercedes-Benz pour les
                systèmes {data?.ntgName}.
              </Text>

              <Flex w="100%" justify="center">
                <Blockquote
                  w="90%"
                  color="red"
                  iconSize={38}
                  // cite="– Forrest Gump"
                  icon={<WarningIcon size={20} weight="thin" />}
                  mt="xl"
                >
                  Un PC Windows est requis pour installer cette mise à jour — le
                  Mercedes Download Manager fonctionne uniquement sur Windows.
                  Les appareils Mac et mobiles ne sont pas pris en charge.
                </Blockquote>
              </Flex>

              <Title order={6} mt={16}>
                Ce que vous recevrez par e-mail
              </Title>
              <List>
                <List.Item fz="sm">
                  Un code PIN d'activation Mercedes-Benz, généré pour votre VIN
                  et la version de cartographie sélectionnée.
                </List.Item>
                <List.Item fz="sm">
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
                <List.Item fz="sm">
                  Une clé USB d'au moins 32 Go (64 Go recommandés pour les
                  cartographies les plus récentes), formatée en FAT32 ou exFAT.
                </List.Item>
                <List.Item fz="sm">
                  Un ordinateur sous Windows (nécessaire pour utiliser Mercedes
                  Download Manager).
                </List.Item>
                <List.Item fz="sm">
                  Votre Mercedes-Benz, avec le moteur en marche ou le contact
                  mis pendant toute la durée de la mise à jour.
                </List.Item>
              </List>

              <Title order={6} mt={16}>
                Installation
              </Title>
              <Text fz="sm">
                L'installation dure environ une heure, dont la majeure partie
                est consacrée à la copie des fichiers. Aucun passage en atelier
                ni outil de programmation n'est nécessaire.
              </Text>

              <Title order={6} mt={16}>
                Compatibilité
              </Title>
              <List>
                {models.map((model) => (
                  <List.Item key={model.name} fz="sm">
                    {model.name} ({model.codes.join(" / ")})
                  </List.Item>
                ))}
              </List>
              <Text fz="sm">
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
                {data?.regions?.map((region, i) => (
                  <List.Item key={i} fz="sm">
                    {region?.displayName} (
                    {region?.versions
                      ?.map((version, i) => formatVersion(version?.displayName))
                      .join(", ")}
                    )
                  </List.Item>
                ))}
              </List>
            </Stack>
          </Flex>
        </ScrollArea>
      </GridCol>
    </Grid>
  );
}

export default RetailForm;
