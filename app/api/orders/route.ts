import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { badRequest, requireAuth } from "@/src/lib/api";

export const runtime = "nodejs";

type OrderPayload = {
  items: Array<{ productId: string; quantity: number }>;
  shipping: {
    name: string;
    email: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  };
  paymentMethod: "COD" | "STRIPE";
  paymentRef?: string;
};

const SHIPPING_COST = 10;
const TAX_RATE = 0.08;

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { user } = auth.session;
  const where = user.role === "ADMIN" ? {} : { userId: user.id };

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const body = (await req.json()) as OrderPayload;

  if (body.paymentMethod === "STRIPE") {
    return badRequest("Use /api/payments/checkout for Stripe orders.");
  }

  if (!body?.items?.length) {
    return badRequest("Order items are required");
  }

  const shipping = body.shipping;
  const requiredShipping = [
    "name",
    "email",
    "phone",
    "line1",
    "city",
    "state",
    "postal",
    "country",
  ];
  for (const key of requiredShipping) {
    if (!shipping?.[key as keyof typeof shipping]) {
      return badRequest(`Missing shipping field: ${key}`);
    }
  }

  const productIds = body.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const lineItems = body.items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const quantity = Math.max(1, Number(item.quantity));

      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      return {
        product,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
      };
    })
    .filter(Boolean) as Array<{
    product: (typeof products)[number];
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;

  if (!lineItems.length) {
    return badRequest("No valid products found");
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + tax + SHIPPING_COST).toFixed(2));

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: auth.session.user.id,
          paymentMethod: "COD",
          paymentStatus: "PENDING",
          paymentRef: body.paymentRef || null,
          subtotal,
          shippingCost: SHIPPING_COST,
          tax,
          total,
          shippingName: shipping.name,
          shippingEmail: shipping.email,
          shippingPhone: shipping.phone,
          shippingLine1: shipping.line1,
          shippingLine2: shipping.line2 || null,
          shippingCity: shipping.city,
          shippingState: shipping.state,
          shippingPostal: shipping.postal,
          shippingCountry: shipping.country,
          items: {
            create: lineItems.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
        },
        include: {
          items: { include: { product: true } },
        },
      });

      for (const item of lineItems) {
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return created;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to place order. Please retry with valid stock.",
      },
      { status: 400 },
    );
  }
}
