import { Link } from "react-router-dom";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to save items to your wishlist");
      return;
    }
    try {
      const { data } = await api.post(`/wishlist/${product._id}`);
      toast.success(data.added ? "Added to wishlist 💜" : "Removed from wishlist");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative glass-card overflow-hidden flex flex-col"
    >
      <Link to={`/products/${product.slug || product._id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={product.images?.[0]?.url || "https://placehold.co/400x400?text=ShopSmart+AI"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {hasDiscount && (
            <span className="badge absolute top-3 left-3 bg-accent-pink text-white shadow-glow-pink">
              -{Math.round(100 - (product.discountPrice / product.price) * 100)}%
            </span>
          )}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur
              flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Toggle wishlist"
          >
            <Heart className="w-4 h-4 text-accent-pink" />
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
            {product.category}
          </span>
          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <Star className="w-4 h-4 fill-accent-orange text-accent-orange" />
            <span>{product.ratingsAverage?.toFixed(1) || "New"}</span>
            <span>·</span>
            <span>{product.ratingsCount || 0} reviews</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold gradient-text">${displayPrice?.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="w-full btn-gradient !py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
