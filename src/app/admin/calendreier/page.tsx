"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Group,
  Stack,
  Text,
  Badge,
  Drawer,
  Loader,
  Select,
  Title,
} from "@mantine/core";
import { useGetCalendarQuery } from "@/lib/api/calendarApi";

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

function formatKey(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function CalendarPage() {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, isLoading } = useGetCalendarQuery({ month, year });

  const rdvs = data?.rdvs || [];

  const grouped = useMemo(() => {
    return rdvs.reduce((acc: any, item: any) => {
      const key = new Date(item.date).toISOString().split("T")[0];

      if (!acc[key]) acc[key] = [];
      acc[key].push(item);

      return acc;
    }, {});
  }, [rdvs]);

  const [selected, setSelected] = useState<any[]>([]);
  const [opened, setOpened] = useState(false);

  const days = getDaysInMonth(month, year);

  const handleClick = (day: number) => {
    const date = new Date(year, month - 1, day);
    const key = formatKey(date);

    setSelected(grouped[key] || []);
    setOpened(true);
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

  return (
    <Box p="lg">
      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <Title order={2}>Calendar</Title>

        <Group>
          <Select
            value={String(month)}
            onChange={(v) => setMonth(Number(v))}
            data={[
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
            ]}
          />

          <Select
            value={String(year)}
            onChange={(v) => setYear(Number(v))}
            data={["2025", "2026", "2027"]}
          />
        </Group>
      </Group>

      {/* GRID */}
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 10,
        }}
      >
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const date = new Date(year, month - 1, day);
          const key = formatKey(date);

          const count = grouped[key]?.length || 0;

          return (
            <Box
              key={day}
              onClick={() => handleClick(day)}
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 12,
                minHeight: 80,
                cursor: "pointer",
              }}
            >
              <Text fw={600}>{day}</Text>

              {count > 0 && (
                <Badge color="blue" size="sm">
                  {count} RDV
                </Badge>
              )}
            </Box>
          );
        })}
      </Box>

      {/* DRAWER */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="RDVs"
        position="right"
      >
        <Stack>
          {selected.length === 0 ? (
            <Text>No RDV</Text>
          ) : (
            selected.map((r: any) => (
              <Box key={r._id}>
                <Text fw={600}>{r.name}</Text>
                <Text size="sm" c="dimmed">
                  {r.location || "No location"}
                </Text>
              </Box>
            ))
          )}
        </Stack>
      </Drawer>
    </Box>
  );
}
