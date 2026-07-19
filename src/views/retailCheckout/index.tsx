"use client";

import { useRetailAuthDrawer } from "@/hooks/useRetailAuthDrawer";
import { notify } from "@/lib/notifications";
import { useCreateOrderMutation } from "@/lib/retailApi/ordersApi";
import { updateBalance } from "@/retailStore/retailAuthSlice";
import { clearCart } from "@/retailStore/retailCartSlice";
import { RootRetailState } from "@/retailStore/retailStore";
import {
  Card,
  Stack,
  Text,
  Title,
  Group,
  Divider,
  Button,
  Badge,
  Box,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";

function RetailCheckoutView() {
  const dispatch = useDispatch();
    const { open } = useRetailAuthDrawer();
    const { user } = useSelector((state: RootRetailState) => state.retailAuth);
  const items = useSelector((state: RootRetailState) => state.retailCart.items);

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  console.log("items: ", items)

  const totalTokens = items.reduce((acc, item) => acc + item.tokenCost, 0);

  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);

  const handleCreateOrder = async () => {
    if (!user) {
      open({ isGeneration: true });
      return;
    }
    try {
      const result = await createOrder({
        items: items.map((item) => ({
          hu: item.hu,
          region: item.region,
          version: item.version,
        //   vin: item.vin,
          vin: "XXXXXXXXXXXXXXXXX",
        })),
      }).unwrap();

      notify.success({
        message: "Votre commande a été créée avec succès.",
      });

      dispatch(updateBalance(result.balance));

      dispatch(clearCart());
    } catch (error: any) {
      console.error(error);

      notify.error({
        title: "Erreur",
        message: error?.data?.message || "Impossible de créer la commande.",
      });
    }
  };

  if (!items.length) {
    return (
      <Box ta="center" mt={80}>
        <Title order={3}>Votre panier est vide</Title>

        <Text c="dimmed" mt={8}>
          Ajoutez des mises à jour GPS avant de continuer.
        </Text>
      </Box>
    );
  }

  return (
    <Stack maw={900} mx="auto" p={32} gap={24}>
      <Title order={2}>Votre panier</Title>

      {items.map((item) => (
        <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap={8}>
            <Group justify="space-between">
              <Title order={4}>{item.ntgName}</Title>

              <Badge>{item.tokenCost} tokens</Badge>
            </Group>

            <Text size="sm">Région : {item.region}</Text>

            <Text size="sm">Version : {item.version}</Text>

            <Text size="sm">VIN : {item.vin}</Text>

            <Divider my="sm" />

            <Group justify="space-between">
              <Text fw={600}>Prix</Text>

              <Text fw={700}>{item.price} TND</Text>
            </Group>
          </Stack>
        </Card>
      ))}

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack>
          <Group justify="space-between">
            <Text>Total tokens</Text>

            <Text fw={700}>{totalTokens}</Text>
          </Group>

          <Group justify="space-between">
            <Text>Total</Text>

            <Text fw={700} size="lg">
              {totalPrice} TND
            </Text>
          </Group>
          <Button mt="md" loading={isLoading} onClick={handleCreateOrder}>
            Continuer
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}

export default RetailCheckoutView;
