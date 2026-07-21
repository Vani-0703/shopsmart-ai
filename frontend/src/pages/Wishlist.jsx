import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/wishlist").then(({ data }) => {
      setProducts(data.products);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Your wishlist</h1>
      {products.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <Heart className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          Nothing saved yet. Tap the heart icon on any product to add it here.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
