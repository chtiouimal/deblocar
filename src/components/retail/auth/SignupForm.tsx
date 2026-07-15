import { useRetailAuthDrawer } from "@/hooks/useRetailAuthDrawer";
import { notify } from "@/lib/notifications";
import { setRetailUser } from "@/retailStore/retailAuthSlice";
import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { useDispatch } from "react-redux";

function SignupForm() {
  const dispatch = useDispatch();
  const { close } = useRetailAuthDrawer();
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setSignupForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/retail/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      dispatch(setRetailUser(data.user));

      notify.success({
        title: "Compte créé avec succès",
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
        label="Nom"
        name="name"
        value={signupForm.name}
        onChange={handleInputChange}
      />
      <TextInput
        label="Email"
        name="email"
        value={signupForm.email}
        onChange={handleInputChange}
      />
      <PasswordInput
        label="Mot de passe"
        name="password"
        value={signupForm.password}
        onChange={handleInputChange}
      />
      <Button type="submit" mt={32} disabled={loading}>
        {loading ? "En cours ..." : "S'inscrire"}
      </Button>
    </form>
  );
}

export default SignupForm