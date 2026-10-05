"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);

  function load() {
    setLoading(true);
    apiRequest("/api/categories/admin/all", { token })
      .then((res) => setCategories(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() sets loading synchronously so the table shows a spinner the instant token becomes available
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      await apiRequest("/api/categories", {
        method: "POST",
        token,
        body: { name: form.name, description: form.description },
      });
      setForm({ name: "", description: "" });
      load();
    } catch (err) {
      setError(err.errors?.[0]?.msg || err.message);
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(cat) {
    setBusyId(cat._id);
    setError("");
    try {
      const path = cat.isActive
        ? `/api/categories/${cat._id}/deactivate`
        : `/api/categories/${cat._id}/activate`;
      await apiRequest(path, { method: "PATCH", token });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <p className="py-10 text-center text-gray-500">Loading categories...</p>;
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Manage categories</h1>

      <form
        onSubmit={handleCreate}
        className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:flex-row"
      >
        <input
          type="text"
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
          className="flex-1 rounded border px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="flex-1 rounded border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={creating}
          className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {creating ? "Adding..." : "+ Add category"}
        </button>
      </form>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.description || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      c.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    disabled={busyId === c._id}
                    onClick={() => toggleActive(c)}
                    className="text-sm font-medium text-indigo-700 hover:underline disabled:opacity-50"
                  >
                    {c.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
