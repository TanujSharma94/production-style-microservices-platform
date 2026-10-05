"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { user, ready, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="text-2xl">🛍️</span>
          ShopHub
        </Link>
        <div className="flex items-center gap-3 text-sm font-medium">
          <Link href="/" className="rounded px-2 py-1 hover:bg-white/15">
            Products
          </Link>
          {ready && user?.role === "admin" && (
            <Link href="/admin/products" className="rounded px-2 py-1 hover:bg-white/15">
              Admin
            </Link>
          )}
          {ready && user && (
            <>
              <Link href="/orders" className="rounded px-2 py-1 hover:bg-white/15">
                Orders
              </Link>
              <Link href="/cart" className="relative rounded px-2 py-1 hover:bg-white/15">
                🛒
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-fuchsia-400 px-1 text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </>
          )}
          {ready && user ? (
            <>
              <span className="hidden rounded-full bg-white/15 px-3 py-1 sm:inline">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="rounded-full bg-white/20 px-4 py-1.5 hover:bg-white/30"
              >
                Logout
              </button>
            </>
          ) : (
            ready && (
              <>
                <Link href="/login" className="rounded px-2 py-1 hover:bg-white/15">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-white px-4 py-1.5 font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  Sign up
                </Link>
              </>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
