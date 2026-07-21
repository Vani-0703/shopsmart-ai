import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import SearchFilters from "../components/SearchFilters";
import { SlidersHorizontal } from "lucide-react";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    sort: searchParams.get("sort") || "",
  });

  useEffect(() => {
    setLoading(true);
    const params = { ...filters, page, limit: 12, keyword: searchParams.get("keyword") || "" };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);

    api.get("/products", { params }).then(({ data }) => {
      setProducts(data.products);
      setPages(data.pages);
      setLoading(false);
    });
  }, [filters, page, searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {searchParams.get("keyword") ? `Results for "${searchParams.get("keyword")}"` : "All products"}
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
            className="input-field !py-2 !w-auto text-sm"
          >
            <option value="">Sort: Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="popular">Best Selling</option>
          </select>
          <button onClick={() => setShowFilters((v) => !v)} className="lg:hidden btn-ghost !py-2 !px-3">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <SearchFilters filters={filters} setFilters={setFilters} />
        </div>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="skeleton aspect-square" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-400">
              No products found. Try adjusting your filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold ${
                        page === i + 1 ? "bg-sunset-gradient text-white" : "border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
