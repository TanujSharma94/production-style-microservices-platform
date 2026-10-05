"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [ready, user, router]);

  if (!ready || !user || user.role !== "admin") {
    return <p className="py-10 text-center text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex gap-4 border-b pb-3 text-sm font-medium">
        <Link href="/admin/products" className="hover:text-indigo-700">
          Products
        </Link>
      </div>
      {children}
    </div>
  );
}
