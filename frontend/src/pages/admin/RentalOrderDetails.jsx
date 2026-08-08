import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { adminOrderService } from "../../services/adminOrderService";
import StatusBadge from "../../components/admin/StatusBadge";
import OrderStatusActions from "../../components/admin/OrderStatusActions";
import OrderTimeline from "../../components/admin/OrderTimeline";
import DepositSummary from "../../components/admin/DepositSummary";
import PaymentSummary from "../../components/admin/PaymentSummary";
import PageLoadingFallback from "../../components/ui/PageLoadingFallback";
import Card from "../../components/ui/Card";

function RentalOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminOrderService.getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError(err.message || "Failed to load rental order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  if (loading) return <PageLoadingFallback />;

  if (error || !order) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-medium">{error || "Order not found"}</p>
        <button
          onClick={fetchOrderDetails}
          className="mt-4 font-semibold text-[#4f8c89] underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate rental duration in days
  const startDate = new Date(order.rentalStart);
  const endDate = new Date(order.rentalEnd);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  return (
    <div className="pb-16 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          >
            ←
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                Order {order.orderNumber || `#R${order.id.slice(-4)}`}
              </h2>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-0.5 text-xs text-gray-500">
              Created on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Workflow Actions */}
        <OrderStatusActions order={order} onOrderUpdated={fetchOrderDetails} />
      </div>

      {/* Visual Timeline */}
      <OrderTimeline order={order} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Order Details & Line Items */}
        <div className="space-y-6 lg:col-span-2">
          {/* Products & Line Items */}
          <Card className="p-6">
            <h3 className="mb-4 text-base font-semibold text-gray-900">Rental Line Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase text-gray-400">
                  <tr>
                    <th className="px-4 py-2.5">Item</th>
                    <th className="px-4 py-2.5">Variant</th>
                    <th className="px-4 py-2.5">Qty</th>
                    <th className="px-4 py-2.5">Unit Price</th>
                    <th className="px-4 py-2.5 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.lines?.map((line) => {
                    const product = line.variant?.product;
                    return (
                      <tr key={line.id}>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {product?.name || "Rental Product"}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {line.variant?.brand || line.variant?.color || "Standard"}
                        </td>
                        <td className="px-4 py-3">{line.quantity}</td>
                        <td className="px-4 py-3">₹{line.unitPrice}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          ₹{line.lineTotal || line.unitPrice * line.quantity}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Rental Duration Details */}
            <div className="mt-6 rounded-xl bg-gray-50 p-4 border border-gray-100 flex flex-wrap items-center justify-between text-xs">
              <div>
                <span className="text-gray-400">Pickup Type: </span>
                <span className="font-semibold text-gray-800">{order.pickupType?.replace(/_/g, " ")}</span>
              </div>
              <div>
                <span className="text-gray-400">Rental Period: </span>
                <span className="font-semibold text-gray-800">
                  {startDate.toLocaleDateString()} → {endDate.toLocaleDateString()} ({diffDays} Days)
                </span>
              </div>
            </div>
          </Card>

          {/* Pricing Calculation Summary */}
          <Card className="p-6">
            <h3 className="mb-4 text-base font-semibold text-gray-900">Pricing Breakdown</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Rental Subtotal</span>
                <span className="font-medium text-gray-900">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (18%)</span>
                <span className="font-medium text-gray-900">₹{order.taxTotal}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
                <span>Rental Total (Revenue)</span>
                <span className="text-[#4f8c89]">₹{order.total}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 pt-1">
                <span>+ Security Deposit (Held Separately)</span>
                <span>₹{order.deposit?.amountCollected || 0}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 Column: Customer, Deposit & Payments */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card className="p-6">
            <h3 className="mb-3 text-base font-semibold text-gray-900">Customer Details</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <p className="text-sm font-semibold text-gray-900">{order.customer?.name || "Customer"}</p>
              <p>Email: {order.customer?.email || "-"}</p>
              <p>Phone: {order.customer?.phone || "-"}</p>
              {order.shippingAddress && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <span className="font-medium text-gray-700">Delivery Address:</span>
                  <p className="text-gray-500">
                    {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Security Deposit Summary */}
          <DepositSummary deposit={order.deposit} />

          {/* Payment & Invoices */}
          <PaymentSummary order={order} onPaymentRecorded={fetchOrderDetails} />
        </div>
      </div>
    </div>
  );
}

export default RentalOrderDetails;
