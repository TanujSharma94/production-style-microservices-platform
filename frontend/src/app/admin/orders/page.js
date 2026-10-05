"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  function load() {
    setLoading(true);
    apiRequest("/api/orders/admin/all", { token })
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() sets loading synchronously so the table shows a spinner the instant token becomes available
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function markPaid(order) {
    setBusyId(order._id);
    setError("");
    try {
      await apiRequest(`/api/orders/${order._id}/pay`, {
        method: "PATCH",
        token,
      });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <p className="py-10 text-center text-gray-500">Loading orders...</p>;
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">All orders</h1>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t align-top">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                  #{o._id.slice(-6)}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{o.user?.name}</p>
                  <p className="text-xs text-gray-500">{o.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {o.items.length} item(s)
                </td>
                <td className="px-4 py-3 font-semibold">
                  {formatPrice(o.totalAmount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      STATUS_STYLES[o.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{o.paymentStatus}</td>
                <td className="px-4 py-3 text-right">
                  {o.status === "pending" && o.paymentStatus === "unpaid" && (
                    <button
                      disabled={busyId === o._id}
                      onClick={() => markPaid(o)}
                      className="text-sm font-medium text-indigo-700 hover:underline disabled:opacity-50"
                    >
                      Mark paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
