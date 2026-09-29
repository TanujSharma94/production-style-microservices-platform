"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { user, ready, token } = useAuth();
  const router = useRouter();
  const { cart, loading, refreshCart, updateItem, removeItem } = useCart();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (ready && !user) {
      router.push("/login");
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (token) refreshCart();
  }, [token, refreshCart]);

  async function handleQuantity(productId, quantity) {
    if (quantity < 1) return;
    setBusyId(productId);
    setError("");
    try {
      await updateItem(productId, quantity);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemove(productId) {
    setBusyId(productId);
    setError("");
    try {
      await removeItem(productId);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleCheckout() {
    setCheckingOut(true);
    setError("");
    try {
      const { apiRequest } = await import("@/lib/api");
      const res = await apiRequest("/api/orders/checkout", {
        method: "POST",
        token,
      });
      await refreshCart();
      router.push(`/orders/${res.data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingOut(false);
    }
  }

  if (!ready || loading || !cart) {
    return <p className="py-10 text-center text-gray-500">Loading cart...</p>;
  }

  const items = cart.items || [];
  const total = items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-5xl">🛒</p>
        <p className="mt-3 text-lg font-semibold">Your cart is empty</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-500"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Your cart</h1>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const p = item.product;
          const isBusy = busyId === p._id;
          return (
            <div
              key={p?._id ?? `cart-item-${idx}`}
              className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${p._id}`}
                  className="font-semibold hover:text-indigo-700"
                >
                  {p.name}
                </Link>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.priceAtAdd)} each
                </p>
                {p.isActive === false && (
                  <p className="text-xs text-red-600">No longer available</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={isBusy}
                  onClick={() => handleQuantity(p._id, item.quantity - 1)}
                  className="h-8 w-8 rounded-full bg-gray-100 font-bold hover:bg-gray-200 disabled:opacity-50"
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  disabled={isBusy}
                  onClick={() => handleQuantity(p._id, item.quantity + 1)}
                  className="h-8 w-8 rounded-full bg-gray-100 font-bold hover:bg-gray-200 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <span className="w-24 text-right font-semibold">
                {formatPrice(item.priceAtAdd * item.quantity)}
              </span>
              <button
                disabled={isBusy}
                onClick={() => handleRemove(p._id)}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
        <span className="text-lg font-bold">Total: {formatPrice(total)}</span>
        <button
          onClick={handleCheckout}
          disabled={checkingOut}
          className="rounded-full bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {checkingOut ? "Placing order..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}
