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
  Radio,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "@/retailStore/retailCartSlice";
import { TrashIcon } from "@phosphor-icons/react";
import { ActionIcon } from "@mantine/core";
import { formatPrice } from "@/utils/formatNumber";
import { useState } from "react";
import { RetailPaymentMethod } from "@/types/retail";
import StripeProvider from "@/components/retail/stripe/StripeProvider";
import StripePaymentForm from "@/components/retail/stripe/StripePaymentForm";
import { useRouter } from "next/navigation";

function RetailCheckoutView() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { open } = useRetailAuthDrawer();
  const { user } = useSelector((state: RootRetailState) => state.retailAuth);
  const items = useSelector((state: RootRetailState) => state.retailCart.items);

  const [paymentMethod, setPaymentMethod] =
    useState<RetailPaymentMethod>("tokens");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const totalTokens = items.reduce((acc, item) => acc + item.tokenCost, 0);
  const totalPrice = Number(
    items.reduce((acc, item) => acc + item.price, 0).toFixed(2),
  );

  const handleCreateOrder = async () => {
    if (!user) {
      open({ isGeneration: true });
      return;
    }
    try {
      const result = await createOrder({
        paymentMethod,

        items: items.map((item) => ({
          hu: item.hu,
          region: item.region,
          version: item.version,

          // TEST VIN - DO NOT CONSUME MBTOOLS
          vin: "XXXXXXXXXXXXXXXXX",
        })),
      }).unwrap();

      if (result.paymentRequired && result.clientSecret) {
        setClientSecret(result.clientSecret);
        setOrderId(result.orderId);
        setOrderCreated(true);
        return;
      }

      setOrderCreated(true);

      notify.success({
        message: "Votre commande a été créée avec succès.",
      });

      if (result.balance !== undefined) {
        dispatch(updateBalance(result.balance));
      }

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
              <Group>
                <Badge>{item.tokenCost} tokens</Badge>

                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => {
                    dispatch(removeFromCart(item.id));

                    notify.success({
                      message: "Produit retiré du panier.",
                    });
                  }}
                >
                  <TrashIcon size={20} weight="thin" />
                </ActionIcon>
              </Group>
            </Group>

            <Text size="sm">Région : {item.region}</Text>

            <Text size="sm">Version : {item.version}</Text>

            <Text size="sm">VIN : {item.vin}</Text>

            <Divider my="sm" />

            <Group justify="space-between">
              <Text fw={600}>Prix</Text>

              <Text fw={700}>{formatPrice(item.price)} TND</Text>
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
              {formatPrice(totalPrice)} TND
            </Text>
          </Group>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack>
              <Text fw={700}>Méthode de paiement</Text>

              {!orderCreated && (
                <Radio.Group
                  value={paymentMethod}
                  onChange={(value) =>
                    setPaymentMethod(value as RetailPaymentMethod)
                  }
                >
                  <Stack>
                    <Radio value="tokens" label="Payer avec mes tokens" />

                    <Radio value="card" label="Carte bancaire" />
                  </Stack>
                </Radio.Group>
              )}
            </Stack>
          </Card>
          {!orderCreated && (
            <Button mt="md" loading={isLoading} onClick={handleCreateOrder}>
              Continuer
            </Button>
          )}
          {clientSecret && (
            <StripeProvider clientSecret={clientSecret}>
              <StripePaymentForm
                onSuccess={() => {
                  router.push(`/retail/checkout/processing?orderId=${orderId}`);
                }}
              />
            </StripeProvider>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

export default RetailCheckoutView;
