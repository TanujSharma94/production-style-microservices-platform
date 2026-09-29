"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      return null;
    }
    setLoading(true);
    try {
      const res = await apiRequest("/api/cart", { token });
      setCart(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, [token]);

  async function addToCart(productId, quantity = 1) {
    await apiRequest("/api/cart/items", {
      method: "POST",
      token,
      body: { productId, quantity },
    });
    return refreshCart();
  }

  async function updateItem(productId, quantity) {
    await apiRequest(`/api/cart/items/${productId}`, {
      method: "PUT",
      token,
      body: { quantity },
    });
    return refreshCart();
  }

  async function removeItem(productId) {
    await apiRequest(`/api/cart/items/${productId}`, {
      method: "DELETE",
      token,
    });
    return refreshCart();
  }

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const value = {
    cart,
    loading,
    itemCount,
    refreshCart,
    addToCart,
    updateItem,
    removeItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
