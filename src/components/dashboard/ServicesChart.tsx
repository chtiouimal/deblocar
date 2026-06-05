"use client";

import { Paper, Title, Group, ThemeIcon, Text, Skeleton } from "@mantine/core";
import { WrenchIcon } from "@phosphor-icons/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useGetServicesChartQuery } from "@/lib/api/dashboardApi";
import { colors } from "@/theme/colors";

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
      <Paper p="sm" shadow="sm">
        <Text fw={600} size="sm" mb={4}>
          {label}
        </Text>
        {payload.map((p: any) => (
          <Text key={p.name} size="xs" c={p.color}>
            {p.name === "requested" ? "Demandés" : "Vendus"}: {p.value}
          </Text>
        ))}
      </Paper>
    );
  }
  return null;
};

export default function ServicesChart({ queryParams }: Props) {
  const { data, isLoading } = useGetServicesChartQuery(queryParams);

  return (
    <Paper p="lg" h="100%">
      <Group mb="lg">
        <ThemeIcon variant="light" color="orange" size="sm">
          <WrenchIcon size={14} />
        </ThemeIcon>
        <Title order={4}>Services les plus demandés</Title>
      </Group>

      {isLoading ? (
        <Skeleton height={280} radius="sm" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data?.services || []}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            barCategoryGap="30%"
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />

            <XAxis
              dataKey="name"
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

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: colors.background }}
            />

            <Legend
              formatter={(value) => (
                <span style={{ fontSize: 12, color: "#495057" }}>
                  {value === "requested" ? "Demandés" : "Vendus"}
                </span>
              )}
            />

            <Bar dataKey="requested" fill="#228be6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sold" fill="#40c057" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
