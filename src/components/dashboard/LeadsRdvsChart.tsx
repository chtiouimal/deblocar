"use client";

import {
  Box,
  Paper,
  Title,
  Group,
  ThemeIcon,
  Text,
  Skeleton,
} from "@mantine/core";
import { UsersIcon } from "@phosphor-icons/react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { useGetLeadsRdvsChartQuery } from "@/lib/api/dashboardApi";
import { colors } from "@/theme/colors";

interface Props {
  queryParams: {
    filter?: "day" | "month" | "year";
    day?: number;
    month?: number;
    year?: number;
  };
}

const MONTH_NAMES = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

function getTickFormatter(filter: string) {
  return (label: string) => {
    if (filter === "day") {
      return label;
    }

    if (filter === "month") {
      const day = parseInt(label);
      return day % 2 === 0 ? "" : String(day);
    }

    // year
    const index = parseInt(label);
    return MONTH_NAMES[index - 1] || label;
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper withBorder p="sm" shadow="sm">
        <Text fw={600} size="sm" mb={4}>
          {label}
        </Text>
        {payload.map((p: any) => (
          <Text key={p.name} size="xs" c={p.color}>
            {p.name === "leads" ? "Leads" : "RDVs"}: {p.value}
          </Text>
        ))}
      </Paper>
    );
  }
  return null;
};

export default function LeadsRdvsChart({ queryParams }: Props) {
  const { data, isLoading } = useGetLeadsRdvsChartQuery(queryParams);
  const filter = queryParams.filter || "month";
  const tickFormatter = getTickFormatter(filter);

  return (
    <Paper p="lg" h="100%" style={{ display: "flex", flexDirection: "column" }}>
      <Group mb="md">
        <ThemeIcon variant="light" color="blue" size="sm">
          <UsersIcon size={14} />
        </ThemeIcon>
        <Title order={4}>Leads vs RDVs</Title>
      </Group>

      {isLoading ? (
        <Skeleton radius="sm" style={{ flex: 1 }} />
      ) : (
        <Box style={{ flex: 1, minHeight: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data?.points || []}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.primary}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="rdvsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="violet" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="violet" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#868e96" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={tickFormatter}
                interval={0}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#868e96" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: 12, color: "#495057" }}>
                    {value === "leads" ? "Leads" : "RDVs"}
                  </span>
                )}
              />

              <Area
                type="monotone"
                dataKey="leads"
                stroke={colors.primary}
                strokeWidth={2.5}
                fill="url(#leadsGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="rdvs"
                stroke="violet"
                strokeWidth={2.5}
                fill="url(#rdvsGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}
