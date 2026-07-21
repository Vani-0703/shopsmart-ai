import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const STORAGE_KEY = "shopsmart_cart";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          seller: product.seller?._id || product.seller,
          name: product.name,
          image: product.images?.[0]?.url,
          price: product.discountPrice || product.price,
          stock: product.stock,
          quantity,
        },
      ];
    });
    toast.success(`${product.name} added to cart 🛒`);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.product === productId ? { ...i, quantity } : i)));
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.product !== productId));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
