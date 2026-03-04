"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency } from "@/src/lib/format";
import { useCart } from "@/src/lib/cart-context";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    category?: { name: string; slug: string };
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-[0_15px_30px_-20px_rgba(56,189,248,0.55)]"
    >
      <Link href={`/products/${product.id}`} className="block overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={420}
          unoptimized
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-3 p-4">
        <p className="text-xs uppercase tracking-wider text-cyan-200/80">{product.category?.name || "General"}</p>
        <h3 className="line-clamp-1 text-lg font-extrabold text-white">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-300">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-black text-amber-300">{formatCurrency(product.price)}</p>
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
            className="rounded-full bg-cyan-300 px-3 py-1 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.stock > 0 ? "Add" : "Sold Out"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

