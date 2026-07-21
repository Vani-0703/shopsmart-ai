import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const STAGES = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/orders/seller/list").then(({ data }) => {
      setOrders(data.orders);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status, note: `Status updated to ${status}` });
      toast.success("Order status updated");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">No orders yet</div>
      ) : (
        orders.map((o) => (
          <div key={o._id} className="glass-card p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">Order #{o._id.slice(-6).toUpperCase()}</p>
              <p className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString()} · ${o.totalPrice?.toFixed(2)}</p>
            </div>
            <select
              value={o.currentStatus}
              onChange={(e) => updateStatus(o._id, e.target.value)}
              className="input-field !w-auto !py-2 text-sm capitalize"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        ))
      )}
    </div>
  );
};

export default SellerOrders;
