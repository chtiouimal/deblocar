"use client";

import {
  ActionIcon,
  Badge,
  Button,
  Drawer,
  Group,
  Pagination,
  Stack,
  Table,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";

import { useState } from "react";

import { PencilSimpleIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";

import {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from "@/lib/api/servicesApi";

interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  isDeleted: boolean;
}

export default function ServicesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetServicesQuery({
    page,
    limit: 10,
  });

  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const services: Service[] = data?.services || [];
  const totalPages = data?.pagination?.pages || 1;

  const [opened, setOpened] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);

  const openCreate = () => {
    setEditingService(null);
    setTitle("");
    setDescription("");
    setPrice(null);
    setOpened(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setPrice(service.price);
    setOpened(true);
  };

  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      price: price || 0,
    };

    if (editingService) {
      await updateService({
        id: editingService._id,
        ...payload,
      });
    } else {
      await createService(payload);
    }

    setOpened(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this service?");
    if (!confirmed) return;

    await deleteService(id);
  };

  return (
    <Stack p="lg">
      {/* HEADER */}
      <Group justify="space-between">
        <Title order={2}>Services</Title>

        <Button leftSection={<PlusIcon size={18} />} onClick={openCreate}>
          Create Service
        </Button>
      </Group>

      {/* TABLE */}
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {services.map((service) => (
            <Table.Tr key={service._id}>
              <Table.Td>{service.title}</Table.Td>
              <Table.Td>{service.price}</Table.Td>

              <Table.Td>
                <Badge color={service.isDeleted ? "red" : "green"}>
                  {service.isDeleted ? "Deleted" : "Active"}
                </Badge>
              </Table.Td>

              <Table.Td>
                <Group gap="xs">
                  <ActionIcon
                    variant="subtle"
                    onClick={() => openEdit(service)}
                  >
                    <PencilSimpleIcon size={18} />
                  </ActionIcon>

                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => handleDelete(service._id)}
                  >
                    <TrashIcon size={18} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* PAGINATION */}
      <Group justify="center" mt="md">
        <Pagination value={page} onChange={setPage} total={totalPages} />
      </Group>

      {/* DRAWER */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={editingService ? "Update Service" : "Create Service"}
        position="right"
      >
        <Stack>
          <TextInput
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            label="Description"
            minRows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextInput
            label="Price"
            value={price === null ? "" : String(price)}
            onChange={(e) =>
              setPrice(e.target.value ? Number(e.target.value) : null)
            }
          />

          <Button onClick={handleSubmit}>
            {editingService ? "Update" : "Create"}
          </Button>
        </Stack>
      </Drawer>
    </Stack>
  );
}
