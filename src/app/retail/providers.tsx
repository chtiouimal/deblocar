"use client";

import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { retailStore, RootRetailState } from "@/retailStore/retailStore";
import { RetailAuthDrawerProvider } from "@/hooks/useRetailAuthDrawer";
import { loadCart, saveCart } from "@/retailStore/cartPersistence";
import { hydrateCart } from "@/retailStore/retailCartSlice";

function CartManager() {
  const dispatch = useDispatch();

  const items = useSelector((state: RootRetailState) => state.retailCart.items);

  const [hydrated, setHydrated] = useState(false);

  // Load cart once
  useEffect(() => {
    dispatch(hydrateCart(loadCart()));
    setHydrated(true);
  }, [dispatch]);

  // Save only after loading existing cart
  useEffect(() => {
    if (hydrated) {
      saveCart(items);
    }
  }, [items, hydrated]);

  return null;
}

export default function RetailProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={retailStore}>
      <CartManager />
      <RetailAuthDrawerProvider>{children}</RetailAuthDrawerProvider>
    </Provider>
  );
}
