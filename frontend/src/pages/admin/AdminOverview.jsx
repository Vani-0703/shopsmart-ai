import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { DollarSign, Users, Package, ShoppingBag } from "lucide-react";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminOverview = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics").then(({ data }) => setData(data.analytics));
  }, []);

  if (!data) return <LoadingSpinner />;

  const stats = [
    { label: "Total revenue", value: `$${data.totalRevenue.toFixed(2)}`, icon: DollarSign },
    { label: "Customers", value: data.totalUsers, icon: Users },
    { label: "Sellers", value: data.totalSellers, icon: Users },
    { label: "Total orders", value: data.totalOrders, icon: ShoppingBag },
    { label: "Products listed", value: data.totalProducts, icon: Package },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-5">
            <s.icon className="w-5 h-5 text-brand-500 mb-2" />
            <p className="text-xl font-bold truncate">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4">Revenue over time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.salesByDay}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminOverview;
