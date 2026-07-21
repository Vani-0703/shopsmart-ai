import { useState } from "react";
import { LayoutGrid, Users, ShieldCheck } from "lucide-react";
import AdminOverview from "./admin/AdminOverview";
import AdminUsers from "./admin/AdminUsers";

const tabs = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "users", label: "Users & sellers", icon: Users },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState("overview");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-8">
        <ShieldCheck className="w-6 h-6 text-brand-500" />
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
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

      {tab === "overview" && <AdminOverview />}
      {tab === "users" && <AdminUsers />}
    </div>
  );
};

export default AdminDashboard;
