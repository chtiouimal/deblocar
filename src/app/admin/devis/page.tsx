"use client";

import { useEffect, useState } from "react";
import { Table, Group, Button, Drawer, Loader, Badge, Pagination, UnstyledButton } from "@mantine/core";
import { EyeIcon } from "@phosphor-icons/react";

type Devis = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  brand: string;
  model: string;
  year: string;
  vin: string;
  services: string[];
  createdAt: string;
};

export default function DevisPage() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selected, setSelected] = useState<Devis | null>(null);

  const fetchDevis = async (pageNumber = 1) => {
    setLoading(true);

    const res = await fetch(`/api/devis?page=${pageNumber}&limit=10`);

    const data = await res.json();

    setDevis(data.devis);
    setPage(data.pagination.page);
    setTotalPages(data.pagination.pages);

    setLoading(false);
  };

  useEffect(() => {
    fetchDevis(1);
  }, []);

  if (loading) return <Loader />;

  return (
    <div style={{ padding: 20, width: "100%" }}>
      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <h2>Devis</h2>
      </Group>

      {/* TABLE */}
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Vehicle</Table.Th>
            <Table.Th>Services</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {devis.map((d) => (
            <Table.Tr key={d._id}>
              <Table.Td>{d.name}</Table.Td>
              <Table.Td>{d.email}</Table.Td>
              <Table.Td>
                {d.brand} {d.model} ({d.year})
              </Table.Td>
              <Table.Td>{d.services.slice(0, 2).join(", ")}</Table.Td>
              <Table.Td>{new Date(d.createdAt).toLocaleDateString()}</Table.Td>

              <Table.Td>
                <UnstyledButton onClick={() => setSelected(d)}>
                  <EyeIcon size={20} />
                </UnstyledButton>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* PAGINATION */}
      <Group justify="center" mt="md">
        <Pagination
          total={totalPages}
          value={page}
          onChange={(p) => fetchDevis(p)}
        />
      </Group>

      {/* DETAILS DRAWER */}
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
              <b>Vehicle:</b> {selected.brand} {selected.model} ({selected.year}
              )
            </div>

            <div>
              <b>VIN:</b> {selected.vin}
            </div>

            <div>
              <b>Services:</b>{" "}
              {selected.services.map((s, i) => (
                <Badge key={i} mr={5}>
                  {s}
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
