import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/src/lib/db";
import { badRequest, requireAuth } from "@/src/lib/api";

export const runtime = "nodejs";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    })
  : null;

const SHIPPING_COST = 10;
const TAX_RATE = 0.08;

type CheckoutPayload = {
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
};

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY to enable card payments." },
      { status: 500 },
    );
  }

  const body = (await req.json()) as CheckoutPayload;
  const items = body?.items;
  const shipping = body?.shipping;

  if (!Array.isArray(items) || !items.length) {
    return badRequest("Checkout items are required");
  }

  const requiredShipping = ["name", "email", "phone", "line1", "city", "state", "postal", "country"];
  for (const key of requiredShipping) {
    if (!shipping?.[key as keyof typeof shipping]) {
      return badRequest(`Missing shipping field: ${key}`);
    }
  }

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const lineItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const quantity = Math.max(1, Number(item.quantity || 1));
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
    return badRequest("No valid products supplied");
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + tax + SHIPPING_COST).toFixed(2));

  try {
    const order = await prisma.order.create({
      data: {
        userId: auth.session.user.id,
        paymentMethod: "STRIPE",
        paymentStatus: "PENDING",
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
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      metadata: {
        userId: auth.session.user.id,
        orderId: order.id,
      },
      automatic_payment_methods: { enabled: true },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentRef: paymentIntent.id,
      },
    });

    return NextResponse.json({
      provider: "stripe",
      orderId: order.id,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: total,
      currency: "usd",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not initialize Stripe checkout.",
      },
      { status: 400 },
    );
  }
}
