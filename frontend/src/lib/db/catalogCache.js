import { db } from "./database";

const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

/**
 * Checks if a cache key is still valid according to TTL.
 * @param {string} key - Cache metadata key
 * @param {number} [ttlMs=DEFAULT_TTL_MS] - TTL in milliseconds
 * @returns {Promise<boolean>}
 */
export async function isCacheValid(key, ttlMs = DEFAULT_TTL_MS) {
  try {
    const meta = await db.cacheMeta.get(key);
    if (!meta || !meta.updatedAt) return false;
    return Date.now() - meta.updatedAt < ttlMs;
  } catch (error) {
    console.warn("IndexedDB cache check warning:", error);
    return false;
  }
}

/**
 * Retrieves cached products from IndexedDB.
 * @returns {Promise<Array|null>}
 */
export async function getCachedProducts() {
  try {
    const products = await db.products.toArray();
    return products.length > 0 ? products : null;
  } catch (error) {
    console.warn("Failed to read products from IndexedDB:", error);
    return null;
  }
}

/**
 * Stores product catalog items into IndexedDB.
 * @param {Array} products - List of product objects
 */
export async function setCachedProducts(products) {
  if (!Array.isArray(products)) return;
  try {
    const now = Date.now();
    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      categoryId: p.categoryId || p.category?.id || null,
      brand: p.brand,
      color: p.color,
      duration: p.duration,
      price: p.price,
      image: p.image,
      quantityAvailable: p.quantityAvailable,
      description: p.description,
      options: p.options || [],
      cachedAt: now,
    }));

    await db.transaction("rw", db.products, db.cacheMeta, async () => {
      await db.products.clear();
      await db.products.bulkPut(formatted);
      await db.cacheMeta.put({ key: "products_meta", updatedAt: now });
    });
  } catch (error) {
    console.warn("Failed to write products to IndexedDB:", error);
  }
}

/**
 * Retrieves cached categories from IndexedDB.
 * @returns {Promise<Array|null>}
 */
export async function getCachedCategories() {
  try {
    const categories = await db.categories.toArray();
    return categories.length > 0 ? categories : null;
  } catch (error) {
    console.warn("Failed to read categories from IndexedDB:", error);
    return null;
  }
}

/**
 * Stores category items into IndexedDB.
 * @param {Array} categories - List of category objects
 */
export async function setCachedCategories(categories) {
  if (!Array.isArray(categories)) return;
  try {
    const now = Date.now();
    const formatted = categories.map((c) => ({
      ...c,
      cachedAt: now,
    }));

    await db.transaction("rw", db.categories, db.cacheMeta, async () => {
      await db.categories.clear();
      await db.categories.bulkPut(formatted);
      await db.cacheMeta.put({ key: "categories_meta", updatedAt: now });
    });
  } catch (error) {
    console.warn("Failed to write categories to IndexedDB:", error);
  }
}

/**
 * Clears cached product items and metadata from IndexedDB to force cache refresh.
 */
export async function clearCachedProducts() {
  try {
    await db.transaction("rw", db.products, db.cacheMeta, async () => {
      await db.products.clear();
      await db.cacheMeta.delete("products_meta");
    });
  } catch (error) {
    console.warn("Failed to clear cached products:", error);
  }
}
