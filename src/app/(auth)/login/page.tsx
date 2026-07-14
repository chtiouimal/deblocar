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
  Grid,
  Box,
  Flex,
  Text,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { notify } from "@/lib/notifications";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

      notify.success({
        title: "Connexion réussie",
        message: "Bienvenue sur votre espace Deblocar.",
      });
    } catch (err: any) {
      setError(err.message);
      notify.error({
        title: "Échec de la connexion",
        message:
          err?.data?.message ?? "Adresse e-mail ou mot de passe incorrect.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid>
      <Grid.Col span={{ base: 0, md: 8 }} visibleFrom="md">
        <Box
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Image
            src="/bg/auth-bg.jpg"
            alt="auth_bg"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "left",
            }}
          />
        </Box>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Container
          size={400}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: 16,
          }}
        >
          <Group justify="flex-start" mb={64}>
            <Link href="/" style={{ opacity: 1, transform: "Scale(0.8)" }}>
              <Image
                src="/deblocar-logo.png"
                alt="deblocar-logo"
                width={192}
                height={30}
              />
            </Link>
          </Group>

          <form onSubmit={handleLogin}>
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

            {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

            <Button fullWidth type="submit" mt={16} loading={loading}>
              Login
            </Button>
          </form>
          <Text fz={14} style={{ textAlign: "center" }}>
            © Deblocar — All rights reserved
          </Text>
        </Container>
      </Grid.Col>
    </Grid>
  );
}
