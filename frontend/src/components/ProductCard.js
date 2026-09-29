import Link from "next/link";
import { formatPrice } from "@/lib/format";
import StockLabel from "@/components/StockLabel";

const PALETTES = [
  ["#6366f1", "#a855f7"],
  ["#0ea5e9", "#6366f1"],
  ["#f97316", "#ec4899"],
  ["#10b981", "#0ea5e9"],
  ["#f59e0b", "#ef4444"],
  ["#14b8a6", "#22c55e"],
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function iconFor(name, category) {
  const t = `${name} ${category}`.toLowerCase();
  if (/head|ear|audio|speaker/.test(t)) return "🎧";
  if (/phone|mobile/.test(t)) return "📱";
  if (/laptop|computer|notebook/.test(t)) return "💻";
  if (/watch/.test(t)) return "⌚";
  if (/camera/.test(t)) return "📷";
  return "🛍️";
}

export default function ProductCard({ product }) {
  const [from, to] = PALETTES[hash(product._id) % PALETTES.length];
  const category = product.category?.name || "";

  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="relative flex h-44 items-center justify-center text-6xl"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <span className="drop-shadow transition group-hover:scale-110">
          {iconFor(product.name, category)}
        </span>
        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-0.5 text-xs font-semibold text-gray-700">
            {category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-lg font-semibold group-hover:text-indigo-700">
          {product.name}
        </h2>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-600">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-extrabold text-indigo-700">
            {formatPrice(product.price)}
          </span>
          <StockLabel stock={product.stock} />
        </div>
      </div>
    </Link>
  );
}
