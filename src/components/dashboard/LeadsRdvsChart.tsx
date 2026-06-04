"use client";

import { Paper, Title, Group, ThemeIcon, Text, Skeleton } from "@mantine/core";
import { UsersIcon } from "@phosphor-icons/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { useGetLeadsRdvsChartQuery } from "@/lib/api/dashboardApi";

interface Props {
  queryParams: {
    filter?: "day" | "month" | "year";
    day?: number;
    month?: number;
    year?: number;
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper withBorder p="sm" radius="md" shadow="sm">
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

  return (
    <Paper withBorder radius="md" p="lg" h="100%">
      <Group mb="lg">
        <ThemeIcon variant="light" color="blue" size="sm">
          <UsersIcon size={14} />
        </ThemeIcon>
        <Title order={4}>Leads vs RDVs</Title>
      </Group>

      {isLoading ? (
        <Skeleton height={280} radius="sm" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data?.points || []}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#228be6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#228be6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rdvsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7950f2" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#7950f2" stopOpacity={0} />
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
              stroke="#228be6"
              strokeWidth={2.5}
              fill="url(#leadsGradient)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="rdvs"
              stroke="#7950f2"
              strokeWidth={2.5}
              fill="url(#rdvsGradient)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
