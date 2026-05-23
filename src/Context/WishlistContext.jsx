import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem("zaptro-wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("zaptro-wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isWishlisted = (id) =>
    wishlistItems.some((item) => item.id === id);

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        toast("Removed from wishlist", { icon: "💔" });
        return prev.filter((item) => item.id !== product.id);
      } else {
        toast.success("Added to wishlist!", { icon: "❤️" });
        return [...prev, product];
      }
    });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, toggleWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
