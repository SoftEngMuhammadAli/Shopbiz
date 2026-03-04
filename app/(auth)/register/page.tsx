"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await res.json();
    if (!res.ok) {
      setError(result.error || "Registration failed");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });

    router.refresh();
  }

  return (
    <div className="page-shell flex justify-center">
      <form onSubmit={onSubmit} className="glass w-full max-w-md space-y-4 rounded-2xl p-6">
        <h1 className="text-3xl font-black text-white">Create Account</h1>
        <div>
          <label className="label">Name</label>
          <input name="name" required className="input" />
        </div>
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label">Password</label>
          <input name="password" type="password" minLength={6} required className="input" />
        </div>
        {error ? <p className="text-sm font-semibold text-red-300">{error}</p> : null}
        <button className="w-full rounded-xl bg-cyan-300 px-4 py-2 font-bold text-slate-900" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="text-sm text-slate-300">
          Already have an account? <Link href="/login" className="font-bold text-cyan-300">Sign in</Link>
        </p>
      </form>
    </div>
  );
}


