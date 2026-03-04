import Link from "next/link";
import { prisma } from "@/src/lib/db";
import ProductCard from "@/src/components/ui/product-card";
import AnimatedSection from "@/src/components/ui/animated-section";
import HeroCanvas from "@/src/components/three/hero-canvas";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, take: 8 }),
  ]);

  return (
    <div className="page-shell space-y-16">
      <AnimatedSection className="grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="inline-block rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-100">
            Full Stack Ecommerce
          </p>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
            Shopbiz powers products, payments, and orders in one seamless platform.
          </h1>
          <p className="max-w-xl text-base text-slate-300 sm:text-lg">
            Animated storefront, role-based access, order lifecycle management, and Stripe-ready checkout built with
            Next.js, Prisma, and token auth sessions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="rounded-full bg-cyan-300 px-5 py-2 font-bold text-slate-950">
              Explore Products
            </Link>
            <Link href="/register" className="rounded-full border border-white/30 px-5 py-2 font-bold text-slate-100">
              Create Account
            </Link>
          </div>
        </div>
        <HeroCanvas />
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-white">Popular Categories</h2>
          <Link href="/products" className="text-sm font-semibold text-cyan-300">
            View all
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="glass rounded-xl p-4 transition hover:border-cyan-300/50"
            >
              <h3 className="text-lg font-bold text-white">{category.name}</h3>
              <p className="mt-1 text-sm text-slate-300">{category.description || "Curated top picks"}</p>
            </Link>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2} className="space-y-5">
        <h2 className="text-2xl font-extrabold text-white">Featured Products</h2>
        {featured.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-white/20 bg-white/5 p-5 text-slate-300">
            No featured products yet. Add some from the admin panel.
          </p>
        )}
      </AnimatedSection>
    </div>
  );
}


