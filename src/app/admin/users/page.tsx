"use client";

import { useEffect, useState } from "react";
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
} from "@mantine/core";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";

type User = {
  _id: string;
  name: string;
  email: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [opened, setOpened] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchUsers = async (pageNumber = 1) => {
    setLoading(true);

    const res = await fetch(`/api/users?page=${pageNumber}&limit=10`);

    const data = await res.json();

    setUsers(data.users);
    setPage(data.pagination.page);
    setTotalPages(data.pagination.pages);

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm({ name: "", email: "", password: "" });
    setOpened(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
    });
    setOpened(true);
  };

  const saveUser = async () => {
    if (editUser) {
      // UPDATE
      await fetch(`/api/users/${editUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
        }),
      });
    } else {
      // CREATE
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setOpened(false);
    setEditUser(null);
    setForm({ name: "", email: "", password: "" });

    fetchUsers(page);
  };

  const deleteUser = async () => {
    if (!confirmDelete) return;

    await fetch(`/api/users/${confirmDelete}`, {
      method: "DELETE",
    });

    setConfirmDelete(null);
    fetchUsers(page);
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: 20, width: "100%" }}>
      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <h2>Users</h2>

        <Button onClick={() => setOpened(true)}>Create User</Button>
      </Group>

      {/* TABLE */}
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user._id}>
              <Table.Td>{user.name}</Table.Td>
              <Table.Td>{user.email}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {/* EDIT */}
                  <UnstyledButton onClick={() => openEdit(user)}>
                    <PencilSimpleIcon size={20} />
                  </UnstyledButton>

                  {/* DELETE */}
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
        <Pagination
          total={totalPages}
          value={page}
          onChange={(p) => fetchUsers(p)}
        />
      </Group>

      {/* DRAWER (CREATE USER) */}
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

        {!editUser && <PasswordInput
          mt="sm"
          label="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />}
        <Button fullWidth mt="md" onClick={saveUser}>
          {editUser ? "Update" : "Create"}
        </Button>
      </Drawer>
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

          <Button color="red" onClick={deleteUser}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
