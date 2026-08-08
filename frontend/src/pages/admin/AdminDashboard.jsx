import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminStatCard from "../../components/admin/AdminStatCard";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import PageLoadingFallback from "../../components/ui/PageLoadingFallback";

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/v1/dashboard/metrics", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const json = await res.json();
        
        if (res.ok && json.success) {
          setMetrics(json.data);
        } else {
          setError(json.message || "Failed to load dashboard metrics");
        }
      } catch (err) {
        setError("Network error loading dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [navigate]);

  if (loading) {
    return (
      <div className="pb-12 animate-pulse space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-44 rounded-xl bg-gray-200" />
            <div className="h-4 w-64 rounded-lg bg-gray-100" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-28 rounded-lg bg-gray-200" />
            <div className="h-10 w-32 rounded-lg bg-gray-200" />
          </div>
        </div>

        {/* 6 Skeleton Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
              <div className="h-3 w-1/2 rounded bg-gray-200" />
              <div className="h-7 w-3/4 rounded-lg bg-gray-200" />
              <div className="h-2 w-1/3 rounded bg-gray-100" />
            </div>
          ))}
        </div>

        {/* Skeleton Table and Activity */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="h-80 rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-2 space-y-4">
            <div className="h-5 w-48 rounded bg-gray-200" />
            <div className="space-y-3 pt-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-9 w-full rounded-lg bg-gray-100" />
              ))}
            </div>
          </div>
          <div className="h-80 rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="space-y-3 pt-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 w-full rounded-xl bg-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 font-semibold text-[#4f8c89] hover:underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">Overview of your rental business</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/orders"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            View Invoices
          </Link>
          <Link
            to="/admin/products/new"
            className="rounded-lg bg-[#4f8c89] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3f7370]"
          >
            + Add Product
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <AdminStatCard 
          label="Today's Rentals" 
          value={metrics?.pendingPickups || 0} 
          subtext="Awaiting pickup"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <AdminStatCard 
          label="Active Rentals" 
          value={metrics?.activeRentals || 0} 
          subtext="Currently with customers"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <AdminStatCard 
          label="Late Returns" 
          value={metrics?.overdueRentals || 0} 
          subtext="Past due date"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
        <AdminStatCard 
          label="Revenue" 
          value={`₹${(metrics?.totalRevenue || 0).toLocaleString()}`} 
          subtext="Total processed"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <AdminStatCard 
          label="Pending Quotes" 
          value={metrics?.totalOrders || 0} 
          subtext="Total historical orders"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
        <AdminStatCard 
          label="Pending Invoices" 
          value={metrics?.returnedAwaitingInspection || 0} 
          subtext="Needs inspection"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="font-semibold text-gray-900">Recent Rental Orders</h3>
              <Link to="/admin/orders" className="text-sm font-medium text-[#4f8c89] hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">Order Ref</th>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Rental Period</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Total</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {metrics?.recentOrders?.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                        {order.reference || `#ORD-${order.id.slice(-4)}`}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{order.customer?.name || "Customer"}</div>
                        <div className="text-xs text-gray-500">{order.customer?.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {new Date(order.rentalStart).toLocaleDateString()} - <br/>
                        {new Date(order.rentalEnd).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge className={
                          order.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                          order.status === "PICKED_UP" ? "bg-blue-100 text-blue-700" :
                          order.status === "RETURNED" ? "bg-purple-100 text-purple-700" :
                          "bg-gray-100 text-gray-700"
                        }>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link to={`/admin/orders/${order.id}`} className="font-medium text-[#4f8c89] hover:underline">
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {(!metrics?.recentOrders || metrics.recentOrders.length === 0) && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick Actions & Summary */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <Link to="/admin/orders" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-[#4f8c89] hover:bg-gray-50 hover:text-[#4f8c89]">
                <span>New Rental Order</span>
                <span className="text-gray-400">→</span>
              </Link>
              <Link to="/admin/products/new" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-[#4f8c89] hover:bg-gray-50 hover:text-[#4f8c89]">
                <span>Add Product</span>
                <span className="text-gray-400">→</span>
              </Link>
              <Link to="/admin/scheduler" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-[#4f8c89] hover:bg-gray-50 hover:text-[#4f8c89]">
                <span>View Scheduler</span>
                <span className="text-gray-400">→</span>
              </Link>
              <Link to="/admin/reports" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-[#4f8c89] hover:bg-gray-50 hover:text-[#4f8c89]">
                <span>Generate Reports</span>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Rental Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-500">Today</span>
                <span className="font-semibold text-gray-900">+{metrics?.pendingPickups || 0} Pickups</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-500">This Week</span>
                <span className="font-semibold text-gray-900">{metrics?.totalOrders || 0} Orders</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">This Month</span>
                <span className="font-semibold text-[#4f8c89]">{metrics?.totalProducts || 0} Products</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
