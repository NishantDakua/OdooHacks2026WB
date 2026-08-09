import { useEffect, useState } from "react";

function FilterBar({
  search = "",
  onSearchChange,
  status = "",
  onStatusChange,
  paymentStatus = "",
  onPaymentStatusChange,
  view = "list",
  onViewChange,
  onReset,
}) {
  const [localSearch, setLocalSearch] = useState(search);

  // Search debounce (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  // Sync if outer search resets
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Search and Filters */}
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search ref, customer, product..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10 shadow-sm"
          />
          <svg
            className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10 shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Quotation</option>
          <option value="QUOTATION_SENT">Quotation Sent</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PICKED_UP">Picked Up / Active</option>
          <option value="RETURNED">Returned</option>
          <option value="CLOSED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Payment / Deposit Filter */}
        {onPaymentStatusChange && (
          <select
            value={paymentStatus}
            onChange={(e) => onPaymentStatusChange(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10 shadow-sm"
          >
            <option value="">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="COLLECTED">Deposit Collected</option>
            <option value="HELD">Deposit Held</option>
            <option value="REFUNDED">Deposit Refunded</option>
          </select>
        )}

        {/* Reset button if filtered */}
        {(search || status || paymentStatus) && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* View Switcher */}
      {onViewChange && (
        <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => onViewChange("list")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              view === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            List
          </button>
          <button
            type="button"
            onClick={() => onViewChange("kanban")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              view === "kanban"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            Kanban
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterBar;
