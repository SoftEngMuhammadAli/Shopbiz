import Link from "next/link";
import { getAuthSession } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import { formatCurrency, formatDate } from "@/src/lib/format";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return null;
  }

  const orders = await prisma.order.findMany({
    where: session.user.role === "ADMIN" ? {} : { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="page-shell space-y-6">
      <h1 className="text-3xl font-black text-white">Orders</h1>
      {!orders.length ? (
        <p className="glass rounded-2xl p-6 text-slate-300">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-slate-400">Order ID</p>
                  <p className="font-mono text-sm text-cyan-200">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Placed</p>
                  <p className="text-sm text-white">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-200">
                  Status: <span className="font-bold text-cyan-200">{order.status}</span>
                </p>
                <p className="text-sm text-slate-200">
                  Payment: <span className="font-bold text-amber-300">{order.paymentStatus}</span>
                </p>
                <p className="text-lg font-black text-white">{formatCurrency(order.total)}</p>
              </div>

              <div className="mt-4 grid gap-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
                    <span className="text-slate-200">{item.product.name} × {item.quantity}</span>
                    <span className="font-bold text-slate-100">{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <Link href="/products" className="inline-block rounded-xl border border-white/20 px-4 py-2 text-slate-200">
        Continue Shopping
      </Link>
    </div>
  );
}


