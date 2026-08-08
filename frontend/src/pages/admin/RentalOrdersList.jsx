import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminOrderService } from "../../services/adminOrderService";
import StatusBadge from "../../components/admin/StatusBadge";
import DataTable from "../../components/admin/DataTable";
import FilterBar from "../../components/admin/FilterBar";
import PageLoadingFallback from "../../components/ui/PageLoadingFallback";
import Card from "../../components/ui/Card";

function RentalOrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [view, setView] = useState("list");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminOrderService.getOrders({
        status: statusFilter,
        search,
      });
      setOrders(data || []);
    } catch (err) {
      setError(err.message || "Unable to load rental orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  // Client-side filtering for payment status if applied
  const filteredOrders = useMemo(() => {
    if (!paymentFilter) return orders;
    return orders.filter((o) => {
      if (paymentFilter === "COLLECTED") return o.deposit?.status === "COLLECTED";
      if (paymentFilter === "HELD") return o.deposit?.status === "HELD";
      if (paymentFilter === "REFUNDED") return o.deposit?.status === "REFUNDED";
      return true;
    });
  }, [orders, paymentFilter]);

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPaymentFilter("");
  };

  const columns = [
    {
      header: "Order Ref",
      accessor: "orderNumber",
      render: (row) => (
        <span className="font-semibold text-gray-900">
          {row.orderNumber || `#R${row.id.slice(-4)}`}
        </span>
      ),
    },
    {
      header: "Customer",
      accessor: "customer",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.customer?.name || "Customer"}</p>
          <p className="text-xs text-gray-400">{row.customer?.email || row.customer?.phone || "-"}</p>
        </div>
      ),
    },
    {
      header: "Products",
      accessor: "lines",
      render: (row) => {
        const firstLine = row.lines?.[0];
        const productName = firstLine?.variant?.product?.name || "Rental Product";
        const extraCount = (row.lines?.length || 1) - 1;
        return (
          <div>
            <p className="font-medium text-gray-800 truncate max-w-[180px]">{productName}</p>
            {extraCount > 0 && <p className="text-[11px] text-gray-400">+{extraCount} more items</p>}
          </div>
        );
      },
    },
    {
      header: "Rental Period",
      accessor: "rentalStart",
      render: (row) => (
        <div className="text-xs">
          <span>{new Date(row.rentalStart).toLocaleDateString()}</span>
          <span className="text-gray-400"> → </span>
          <span>{new Date(row.rentalEnd).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Total",
      accessor: "total",
      render: (row) => <span className="font-semibold text-gray-900">₹{row.total}</span>,
    },
    {
      header: "Deposit",
      accessor: "deposit",
      render: (row) => (
        <span className="text-xs font-medium text-gray-600">
          ₹{row.deposit?.amountCollected || 0} ({row.deposit?.status || "PENDING"})
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <Link
          to={`/admin/orders/${row.id}`}
          className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#4f8c89] hover:bg-white transition"
        >
          Details
        </Link>
      ),
    },
  ];

  // Kanban groups
  const kanbanColumns = [
    { title: "Quotation", statuses: ["DRAFT", "QUOTATION_SENT"] },
    { title: "Confirmed", statuses: ["CONFIRMED", "READY_FOR_PICKUP"] },
    { title: "Active / Picked Up", statuses: ["PICKED_UP", "ACTIVE"] },
    { title: "Returned", statuses: ["RETURNED"] },
    { title: "Completed", statuses: ["CLOSED", "COMPLETED"] },
  ];

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rental Orders</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage quotations, rentals, pickups and returns.
          </p>
        </div>
        <div>
          <Link
            to="/admin/orders/new"
            className="flex items-center gap-2 rounded-xl bg-[#4f8c89] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3d726f]"
          >
            <span>+</span> New Rental Order
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        paymentStatus={paymentFilter}
        onPaymentStatusChange={setPaymentFilter}
        view={view}
        onViewChange={setView}
        onReset={handleResetFilters}
      />

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between">
          <p>{error}</p>
          <button
            type="button"
            onClick={fetchOrders}
            className="font-semibold text-red-800 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content View */}
      {loading ? (
        <PageLoadingFallback />
      ) : view === "list" ? (
        <DataTable
          columns={columns}
          data={filteredOrders}
          onRowClick={(row) => navigate(`/admin/orders/${row.id}`)}
          emptyMessage="No rental orders found matching your search or filters."
        />
      ) : (
        /* Kanban View */
        <div className="grid gap-6 overflow-x-auto pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {kanbanColumns.map((col) => {
            const columnOrders = filteredOrders.filter((o) =>
              col.statuses.includes(o.status)
            );
            return (
              <div key={col.title} className="flex flex-col rounded-2xl bg-gray-50/80 p-4 border border-gray-200/80">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    {col.title}
                  </h3>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-500 border border-gray-200">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  {columnOrders.map((order) => (
                    <Card
                      key={order.id}
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="cursor-pointer p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#4f8c89]/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-900">
                          {order.orderNumber || `#R${order.id.slice(-4)}`}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>

                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {order.customer?.name || "Customer"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500 truncate">
                        {order.lines?.[0]?.variant?.product?.name || "Product"}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                        <span className="text-gray-400">
                          {new Date(order.rentalStart).toLocaleDateString()}
                        </span>
                        <span className="font-bold text-gray-900">₹{order.total}</span>
                      </div>
                    </Card>
                  ))}
                  {columnOrders.length === 0 && (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
                      No orders
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RentalOrdersList;
