"use client"

import TransactionList from "@/components/retail/transactions/TransactionList";
import { useGetTransactionsQuery } from "@/lib/retailApi/transactionsApi";
import { RootRetailState } from "@/retailStore/retailStore";
import { RetailTransactionType } from "@/types/retail";
import { Box, Grid, GridCol, Tabs, Text, Title } from "@mantine/core"
import { useState } from "react";
import { useSelector } from "react-redux";

function RetailProfileView() {
  const { user } = useSelector((state: RootRetailState) => state.retailAuth);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: "consume" as RetailTransactionType,
  });

  const { data, isLoading } = useGetTransactionsQuery({
    page: filters.page,
    limit: filters.limit,
    type: filters.type,
  });

  const transactions = data?.transactions ?? [];
  const totalPages = data?.pagination.pages ?? 1;

  return (
    <Box style={{ maxWidth: 1440, margin: "0 auto", minHeight: "80vh" }} p={32}>
      <Grid>
        <GridCol span={{ base: 12, md: 4 }}>
          <Title order={3}>{user?.name}</Title>
          <Text>{user?.email}</Text>
          <Text>{user?.balance} tokens</Text>
        </GridCol>
        <GridCol span={{ base: 12, md: 8 }}>
          <Tabs
            value={filters.type}
            onChange={(value) => {
              setFilters((prev) => ({
                ...prev,
                page: 1,
                type: value as RetailTransactionType,
              }));
            }}
          >
            <Tabs.List>
              <Tabs.Tab value="consume">Générations</Tabs.Tab>
              <Tabs.Tab value="topup">Recharges</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="consume">
              <TransactionList data={transactions} />
            </Tabs.Panel>
            <Tabs.Panel value="topup">
              <TransactionList data={transactions} />
            </Tabs.Panel>
          </Tabs>
        </GridCol>
      </Grid>
    </Box>
  );
}

export default RetailProfileView