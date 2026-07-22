"use client";

import CustomLoader from "@/components/core/loading";
import { useGetRetailHistoryByIdQuery } from "@/lib/api/retailHistoryApi";
import { RetailOrderItem } from "@/types/retail";
import { Badge, Box, Flex, Grid, Table, Text, Title } from "@mantine/core";
import { CalendarDotsIcon } from "@phosphor-icons/react";
import { useParams } from "next/navigation";

function TransactionDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetRetailHistoryByIdQuery(id);

  if (isLoading) {
    return <CustomLoader />;
  }

  const transaction = data?.transaction;

  if (!transaction) return <div>transaction not found</div>;
  return (
    <Box style={{ width: "100%", padding: 20 }}>
      <Flex justify="space-between" mb={64}>
        <Flex direction="column" gap={16}>
          <Title order={4}>{transaction.retailUserId?.name}</Title>
          <Flex gap={8}>
            {transaction.createdAt && (
              <Badge
                leftSection={<CalendarDotsIcon />}
                style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
              >
                {transaction.createdAt.split("T")[0]}
              </Badge>
            )}
          </Flex>
        </Flex>
        <Badge color={transaction.type === "consume" ? "cyan" : "orange"}>
          {transaction?.type === "consume" ? "Consomation" : "Recharge"}
        </Badge>
      </Flex>
      <Grid mb={32}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Flex gap={8} align="flex-end">
            <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
              Email:
            </Text>
            <Text>{transaction?.retailUserId?.email}</Text>
          </Flex>
          <Flex gap={8} align="flex-end">
            <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
              Crédits:
            </Text>
            <Text>{transaction.amount} crédit(s)</Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Flex gap={8} align="flex-end">
            <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
              Status:
            </Text>
            <Text>{transaction?.orderId?.status}</Text>
          </Flex>
          <Flex gap={8} align="flex-end">
            <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
              Nombre de produits:
            </Text>
            <Text>{transaction?.orderId?.items?.length}</Text>
          </Flex>
        </Grid.Col>
      </Grid>
      <Flex direction="column" gap={16}>
        <Title order={6}>liste des produits</Title>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Service</Table.Th>
              <Table.Th>Region</Table.Th>
              <Table.Th>Prix</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {transaction?.orderId?.items?.map((item: RetailOrderItem) => (
              <Table.Tr key={item._id}>
                <Table.Td>{item?.ntgName}</Table.Td>
                <Table.Td>{item?.region}</Table.Td>
                <Table.Td>{item?.tokenCost}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Flex>
    </Box>
  );
}

export default TransactionDetailsPage;
