"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Stack,
  Select,
  MultiSelect,
  Group,
} from "@mantine/core";
import { useGetCitiesQuery } from "@/lib/api/citiesApi";
import { useGetServicesQuery } from "@/lib/api/servicesApi";
import { CAR_DATA } from "@/constants/devis";
import { useGetStatusesQuery } from "@/lib/api/statusApi";
import { DatePickerInput } from "@mantine/dates";
import { XIcon } from "@phosphor-icons/react";

type Filters = {
  status: string;
  city: string;
  brand: string;
  score: string;
  services: string[];
  date: string;
};

type Props = {
  opened: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  filters: Filters;
};

const SCORE_OPTIONS = ["Chaud", "Tiède", "Froid"];
const BRAND_OPTIONS = Object.keys(CAR_DATA);

export default function LeadsFilter({
  opened,
  onClose,
  onApply,
  filters,
}: Props) {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  const { data: citiesResponse } = useGetCitiesQuery();
  const { data: servicesResponse = [] } = useGetServicesQuery({
    page: 1,
    limit: 1000,
  });
  const { data: statuses = [] } = useGetStatusesQuery();

  const services = servicesResponse?.services || [];
  const cities = citiesResponse?.cities || [];

  // sync when opening drawer or parent changes
  useEffect(() => {
    if (opened) {
      setLocalFilters(filters);
    }
  }, [opened, filters]);

  const update = (key: keyof Filters, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetState: Filters = {
      status: "",
      city: "",
      brand: "",
      score: "",
      services: [],
      date: "",
    };

    setLocalFilters(resetState);
    onApply(resetState);
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Filtres Leads"
      position="right"
      size="md"
    >
      <Stack>
        {/* STATUS */}
        <Select
          label="Status"
          data={statuses.map((s) => ({
            value: s._id,
            label: s.label,
          }))}
          value={localFilters.status}
          onChange={(v) => update("status", v || "")}
          clearable
        />

        {/* CITY */}
        <Select
          label="City"
          data={cities.map((c) => ({
            value: c._id,
            label: c.name,
          }))}
          value={localFilters.city}
          onChange={(v) => update("city", v || "")}
          clearable
        />

        {/* BRAND */}
        <Select
          label="Brand"
          data={BRAND_OPTIONS}
          value={localFilters.brand}
          onChange={(v) => update("brand", v || "")}
          clearable
        />

        {/* SCORE */}
        <Select
          label="Score"
          data={SCORE_OPTIONS}
          value={localFilters.score}
          onChange={(v) => update("score", v || "")}
          clearable
        />

        {/* SERVICES */}
        <MultiSelect
          label="Services"
          data={services.map((s: any) => ({
            value: s._id,
            label: s.title,
          }))}
          value={localFilters.services}
          onChange={(v) => update("services", v)}
        />

        {/* DATE */}
        <DatePickerInput
          label="Date"
          placeholder="Select date"
          value={localFilters.date ? new Date(localFilters.date) : null}
          onChange={(v) => update("date", v ? v.toString().split("T")[0] : "")}
          clearable
        />
      </Stack>

      {/* ACTIONS */}
      <Group justify="space-between" mt={32}>
        <Button
          className="textBtn"
          leftSection={<XIcon size={20} weight="thin" />}
          onClick={handleReset}
        >
          Reset
        </Button>

        <Group>
          <Button variant="default" onClick={onClose} className="textBtn">
            Cancel
          </Button>

          <Button onClick={handleApply}>Apply</Button>
        </Group>
      </Group>
    </Drawer>
  );
}