"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const { user, ready, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !user) router.push("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!token) return;
    apiRequest("/api/orders", { token })
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (!ready || loading) {
    return <p className="py-10 text-center text-gray-500">Loading orders...</p>;
  }

  if (error) {
    return <p className="py-10 text-center text-red-600">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-5xl">📦</p>
        <p className="mt-3 text-lg font-semibold">No orders yet</p>
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
      <h1 className="mb-4 text-2xl font-bold">Your orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/orders/${order._id}`}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md"
          >
            <div>
              <p className="font-semibold">Order #{order._id.slice(-6)}</p>
              <p className="text-sm text-gray-500">
                {order.items.length} item(s) ·{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  STATUS_STYLES[order.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
