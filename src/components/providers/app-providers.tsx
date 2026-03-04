"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { CartProvider } from "@/src/lib/cart-context";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}

