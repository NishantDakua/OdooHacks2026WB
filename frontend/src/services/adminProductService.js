import { clearCachedProducts } from "../lib/db/catalogCache";

const API_BASE_URL = "http://localhost:5000/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "An error occurred during API request");
  }
  return json.data;
};

export const adminProductService = {
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.categoryId) query.append("categoryId", params.categoryId);
    if (params.search) query.append("search", params.search);
    if (params.isRentable !== undefined && params.isRentable !== "") {
      query.append("isRentable", params.isRentable);
    }

    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const result = await handleResponse(res);
    await clearCachedProducts();
    return result;
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const result = await handleResponse(res);
    await clearCachedProducts();
    return result;
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const result = await handleResponse(res);
    await clearCachedProducts();
    return result;
  },

  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/products/categories`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createCategory(name) {
    const res = await fetch(`${API_BASE_URL}/products/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return handleResponse(res);
  },

  async uploadImage(formData) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/products/upload-image`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    return handleResponse(res);
  },
};
