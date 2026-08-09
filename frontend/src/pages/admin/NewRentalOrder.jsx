import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminOrderService } from "../../services/adminOrderService";
import Card from "../../components/ui/Card";
import PageLoadingFallback from "../../components/ui/PageLoadingFallback";

import { saveFormDraft, getFormDraft } from "../../lib/db/offlineSync";

function NewRentalOrder() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [customerId, setCustomerId] = useState("");
  const [pickupType, setPickupType] = useState("STORE_PICKUP");
  const [rentalStart, setRentalStart] = useState("");
  const [rentalEnd, setRentalEnd] = useState("");
  const [status, setStatus] = useState("DRAFT");
  
  // Line items
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);

  // Deposit
  const [depositType, setDepositType] = useState("FIXED");
  const [depositAmount, setDepositAmount] = useState(1000);

  // Restore saved draft on initial mount
  useEffect(() => {
    async function restoreDraft() {
      const draft = await getFormDraft("new_rental_order_draft");
      if (draft) {
        if (draft.customerId) setCustomerId(draft.customerId);
        if (draft.pickupType) setPickupType(draft.pickupType);
        if (draft.rentalStart) setRentalStart(draft.rentalStart);
        if (draft.rentalEnd) setRentalEnd(draft.rentalEnd);
        if (draft.status) setStatus(draft.status);
        if (draft.quantity) setQuantity(draft.quantity);
        if (draft.depositAmount) setDepositAmount(draft.depositAmount);
      }
    }
    restoreDraft();
  }, []);

  // Auto-save form draft to IndexedDB when user modifies form inputs
  useEffect(() => {
    if (!loading && customerId) {
      saveFormDraft("new_rental_order_draft", "rental_order", {
        customerId,
        pickupType,
        rentalStart,
        rentalEnd,
        status,
        quantity,
        depositAmount,
      });
    }
  }, [customerId, pickupType, rentalStart, rentalEnd, status, quantity, depositAmount, loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customerList, productList] = await Promise.all([
          adminOrderService.getCustomers(),
          adminOrderService.getProducts(),
        ]);
        setCustomers(customerList || []);
        setProducts(productList || []);
        
        if (customerList?.length > 0) setCustomerId(customerList[0].id);
        if (productList?.length > 0) {
          const firstProd = productList[0];
          setSelectedProductId(firstProd.id);
          const firstVariant = firstProd.variants?.[0];
          if (firstVariant) {
            setSelectedVariantId(firstVariant.id);
            setUnitPrice(Number(firstVariant.price || firstProd.rentalPrice || 500));
          }
        }

        // Default rental dates (Today -> Tomorrow)
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 3);
        setRentalStart(today.toISOString().split("T")[0]);
        setRentalEnd(tomorrow.toISOString().split("T")[0]);
      } catch (err) {
        setError(err.message || "Failed to load customers or products.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProductChange = (e) => {
    const prodId = e.target.value;
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    const variant = prod?.variants?.[0];
    if (variant) {
      setSelectedVariantId(variant.id);
      setUnitPrice(Number(variant.price || prod.rentalPrice || 500));
    }
  };

  // Pricing calculations
  const subtotal = Number(unitPrice) * Number(quantity);
  const taxTotal = subtotal * 0.18;
  const total = subtotal + taxTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId || !selectedVariantId || !rentalStart || !rentalEnd) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const orderPayload = {
        customerId,
        pickupType,
        rentalStart: new Date(rentalStart).toISOString(),
        rentalEnd: new Date(rentalEnd).toISOString(),
        status,
        lines: [
          {
            variantId: selectedVariantId,
            quantity: Number(quantity),
            unitPrice: Number(unitPrice),
          },
        ],
        depositAmount: Number(depositAmount),
        depositAmountType: depositType,
      };

      const createdOrder = await adminOrderService.createOrder(orderPayload);
      if (createdOrder?.id) {
        navigate(`/admin/orders/${createdOrder.id}`);
      } else {
        navigate("/admin/orders");
      }
    } catch (err) {
      setError(err.message || "Failed to create rental order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoadingFallback />;

  return (
    <div className="pb-16 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50"
          >
            ←
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Rental Order</h2>
            <p className="mt-0.5 text-xs text-gray-500">Create a rental quotation or confirmed order.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Type Section */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-gray-900 text-sm">Customer & Order Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">Customer</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Pickup / Delivery Method</label>
              <select
                value={pickupType}
                onChange={(e) => setPickupType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              >
                <option value="STORE_PICKUP">Store Pickup</option>
                <option value="DELIVERY">Direct Delivery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Rental Start Date</label>
              <input
                type="date"
                value={rentalStart}
                onChange={(e) => setRentalStart(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Rental End Date</label>
              <input
                type="date"
                value={rentalEnd}
                onChange={(e) => setRentalEnd(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              >
                <option value="DRAFT">Quotation (Draft)</option>
                <option value="CONFIRMED">Confirmed Order</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Product & Variant Line Item */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-gray-900 text-sm">Product Line Item</h3>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700">Product</label>
              <select
                value={selectedProductId}
                onChange={handleProductChange}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Unit Price (₹)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              />
            </div>
          </div>
        </Card>

        {/* Security Deposit & Totals */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-gray-900 text-sm">Security Deposit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">Deposit Type</label>
                <select
                  value={depositType}
                  onChange={(e) => setDepositType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
                >
                  <option value="FIXED">Fixed Amount (₹)</option>
                  <option value="PERCENTAGE">Percentage of Total (%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  {depositType === "FIXED" ? "Deposit Amount (₹)" : "Deposit Percentage (%)"}
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between">
            <h3 className="mb-4 font-semibold text-gray-900 text-sm">Order Summary</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (18%):</span>
                <span>₹{taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900">
                <span>Rental Total:</span>
                <span className="text-[#4f8c89]">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>+ Security Deposit:</span>
                <span>₹{depositAmount}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Link
                to="/admin/orders"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[#4f8c89] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#3d726f] disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Order"}
              </button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}

export default NewRentalOrder;
