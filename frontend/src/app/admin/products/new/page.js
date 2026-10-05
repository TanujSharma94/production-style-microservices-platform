"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function NewProductPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    initialStock: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiRequest("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await apiRequest("/api/products", {
        method: "POST",
        token,
        body: {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          initialStock: Number(form.initialStock),
        },
      });
      router.push("/admin/products");
    } catch (err) {
      setError(err.errors?.[0]?.msg || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h1 className="mb-4 text-xl font-bold">New product</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
          className="w-full rounded border px-3 py-2"
        />
        <textarea
          placeholder="Description (min 10 characters)"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
          minLength={10}
          rows={4}
          className="w-full rounded border px-3 py-2"
        />
        <input
          type="number"
          placeholder="Price in paise (e.g. 49900 = ₹499)"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
          required
          min={0}
          className="w-full rounded border px-3 py-2"
        />
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          required
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Initial stock"
          value={form.initialStock}
          onChange={(e) => update("initialStock", e.target.value)}
          required
          min={0}
          className="w-full rounded border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create product"}
        </button>
      </form>
    </div>
  );
}
