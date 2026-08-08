import { useState } from "react";
import Card from "../ui/Card";
import StatusBadge from "./StatusBadge";
import Modal from "../ui/Modal";
import { adminOrderService } from "../../services/adminOrderService";

function PaymentSummary({ order, onPaymentRecorded }) {
  const [openModal, setOpenModal] = useState(false);
  const [method, setMethod] = useState("UPI");
  const [amount, setAmount] = useState(order?.total || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const invoices = order?.invoices || [];
  // Calculate total paid across all payments in invoices
  const allPayments = invoices.flatMap((inv) => inv.payments || []);
  const totalPaid = allPayments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const orderTotal = Number(order?.total || 0);
  const outstanding = Math.max(0, orderTotal - totalPaid);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await adminOrderService.recordPayment({
        orderId: order.id,
        invoiceId: invoices[0]?.id || null,
        method,
        amount: Number(amount),
      });
      setOpenModal(false);
      if (onPaymentRecorded) onPaymentRecorded();
    } catch (err) {
      setError(err.message || "Failed to record payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Payment & Invoices</h3>
          <p className="text-[11px] text-gray-500">Official billing and payments</p>
        </div>
        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="rounded-lg bg-[#4f8c89] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#3d726f]"
        >
          + Record Payment
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs mb-4">
        <div>
          <span className="text-gray-500">Order Total:</span>
          <p className="font-bold text-gray-900 text-sm">₹{orderTotal.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-gray-500">Total Paid:</span>
          <p className="font-bold text-emerald-600 text-sm">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-gray-500">Outstanding:</span>
          <p className={`font-bold text-sm ${outstanding > 0 ? "text-amber-600" : "text-gray-400"}`}>
            ₹{outstanding.toLocaleString()}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Payment Status:</span>
          <div className="mt-0.5">
            <StatusBadge status={totalPaid >= orderTotal && orderTotal > 0 ? "PAID" : totalPaid > 0 ? "PARTIALLY_PAID" : "UNPAID"} />
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="border-t border-gray-100 pt-3">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Invoices</h4>
        {invoices.length === 0 ? (
          <p className="text-xs text-gray-400">No invoices issued yet.</p>
        ) : (
          <div className="space-y-2">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 text-xs">
                <div>
                  <span className="font-semibold text-gray-900">{inv.invoiceNumber}</span>
                  <span className="ml-2 text-gray-400">({inv.type})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">₹{inv.amount}</span>
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <Modal open={openModal} title="Record Payment" onClose={() => setOpenModal(false)}>
        <form onSubmit={handleRecordPayment} className="space-y-4 text-sm text-gray-700">
          {error && <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-600">{error}</div>}

          <div>
            <label className="block text-xs font-medium text-gray-700">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 p-2 text-sm outline-none focus:border-[#4f8c89]"
            >
              <option value="UPI">UPI</option>
              <option value="CARD">Credit / Debit Card</option>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Amount Received (₹)</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 p-2 text-sm outline-none focus:border-[#4f8c89]"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#4f8c89] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3d726f] disabled:opacity-50"
            >
              {loading ? "Recording..." : "Save Payment"}
            </button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}

export default PaymentSummary;
