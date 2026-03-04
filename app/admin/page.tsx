import Link from "next/link";
import { getAuthSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/db";
import { formatCurrency } from "@/src/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAuthSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [userCount, productCount, orderCount, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  return (
    <div className="page-shell space-y-6">
      <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Users" value={String(userCount)} />
        <Card title="Products" value={String(productCount)} />
        <Card title="Orders" value={String(orderCount)} />
        <Card title="Revenue" value={formatCurrency(revenue._sum.total || 0)} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products" className="rounded-xl bg-cyan-300 px-4 py-2 font-bold text-slate-900">
          Manage Products
        </Link>
        <Link href="/admin/orders" className="rounded-xl border border-white/25 px-4 py-2 font-bold text-slate-100">
          Manage Orders
        </Link>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-sm text-slate-300">{title}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}


