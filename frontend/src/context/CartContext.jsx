import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, configuration = {}) => {
    setCart((previous) => {
      const existingIndex = previous.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.configuration) ===
            JSON.stringify(configuration)
      );

      if (existingIndex !== -1) {
        return previous.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...previous,
        {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          configuration,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((previous) =>
      previous.filter((item) => item.id !== cartItemId)
    );
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) return;

    setCart((previous) =>
      previous.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}