"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/src/lib/cart-context";
import { formatCurrency } from "@/src/lib/format";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <div className="page-shell space-y-6">
      <h1 className="text-3xl font-black text-white">Your Cart</h1>

      {!items.length ? (
        <div className="glass rounded-2xl p-6">
          <p className="text-slate-200">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block rounded-xl bg-cyan-300 px-4 py-2 font-bold text-slate-950">
            Shop now
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="glass flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  unoptimized
                  className="h-24 w-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">{item.name}</h2>
                  <p className="text-slate-300">{formatCurrency(item.price)}</p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                  className="input w-24"
                />
                <button onClick={() => removeItem(item.productId)} className="rounded-xl border border-red-300/40 px-3 py-2 text-red-200">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <aside className="glass h-fit rounded-2xl p-5">
            <p className="text-sm text-slate-300">Subtotal</p>
            <p className="text-3xl font-black text-amber-300">{formatCurrency(subtotal)}</p>
            <Link href="/checkout" className="mt-4 block rounded-xl bg-cyan-300 px-4 py-2 text-center font-bold text-slate-950">
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}


