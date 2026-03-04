"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/src/lib/format";

type Order = {
  id: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  total: number;
  user: { name: string; email: string };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function loadOrders() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    const run = async () => {
      await loadOrders();
    };
    void run();
  }, []);

  async function updateOrder(id: string, status: Order["status"]) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    await loadOrders();
  }

  return (
    <div className="page-shell space-y-6">
      <h1 className="text-3xl font-black text-white">Manage Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-cyan-200">{order.id}</p>
                <p className="text-sm text-slate-200">{order.user.name} ({order.user.email})</p>
              </div>
              <p className="text-lg font-black text-amber-300">{formatCurrency(order.total)}</p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-300">Payment: {order.paymentStatus}</span>
              <select className="input max-w-48" value={order.status} onChange={(e) => updateOrder(order.id, e.target.value as Order["status"])}>
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


