import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const load = () => {
    api.get(`/reviews/product/${productId}`).then(({ data }) => {
      setReviews(data.reviews);
      setLoading(false);
    });
  };

  useEffect(load, [productId]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/reviews/product/${productId}`, { rating, comment });
      toast.success("Review submitted, thank you!");
      setComment("");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {isAuthenticated && (
        <form onSubmit={submitReview} className="glass-card p-5 space-y-3">
          <h4 className="font-semibold">Write a review</h4>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRating(n)}>
                <Star className={`w-6 h-6 ${n <= rating ? "fill-accent-orange text-accent-orange" : "text-slate-300"}`} />
              </button>
            ))}
          </div>
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="input-field min-h-[90px]"
          />
          <button type="submit" className="btn-gradient !py-2 text-sm">
            Submit review
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-slate-400 text-sm">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-slate-400 text-sm">No reviews yet — be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="glass-card p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{r.name}</span>
                {r.verifiedPurchase && (
                  <span className="badge bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Verified purchase
                  </span>
                )}
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < r.rating ? "fill-accent-orange text-accent-orange" : "text-slate-300"}`} />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
              {r.sellerReply && (
                <div className="mt-2 pl-3 border-l-2 border-brand-300 text-sm text-slate-500">
                  <span className="font-semibold">Seller reply: </span>
                  {r.sellerReply}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
