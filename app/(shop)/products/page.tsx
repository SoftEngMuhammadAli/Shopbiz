import Link from "next/link";
import { prisma } from "@/src/lib/db";
import ProductCard from "@/src/components/ui/product-card";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const categorySlug = params.category;
  const q = params.q?.trim();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-white">Products</h1>
        <form className="flex flex-col gap-3 sm:flex-row">
          <input
            className="input"
            name="q"
            placeholder="Search products..."
            defaultValue={q || ""}
          />
          <button className="rounded-xl bg-cyan-300 px-5 py-2 font-bold text-slate-900">Search</button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
            !categorySlug ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/20 text-slate-200"
          }`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
              categorySlug === category.slug
                ? "border-cyan-300 bg-cyan-300 text-slate-950"
                : "border-white/20 text-slate-200"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-white/20 bg-white/5 p-6 text-slate-300">
          No products found for your filters.
        </p>
      )}
    </div>
  );
}


