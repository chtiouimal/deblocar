import { RetailCartItem } from "./retailCartSlice";

const CART_KEY = "retail_cart";

export function loadCart(): RetailCartItem[] {
  if (typeof window === "undefined") return [];

  const cart = localStorage.getItem(CART_KEY);

  return cart ? JSON.parse(cart) : [];
}

export function saveCart(items: RetailCartItem[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function clearSavedCart() {
  localStorage.removeItem(CART_KEY);
}
