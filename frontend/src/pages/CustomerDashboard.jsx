import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Bell } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const statusColors = {
  placed: "bg-slate-100 text-slate-600",
  confirmed: "bg-blue-100 text-blue-600",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-600",
  out_for_delivery: "bg-orange-100 text-orange-600",
  delivered: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-600",
};

const CustomerDashboard = () => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/orders/mine"), api.get("/notifications")]).then(([o, n]) => {
      setOrders(o.data.orders);
      setNotifications(n.data.notifications);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-1">Hi {profile?.name?.split(" ")[0]} 👋</h1>
      <p className="text-slate-500 mb-8">Here's what's happening with your orders</p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" /> Order history
          </h2>
          {orders.length === 0 ? (
            <div className="glass-card p-10 text-center text-slate-400">No orders yet — go find something you love!</div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <Link key={o._id} to={`/orders/${o._id}`} className="glass-card p-4 flex items-center justify-between block hover:shadow-glow transition-shadow">
                  <div>
                    <p className="font-semibold text-sm">Order #{o._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${o.totalPrice?.toFixed(2)}</p>
                    <span className={`badge ${statusColors[o.currentStatus]} capitalize`}>{o.currentStatus.replace(/_/g, " ")}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" /> Notifications
          </h2>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="glass-card p-6 text-center text-slate-400 text-sm">No notifications yet</div>
            ) : (
              notifications.slice(0, 8).map((n) => (
                <div key={n._id} className={`glass-card p-3 text-sm ${!n.isRead ? "border-l-4 border-brand-500" : ""}`}>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-slate-500 text-xs">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
