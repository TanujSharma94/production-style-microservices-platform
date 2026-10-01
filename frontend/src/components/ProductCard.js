import Link from "next/link";
import { formatPrice } from "@/lib/format";
import StockLabel from "@/components/StockLabel";

const CATEGORY_STYLE = {
  Electronics: { from: "#6366f1", to: "#a855f7", icon: "📱" },
  Fashion: { from: "#ec4899", to: "#f97316", icon: "👕" },
  "Home & Kitchen": { from: "#10b981", to: "#0ea5e9", icon: "🏠" },
  Books: { from: "#f59e0b", to: "#ef4444", icon: "📚" },
  "Sports & Fitness": { from: "#14b8a6", to: "#22c55e", icon: "🏋️" },
  "Beauty & Personal Care": { from: "#f472b6", to: "#c084fc", icon: "💄" },
};

const DEFAULT_STYLE = { from: "#6366f1", to: "#8b5cf6", icon: "🛍️" };

function iconFor(name, category) {
  const t = name.toLowerCase();
  if (/head|ear|audio|speaker/.test(t)) return "🎧";
  if (/phone/.test(t)) return "📱";
  if (/laptop|notebook/.test(t)) return "💻";
  if (/watch/.test(t)) return "⌚";
  if (/camera|webcam/.test(t)) return "📷";
  if (/shoe|sneaker/.test(t)) return "👟";
  if (/jacket|bomber/.test(t)) return "🧥";
  if (/saree|kurta|dress/.test(t)) return "👗";
  if (/sunglass/.test(t)) return "🕶️";
  if (/bag|wallet/.test(t)) return "👜";
  if (/cookware|mixer|dinner/.test(t)) return "🍳";
  if (/bedsheet|pillow|mattress/.test(t)) return "🛏️";
  if (/lamp|clock/.test(t)) return "💡";
  if (/bottle/.test(t)) return "🍶";
  if (/yoga|mat/.test(t)) return "🧘";
  if (/dumbbell|gym|protein/.test(t)) return "🏋️";
  if (/bat|cricket/.test(t)) return "🏏";
  if (/football/.test(t)) return "⚽";
  if (/badminton/.test(t)) return "🏸";
  if (/running|treadmill/.test(t)) return "🏃";
  if (/shampoo|hair/.test(t)) return "🧴";
  if (/perfume/.test(t)) return "🌸";
  if (/lipstick|nail/.test(t)) return "💄";
  if (/sunscreen|face wash|mask|lotion/.test(t)) return "🧴";
  return CATEGORY_STYLE[category]?.icon || DEFAULT_STYLE.icon;
}

export default function ProductCard({ product }) {
  const category = product.category?.name || "";
  const style = CATEGORY_STYLE[category] || DEFAULT_STYLE;

  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="relative flex h-44 items-center justify-center text-6xl"
        style={{ background: `linear-gradient(135deg, ${style.from}, ${style.to})` }}
      >
        <span className="drop-shadow-lg transition group-hover:scale-110">
          {iconFor(product.name, category)}
        </span>
        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-0.5 text-xs font-semibold text-gray-700 backdrop-blur">
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
