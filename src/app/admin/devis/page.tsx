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
  Scroller,
  OverflowList,
  Flex,
  Text,
} from "@mantine/core";

import { CalendarDotsIcon, EyeIcon } from "@phosphor-icons/react";
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

      <Table striped highlightOnHover withTableBorder>
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
                <OverflowList
                  data={d.services.map((s: any) => s.title)}
                  style={{ maxWidth: 500 }}
                  gap={4}
                  renderOverflow={(items) => (
                    <Badge
                      style={{
                        backgroundColor: "transparent",
                        opacity: 0.6,
                        fontWeight: 400,
                        textTransform: "lowercase",
                      }}
                    >
                      +{items.length} plus
                    </Badge>
                  )}
                  renderItem={(item, index) => (
                    <Badge key={index}>{item}</Badge>
                  )}
                />
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

      {pagination?.pages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={pagination?.pages || 1}
            value={page}
            onChange={setPage}
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
            {selected.date && (
              <Badge
                leftSection={<CalendarDotsIcon />}
                style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
              >
                {selected.date.split("T")[0]}
              </Badge>
            )}
            <Flex direction="column" gap={10}>
              <Flex gap={8} align="flex-end">
                <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
                  Nom:
                </Text>
                <Text>{selected.name}</Text>
              </Flex>
              <Flex gap={8} align="flex-end">
                <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
                  Email:
                </Text>
                <Text>{selected.email}</Text>
              </Flex>
              <Flex gap={8} align="flex-end">
                <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
                  Télephone:
                </Text>
                <Text>{selected.phone}</Text>
              </Flex>
            </Flex>

            <Flex direction="column" gap={10}>
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
            </Flex>

            <Flex direction="column" gap={10}>
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
            </Flex>

            <Flex direction="column" gap={10}>
              <Flex gap={8} align="flex-end">
                <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
                  Prix total:
                </Text>
                <Text>{selected.totalPrice} TND</Text>
              </Flex>
            </Flex>
          </div>
        )}
      </Drawer>
    </div>
  );
}
