"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/src/types/store";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "shopbiz_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return {
      items,
      itemCount,
      subtotal,
      addItem: (item, quantity = 1) => {
        setItems((prev) => {
          const exists = prev.find((p) => p.productId === item.productId);
          if (exists) {
            return prev.map((p) =>
              p.productId === item.productId
                ? { ...p, quantity: Math.min(p.quantity + quantity, p.stock) }
                : p,
            );
          }

          return [...prev, { ...item, quantity: Math.min(quantity, item.stock) }];
        });
      },
      removeItem: (productId) => {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
      },
      updateQuantity: (productId, quantity) => {
        setItems((prev) =>
          prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.stock) }
              : item,
          ),
        );
      },
      clearCart: () => {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};

