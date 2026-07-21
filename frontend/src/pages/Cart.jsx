import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn-gradient">
          Browse products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Your cart</h1>
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product} className="glass-card p-4 flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-brand-500 font-bold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl">
                <button onClick={() => updateQuantity(item.product, item.quantity - 1)} className="p-2">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => removeFromCart(item.product)} className="text-red-400 hover:text-red-500 p-2">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 h-fit sticky top-24">
          <h2 className="font-semibold mb-4">Order summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-500">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-slate-500">Shipping</span>
            <span>{subtotal > 50 ? "Free" : "$5.99"}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <span>Total</span>
            <span className="gradient-text">${(subtotal + (subtotal > 50 ? 0 : 5.99)).toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn-gradient w-full">
            Proceed to checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
