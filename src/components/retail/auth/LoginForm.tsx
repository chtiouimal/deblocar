import { useRetailAuthDrawer } from "@/hooks/useRetailAuthDrawer";
import { notify } from "@/lib/notifications";
import { setRetailUser } from "@/retailStore/retailAuthSlice";
import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { useDispatch } from "react-redux";

function LoginForm() {
  const dispatch = useDispatch();
  const { close } = useRetailAuthDrawer();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/retail/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      dispatch(setRetailUser(data.user));

      notify.success({
        // title: "Connexion réussie",
        // message: "Bienvenue sur votre espace Deblocar.",
        message: "Connexion réussie",
      });

      close();
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
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Email"
        name="email"
        value={loginForm.email}
        onChange={handleInputChange}
      />
      <PasswordInput
        label="Mot de passe"
        name="password"
        value={loginForm.password}
        onChange={handleInputChange}
      />
      <Button type="submit" mt={32} w="100%">
        {!loading ? "Se connecter" : "en cours ..."}
      </Button>
    </form>
  );
}

export default LoginForm