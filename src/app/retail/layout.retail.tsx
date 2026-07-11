"use client"

import AuthRetailForm from "@/components/retail/auth/AuthRetailForm";
import { useAuthRetailInit } from "@/hooks/useAuthInit";
import { useRetailAuthDrawer } from "@/hooks/useRetailAuthDrawer";
import { useRetailLogoutMutation } from "@/lib/retailApi/authRetailApi";
import { setRetailUser } from "@/retailStore/retailAuthSlice";
import { RootRetailState } from "@/retailStore/retailStore";
import { Avatar, Box, Button, Flex, UnstyledButton } from "@mantine/core";
import { CoinsIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

function RetailLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(
    (state: RootRetailState) => state.retailAuth,
  );

  const { open } = useRetailAuthDrawer();

  const [logout] = useRetailLogoutMutation();

  useAuthRetailInit();

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      dispatch(setRetailUser(null));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <main>
      <Flex justify="space-between" align="center" p={32}>
        <Link href="/" style={{ opacity: 1 }}>
          <Image
            src="/Deblocar_small.svg"
            alt="deblocar-logo"
            width={192}
            height={30}
          />
        </Link>
        {user ? (
          <Flex gap={16} align="center">
            <Flex gap={8}>
              <CoinsIcon size={26} weight="thin" />
              {user.balance}
            </Flex>
            <Avatar radius="xl" />
            <UnstyledButton onClick={handleLogout}>
              Se déconnecter
            </UnstyledButton>
          </Flex>
        ) : (
          <Button onClick={open}>Se connecter</Button>
        )}
      </Flex>
      <Box>
        {children}
        <AuthRetailForm />
      </Box>
    </main>
  );
}

export default RetailLayout