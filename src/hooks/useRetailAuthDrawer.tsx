import { createContext, useContext, ReactNode, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

interface RetailAuthDrawerContextType {
  open: (options?: { isGeneration?: boolean }) => void;
  close: () => void;
  opened: boolean;
  isGeneration: boolean;
}

const RetailAuthDrawerContext =
  createContext<RetailAuthDrawerContextType | null>(null);

export function RetailAuthDrawerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [opened, { open: openDrawer, close }] = useDisclosure(false);
  const [isGeneration, setIsGeneration] = useState(false);

  const open = (options?: { isGeneration?: boolean }) => {
    setIsGeneration(options?.isGeneration ?? false);
    openDrawer();
  };

  return (
    <RetailAuthDrawerContext.Provider
      value={{
        opened,
        open,
        close,
        isGeneration,
      }}
    >
      {children}
    </RetailAuthDrawerContext.Provider>
  );
}

export function useRetailAuthDrawer() {
  const ctx = useContext(RetailAuthDrawerContext);

  if (!ctx) {
    throw new Error(
      "useRetailAuthDrawer must be used within RetailAuthDrawerProvider",
    );
  }

  return ctx;
}
