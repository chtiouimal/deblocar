// components/auth/AuthDrawer.tsx
import {
  Blockquote,
  Box,
  Drawer,
  Flex,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useRetailAuthDrawer } from "@/hooks/useRetailAuthDrawer";
import { WarningIcon } from "@phosphor-icons/react";

export default function AuthDrawer() {
  const { opened, close, isGeneration } = useRetailAuthDrawer();
  const [hasAccount, setHasAccount] = useState(true);

  return (
    <Drawer
      opened={opened}
      position="right"
      onClose={close}
      title="Authentication"
      zIndex={1000}
    >
      {isGeneration && (
        <Flex w="100%" justify="center">
          <Blockquote
            w="90%"
            color="red"
            iconSize={38}
            icon={<WarningIcon size={20} weight="thin" />}
            mt="xl"
          >
            Vous devez être connecté pour continuer. Connectez-vous ou créez un
            compte afin de générer votre code.
          </Blockquote>
        </Flex>
      )}
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
