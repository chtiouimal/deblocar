"use client";

import styles from "./page.module.css";

import { useState } from "react";
import {
  Box,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
  ThemeIcon,
  Badge,
  Skeleton,
} from "@mantine/core";
import {
  UsersIcon,
  CalendarCheckIcon,
  CurrencyDollarIcon,
  TrendUpIcon,
  ClockIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
import { useGetDashboardQuery } from "@/lib/api/dashboardApi";
import {
  MonthPickerInput,
  YearPickerInput,
  DatePickerInput,
} from "@mantine/dates";
import "@mantine/dates/styles.css";
import LeadsRdvsChart from "@/components/dashboard/LeadsRdvsChart";
import ServicesChart from "@/components/dashboard/ServicesChart";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}

function StatCard({ label, value, icon, color, loading }: StatCardProps) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Text size="sm" c="dimmed">
            {label}
          </Text>
          {loading ? (
            <Skeleton height={32} width={80} />
          ) : (
            <Title order={2}>{value}</Title>
          )}
        </Stack>
        <ThemeIcon variant="light" color={color} size="lg" radius="md">
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

function DashboardPage() {
  const now = new Date();

  const [filter, setFilter] = useState<"day" | "month" | "year">("month");
  const [selectedDay, setSelectedDay] = useState<Date>(now);
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [selectedYear, setSelectedYear] = useState<Date>(
    new Date(now.getFullYear(), 0, 1),
  );

  const queryParams =
    filter === "day"
      ? {
          filter,
          day: selectedDay.getDate(),
          month: selectedDay.getMonth() + 1,
          year: selectedDay.getFullYear(),
        }
      : filter === "month"
        ? {
            filter,
            month: selectedMonth.getMonth() + 1,
            year: selectedMonth.getFullYear(),
          }
        : {
            filter,
            year: selectedYear.getFullYear(),
          };

  const { data, isLoading } = useGetDashboardQuery(queryParams);

  return (
    <div style={{ padding: 20, width: "100%", overflow: "auto" }}>
      <Group justify="space-between" mb="md">
        <h2>Dashboard</h2>
        <Group>
          <SegmentedControl
            value={filter}
            onChange={(v) => setFilter(v as "day" | "month" | "year")}
            data={[
              { label: "Jour", value: "day" },
              { label: "Mois", value: "month" },
              { label: "Année", value: "year" },
            ]}
          />

          {filter === "day" && (
            <DatePickerInput
              value={selectedDay}
              onChange={(d) => d && setSelectedDay(new Date(d))}
              valueFormat="DD MMM YYYY"
              variant="unstyled"
            />
          )}

          {filter === "month" && (
            <MonthPickerInput
              value={selectedMonth}
              onChange={(d) => d && setSelectedMonth(new Date(d))}
              valueFormat="MMMM YYYY"
              maxLevel="decade"
              variant="unstyled"
            />
          )}

          {filter === "year" && (
            <YearPickerInput
              value={selectedYear}
              onChange={(d) => d && setSelectedYear(new Date(d))}
              valueFormat="YYYY"
              variant="unstyled"
            />
          )}
        </Group>
      </Group>

      {/* STAT CARDS */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Leads aujourd'hui"
            value={data?.leadsToday ?? 0}
            icon={<UsersIcon size={18} />}
            color="blue"
            loading={isLoading}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total leads"
            value={data?.leadsTotal ?? 0}
            icon={<UsersIcon size={18} />}
            color="violet"
            loading={isLoading}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Chiffre d'affaires"
            value={formatCurrency(data?.ca ?? 0)}
            icon={<CurrencyDollarIcon size={18} />}
            color="green"
            loading={isLoading}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Taux de conversion"
            value={`${data?.conversionRate ?? 0}%`}
            icon={<TrendUpIcon size={18} />}
            color="orange"
            loading={isLoading}
          />
        </Grid.Col>
      </Grid>

      {/* UPCOMING RDVS */}
      <Paper withBorder radius="md" p="lg">
        <Group mb="md">
          <ThemeIcon variant="light" color="blue" size="sm">
            <CalendarCheckIcon size={14} />
          </ThemeIcon>
          <Title order={4}>Prochains RDVs</Title>
        </Group>

        <Stack gap="sm">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={48} radius="sm" />
            ))
          ) : data?.upcomingRdvs?.length === 0 ? (
            <Text c="dimmed" size="sm">
              Aucun RDV à venir
            </Text>
          ) : (
            data?.upcomingRdvs?.map((rdv: any) => (
              <Paper key={rdv._id} withBorder radius="sm" p="sm">
                <Group justify="space-between">
                  <Stack gap={2}>
                    <Text fw={600} size="sm">
                      {rdv.name}
                    </Text>
                    <Group gap={4}>
                      <MapPinIcon size={12} />
                      <Text size="xs" c="dimmed">
                        {rdv.location || "Pas de lieu"}
                      </Text>
                    </Group>
                  </Stack>
                  <Badge variant="light" color="blue" size="sm">
                    <Group gap={4}>
                      <ClockIcon size={11} />
                      {formatDate(rdv.date)}
                    </Group>
                  </Badge>
                </Group>
              </Paper>
            ))
          )}
        </Stack>
      </Paper>

      <Grid mb="xl" mt="xl">
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <LeadsRdvsChart queryParams={queryParams} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <ServicesChart queryParams={queryParams} />
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default DashboardPage;
