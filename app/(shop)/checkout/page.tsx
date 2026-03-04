"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/src/lib/cart-context";
import { formatCurrency } from "@/src/lib/format";
import StripePaymentForm from "@/src/components/ui/stripe-payment-form";

const SHIPPING = 10;
const TAX = 0.08;

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

type ShippingDetails = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal: string;
  country: string;
};

type StripeState = {
  orderId: string;
  clientSecret: string;
  shipping: ShippingDetails;
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "STRIPE">("COD");
  const [stripeState, setStripeState] = useState<StripeState | null>(null);

  const totals = useMemo(() => {
    const tax = Number((subtotal * TAX).toFixed(2));
    const total = Number((subtotal + SHIPPING + tax).toFixed(2));
    return { tax, total };
  }, [subtotal]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!items.length) {
      setError("Your cart is empty.");
      setLoading(false);
      return;
    }

    const fd = new FormData(e.currentTarget);
    const shipping: ShippingDetails = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      line1: String(fd.get("line1") || ""),
      line2: String(fd.get("line2") || ""),
      city: String(fd.get("city") || ""),
      state: String(fd.get("state") || ""),
      postal: String(fd.get("postal") || ""),
      country: String(fd.get("country") || ""),
    };

    try {
      if (paymentMethod === "COD") {
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
            shipping,
            paymentMethod,
          }),
        });

        const result = await orderRes.json();
        if (!orderRes.ok) {
          throw new Error(result.error || "Could not place order");
        }

        clearCart();
        router.push(`/orders?placed=${result.order.id}`);
        return;
      }

      if (!stripePromise) {
        throw new Error("Stripe publishable key is missing.");
      }

      const checkoutRes = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          shipping,
        }),
      });

      const checkout = await checkoutRes.json();
      if (!checkoutRes.ok) {
        throw new Error(checkout.error || "Could not initialize Stripe checkout.");
      }

      setStripeState({
        clientSecret: checkout.clientSecret,
        orderId: checkout.orderId,
        shipping,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  function onStripeSuccess() {
    clearCart();
    if (stripeState?.orderId) {
      router.push(`/orders?placed=${stripeState.orderId}&payment=processing`);
    } else {
      router.push("/orders");
    }
  }

  return (
    <div className="page-shell grid gap-8 lg:grid-cols-[1fr_320px]">
      <form onSubmit={onSubmit} className="glass space-y-4 rounded-2xl p-6">
        <h1 className="text-3xl font-black text-white">Checkout</h1>
        <div>
          <label className="label">Full Name</label>
          <input name="name" required className="input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required className="input" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input name="phone" required className="input" />
          </div>
        </div>
        <div>
          <label className="label">Address Line 1</label>
          <input name="line1" required className="input" />
        </div>
        <div>
          <label className="label">Address Line 2</label>
          <input name="line2" className="input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">City</label>
            <input name="city" required className="input" />
          </div>
          <div>
            <label className="label">State</label>
            <input name="state" required className="input" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Postal Code</label>
            <input name="postal" required className="input" />
          </div>
          <div>
            <label className="label">Country</label>
            <input name="country" required className="input" defaultValue="USA" />
          </div>
        </div>
        <div>
          <label className="label">Payment Method</label>
          <select
            className="input"
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value as "COD" | "STRIPE");
              setStripeState(null);
            }}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="STRIPE">Card Payment (Stripe)</option>
          </select>
        </div>

        {paymentMethod === "COD" ? (
          <button
            type="submit"
            disabled={loading || !items.length}
            className="rounded-xl bg-cyan-300 px-5 py-2 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Placing order..." : "Place COD Order"}
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading || !items.length || !!stripeState}
            className="rounded-xl bg-cyan-300 px-5 py-2 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Preparing payment..." : stripeState ? "Payment Initialized" : "Continue to Card Payment"}
          </button>
        )}

        {error ? <p className="text-sm font-semibold text-red-300">{error}</p> : null}

        {paymentMethod === "STRIPE" && stripeState?.clientSecret && stripePromise ? (
          <Elements stripe={stripePromise} options={{ clientSecret: stripeState.clientSecret }}>
            <StripePaymentForm
              customerName={stripeState.shipping.name}
              customerEmail={stripeState.shipping.email}
              onSuccess={onStripeSuccess}
            />
          </Elements>
        ) : null}
      </form>

      <aside className="glass h-fit space-y-2 rounded-2xl p-5">
        <h2 className="text-xl font-extrabold text-white">Summary</h2>
        <p className="text-slate-300">Subtotal: {formatCurrency(subtotal)}</p>
        <p className="text-slate-300">Shipping: {formatCurrency(SHIPPING)}</p>
        <p className="text-slate-300">Tax: {formatCurrency(totals.tax)}</p>
        <p className="text-2xl font-black text-amber-300">Total: {formatCurrency(totals.total)}</p>
      </aside>
    </div>
  );
}
