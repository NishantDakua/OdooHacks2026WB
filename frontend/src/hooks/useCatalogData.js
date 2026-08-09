import { useEffect, useState, useCallback, useRef } from "react";
import { getCachedProducts, setCachedProducts } from "../lib/db/catalogCache";

// In-memory request deduplication map
const inFlightRequests = new Map();

/**
 * Deduplicated fetch helper to prevent duplicate simultaneous API network calls.
 * @param {string} url - API Endpoint URL
 * @returns {Promise<any>}
 */
async function deduplicatedFetch(url) {
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url);
  }

  const promise = fetch(url)
    .then((res) => res.json())
    .finally(() => {
      inFlightRequests.delete(url);
    });

  inFlightRequests.set(url, promise);
  return promise;
}

/**
 * Custom Hook for Stale-While-Revalidate (SWR) catalog data loading with IndexedDB.
 */
export function useCatalogData() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [error, setError] = useState("");
  const isMountedRef = useRef(true);

  const fetchFromBackend = useCallback(async () => {
    try {
      setIsRevalidating(true);
      const json = await deduplicatedFetch("http://localhost:5000/api/v1/products");

      if (json.success && Array.isArray(json.data)) {
        const formatted = json.data.map((item) => {
          const variant = item.variants?.[0] || {};
          const rule = item.pricelistRules?.[0] || {};
          return {
            id: item.id,
            name: item.name,
            category: item.category?.name || "General",
            brand: variant.brand || "Standard",
            color: variant.color || "Standard",
            duration: rule.durationUnit === "MONTHLY" ? "Monthly" : "Daily",
            price: Number(rule.price || 500),
            image:
              item.images?.[0] ||
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
            quantityAvailable: variant.quantityAvailable || 0,
            description: item.description || "",
            options: item.options || [],
          };
        });

        if (isMountedRef.current) {
          setProducts(formatted);
          setError("");
        }

        // Asynchronously update IndexedDB read cache
        await setCachedProducts(formatted);
      }
    } catch (err) {
      if (isMountedRef.current) {
        // If we have cached products, keep them visible instead of throwing
        console.warn("Backend catalog fetch failed, relying on cached state:", err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setIsRevalidating(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    async function loadCatalog() {
      // Step 1: Read from IndexedDB cache
      const cached = await getCachedProducts();

      if (cached && cached.length > 0 && isMountedRef.current) {
        setProducts(cached);
        setLoading(false); // Instant render from IndexedDB!
      }

      // Step 2: Background revalidation from backend API
      fetchFromBackend();
    }

    loadCatalog();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchFromBackend]);

  return {
    products,
    loading,
    isRevalidating,
    error,
    refresh: fetchFromBackend,
  };
}
