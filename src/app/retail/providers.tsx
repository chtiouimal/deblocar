"use client";

import { RetailAuthDrawerProvider } from "@/hooks/useRetailAuthDrawer";
import { retailStore } from "@/retailStore/retailStore";
import { Provider } from "react-redux";

export default function RetailProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RetailAuthDrawerProvider>
      <Provider store={retailStore}>{children}</Provider>
    </RetailAuthDrawerProvider>
  );
}
