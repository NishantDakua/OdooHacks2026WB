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

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    return localStorage.getItem("appliedCoupon") || "";
  });

  const [checkoutData, setCheckoutData] = useState(() => {
    try {
      const saved = localStorage.getItem("checkoutData");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("appliedCoupon", appliedCoupon);
  }, [appliedCoupon]);

  useEffect(() => {
    if (checkoutData) {
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    } else {
      localStorage.removeItem("checkoutData");
    }
  }, [checkoutData]);

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
    (total, item) => {
      const duration = Number(item.configuration?.["Rental Duration"]) || 1;
      return total + item.product.price * item.quantity * duration;
    },
    0
  );

  // Security Deposit: ₹1,500 per item quantity (refundable collateral)
  const depositTotal = cart.reduce(
    (total, item) => {
      const itemDeposit = item.product.deposit || 1500;
      return total + itemDeposit * item.quantity;
    },
    0
  );

  const taxAmount = Math.round(cartTotal * 0.18); // 18% GST

  const applyCoupon = (code) => {
    if (code.toUpperCase() === "RENTEASE10") {
      setAppliedCoupon("RENTEASE10");
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon("");
  };

  const isCouponApplied = appliedCoupon === "RENTEASE10";
  const discountAmount = isCouponApplied ? Math.round(cartTotal * 0.1) : 0;
  const rentalSubtotal = Math.max(cartTotal - discountAmount, 0);
  const finalTotal = rentalSubtotal + taxAmount + depositTotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        depositTotal,
        taxAmount,
        rentalSubtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        finalTotal,
        checkoutData,
        setCheckoutData,
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