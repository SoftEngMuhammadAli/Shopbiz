import { NextResponse } from "next/server";
import { requireAuth, requireAdmin } from "@/src/lib/api";
import { prisma } from "@/src/lib/db";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { product: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (auth.session.user.role !== "ADMIN" && order.userId !== auth.session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(req: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;

  const { id } = await params;
  const body = await req.json();

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: body?.status,
      paymentStatus: body?.paymentStatus,
    },
  });

  return NextResponse.json({ order });
}


