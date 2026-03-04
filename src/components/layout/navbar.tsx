"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, LayoutDashboard, LogOut, UserCircle } from "lucide-react";
import { useCart } from "@/src/lib/cart-context";

const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/orders", label: "Orders" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-black tracking-tight text-white">
          SHOPBIZ
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold transition ${
                pathname === item.href ? "text-cyan-300" : "text-slate-200 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {session?.user?.role === "ADMIN" ? (
            <Link href="/admin" className="text-sm font-semibold text-amber-300 hover:text-amber-200">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full border border-cyan-300/45 px-3 py-1.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-slate-900">
                {itemCount}
              </span>
            ) : null}
          </Link>

          {status === "authenticated" ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-slate-300 sm:inline">{session.user?.name}</span>
              {session.user?.role === "ADMIN" ? (
                <Link href="/admin" className="rounded-full p-2 text-amber-200 hover:bg-white/10">
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              ) : (
                <UserCircle className="h-5 w-5 text-slate-300" />
              )}
              <button
                className="rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="rounded-full bg-cyan-400 px-4 py-1.5 text-sm font-bold text-slate-950 hover:bg-cyan-300">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

