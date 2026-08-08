const STATUS_CONFIG = {
  // Rental Order Statuses
  DRAFT: { label: "Quotation", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  QUOTATION_SENT: { label: "Quotation Sent", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  CONFIRMED: { label: "Confirmed", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  READY_FOR_PICKUP: { label: "Ready for Pickup", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  PICKED_UP: { label: "Picked Up / Active", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  ACTIVE: { label: "Active Rental", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  RETURNED: { label: "Returned", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  CLOSED: { label: "Completed", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" },
  COMPLETED: { label: "Completed", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" },
  CANCELLED: { label: "Cancelled", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  LATE: { label: "Late Return", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  DAMAGED: { label: "Damaged", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },

  // Deposit Statuses
  DEPOSIT_PENDING: { label: "Deposit Pending", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  COLLECTED: { label: "Deposit Collected", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  HELD: { label: "Deposit Held", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  SETTLED: { label: "Deposit Settled", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  REFUNDED: { label: "Deposit Refunded", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },

  // Payment Statuses
  PENDING: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  PAID: { label: "Paid", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  SUCCESS: { label: "Paid", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  FAILED: { label: "Failed", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  UNPAID: { label: "Unpaid", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

function StatusBadge({ status, className = "" }) {
  const config = STATUS_CONFIG[status] || {
    label: status ? status.replace(/_/g, " ") : "Unknown",
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {config.label}
    </span>
  );
}

export default StatusBadge;
