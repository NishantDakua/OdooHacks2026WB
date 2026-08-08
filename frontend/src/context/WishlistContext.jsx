import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "wishlist";

function readStoredWishlist() {
  try {
    const storedWishlist = localStorage.getItem(STORAGE_KEY);
    const parsedWishlist = storedWishlist ? JSON.parse(storedWishlist) : [];

    return Array.isArray(parsedWishlist) ? parsedWishlist : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(readStoredWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    if (!product?.id) {
      return;
    }

    setWishlistItems((previous) => {
      if (previous.some((item) => item.id === product.id)) {
        return previous;
      }

      return [...previous, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((previous) =>
      previous.filter((item) => item.id !== productId)
    );
  };

  const toggleWishlist = (product) => {
    if (!product?.id) {
      return;
    }

    setWishlistItems((previous) => {
      const isAlreadySaved = previous.some((item) => item.id === product.id);

      if (isAlreadySaved) {
        return previous.filter((item) => item.id !== product.id);
      }

      return [...previous, product];
    });
  };

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item.id === productId);

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    }),
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}