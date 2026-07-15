// components/auth/AuthDrawer.tsx
import { Box, Drawer, Text, UnstyledButton } from "@mantine/core";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useRetailAuthDrawer } from "@/hooks/useRetailAuthDrawer";

export default function AuthDrawer() {
  const { opened, close } = useRetailAuthDrawer();
  const [hasAccount, setHasAccount] = useState(true);

  return (
    <Drawer
      opened={opened}
      position="right"
      onClose={close}
      title="Authentication"
    >
      <Box pt={32}>{hasAccount ? <LoginForm /> : <SignupForm />}</Box>
      <UnstyledButton
        mt={16}
        w="100%"
        style={{ display: "flex", justifyContent: "center" }}
        onClick={() => setHasAccount((prev) => !prev)}
      >
        <Text size="sm">
          {hasAccount ? "Vous n'avez pas de compte?" : "Vous avez un compte?"}
        </Text>
      </UnstyledButton>
    </Drawer>
  );
}
