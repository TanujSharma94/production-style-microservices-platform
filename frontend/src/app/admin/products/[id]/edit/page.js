"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function EditProductPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiRequest(`/api/products/${id}`), apiRequest("/api/categories")])
      .then(([productRes, catRes]) => {
        const p = productRes.data;
        setForm({
          name: p.name,
          description: p.description,
          price: String(p.price),
          category: p.category?._id || "",
        });
        setCategories(catRes.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await apiRequest(`/api/products/${id}`, {
        method: "PUT",
        token,
        body: {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: form.category,
        },
      });
      router.push("/admin/products");
    } catch (err) {
      setError(err.errors?.[0]?.msg || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="py-10 text-center text-gray-500">Loading...</p>;
  }
  if (!form) {
    return <p className="py-10 text-center text-red-600">{error || "Product not found"}</p>;
  }

  return (
    <div className="mx-auto max-w-lg rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h1 className="mb-4 text-xl font-bold">Edit product</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
          className="w-full rounded border px-3 py-2"
        />
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
          minLength={10}
          rows={4}
          className="w-full rounded border px-3 py-2"
        />
        <input
          type="number"
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
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
