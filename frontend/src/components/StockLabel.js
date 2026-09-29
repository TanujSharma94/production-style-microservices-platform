export default function StockLabel({ stock }) {
  if (stock <= 0) {
    return <span className="text-sm font-medium text-red-600">Out of stock</span>;
  }
  if (stock <= 5) {
    return (
      <span className="text-sm font-medium text-orange-600">
        Only {stock} left
      </span>
    );
  }
  return <span className="text-sm font-medium text-green-600">In stock</span>;
}
