import { createContext, useContext, ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";

const RetailAuthDrawerContext = createContext<{
  open: () => void;
  close: () => void;
  opened: boolean;
} | null>(null);

export function RetailAuthDrawerProvider({ children }: { children: ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <RetailAuthDrawerContext.Provider value={{ opened, open, close }}>
      {children}
    </RetailAuthDrawerContext.Provider>
  );
}

export function useRetailAuthDrawer() {
  const ctx = useContext(RetailAuthDrawerContext);
  if (!ctx) throw new Error("useAuthDrawer must be used within AuthDrawerProvider");
  return ctx;
}