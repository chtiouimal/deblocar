"use client"

import CustomLoader from "@/components/core/loading";
import AuthRetailForm from "@/components/retail/auth/AuthRetailForm";
import { useAuthRetailInit } from "@/hooks/useAuthInit";
import { useRetailAuthDrawer } from "@/hooks/useRetailAuthDrawer";
import { notify } from "@/lib/notifications";
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
      notify.success({
        title: "Déconnexion",
        message: "Vous avez été déconnecté avec succès.",
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <>
      <Box
        className="leftBg"
        h="100vh"
        w="100%"
        style={{ position: "fixed" }}
      />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
        }}
      >
        <Flex
          justify="space-between"
          align="center"
          p={32}
          style={{ maxWidth: 1440, margin: "0 auto" }}
        >
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

              <Link href="/retail/profile">
                <Avatar radius="xl" />
              </Link>

              <UnstyledButton onClick={handleLogout}>
                Se déconnecter
              </UnstyledButton>
            </Flex>
          ) : (
            <Button onClick={open}>Se connecter</Button>
          )}
        </Flex>

        {children}
        <AuthRetailForm />
      </main>
    </>
  );
}

export default RetailLayout