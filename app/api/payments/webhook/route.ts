import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/src/lib/db";

export const runtime = "nodejs";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    })
  : null;

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET is missing." }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook signature verification failed." },
      { status: 400 },
    );
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata?.orderId;
      if (!orderId) {
        return NextResponse.json({ received: true });
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order) {
        return NextResponse.json({ received: true });
      }

      if (order.paymentStatus !== "PAID") {
        await prisma.$transaction(async (tx) => {
          for (const item of order.items) {
            const product = await tx.product.findUnique({ where: { id: item.productId } });
            if (!product || product.stock < item.quantity) {
              throw new Error(`Insufficient stock while finalizing order ${order.id}`);
            }
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }

          await tx.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "PAID",
              status: "PROCESSING",
              paymentRef: intent.id,
            },
          });
        });
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata?.orderId;
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "FAILED",
            paymentRef: intent.id,
          },
        });
      }
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process webhook." },
      { status: 400 },
    );
  }

  return NextResponse.json({ received: true });
}
