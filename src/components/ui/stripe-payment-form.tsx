"use client";

import { FormEvent, useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

type StripePaymentFormProps = {
  customerName: string;
  customerEmail: string;
  onSuccess: () => void;
};

export default function StripePaymentForm({
  customerName,
  customerEmail,
  onSuccess,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!stripe || !elements) {
      setError("Stripe is still loading. Please wait a moment.");
      return;
    }

    setSubmitting(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: customerName,
            email: customerEmail,
          },
        },
      },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message || "Payment confirmation failed.");
      setSubmitting(false);
      return;
    }

    const status = result.paymentIntent?.status;
    if (status === "succeeded" || status === "processing" || status === "requires_capture") {
      onSuccess();
      return;
    }

    setError(`Payment status: ${status || "unknown"}. Please try again.`);
    setSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-white/20 bg-white/5 p-4">
      <h3 className="text-base font-bold text-white">Card Payment</h3>
      <PaymentElement />
      {error ? <p className="text-sm font-semibold text-red-300">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting || !stripe || !elements}
        className="rounded-xl bg-cyan-300 px-4 py-2 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Confirming payment..." : "Pay now"}
      </button>
    </form>
  );
}
