import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, ShieldCheck } from "lucide-react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewList from "../components/ReviewList";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import { getProductImages } from "../utils/productImages";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data.product);
      setLoading(false);
      api.get(`/ai/similar/${data.product._id}`).then(({ data: d }) => setSimilar(d.similar));
    });
  }, [id]);

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error("Please sign in to save items");
    const { data } = await api.post(`/wishlist/${product._id}`);
    toast.success(data.added ? "Added to wishlist 💜" : "Removed from wishlist");
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  const images = getProductImages(product);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="glass-card aspect-square overflow-hidden mb-3">
            <img
              src={images[activeImage] || "https://placehold.co/600x600?text=ShopSmart+AI"}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x600?text=ShopSmart+AI";
              }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${
                    activeImage === i ? "border-brand-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/100x100?text=Photo";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-500">{product.category}</span>
          <h1 className="text-3xl font-display font-bold mt-1 mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4 text-sm">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.ratingsAverage) ? "fill-accent-orange text-accent-orange" : "text-slate-300"}`} />
              ))}
            </div>
            <span className="text-slate-500">{product.ratingsAverage?.toFixed(1)} ({product.ratingsCount} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold gradient-text">${displayPrice?.toFixed(2)}</span>
            {hasDiscount && <span className="text-lg text-slate-400 line-through">${product.price.toFixed(2)}</span>}
            {product.stock > 0 ? (
              <span className="badge bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">In stock</span>
            ) : (
              <span className="badge bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">Out of stock</span>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-3">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => addToCart(product, qty)}
              disabled={product.stock === 0}
              className="btn-gradient flex-1 disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" /> Add to cart
            </button>
            <button onClick={handleWishlist} className="btn-ghost !px-4">
              <Heart className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="glass-card p-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-500" /> Fast, tracked delivery
            </div>
            <div className="glass-card p-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-500" /> Secure checkout
            </div>
          </div>

          {product.seller && (
            <div className="mt-6 glass-card p-4">
              <p className="text-xs text-slate-400 mb-1">Sold by</p>
              <p className="font-semibold">{product.seller.storeName || product.seller.name}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer reviews</h2>
        <ReviewList productId={product._id} />
      </div>

      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similar.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
