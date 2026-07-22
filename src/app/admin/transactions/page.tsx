"use client"

import CustomLoader from "@/components/core/loading";
import { useGetRetailHistoryQuery } from "@/lib/api/retailHistoryApi";
import { RetailTransactionAdmin, RetailTransactionType } from "@/types/retail";
import { Badge, Button, Drawer, Flex, Group, Pagination, Select, Table, Text, UnstyledButton } from "@mantine/core";
import { CalendarDotsIcon, EyeIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<RetailTransactionAdmin | null>(null);
  const [filters, setFilters] = useState<{
    type?: RetailTransactionType;
  }>({
    type: undefined,
  });

  const hasActiveFilters =
    filters.type

  const { data, isLoading } = useGetRetailHistoryQuery({
    page,
    limit: 10,
    ...filters,
  });
  
  const resetFilters = () => {
    setFilters({
      type: undefined
    });
  };

  if (isLoading) {
    return <CustomLoader />;
  }
  
  const transactions = data?.transactions || [];
  const pagination = data?.pagination;

  const TransactionsType = [
    {
      value: "consume",
      label: "Consomation",
    },
    {
      value: "topup",
      label: "Recharge",
    },
  ] as {value: RetailTransactionType, label :string}[];

  return (
    <div style={{ padding: 20, width: "100%" }}>
      <Group justify="space-between" mb="md">
        <h2>Transactions</h2>
        <Group>
          {hasActiveFilters && (
            <Button
              className="textBtn"
              leftSection={<XIcon size={20} weight="thin" />}
              onClick={resetFilters}
            >
              Réinitialiser
            </Button>
          )}
          <Select
            placeholder="Type"
            data={TransactionsType}
            value={filters.type ?? null}
            pl={8}
            onChange={(v) =>
              setFilters({
                type: v ? (v as RetailTransactionType) : undefined,
              })
            }
          />
        </Group>
      </Group>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Commercial</Table.Th>
            <Table.Th>Crédit</Table.Th>
            <Table.Th>type</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {transactions.map((transaction: RetailTransactionAdmin) => (
            <Table.Tr key={transaction._id}>
              <Table.Td>{transaction.retailUserId?.name}</Table.Td>
              <Table.Td>{transaction.amount} crédit(s)</Table.Td>

              <Table.Td>
                <Badge
                  color={transaction.type === "consume" ? "cyan" : "orange"}
                >
                  {transaction.type === "consume" ? "Consomation" : "Recharge"}
                </Badge>
              </Table.Td>

              <Table.Td>
                {transaction?.createdAt?.split("T")[0] ?? "Non défini"}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {transaction?.type === "consume" ? (
                    <Link
                      href={`/admin/transactions/${transaction._id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <EyeIcon size={24} />
                    </Link>
                  ) : (
                    <UnstyledButton onClick={() => setSelected(transaction)}>
                      <EyeIcon size={20} />
                    </UnstyledButton>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {pagination && pagination?.pages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={pagination?.pages || 1}
            value={page}
            onChange={(p) => setPage(p)}
          />
        </Group>
      )}

      <Drawer
        opened={!!selected}
        onClose={() => setSelected(null)}
        title="Details devis"
        position="right"
        size="md"
      >
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {selected.createdAt && (
              <Badge
                leftSection={<CalendarDotsIcon />}
                style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
              >
                {selected.createdAt.split("T")[0]}
              </Badge>
            )}
            <Flex direction="column" gap={10}>
              <Flex gap={8} align="flex-end">
                <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
                  Nom:
                </Text>
                <Text>{selected?.retailUserId?.name}</Text>
              </Flex>
              <Flex gap={8} align="flex-end">
                <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
                  Email:
                </Text>
                <Text>{selected?.retailUserId?.email}</Text>
              </Flex>
              {/* <Flex gap={8} align="flex-end">
                <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
                  Valeur:
                </Text>
                <Text>{selected.amount}</Text>
              </Flex> */}
            </Flex>

            {/* <Flex direction="column" gap={10}>
              <Flex gap={8} align="flex-end">
                <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
                  Véhicule:
                </Text>
                <Text>{selected.brand}</Text>
              </Flex>
              <Flex gap={8} align="flex-end">
                <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
                  N° de chasis:
                </Text>
                <Text>{selected.vin}</Text>
              </Flex>
            </Flex> */}

            {/* <Flex direction="column" gap={10}>
              <Flex gap={8} align="flex-end">
                <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
                  Services:
                </Text>
              </Flex>
              <Flex wrap="wrap" gap={8}>
                {selected.services.map((s: any) => (
                  <Badge key={s._id} mr={5}>
                    {s.title}
                  </Badge>
                ))}
              </Flex>
            </Flex> */}

            <Flex direction="column" gap={10}>
              <Flex gap={8} align="flex-end">
                <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
                  Crédit recharger:
                </Text>
                <Text>{selected.amount} crédit(s)</Text>
              </Flex>
            </Flex>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default TransactionsPage