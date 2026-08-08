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

export const adminOrderService = {
  // Rental Orders
  async getOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append("status", params.status);
    if (params.search) query.append("search", params.search);
    if (params.customerId) query.append("customerId", params.customerId);

    const res = await fetch(`${API_BASE_URL}/rentals?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getOrderById(id) {
    const res = await fetch(`${API_BASE_URL}/rentals/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createOrder(orderData) {
    const res = await fetch(`${API_BASE_URL}/rentals`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(res);
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/rentals/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  // Invoices & Payments
  async createInvoice(invoiceData) {
    const res = await fetch(`${API_BASE_URL}/invoices`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(invoiceData),
    });
    return handleResponse(res);
  },

  async recordPayment(paymentData) {
    const res = await fetch(`${API_BASE_URL}/invoices/payment`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });
    return handleResponse(res);
  },

  async getOrderInvoices(orderId) {
    const res = await fetch(`${API_BASE_URL}/invoices/order/${orderId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Deposits
  async settleDeposit(depositId, data) {
    const res = await fetch(`${API_BASE_URL}/deposits/${depositId}/settle`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async refundDeposit(depositId) {
    const res = await fetch(`${API_BASE_URL}/deposits/${depositId}/refund`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Supporting Data
  async getCustomers() {
    const res = await fetch(`${API_BASE_URL}/users/customers`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getProducts() {
    const res = await fetch(`${API_BASE_URL}/products`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
