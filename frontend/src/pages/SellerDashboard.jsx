import { useState } from "react";
import { LayoutGrid, Package, ShoppingBag, BarChart3 } from "lucide-react";
import SellerOverview from "./seller/SellerOverview";
import SellerProducts from "./seller/SellerProducts";
import SellerOrders from "./seller/SellerOrders";

const tabs = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingBag },
];

const SellerDashboard = () => {
  const [tab, setTab] = useState("overview");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-8">
        <BarChart3 className="w-6 h-6 text-brand-500" />
        <h1 className="text-2xl font-bold">Seller dashboard</h1>
      </div>

      <div className="flex gap-2 mb-8 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key ? "border-brand-500 text-brand-600" : "border-transparent text-slate-500"
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <SellerOverview />}
      {tab === "products" && <SellerProducts />}
      {tab === "orders" && <SellerOrders />}
    </div>
  );
};

export default SellerDashboard;
