import { useEffect, useState } from "react";
import api from "../services/api";

const SearchFilters = ({ filters, setFilters }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/products/meta/categories").then(({ data }) => setCategories(data.categories));
  }, []);

  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  return (
    <aside className="glass-card p-5 space-y-6 h-fit sticky top-24">
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => update("category", "")}
            className={`block text-sm w-full text-left px-3 py-1.5 rounded-lg ${
              !filters.category ? "bg-brand-100 dark:bg-brand-900 text-brand-600" : "hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            All categories
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => update("category", c._id)}
              className={`flex justify-between text-sm w-full text-left px-3 py-1.5 rounded-lg ${
                filters.category === c._id ? "bg-brand-100 dark:bg-brand-900 text-brand-600" : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{c._id}</span>
              <span className="text-slate-400">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            className="input-field !py-2 text-sm"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="input-field !py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Minimum rating</h3>
        <div className="flex gap-2">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => update("rating", filters.rating === r ? "" : r)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                filters.rating === r
                  ? "bg-accent-orange text-white border-accent-orange"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              {r}★+
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setFilters({ category: "", minPrice: "", maxPrice: "", rating: "", sort: "" })}
        className="btn-ghost w-full !py-2 text-sm"
      >
        Clear filters
      </button>
    </aside>
  );
};

export default SearchFilters;
