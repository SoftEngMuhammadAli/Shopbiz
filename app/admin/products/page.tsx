"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  featured: boolean;
  categoryId: string;
  category: { name: string };
};

const defaultForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image: "",
  categoryId: "",
  featured: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    const [pRes, cRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")]);
    const p = await pRes.json();
    const c = await cRes.json();
    setProducts(p.products || []);
    setCategories(c.categories || []);
    if (c.categories?.[0]) {
      setForm((prev) => (prev.categoryId ? prev : { ...prev, categoryId: c.categories[0].id }));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to add product");
      setLoading(false);
      return;
    }

    setForm({ ...defaultForm, categoryId: form.categoryId || categories[0]?.id || "" });
    await loadData();
    setLoading(false);
  }

  async function removeProduct(id: string) {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) await loadData();
  }

  return (
    <div className="page-shell space-y-8">
      <h1 className="text-3xl font-black text-white">Manage Products</h1>

      <form onSubmit={onSubmit} className="glass grid gap-4 rounded-2xl p-5 md:grid-cols-2">
        <div>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="label">Image URL</label>
          <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
        </div>
        <div>
          <label className="label">Price</label>
          <input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        </div>
        <div>
          <label className="label">Stock</label>
          <input type="number" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
        </div>
        <div>
          <label className="label">Category</label>
          <select
            className="input"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 pt-7">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          <label htmlFor="featured" className="text-sm font-semibold text-slate-200">
            Featured Product
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="label">Description</label>
          <textarea className="input min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        {error ? <p className="text-sm text-red-300 md:col-span-2">{error}</p> : null}
        <button className="rounded-xl bg-cyan-300 px-4 py-2 font-bold text-slate-900 md:col-span-2" disabled={loading}>
          {loading ? "Adding product..." : "Add Product"}
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => (
          <article key={p.id} className="glass overflow-hidden rounded-2xl">
            <Image
              src={p.image}
              alt={p.name}
              width={600}
              height={320}
              unoptimized
              className="h-40 w-full object-cover"
            />
            <div className="space-y-2 p-4">
              <h2 className="font-bold text-white">{p.name}</h2>
              <p className="text-sm text-slate-300">{p.category.name}</p>
              <p className="text-sm text-slate-300">${p.price.toFixed(2)} - Stock {p.stock}</p>
              <button onClick={() => removeProduct(p.id)} className="rounded-lg border border-red-300/40 px-3 py-1 text-sm text-red-200">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
