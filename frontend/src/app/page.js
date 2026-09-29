"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

const PERKS = [
  { icon: "🚚", title: "Fast delivery", text: "Quick dispatch on every order" },
  { icon: "🔒", title: "Secure checkout", text: "Your account is protected" },
  { icon: "↩️", title: "Easy returns", text: "Cancel pending orders anytime" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiRequest("/api/products")
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data);
        setError("");
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
  }, [attempt]);

  function retry() {
    setLoading(true);
    setError("");
    setAttempt((a) => a + 1);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-12 text-center text-white shadow-lg sm:py-16">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Shop the latest gadgets
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-white/90">
          Phones, laptops, headphones and more, at prices that make sense.
        </p>
        <a
          href="#products"
          className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 font-semibold text-indigo-700 shadow hover:bg-indigo-50"
        >
          Browse products
        </a>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PERKS.map((perk) => (
          <div
            key={perk.title}
            className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
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
        <h2 className="mb-4 text-2xl font-bold">Featured products</h2>

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
            <button
              onClick={retry}
              className="rounded-full bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-500"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="py-10 text-center text-gray-500">No products available.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
} 
