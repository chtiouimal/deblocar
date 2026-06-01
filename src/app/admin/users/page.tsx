"use client";

import { useState } from "react";
import {
  Table,
  Button,
  Group,
  Drawer,
  TextInput,
  PasswordInput,
  Loader,
  Pagination,
  Modal,
  UnstyledButton,
  Box,
} from "@mantine/core";

import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";

import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/lib/api/adminApi";
import CustomLoader from "@/components/core/loading";

type User = {
  _id: string;
  name: string;
  email: string;
};

export default function UsersPage() {
  const [page, setPage] = useState(1);

  const [opened, setOpened] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ RTK QUERY
  const { data, isLoading } = useGetUsersQuery({
    page,
    limit: 10,
  });

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = data?.users || [];
  const totalPages = data?.pagination?.pages || 1;

  // -------------------
  // OPEN CREATE
  // -------------------
  const openCreate = () => {
    setEditUser(null);
    setForm({ name: "", email: "", password: "" });
    setOpened(true);
  };

  // -------------------
  // OPEN EDIT
  // -------------------
  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
    });
    setOpened(true);
  };

  // -------------------
  // SAVE (CREATE / UPDATE)
  // -------------------
  const saveUser = async () => {
    if (editUser) {
      await updateUser({
        id: editUser._id,
        name: form.name,
        email: form.email,
      }).unwrap();
    } else {
      await createUser(form).unwrap();
    }

    setOpened(false);
    setEditUser(null);
  };

  // -------------------
  // DELETE
  // -------------------
  const handleDelete = async () => {
    if (!confirmDelete) return;

    await deleteUser(confirmDelete).unwrap();
    setConfirmDelete(null);
  };

  // -------------------
  // LOADING
  // -------------------
  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <div style={{ padding: 20, width: "100%" }}>
      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <h2>Users</h2>
        <Button onClick={openCreate}>Create User</Button>
      </Group>

      {/* TABLE */}
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {users.map((user: User) => (
            <Table.Tr key={user._id}>
              <Table.Td>{user.name}</Table.Td>
              <Table.Td>{user.email}</Table.Td>

              <Table.Td>
                <Group gap="xs">
                  <UnstyledButton onClick={() => openEdit(user)}>
                    <PencilSimpleIcon size={20} />
                  </UnstyledButton>

                  <UnstyledButton onClick={() => setConfirmDelete(user._id)}>
                    <TrashIcon size={20} color="red" />
                  </UnstyledButton>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* PAGINATION */}
      <Group justify="center" mt="md">
        <Pagination total={totalPages} value={page} onChange={setPage} />
      </Group>

      {/* DRAWER */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={editUser ? "Edit User" : "Create User"}
        position="right"
      >
        <TextInput
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <TextInput
          mt="sm"
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {!editUser && (
          <PasswordInput
            mt="sm"
            label="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        )}

        <Button fullWidth mt="md" onClick={saveUser}>
          {editUser ? "Update" : "Create"}
        </Button>
      </Drawer>

      {/* DELETE MODAL */}
      <Modal
        opened={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Confirm deletion"
        centered
      >
        <p>Are you sure you want to delete this user?</p>

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
