"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import TransactionList from "@/components/retail/transactions/TransactionList";
import { useGetTransactionsQuery } from "@/lib/retailApi/transactionsApi";
import { RootRetailState } from "@/retailStore/retailStore";
import { RetailTransactionType } from "@/types/retail";
import {
  Box,
  Card,
  Grid,
  GridCol,
  Group,
  Paper,
  RingProgress,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import CustomLoader from "@/components/core/loading";
import { colors } from "@/theme/colors";

function RetailProfileView() {
  const router = useRouter();

  const { user, loading } = useSelector(
    (state: RootRetailState) => state.retailAuth,
  );

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/retail");
    }
  }, [loading, user, router]);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: "consume" as RetailTransactionType,
  });

  const { data } = useGetTransactionsQuery(
    {
      page: filters.page,
      limit: filters.limit,
      type: filters.type,
    },
    {
      skip: !user,
    },
  );

  const transactions = data?.transactions ?? [];
  const completed = data?.totalConsumed ?? 0;
  const total = data?.totalTopups ?? 0;
  const totalTopups = data?.totalTopups ?? 0;
  const totalConsumed = data?.totalConsumed ?? 0;

  const remaining = user?.balance;
  const stats = [
    {
      value: remaining,
      label: "Solde disponible",
    },
    {
      value: totalConsumed,
      label: "Crédits utilisés",
    },
  ];

  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text>{stat.value}</Text>
      <Text size="xs" c="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  if (loading) {
    return <CustomLoader />; // or your loader
  }

  if (!user) {
    return null;
  }

  return (
    <Box style={{ maxWidth: 1440, margin: "0 auto", minHeight: "80vh" }} p={32}>
      <Grid mb={32}>
        <GridCol span={{ base: 12, md: 7 }}>
          <Title order={3}>{user.name}</Title>
          <Text>{user.email}</Text>
          <Text>{user.balance} crédits disponibles</Text>
        </GridCol>

        <GridCol span={{ base: 12, md: 5 }}>
          <Card padding="sm" withBorder orientation="horizontal">
            <Card.Section inheritPadding px="xs" withBorder>
              <RingProgress
                roundCaps
                thickness={6}
                size={150}
                sections={[
                  {
                    value: (completed / total) * 100,
                    color: colors?.glowingRed[5],
                  },
                ]}
                label={
                  <div>
                    <Text ta="center" fz="lg">
                      {totalTopups > 0
                        ? ((totalConsumed / totalTopups) * 100).toFixed(0)
                        : 0}
                      %
                    </Text>

                    <Text ta="center" fz="xs" c="dimmed">
                      Consommation
                    </Text>
                  </div>
                }
              />
            </Card.Section>
            <Card.Section inheritPadding px="md">
              <Text fz="xl">Crédits</Text>

              <Box mt="xs">
                <Text>{totalTopups}</Text>
                <Text fz="xs" c="dimmed">
                  Total rechargé
                </Text>
              </Box>

              <Group mt="sm">{items}</Group>
            </Card.Section>
          </Card>
        </GridCol>
      </Grid>

      <Tabs
        value={filters.type}
        onChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            page: 1,
            type: value as RetailTransactionType,
          }))
        }
      >
        <Tabs.List>
          <Tabs.Tab value="consume">Générations de codes</Tabs.Tab>

          <Tabs.Tab value="topup">Historique des recharges</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="consume">
          <TransactionList data={transactions} />
        </Tabs.Panel>

        <Tabs.Panel value="topup">
          <TransactionList data={transactions} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

export default RetailProfileView;
