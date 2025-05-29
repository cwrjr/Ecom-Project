import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CartItem, Product } from "@shared/schema";

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (cartItemId: number) => void;
  updateQuantity: (cartItemId: number, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [sessionId] = useState(() => {
    // Generate or retrieve session ID for cart persistence
    const existing = localStorage.getItem("cart-session-id");
    if (existing) return existing;
    const newId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("cart-session-id", newId);
    return newId;
  });

  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["/api/cart", sessionId],
    queryFn: () => fetch(`/api/cart/${sessionId}`, { credentials: "include" }).then(res => res.json()),
    enabled: !!sessionId,
  });

  // Fetch products to calculate totals
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: number; quantity: number; sessionId: string }) =>
      apiRequest("/api/cart", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (cartItemId: number) =>
      apiRequest(`/api/cart/${cartItemId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      apiRequest(`/api/cart/${cartItemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () =>
      apiRequest(`/api/cart/session/${sessionId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  // Calculate cart metrics
  const cartCount = cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  
  const cartTotal = cartItems.reduce((total: number, item: CartItem) => {
    const product = products.find((p: Product) => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  // Cart actions
  const addToCart = (productId: number, quantity: number = 1) => {
    addToCartMutation.mutate({ productId, quantity, sessionId });
  };

  const removeFromCart = (cartItemId: number) => {
    removeFromCartMutation.mutate(cartItemId);
  };

  const updateQuantity = (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      updateQuantityMutation.mutate({ cartItemId, quantity });
    }
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  const value: CartContextType = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}