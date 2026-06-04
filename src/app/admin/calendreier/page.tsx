"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Group,
  Stack,
  Text,
  Badge,
  Drawer,
  Flex,
  Title,
} from "@mantine/core";
import { Calendar, MonthPickerInput } from "@mantine/dates";
import { useGetCalendarQuery } from "@/lib/api/calendarApi";
import CustomLoader from "@/components/core/loading";
import "@mantine/dates/styles.css";
import {
  CalendarDotsIcon,
  CarProfileIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
import { colors } from "@/theme/colors";

function formatKey(date: Date) {
  // Use local date parts to avoid UTC shift issues
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function CalendarPage() {
  const now = new Date();

  const [month, setMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [selected, setSelected] = useState<any[]>([]);
  const [opened, setOpened] = useState(false);

  const { data, isLoading } = useGetCalendarQuery({
    month: month.getMonth() + 1,
    year: month.getFullYear(),
  });

  const rdvs = data?.rdvs || [];

  const grouped = useMemo(() => {
    return rdvs.reduce((acc: any, item: any) => {
      const key = new Date(item.date).toISOString().split("T")[0];
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [rdvs]);

  const handleDayClick = (date: Date) => {
    const key = formatKey(date);
    setSelected(grouped[key] || []);
    setOpened(true);
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <Box style={{ width: "100%", height: "90vh", padding: 20 }}>
      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <h2>Calendrier RDV</h2>
        <MonthPickerInput
          value={month}
          onChange={(date) => date && setMonth(new Date(date))}
          className="textBtn"
          valueFormat="MMMM YYYY"
          maxLevel="decade"
          leftSection={<CalendarDotsIcon size={16} />}
          variant="unstyled"
        />
      </Group>

      {/* CALENDAR */}
      <Box
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Calendar
          fullWidth
          styles={{
            calendarHeader: { display: "none" },
            day: {
              aspectRatio: "unset",
              height: "calc((80vh - 80px) / 6)",
            },
          }}
          date={month}
          // withNextPrevButtons={false}
          __onDayClick={undefined}
          hideOutsideDates
          onDateChange={(dateString: string) => setMonth(new Date(dateString))}
          getDayProps={(date) => {
            const key = formatKey(new Date(date));
            const count = grouped[key]?.length || 0;
            return {
              onClick:
                count > 0 ? () => handleDayClick(new Date(date)) : undefined,
              disabled: count === 0,
            };
          }}
          renderDay={(date) => {
            const key = formatKey(new Date(date));
            const count = grouped[key]?.length || 0;
            return (
              <Box
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text size="sm">{new Date(date).getDate()}</Text>
                {count > 0 && (
                  <Badge
                    color="blue"
                    size="xs"
                    circle
                    style={{ position: "absolute", top: 2, right: 2 }}
                  >
                    {count}
                  </Badge>
                )}
              </Box>
            );
          }}
        />
      </Box>

      {/* DRAWER — unchanged */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="RDVs"
        position="right"
      >
        <Stack gap={32}>
          {selected.length === 0 ? (
            <Text>No RDV</Text>
          ) : (
            selected.map((r: any) => (
              <Flex key={r._id} gap={16}>
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 100,
                    height: "auto",
                    borderRight: "1px solid",
                    borderColor: colors.primary,
                  }}
                >
                  <Title order={4}>
                    {new Date(r.date).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Title>
                </Flex>
                <Flex direction="column" gap={8}>
                  <Text fw={600}>{r.name}</Text>
                  <Flex gap={8}>
                    <Badge
                      leftSection={<CarProfileIcon />}
                      style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    >
                      {r.brand}
                    </Badge>
                    <Badge
                      leftSection={<MapPinIcon />}
                      style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    >
                      {r.location || "aucune localisation"}
                    </Badge>
                  </Flex>
                </Flex>
              </Flex>
            ))
          )}
        </Stack>
      </Drawer>
    </Box>
  );
}
