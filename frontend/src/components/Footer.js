import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-8 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 text-lg font-bold text-white">
            <span>🛍️</span> ShopHub
          </p>
          <p className="mt-2 text-sm text-gray-400">
            A production-style e-commerce platform built with Node.js, MongoDB
            and Next.js.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Shop</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                All products
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Account</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-white">
                Sign up
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-3 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ShopHub
      </div>
    </footer>
  );
}
