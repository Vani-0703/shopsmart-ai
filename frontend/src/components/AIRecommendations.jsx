import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "./ProductCard";

const AIRecommendations = ({ title = "Picked for you by AI" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    api
      .get("/ai/recommendations")
      .then(({ data }) => setProducts(data.recommendations))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated || (!loading && products.length === 0)) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-xl bg-ocean-gradient flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton aspect-square" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};

export default AIRecommendations;
