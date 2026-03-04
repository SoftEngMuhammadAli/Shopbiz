"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="page-shell flex justify-center">
      <form onSubmit={onSubmit} className="glass w-full max-w-md space-y-4 rounded-2xl p-6">
        <h1 className="text-3xl font-black text-white">Sign In</h1>
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label">Password</label>
          <input name="password" type="password" required className="input" />
        </div>
        {error ? <p className="text-sm font-semibold text-red-300">{error}</p> : null}
        <button className="w-full rounded-xl bg-cyan-300 px-4 py-2 font-bold text-slate-900" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-sm text-slate-300">
          No account? <Link href="/register" className="font-bold text-cyan-300">Create one</Link>
        </p>
      </form>
    </div>
  );
}


