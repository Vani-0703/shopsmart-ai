import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const AddressForm = ({ address, setAddress }) => (
  <div className="glass-card p-6 space-y-3">
    <h2 className="font-semibold mb-2">Shipping address</h2>
    <input required placeholder="Address line 1" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} className="input-field" />
    <input placeholder="Address line 2 (optional)" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} className="input-field" />
    <div className="grid grid-cols-2 gap-3">
      <input required placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="input-field" />
      <input required placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="input-field" />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <input required placeholder="Postal code" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} className="input-field" />
      <input required placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="input-field" />
    </div>
  </div>
);

const PaymentForm = ({ address, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const { items, subtotal, clearCart } = useCart();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);

    const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: "if_required" });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    try {
      const { data } = await api.post("/orders", {
        items,
        shippingAddress: address,
        paymentMethod: "card",
        stripePaymentIntentId: paymentIntent.id,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: 0,
        totalPrice: total,
      });
      clearCart();
      onSuccess(data.order._id);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <h2 className="font-semibold flex items-center gap-2">
        <Lock className="w-4 h-4" /> Payment details
      </h2>
      <PaymentElement />
      <button type="submit" disabled={submitting} className="btn-gradient w-full">
        {submitting ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </button>
      <p className="text-xs text-slate-400 text-center">
        Test mode — use card number 4242 4242 4242 4242, any future date and CVC.
      </p>
    </form>
  );
};

const Checkout = () => {
  const { items, subtotal } = useCart();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [address, setAddress] = useState({ line1: "", line2: "", city: "", state: "", postalCode: "", country: "" });
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    api.post("/orders/create-payment-intent", { amount: Math.round(total * 100) }).then(({ data }) => {
      setClientSecret(data.clientSecret);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSuccess = (orderId) => {
    toast.success("Order placed successfully! 🎉");
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <AddressForm address={address} setAddress={setAddress} />
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
              <PaymentForm address={address} onSuccess={handleSuccess} />
            </Elements>
          ) : (
            <div className="glass-card p-6 text-center text-slate-400">Loading payment form...</div>
          )}
        </div>

        <div className="glass-card p-6 h-fit sticky top-24">
          <h2 className="font-semibold mb-4">Order summary</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
            {items.map((i) => (
              <div key={i.product} className="flex justify-between text-sm">
                <span className="text-slate-500">{i.name} × {i.quantity}</span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-500">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-slate-500">Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-4 border-t border-slate-200 dark:border-slate-700">
            <span>Total</span>
            <span className="gradient-text">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
