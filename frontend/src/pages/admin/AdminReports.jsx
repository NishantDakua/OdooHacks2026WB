import { useEffect, useState } from "react";
import { adminOrderService } from "../../services/adminOrderService";
import Card from "../../components/ui/Card";
import AdminStatCard from "../../components/admin/AdminStatCard";
import PageLoadingFallback from "../../components/ui/PageLoadingFallback";

function AdminReports() {
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [timeframe, setTimeframe] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/v1/dashboard/metrics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setMetrics(json.data);

        const orderList = await adminOrderService.getOrders();
        setOrders(orderList || []);
      } catch (err) {
        setError(err.message || "Failed to load report analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, [timeframe]);

  const handleExportCSV = () => {
    if (!orders.length) return;
    const headers = ["Order Number,Customer,Product,Total,Status,Start Date,End Date\n"];
    const rows = orders.map(
      (o) =>
        `"${o.orderNumber || o.id}","${o.customer?.name || "Customer"}","${
          o.lines?.[0]?.variant?.product?.name || "Product"
        }","${o.total}","${o.status}","${new Date(o.rentalStart).toLocaleDateString()}","${new Date(
          o.rentalEnd
        ).toLocaleDateString()}"\n`
    );
    const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RentEase_Rental_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) return <PageLoadingFallback />;

  return (
    <div className="pb-16 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rental Reports & Analytics</h2>
          <p className="mt-1 text-sm text-gray-500">
            Performance analytics, revenue summaries, and rental utilization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 outline-none shadow-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            type="button"
            onClick={handleExportCSV}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl bg-[#4f8c89] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#3d726f]"
          >
            Print Report
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Total Rental Revenue"
          value={`₹${(metrics?.totalRevenue || 0).toLocaleString()}`}
          subtext="Processed payments"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <AdminStatCard
          label="Active Rentals"
          value={metrics?.activeRentals || 0}
          subtext="Items currently with clients"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <AdminStatCard
          label="Deposits Held"
          value={`₹${(metrics?.depositsCollected || 0).toLocaleString()}`}
          subtext="Active security collateral"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
        />
        <AdminStatCard
          label="Overdue / Late"
          value={metrics?.overdueRentals || 0}
          subtext="Require attention"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
      </div>

      {/* Summary Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Rental Status Breakdown</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Confirmed Orders:</span>
              <span className="font-semibold text-gray-900">{orders.filter((o) => o.status === "CONFIRMED").length}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Active / Picked Up:</span>
              <span className="font-semibold text-teal-600">{orders.filter((o) => o.status === "PICKED_UP").length}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Returned & Completed:</span>
              <span className="font-semibold text-gray-900">{orders.filter((o) => ["RETURNED", "CLOSED"].includes(o.status)).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cancelled Quotations:</span>
              <span className="font-semibold text-red-600">{orders.filter((o) => o.status === "CANCELLED").length}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Financial Summary</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Total Security Deposits Collected:</span>
              <span className="font-semibold text-gray-900">₹{metrics?.depositsCollected || 0}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Total Deposits Refunded:</span>
              <span className="font-semibold text-emerald-600">₹{metrics?.depositsRefunded || 0}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Total Invoiced Volume:</span>
              <span className="font-semibold text-gray-900">₹{(metrics?.totalRevenue || 0) * 1.18}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Orders Processed:</span>
              <span className="font-semibold text-[#4f8c89]">{orders.length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminReports;
