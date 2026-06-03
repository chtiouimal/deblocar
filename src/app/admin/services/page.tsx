"use client";

import {
  ActionIcon,
  Badge,
  Button,
  Drawer,
  Group,
  Modal,
  Pagination,
  Stack,
  Table,
  Text,
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
import CustomLoader from "@/components/core/loading";

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
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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

  // const handleDelete = async (id: string) => {
  //   const confirmed = confirm("Are you sure you want to delete this service?");
  //   if (!confirmed) return;

  //   await deleteService(id);
  // };
  const handleDelete = async () => {
    if (!confirmDelete) return;

    await deleteService(confirmDelete).unwrap();
    setConfirmDelete(null);
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <Stack style={{ width: "100%", padding: 20 }}>
      {/* HEADER */}
      <Group justify="space-between">
        <h2>Services</h2>

        <Button leftSection={<PlusIcon size={18} />} onClick={openCreate}>
          Créer un service
        </Button>
      </Group>

      {/* TABLE */}
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Service</Table.Th>
            <Table.Th>Prix</Table.Th>
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

                  {!service.isDeleted && (
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => setConfirmDelete(service._id)}
                    >
                      <TrashIcon size={18} />
                    </ActionIcon>
                  )}
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
        title={editingService ? "Modifier le service" : "Créer un service"}
        position="right"
      >
        <Stack>
          <TextInput
            label="Service"
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
            label="Prix"
            value={price === null ? "" : String(price)}
            onChange={(e) =>
              setPrice(e.target.value ? Number(e.target.value) : null)
            }
          />

          <Button onClick={handleSubmit}>
            {editingService ? "Modifier" : "Créer"}
          </Button>
        </Stack>
      </Drawer>

      {/* DELETE MODAL */}
      <Modal
        opened={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Confirmation de suppression"
        centered
      >
        <Text p={10}>Êtes-vous sûr de vouloir supprimer ce service ?</Text>

        <Group justify="flex-end" p={10}>
          <Button
            variant="default"
            onClick={() => setConfirmDelete(null)}
            className="textBtn"
          >
            Annuler
          </Button>

          <Button onClick={handleDelete}>Supprimer</Button>
        </Group>
      </Modal>
    </Stack>
  );
}
