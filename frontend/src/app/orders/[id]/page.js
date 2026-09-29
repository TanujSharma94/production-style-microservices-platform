"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, ready, token } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (ready && !user) router.push("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!token) return;
    apiRequest(`/api/orders/${id}`, { token })
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  async function handleCancel() {
    setCancelling(true);
    setError("");
    try {
      const res = await apiRequest(`/api/orders/${id}/cancel`, {
        method: "PATCH",
        token,
      });
      setOrder(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  }

  if (!ready || loading) {
    return <p className="py-10 text-center text-gray-500">Loading order...</p>;
  }

  if (error || !order) {
    return (
      <div className="py-10 text-center">
        <p className="mb-3 text-red-600">{error || "Order not found"}</p>
        <Link href="/orders" className="text-indigo-700 underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/orders" className="text-sm text-indigo-700 underline">
        ← Back to orders
      </Link>
      <div className="mt-4 rounded-xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Order #{order._id.slice(-6)}</h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              STATUS_STYLES[order.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {order.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Payment: {order.paymentStatus}
        </p>
        <div className="mt-4 space-y-2 border-t pt-4">
          {order.items.map((item) => (
            <div key={item.product._id} className="flex justify-between text-sm">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.priceAtOrder * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <span className="text-lg font-bold">
            Total: {formatPrice(order.totalAmount)}
          </span>
          {order.status === "pending" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-full border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {cancelling ? "Cancelling..." : "Cancel order"}
            </button>
          )}
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
