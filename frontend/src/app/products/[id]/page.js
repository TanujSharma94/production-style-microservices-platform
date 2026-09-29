"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import StockLabel from "@/components/StockLabel";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [cartMsg, setCartMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest(`/api/products/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!cancelled) setProduct(res.data);
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
  }, [id]);

  async function handleAddToCart() {
    if (!user) {
      router.push("/login");
      return;
    }
    setAdding(true);
    setCartMsg("");
    try {
      await addToCart(product._id, 1);
      setCartMsg("Added to cart!");
    } catch (err) {
      setCartMsg(err.message);
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return <p className="py-10 text-center text-gray-500">Loading product...</p>;
  }

  if (error || !product) {
    return (
      <div className="py-10 text-center">
        <p className="mb-3 text-red-600">{error || "Product not found"}</p>
        <Link href="/" className="text-indigo-700 underline">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/" className="text-sm text-indigo-700 underline">
        ← Back to products
      </Link>
      <div className="mt-4 rounded-xl bg-white p-6 shadow">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {product.category?.name}
        </p>
        <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
        <p className="mt-3 text-gray-700">{product.description}</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-2xl font-extrabold text-indigo-700">
            {formatPrice(product.price)}
          </span>
          <StockLabel stock={product.stock} />
        </div>
        <button
          onClick={handleAddToCart}
          disabled={adding || product.stock <= 0}
          className="mt-6 rounded-full bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {adding ? "Adding..." : product.stock <= 0 ? "Out of stock" : "Add to cart"}
        </button>
        {cartMsg && <p className="mt-2 text-sm text-gray-600">{cartMsg}</p>}
      </div>
    </div>
  );
}
