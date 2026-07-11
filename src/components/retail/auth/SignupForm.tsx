import { useRetailAuthDrawer } from "@/hooks/useRetailAuthDrawer";
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

  const handleSubmit = async () => {
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

      close();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack>
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
      <Button onClick={handleSubmit} mt={32}>
        {loading ? "En cours ..." : "S'inscrire"}
      </Button>
    </Stack>
  );
}

export default SignupForm