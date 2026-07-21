import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const SellerOverview = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/seller-analytics").then(({ data }) => setData(data.analytics));
  }, []);

  if (!data) return <LoadingSpinner />;

  const stats = [
    { label: "Total revenue", value: `$${data.totalRevenue.toFixed(2)}`, icon: DollarSign },
    { label: "Total orders", value: data.totalOrders, icon: ShoppingBag },
    { label: "Products listed", value: data.totalProducts, icon: Package },
    { label: "Top seller", value: data.topProducts[0]?.name || "—", icon: TrendingUp },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-5">
            <s.icon className="w-5 h-5 text-brand-500 mb-2" />
            <p className="text-xl font-bold truncate">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4">Top products by units sold</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.topProducts}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="numSold" fill="#7c3aed" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SellerOverview;
