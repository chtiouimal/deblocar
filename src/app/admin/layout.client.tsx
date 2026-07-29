"use client"

import {
  ActionIcon,
  Box,
  Burger,
  Collapse,
  Drawer,
  Group,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useEffect, useState } from "react";
import classes from "./layout.module.css";
import {
  ArticleIcon,
  CalendarDotsIcon,
  CaretRightIcon,
  ChartBarIcon,
  GearIcon,
  HouseIcon,
  SignOutIcon,
  UsersIcon,
  XIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useLogoutMutation } from "@/lib/api/authApi";
import { colors } from "@/theme/colors";
import { useDisclosure } from "@mantine/hooks";
import CustomLoader from "@/components/core/loading";
import { notify } from "@/lib/notifications";

const mockdata = [
  { label: "Dashboard", icon: ChartBarIcon, link: "/admin/dashboard" },
  { icon: HouseIcon, label: "Leads", link: "/admin/lead" },
  { icon: ArticleIcon, label: "Devis", link: "/admin/devis" },
  {
    icon: CalendarDotsIcon,
    label: "Calendreier RDV",
    link: "/admin/calendreier",
  },
  {
    label: "Clients",
    icon: UsersIcon,
    initiallyOpened: false,
    links: [
      { label: "Clients", link: "/admin/retail" },
      { label: "Transactions", link: "/admin/transactions" },
      { label: "Commandes", link: "/admin/commandes" },
    ],
  },
  {
    label: "Paramètres",
    icon: GearIcon,
    initiallyOpened: true,
    links: [
      { label: "Services", link: "/admin/services" },
      { label: "status", link: "/admin/status" },
      { label: "Utilisateurs", link: "/admin/users" },
    ],
  },
];

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: { label: string; link: string }[];
}

function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  link,
  links,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link) => (
    <Link
      href={link.link}
      key={link.label}
      className={classes.link}
      // onClick={() => setOpened(false)}
    >
      {link.label}
    </Link>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group justify="space-between" gap={0}>
          {link ? (
            <Link
              href={link}
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: 1,
              }}
            >
              <ThemeIcon variant="light" size={30}>
                <Icon size={18} />
              </ThemeIcon>
              {label}
            </Link>
          ) : (
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon variant="light" size={30}>
                <Icon size={18} />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
          )}
          {hasLinks && (
            <CaretRightIcon
              className={classes.chevron}
              // stroke={1.5}
              size={16}
              style={{ transform: opened ? "rotate(-90deg)" : "none" }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse expanded={opened}>{items}</Collapse> : null}
    </>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);

  const { user, loading } = useSelector((state: RootState) => state.auth);

  const [logout] = useLogoutMutation();

  useAuthInit();

  // 🚨 protect route
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    notify.success({
      title: "Déconnexion",
      message: "Vous avez été déconnecté avec succès.",
    });
  };

  if (loading || !user) {
    return <CustomLoader />;
  }

  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  const SidebarContent = (
    <nav
      className={classes.navbar}
      style={{ backgroundColor: colors.secondaryBackground }}
    >
      <ActionIcon
        onClick={close}
        variant="subtle"
        hiddenFrom="md"
        style={{ position: "absolute", right: 32, top: 32 }}
      >
        <XIcon size={18} />
      </ActionIcon>
      <Box className={classes.header}>
        <Group justify="space-between">
          <Link href="/admin/dashboard" style={{ opacity: 1 }}>
            <Image
              src="/deblocar-logo.png"
              alt="deblocar-logo"
              width={192}
              height={30}
            />
          </Link>
        </Group>
      </Box>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        {/* <UserButton /> */}
        <Stack justify="center" gap={0} mb={20}>
          {/* <NavbarLink icon={IconSwitchHorizontal} label="Change account" /> */}
          <UnstyledButton onClick={handleLogout} className={classes.control}>
            <Group gap={10}>
              <ThemeIcon variant="light" size={30}>
                <SignOutIcon size={18} />
              </ThemeIcon>
              Logout
            </Group>
          </UnstyledButton>
        </Stack>
      </div>
    </nav>
  );

  return (
    <main className={classes.main}>
      <Box className={classes.sidebarDesktop} visibleFrom="md">
        {SidebarContent}
      </Box>
      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size="100%"
        hiddenFrom="md"
        position="right"
      >
        {SidebarContent}
      </Drawer>
      <Group hiddenFrom="md" p="sm">
        <Burger opened={opened} onClick={open} size="sm" />
      </Group>
      <div style={{ width: "100%", overflow: "auto" }}>{children}</div>
    </main>
  );
}

export default AdminLayout