"use client";

import CustomLoader from "@/components/core/loading";
import { useGetDevisQuery } from "@/lib/api/devisApi";
import {
  Table,
  Group,
  Badge,
  Pagination,
  Drawer,
  Loader,
  Box,
  UnstyledButton,
} from "@mantine/core";

import { EyeIcon } from "@phosphor-icons/react";
import { useState } from "react";

export default function DevisPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any>(null);

  const { data, isLoading } = useGetDevisQuery({ page, limit: 10 });

  if (isLoading) {
    return <CustomLoader />;
  }

  const devis = data?.devis || [];
  const pagination = data?.pagination;

  return (
    <div style={{ padding: 20, width: "100%" }}>
      <Group justify="space-between" mb="md">
        <h2>Devis</h2>
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Client</Table.Th>
            <Table.Th>Vehicle</Table.Th>
            <Table.Th>Services</Table.Th>
            <Table.Th>Prix</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {devis.map((d: any) => (
            <Table.Tr key={d._id}>
              <Table.Td>{d.name}</Table.Td>

              <Table.Td>
                {d.brand} ({d.year})
              </Table.Td>

              <Table.Td>
                {d.services.map((s: any) => (
                  <Badge key={s._id} mr={5}>
                    {s.title}
                  </Badge>
                ))}
              </Table.Td>

              <Table.Td>{d.totalPrice} TND</Table.Td>

              <Table.Td>
                <UnstyledButton onClick={() => setSelected(d)}>
                  <EyeIcon size={20} />
                </UnstyledButton>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="center" mt="md">
        <Pagination
          total={pagination?.pages || 1}
          value={page}
          onChange={setPage}
        />
      </Group>

      <Drawer
        opened={!!selected}
        onClose={() => setSelected(null)}
        title="Devis details"
        position="right"
        size="md"
      >
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <b>Name:</b> {selected.name}
            </div>
            <div>
              <b>Email:</b> {selected.email}
            </div>
            <div>
              <b>Phone:</b> {selected.phone}
            </div>

            <div>
              <b>Vehicle:</b> {selected.brand} ({selected.year})
            </div>

            <div>
              <b>VIN:</b> {selected.vin}
            </div>

            <div>
              <b>Services:</b>{" "}
              {selected.services.map((s: any) => (
                <Badge key={s._id} mr={5}>
                  {s.title}
                </Badge>
              ))}
            </div>

            <div>
              <b>Date:</b> {new Date(selected.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
