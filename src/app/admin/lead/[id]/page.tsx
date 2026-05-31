"use client";

import { useParams } from "next/navigation";
import { Loader, Box, Badge, Group } from "@mantine/core";
import { useGetLeadByIdQuery } from "@/lib/api/leadsApi";

export default function LeadDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetLeadByIdQuery(id);

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

  const lead = data?.lead;

  if (!lead) return <div>Lead not found</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{lead.name}</h2>

      <p>{lead.email}</p>
      <p>{lead.phone}</p>

      <Group mt="md">
        <Badge>{lead.status}</Badge>
        <Badge>{lead.score}</Badge>
      </Group>

      <hr />

      <h3>Services</h3>
      <ul>
        {lead.services?.map((s: any) => (
          <li key={s._id}>
            {s.title} - {s.price} DT
          </li>
        ))}
      </ul>
    </div>
  );
}
