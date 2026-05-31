"use client";

import { useState } from "react";
import { Table, Group, Loader, Pagination, Box, Badge, Button, Drawer, Stack, TextInput } from "@mantine/core";
import { CalendarDotsIcon, EyeIcon } from "@phosphor-icons/react";
import Link from "next/link";
import LeadsFilter from "@/components/filters/LeadsFilter";
import { useCreateRdvMutation, useGetLeadsQuery } from "@/lib/api/leadsApi";


export default function LeadPage() {
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [rdvDrawer, setRdvDrawer] = useState(false);
  const [rdvForm, setRdvForm] = useState({
    date: "",
    time: "",
    location: "",
  });
  const [createRdv] = useCreateRdvMutation();

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    city: "",
    brand: "",
    score: "",
    services: [] as string[],
    date: "",
  });

  const hasActiveFilters =
    filters.status ||
    filters.city ||
    filters.brand ||
    filters.score ||
    filters.services.length > 0 ||
    filters.date;

  const { data, isLoading } = useGetLeadsQuery({
    page,
    limit: 10,
    ...filters,
  });

  const resetFilters = () => {
    setFilters({
      status: "",
      city: "",
      brand: "",
      score: "",
      services: [],
      date: "",
    });
  };

  if (isLoading) {
    return (
      <Box
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </Box>
    );
  }

  const leads = data?.leads || [];
  const pagination = data?.pagination;

  return (
    <div style={{ padding: 20, width: "100%" }}>
      <Group justify="space-between" mb="md">
        <h2>Leads</h2>
        <Group>
          {hasActiveFilters && (
            <Button variant="light" color="red" onClick={resetFilters}>
              Reset filters
            </Button>
          )}

          <Button onClick={() => setFilterOpen(true)}>Filters</Button>
        </Group>
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nom</Table.Th>
            <Table.Th>Télephone</Table.Th>
            <Table.Th>Voiture</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Score</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {leads.map((lead: any) => (
            <Table.Tr key={lead._id}>
              <Table.Td>{lead.name}</Table.Td>
              <Table.Td>{lead.phone}</Table.Td>
              <Table.Td>{lead.brand}</Table.Td>

              <Table.Td>
                <Badge color={lead.status?.color}>{lead.status?.label}</Badge>
              </Table.Td>

              <Table.Td>
                <Badge
                  color={
                    lead.score === "Chaud"
                      ? "red"
                      : lead.score === "Tiède"
                        ? "yellow"
                        : "blue"
                  }
                >
                  {lead.score}
                </Badge>
              </Table.Td>
              <Table.Td>{lead.date ?? "Non défini"}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Link href={`/admin/lead/${lead._id}`}>
                    <EyeIcon size={20} />
                  </Link>
                  <CalendarDotsIcon
                    style={{cursor: "pointer"}}
                    size={20}
                    onClick={() => {
                      setSelectedLead(lead);
                      setRdvDrawer(true);
                    }}
                  />
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="center" mt="md">
        <Pagination
          total={pagination?.pages || 1}
          value={page}
          onChange={(p) => setPage(p)}
        />
      </Group>
      <LeadsFilter
        opened={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={(f: any) => {
          setFilters(f);
          setFilterOpen(false);
          setPage(1);
        }}
      />
      <Drawer
        opened={rdvDrawer}
        onClose={() => setRdvDrawer(false)}
        title="Planifier RDV"
        position="right"
      >
        <Stack>
          {/* DATE */}
          <TextInput
            label="Date"
            type="date"
            value={rdvForm.date}
            onChange={(e) => setRdvForm({ ...rdvForm, date: e.target.value })}
          />

          {/* TIME */}
          <TextInput
            label="Heure"
            type="time"
            value={rdvForm.time}
            onChange={(e) => setRdvForm({ ...rdvForm, time: e.target.value })}
          />

          {/* LOCATION */}
          <TextInput
            label="Location"
            placeholder="Ex: Tunis centre"
            value={rdvForm.location}
            onChange={(e) =>
              setRdvForm({ ...rdvForm, location: e.target.value })
            }
          />

          {/* ACTION */}
          <Button
            onClick={async () => {
              if (!selectedLead) return;

              await createRdv({
                id: selectedLead._id,
                date: rdvForm.date,
                time: rdvForm.time,
                location: rdvForm.location,
              });

              setRdvDrawer(false);
              setSelectedLead(null);
              setRdvForm({
                date: "",
                time: "",
                location: "",
              });
            }}
          >
            Confirmer RDV
          </Button>
        </Stack>
      </Drawer>
    </div>
  );
}
