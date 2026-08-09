import { useState } from "react";
import { adminOrderService } from "../../services/adminOrderService";
import Modal from "../ui/Modal";
import { queueOfflineAction } from "../../lib/db/offlineSync";

function OrderStatusActions({ order, onOrderUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [confirmModal, setConfirmModal] = useState({ open: false, targetStatus: null, title: "", message: "" });
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [settleModal, setSettleModal] = useState(false);
  const [deductions, setDeductions] = useState({ lateFee: 0, damage: 0, other: 0, notes: "" });

  const status = order?.status;

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");

      if (!navigator.onLine) {
        await queueOfflineAction({
          action: `Update Order Status to ${newStatus}`,
          endpoint: `http://localhost:5000/api/v1/rentals/${order.id}/status`,
          method: "PATCH",
          payload: { status: newStatus },
        });
        setSuccessMsg("⚡ Offline: Action queued locally. Will sync when back online.");
        setConfirmModal({ open: false, targetStatus: null, title: "", message: "" });
        return;
      }

      await adminOrderService.updateOrderStatus(order.id, newStatus);
      setConfirmModal({ open: false, targetStatus: null, title: "", message: "" });
      if (onOrderUpdated) onOrderUpdated();
    } catch (err) {
      setError(err.message || "Failed to update order status.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      setLoading(true);
      setError("");
      await adminOrderService.createInvoice({
        orderId: order.id,
        type: "RENTAL",
        amount: order.subtotal || order.total,
        taxAmount: order.taxTotal || 0,
      });
      setInvoiceModal(false);
      if (onOrderUpdated) onOrderUpdated();
    } catch (err) {
      setError(err.message || "Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleSettleAndRefund = async () => {
    if (!order?.deposit?.id) return;
    try {
      setLoading(true);
      setError("");
      await adminOrderService.settleDeposit(order.deposit.id, {
        lateFeeDeducted: deductions.lateFee,
        damageDeducted: deductions.damage,
        otherDeductions: deductions.other,
        notes: deductions.notes,
      });
      await adminOrderService.refundDeposit(order.deposit.id);
      setSettleModal(false);
      if (onOrderUpdated) onOrderUpdated();
    } catch (err) {
      setError(err.message || "Failed to settle deposit.");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmation = (targetStatus, title, message) => {
    setConfirmModal({ open: true, targetStatus, title, message });
  };

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* DRAFT / QUOTATION */}
        {status === "DRAFT" && (
          <>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleStatusChange("QUOTATION_SENT")}
              className="rounded-lg bg-[#4f8c89] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#3d726f] disabled:opacity-50"
            >
              Send Quotation
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => openConfirmation("CONFIRMED", "Confirm Order", "Are you sure you want to confirm this quotation into a Rental Order?")}
              className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-50"
            >
              Confirm Order
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => openConfirmation("CANCELLED", "Cancel Order", "Are you sure you want to cancel this quotation?")}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        )}

        {/* QUOTATION_SENT */}
        {status === "QUOTATION_SENT" && (
          <>
            <button
              type="button"
              disabled={loading}
              onClick={() => openConfirmation("CONFIRMED", "Confirm Order", "Confirm this quotation into a live rental order?")}
              className="rounded-lg bg-[#4f8c89] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#3d726f] disabled:opacity-50"
            >
              Confirm Order
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => openConfirmation("CANCELLED", "Cancel Quotation", "Are you sure you want to cancel this quotation?")}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        )}

        {/* CONFIRMED */}
        {status === "CONFIRMED" && (
          <>
            <button
              type="button"
              disabled={loading}
              onClick={() => setInvoiceModal(true)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
            >
              Create Invoice
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => openConfirmation("PICKED_UP", "Mark Picked Up", "Mark order as picked up? This will decrement product stock and hold the deposit.")}
              className="rounded-lg bg-[#4f8c89] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#3d726f] disabled:opacity-50"
            >
              Mark Picked Up
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => openConfirmation("CANCELLED", "Cancel Rental", "Cancel this confirmed rental order?")}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        )}

        {/* READY_FOR_PICKUP */}
        {status === "READY_FOR_PICKUP" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => openConfirmation("PICKED_UP", "Mark Picked Up", "Confirm that the customer has collected the product items?")}
            className="rounded-lg bg-[#4f8c89] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#3d726f] disabled:opacity-50"
          >
            Mark Picked Up
          </button>
        )}

        {/* PICKED_UP / ACTIVE */}
        {status === "PICKED_UP" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => openConfirmation("RETURNED", "Mark Returned", "Confirm that all product units have been returned to inventory?")}
            className="rounded-lg bg-[#4f8c89] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#3d726f] disabled:opacity-50"
          >
            Mark as Returned
          </button>
        )}

        {/* RETURNED */}
        {status === "RETURNED" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => setSettleModal(true)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            Settle Deposit & Complete Order
          </button>
        )}

        {/* CLOSED / CANCELLED */}
        {(status === "CLOSED" || status === "CANCELLED") && (
          <span className="text-xs font-medium text-gray-500 italic">
            Order is {status.toLowerCase()}. No further actions available.
          </span>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal open={confirmModal.open} title={confirmModal.title} onClose={() => setConfirmModal({ open: false })}>
        <p className="text-sm text-gray-600">{confirmModal.message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmModal({ open: false })}
            className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleStatusChange(confirmModal.targetStatus)}
            className="rounded-lg bg-[#4f8c89] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3d726f] disabled:opacity-50"
          >
            {loading ? "Updating..." : "Confirm"}
          </button>
        </div>
      </Modal>

      {/* Create Invoice Modal */}
      <Modal open={invoiceModal} title="Generate Rental Invoice" onClose={() => setInvoiceModal(false)}>
        <p className="text-sm text-gray-600">
          This will generate an official tax invoice for <strong>₹{order?.total}</strong> (including 18% GST of ₹{order?.taxTotal || 0}).
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setInvoiceModal(false)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleCreateInvoice}
            className="rounded-lg bg-[#4f8c89] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3d726f] disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Invoice"}
          </button>
        </div>
      </Modal>

      {/* Settle Deposit Modal */}
      <Modal open={settleModal} title="Settle Security Deposit" onClose={() => setSettleModal(false)}>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="flex justify-between">
              <span>Deposit Collected:</span>
              <span className="font-semibold">₹{order?.deposit?.amountCollected || 0}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Late Fee Deduction (₹)</label>
            <input
              type="number"
              min="0"
              value={deductions.lateFee}
              onChange={(e) => setDeductions({ ...deductions, lateFee: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-gray-200 p-2 text-sm outline-none focus:border-[#4f8c89]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Damage / Inspection Deduction (₹)</label>
            <input
              type="number"
              min="0"
              value={deductions.damage}
              onChange={(e) => setDeductions({ ...deductions, damage: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-gray-200 p-2 text-sm outline-none focus:border-[#4f8c89]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Notes / Reason</label>
            <input
              type="text"
              value={deductions.notes}
              onChange={(e) => setDeductions({ ...deductions, notes: e.target.value })}
              placeholder="Inspection summary"
              className="mt-1 w-full rounded-lg border border-gray-200 p-2 text-sm outline-none focus:border-[#4f8c89]"
            />
          </div>
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-800 font-semibold flex justify-between">
            <span>Net Refund to Customer:</span>
            <span>
              ₹{Math.max(0, (order?.deposit?.amountCollected || 0) - (deductions.lateFee + deductions.damage + deductions.other))}
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setSettleModal(false)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSettleAndRefund}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Settling..." : "Confirm & Settle"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default OrderStatusActions;
