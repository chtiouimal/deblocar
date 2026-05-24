"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Title,
  Group,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      // after login → check session
      const meRes = await fetch("/api/auth/me", {
        credentials: "include",
      });
      const data = await meRes.json();

      if (!data.user) {
        throw new Error("Session failed");
      }

      router.replace("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={400} mt={100}>
      <Group justify="center" mb={64}>
        <Link href="/" style={{ opacity: 1 }}>
          <Image
            src="/deblocar-logo.png"
            alt="deblocar-logo"
            width={192}
            height={30}
          />
        </Link>
      </Group>

      <TextInput
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        mb="sm"
      />

      <PasswordInput
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        mb="sm"
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Button fullWidth onClick={handleLogin} loading={loading}>
        Login
      </Button>
    </Container>
  );
}
