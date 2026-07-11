"use client";

import CustomLoader from "@/components/core/loading";
import { useGetRetailUsersQuery, useTopupBalanceMutation } from "@/lib/api/retailApi";
import { Button, Drawer, Group, NumberInput, Pagination, Table, TextInput, UnstyledButton } from "@mantine/core";
import { CoinsIcon } from "@phosphor-icons/react";
import { useState } from "react";

type RetailUser = {
  _id: string;
  name: string;
  email: string;
  balance: number;
};

function RetailPage() {
  const [page, setPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [form, setForm] = useState<{amount: number | undefined, retailUserId: string}>({
    amount: undefined,
    retailUserId: "",
  });
  const { data, isLoading } = useGetRetailUsersQuery({
    page,
    limit: 10,
  });
  
  const [topupBalance] = useTopupBalanceMutation();
  
  const users = data?.users || [];
  const totalPages = data?.pagination?.pages || 1;

  const openTopup = (user: string) => {
      setForm({
        amount: undefined,
        retailUserId: user,
      });
      setOpened(true);
  };

  const onTopup = async () => {
    if (form.retailUserId !== "" && (form?.amount && form?.amount > 0)) {
      await topupBalance(form);
      setOpened(false);
    }
  };
  
  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <div style={{ padding: 20, width: "100%" }}>
      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <h2>Commercials</h2>
      </Group>

      {/* TABLE */}
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nom</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Solde</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {users.map((user: RetailUser) => (
            <Table.Tr key={user._id}>
              <Table.Td>{user.name}</Table.Td>
              <Table.Td>{user.email}</Table.Td>
              <Table.Td>{user.balance}</Table.Td>

              <Table.Td>
                <Group gap="xs">
                  <UnstyledButton onClick={() => openTopup(user?._id)}>
                    <CoinsIcon size={20} weight="thin" />
                  </UnstyledButton>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination total={totalPages} value={page} onChange={setPage} />
        </Group>
      )}

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Recharger le solde"
        position="right"
      >
        <NumberInput
          label="Montant"
          min={1}
          allowNegative={false}
          allowDecimal={false}
          hideControls
          value={form.amount}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              amount: typeof value === "number" ? value : undefined,
            }))
          }
        />

        <Button fullWidth mt="md" onClick={onTopup}>
          Envoyer
        </Button>
      </Drawer>
    </div>
  );
}

export default RetailPage;
