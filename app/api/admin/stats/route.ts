import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { requireAdmin } from "@/src/lib/api";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;

  const [userCount, productCount, orderCount, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  return NextResponse.json({
    userCount,
    productCount,
    orderCount,
    revenue: revenue._sum.total || 0,
  });
}
