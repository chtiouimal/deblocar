"use client";

import { useState } from "react";
import Link from "next/link";
import CustomLoader from "@/components/core/loading";
import { RETAIL_ORDER_STATUS } from "@/constants/retail";
import { RetailOrder, RetailOrderStatus } from "@/types/retail";
import { Badge, Button, Group, Pagination, Select, Table, TextInput } from "@mantine/core";
import {
  CreditCardIcon,
  CoinsIcon,
  EyeIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useGetOrdersQuery } from "@/lib/api/ordersApi";
import { useDebounce } from "@/hooks/useDebounce";

function OrdersPage() {
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<{
    search?: string;
    status?: RetailOrderStatus;
  }>({
    search: undefined,
    status: undefined,
  });

  const debouncedSearch = useDebounce(filters.search, 500);
  const { data, isLoading } = useGetOrdersQuery({
    page,
    limit: 10,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(filters.status && { status: filters.status }),
  });

  const hasActiveFilters = filters.search || filters.status;

  const resetFilters = () => {
    setFilters({
      search: undefined,
      status: undefined,
    });

    setPage(1);
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  const orders = data?.data ?? [];

  const pagination = data?.pagination;

  return (
    <div style={{ padding: 20, width: "100%" }}>
      <Group justify="space-between" mb="md">
        <h2>Commandes</h2>
      </Group>

      <Group mb="md">
        <Group>
          <TextInput
            placeholder="Rechercher un client..."
            value={filters.search ?? ""}
            onChange={(event) => {
              setFilters((prev) => ({
                ...prev,
                search: event.target.value,
              }));

              setPage(1);
            }}
          />

          <Select
            placeholder="Statut"
            clearable
            data={Object.entries(RETAIL_ORDER_STATUS).map(
              ([value, status]) => ({
                value,
                label: status.label,
              }),
            )}
            value={filters.status ?? null}
            onChange={(value) => {
              setFilters((prev) => ({
                ...prev,
                status: value ? (value as RetailOrderStatus) : undefined,
              }));

              setPage(1);
            }}
          />

          {hasActiveFilters && (
            <Button
              className="textBtn"
              leftSection={<XIcon size={20} weight="thin" />}
              onClick={resetFilters}
            >
              Réinitialiser
            </Button>
          )}
        </Group>
      </Group>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Client</Table.Th>
            <Table.Th>Paiement</Table.Th>
            <Table.Th>Codes</Table.Th>
            <Table.Th>Montant</Table.Th>
            <Table.Th>Statut</Table.Th>
            <Table.Th>Date</Table.Th>
            {/* <Table.Th>Actions</Table.Th> */}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {orders.map((order: RetailOrder) => {
            const status = RETAIL_ORDER_STATUS[order.status];

            return (
              <Table.Tr key={order._id}>
                <Table.Td>{order.retailUser?.name}</Table.Td>

                <Table.Td>
                  <Group gap={6}>
                    {order.paymentMethod === "card" ? (
                      <CreditCardIcon size={18} />
                    ) : (
                      <CoinsIcon size={18} />
                    )}

                    {order.paymentMethod === "card" ? "Carte" : "Crédits"}
                  </Group>
                </Table.Td>

                <Table.Td>{order.totalItems}</Table.Td>

                <Table.Td>
                  {order.payment
                    ? `${order.payment.amount} ${order.payment.currency.toUpperCase()}`
                    : `${order.transaction?.amount} crédits`}
                </Table.Td>

                <Table.Td>
                  <Badge color={status.color}>{status.label}</Badge>
                </Table.Td>

                <Table.Td>{order.createdAt.split("T")[0]}</Table.Td>

                {/* <Table.Td>
                  <Link
                    href={`/admin/orders/${order._id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <EyeIcon size={20} />
                  </Link>
                </Table.Td> */}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      {pagination && pagination.pages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={pagination.pages}
            value={page}
            onChange={setPage}
          />
        </Group>
      )}
    </div>
  );
}

export default OrdersPage;
