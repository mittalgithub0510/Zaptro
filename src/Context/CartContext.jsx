import React, { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  // =============================
  // PERSISTENT CART STATE
  // =============================
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("zaptro-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage on every change
  useEffect(() => {
    localStorage.setItem("zaptro-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // =============================
  // CART FUNCTIONS
  // =============================

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        toast.success(`"${product.name || product.title}" quantity updated!`);
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast.success(`"${product.name || product.title}" added to cart!`);
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== id)
    );
    toast("Item removed from cart", { icon: "🗑️" });
  };

  const increaseQty = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // =============================
  // BILLING LOGIC (CENTRALIZED)
  // =============================

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + (item.priceCents / 100) * item.quantity,
    0
  );

  const tax = totalPrice * 0.05;

  // Free delivery above ₹500
  const delivery = totalPrice > 500 ? 0 : 50;

  const finalTotal = totalPrice + tax + delivery;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        totalQuantity,
        totalPrice,
        tax,
        delivery,
        finalTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};