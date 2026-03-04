"use client";

import Image from "next/image";
import { useCart } from "@/src/lib/cart-context";
import { formatCurrency } from "@/src/lib/format";

type Props = {
  product: {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    stock: number;
    category: { name: string };
  };
};

export default function ProductDetailClient({ product }: Props) {
  const { addItem } = useCart();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Image
        src={product.image}
        alt={product.name}
        width={900}
        height={760}
        unoptimized
        className="h-[380px] w-full rounded-2xl object-cover"
      />
      <div className="space-y-5">
        <p className="text-sm uppercase tracking-wider text-cyan-300">{product.category.name}</p>
        <h1 className="text-4xl font-black text-white">{product.name}</h1>
        <p className="text-xl font-extrabold text-amber-300">{formatCurrency(product.price)}</p>
        <p className="text-slate-300">{product.description}</p>
        <p className="text-sm text-slate-400">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
        <button
          onClick={() =>
            addItem({
              productId: product.id,
              image: product.image,
              name: product.name,
              price: product.price,
              stock: product.stock,
            })
          }
          disabled={product.stock <= 0}
          className="rounded-xl bg-cyan-300 px-5 py-2 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

