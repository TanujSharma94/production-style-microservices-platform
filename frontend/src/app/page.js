"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";

const PERKS = [
  { icon: "🚚", title: "Fast delivery", text: "Quick dispatch on every order" },
  { icon: "🔒", title: "Secure checkout", text: "Your account is protected" },
  { icon: "↩️", title: "Easy returns", text: "Cancel pending orders anytime" },
];

const PAGE_SIZE = 12;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    apiRequest("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading/error must flip synchronously when filters change to refetch
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);

    apiRequest(`/api/products?${params.toString()}`)
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data);
        setPage(1);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category, sort]);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const pageItems = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goToPage(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-14 text-center text-white shadow-xl sm:py-20">
        <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <h1 className="relative text-3xl font-extrabold tracking-tight sm:text-5xl">
          Everything you love,
          <br className="hidden sm:block" /> in one place.
        </h1>
        <p className="relative mx-auto mt-4 max-w-xl text-white/90">
          Electronics, fashion, home essentials, books, fitness gear and
          beauty — curated and ready to ship.
        </p>
        <a
          href="#products"
          className="relative mt-7 inline-block rounded-full bg-white px-7 py-2.5 font-semibold text-indigo-700 shadow hover:bg-indigo-50"
        >
          Start shopping →
        </a>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PERKS.map((perk) => (
          <div
            key={perk.title}
            className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5"
          >
            <span className="text-3xl">{perk.icon}</span>
            <div>
              <p className="font-semibold">{perk.title}</p>
              <p className="text-sm text-gray-500">{perk.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="products" className="scroll-mt-20">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured products</h2>
          {!loading && !error && (
            <p className="text-sm text-gray-500">{products.length} products</p>
          )}
        </div>

        <ProductFilters
          categories={categories}
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
        />

        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="py-10 text-center">
            <p className="mb-3 text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="py-10 text-center text-gray-500">
            No products match your filters.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-3 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 hover:bg-gray-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
} 
