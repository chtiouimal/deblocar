"use client";

import { useParams } from "next/navigation";
import {
  Loader,
  Box,
  Badge,
  Group,
  Grid,
  Title,
  Table,
  Text,
  rgba,
  Flex,
} from "@mantine/core";
import { useGetLeadByIdQuery } from "@/lib/api/leadsApi";
import CustomLoader from "@/components/core/loading";
import { colors } from "@/theme/colors";
import { CalendarDotsIcon, FireIcon } from "@phosphor-icons/react";
import CustomScore from "@/components/shared/score";

interface LeadServiceType {
  _id: string;
  title: string;
  price: number;
}

export default function LeadDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetLeadByIdQuery(id);

  if (isLoading) {
    return <CustomLoader />;
  }

  const lead = data?.lead;

  if (!lead) return <div>Lead not found</div>;

  return (
    <Box style={{ width: "100%", padding: 20 }}>
      <Flex justify="space-between" mb={64}>
        <Flex direction="column" gap={16}>
          <Title order={4}>{lead.name}</Title>
          <Flex gap={8}>
            {lead.date && (
              <Badge
                leftSection={<CalendarDotsIcon />}
                style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
              >
                {lead.date.split("T")[0]}
              </Badge>
            )}
            <CustomScore value={lead.score} />
          </Flex>
        </Flex>
        <Badge color={lead.status?.color}>{lead.status?.label}</Badge>
      </Flex>
      <Grid mb={32}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Flex gap={8} align="flex-end">
            <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
              Email:
            </Text>
            <Text>{lead.email}</Text>
          </Flex>
          <Flex gap={8} align="flex-end">
            <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
              Télephone:
            </Text>
            <Text>{lead.phone}</Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Flex gap={8} align="flex-end">
            <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
              Véhicule:
            </Text>
            <Text>{lead.brand}</Text>
          </Flex>
          <Flex gap={8} align="flex-end">
            <Text fz={14} fw={200} style={{ opacity: 0.6, minWidth: 100 }}>
              N° de chasis:
            </Text>
            <Text>{lead.vin}</Text>
          </Flex>
        </Grid.Col>
      </Grid>
      <Flex direction="column" gap={16}>
        <Title order={6}>liste des services</Title>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Service</Table.Th>
              <Table.Th>Prix</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {lead?.services?.map((service: LeadServiceType) => (
              <Table.Tr key={service._id}>
                <Table.Td>{service.title}</Table.Td>
                <Table.Td>{service.price} TND</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Flex>
    </Box>
  );

  // return (
  //   <div style={{ padding: 20 }}>
  //     <h2>{lead.name}</h2>

  //     <p>{lead.email}</p>
  //     <p>{lead.phone}</p>

  //     <Group mt="md">
  //       <Badge color={lead.status.color}>{lead.status.label}</Badge>
  //       <Badge>{lead.score}</Badge>
  //     </Group>

  //     <hr />

  //     <h3>Services</h3>
  //     <ul>
  //       {lead.services?.map((s: any) => (
  //         <li key={s._id}>
  //           {s.title} - {s.price} DT
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
}
