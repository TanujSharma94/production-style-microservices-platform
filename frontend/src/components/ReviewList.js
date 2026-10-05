"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import StarRating, { StarRatingInput } from "@/components/StarRating";

export default function ReviewList({ productId }) {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function load() {
    apiRequest(`/api/reviews/product/${productId}`)
      .then((res) => {
        setReviews(res.data.reviews);
        setAverage(res.data.average);
        setCount(res.data.count);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading must flip synchronously when productId changes to refetch
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const alreadyReviewed = user && reviews.some((r) => r.user?._id === user.id);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (rating < 1) {
      setFormError("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest("/api/reviews", {
        method: "POST",
        token,
        body: { productId, rating, comment },
      });
      setRating(0);
      setComment("");
      load();
    } catch (err) {
      setFormError(err.errors?.[0]?.msg || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading reviews...</p>;
  }

  return (
    <div className="mt-8 border-t pt-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold">Reviews</h2>
        {count > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <StarRating value={average} />
            <span>
              {average.toFixed(1)} ({count} review{count !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {count === 0 && !error && (
        <p className="mt-2 text-sm text-gray-500">No reviews yet. Be the first!</p>
      )}

      <div className="mt-4 space-y-4">
        {reviews.map((r) => (
          <div key={r._id} className="rounded-lg bg-gray-50 p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{r.user?.name || "User"}</span>
              <StarRating value={r.rating} />
            </div>
            {r.comment && <p className="mt-1 text-sm text-gray-600">{r.comment}</p>}
          </div>
        ))}
      </div>

      {user && !alreadyReviewed && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-lg border p-4">
          <p className="mb-2 text-sm font-medium">Write a review</p>
          <StarRatingInput value={rating} onChange={setRating} />
          <textarea
            placeholder="Share your thoughts (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={1000}
            className="mt-2 w-full rounded border px-3 py-2 text-sm"
          />
          {formError && <p className="mt-1 text-sm text-red-600">{formError}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit review"}
          </button>
        </form>
      )}

      {user && alreadyReviewed && (
        <p className="mt-4 text-sm text-gray-500">You&apos;ve already reviewed this product.</p>
      )}
    </div>
  );
}
