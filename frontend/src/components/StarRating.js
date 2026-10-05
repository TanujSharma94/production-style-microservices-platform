export default function StarRating({ value = 0 }) {
  const rounded = Math.round(value);
  return (
    <span className="flex text-yellow-500">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>{i <= rounded ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export function StarRatingInput({ value, onChange }) {
  return (
    <span className="flex gap-1 text-2xl text-yellow-500">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="leading-none"
          aria-label={`${i} star`}
        >
          {i <= value ? "★" : "☆"}
        </button>
      ))}
    </span>
  );
}
