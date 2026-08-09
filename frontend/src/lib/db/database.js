import Dexie from "dexie";

export const db = new Dexie("RentEaseCatalogDB");

// Define IndexedDB tables and indexes
db.version(1).stores({
  products: "id, categoryId, vendorId, isRentable, cachedAt",
  categories: "id, name, cachedAt",
  cacheMeta: "key, updatedAt",
});

db.version(2).stores({
  products: "id, categoryId, vendorId, isRentable, cachedAt",
  categories: "id, name, cachedAt",
  cacheMeta: "key, updatedAt",
  offlineQueue: "++id, action, endpoint, timestamp, status",
  drafts: "id, type, updatedAt",
});

// Immediately open database connection on app startup
db.open().catch((err) => {
  console.warn("IndexedDB initialization warning:", err);
});
