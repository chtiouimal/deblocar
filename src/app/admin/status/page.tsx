"use client";

import { useState } from "react";
import {
  Table,
  Group,
  Button,
  Loader,
  Box,
  Modal,
  UnstyledButton,
  Drawer,
  TextInput,
  Badge,
  ColorInput,
} from "@mantine/core";

import {
  useGetStatusesQuery,
  useCreateStatusMutation,
  useDeleteStatusMutation,
} from "@/lib/api/statusApi";

import { TrashIcon, PlusIcon } from "@phosphor-icons/react";
import CustomLoader from "@/components/core/loading";

type StatusForm = {
  label: string;
  color: string | null;
};

export default function StatusPage() {
  const { data: statuses = [], isLoading } = useGetStatusesQuery();

  const [createStatus] = useCreateStatusMutation();
  const [deleteStatus] = useDeleteStatusMutation();

  const [opened, setOpened] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [form, setForm] = useState<StatusForm>({
    label: "",
    color: "",
  });

  const handleCreate = async () => {
    if (!form.label) return;

    await createStatus(form);
    setForm({ label: "", color: "" });
    setOpened(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    await deleteStatus(confirmDelete);
    setConfirmDelete(null);
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <div style={{ padding: 20, width: "100%" }}>
      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <h2>Status</h2>

        <Button
          leftSection={<PlusIcon size={18} />}
          onClick={() => setOpened(true)}
        >
          Create Status
        </Button>
      </Group>

      {/* TABLE */}
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Label</Table.Th>
            <Table.Th>Color</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {statuses.map((status: any) => (
            <Table.Tr key={status._id}>
              <Table.Td>{status.label}</Table.Td>

              <Table.Td>
                <Badge color={status.color}>{status.color}</Badge>
              </Table.Td>

              <Table.Td>
                <UnstyledButton onClick={() => setConfirmDelete(status._id)}>
                  <TrashIcon size={20} color="red" />
                </UnstyledButton>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* CREATE DRAWER */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create Status"
        position="right"
      >
        <TextInput
          label="Label"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />

        <ColorInput
          mt="sm"
          label="Color"
          placeholder="Pick status color"
          value={form.color ?? ""}
          onChange={(value) =>
            setForm({
              ...form,
              color: value || null,
            })
          }
        />

        <Button fullWidth mt="md" onClick={handleCreate}>
          Create
        </Button>
      </Drawer>

      {/* DELETE MODAL */}
      <Modal
        opened={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Confirm deletion"
        centered
      >
        <p>Are you sure you want to delete this status?</p>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setConfirmDelete(null)}>
            Cancel
          </Button>

          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
