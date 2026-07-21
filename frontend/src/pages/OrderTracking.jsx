import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, Circle, Package } from "lucide-react";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const STAGES = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => {
      setOrder(data.order);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  const currentIndex = STAGES.indexOf(order.currentStatus);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold">Order #{order._id.slice(-6).toUpperCase()}</h1>
          <span className="badge bg-brand-100 text-brand-600 dark:bg-brand-900 capitalize">
            {order.currentStatus.replace(/_/g, " ")}
          </span>
        </div>
        <p className="text-sm text-slate-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      {order.currentStatus !== "cancelled" && (
        <div className="glass-card p-6 mb-8">
          <h2 className="font-semibold mb-6 flex items-center gap-2">
            <Package className="w-5 h-5" /> Tracking progress
          </h2>
          <div className="space-y-6">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex items-center gap-3">
                {i <= currentIndex ? (
                  <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300 shrink-0" />
                )}
                <span className={`capitalize ${i <= currentIndex ? "font-semibold" : "text-slate-400"}`}>
                  {stage.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card p-6 mb-8">
        <h2 className="font-semibold mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
              </div>
              <span className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-semibold mb-3">Shipping address</h2>
        <p className="text-sm text-slate-500">
          {order.shippingAddress?.line1}, {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
          {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
        </p>
        <div className="flex justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 font-bold">
          <span>Total paid</span>
          <span className="gradient-text">${order.totalPrice?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
