import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminOrderService } from "../../services/adminOrderService";
import StatusBadge from "../../components/admin/StatusBadge";
import PageLoadingFallback from "../../components/ui/PageLoadingFallback";
import Card from "../../components/ui/Card";

function RentalScheduler() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const navigate = useNavigate();

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminOrderService.getOrders();
      setOrders(data || []);
    } catch (err) {
      setError(err.message || "Failed to load rental schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const now = new Date();

  // Categorized rentals
  const upcomingPickups = orders.filter(
    (o) =>
      ["CONFIRMED", "READY_FOR_PICKUP"].includes(o.status) &&
      new Date(o.rentalStart).toDateString() === new Date(selectedDate).toDateString()
  );

  const upcomingReturns = orders.filter(
    (o) =>
      ["PICKED_UP", "ACTIVE"].includes(o.status) &&
      new Date(o.rentalEnd).toDateString() === new Date(selectedDate).toDateString()
  );

  const activeRentals = orders.filter((o) => ["PICKED_UP", "ACTIVE"].includes(o.status));

  const overdueRentals = orders.filter(
    (o) => ["PICKED_UP", "ACTIVE"].includes(o.status) && new Date(o.rentalEnd) < now
  );

  return (
    <div className="pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rental Scheduler</h2>
          <p className="mt-1 text-sm text-gray-500">
            Timeline of upcoming pickups, active rentals, and scheduled returns.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 outline-none transition focus:border-[#4f8c89] shadow-sm"
          />
          <button
            type="button"
            onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
            className="rounded-xl bg-gray-100 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
          >
            Today
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <PageLoadingFallback />
      ) : (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 border-l-4 border-l-amber-500">
              <span className="text-xs text-gray-500 font-medium">Pickups on {new Date(selectedDate).toLocaleDateString()}</span>
              <p className="mt-1 text-2xl font-bold text-gray-900">{upcomingPickups.length}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-blue-500">
              <span className="text-xs text-gray-500 font-medium">Returns on {new Date(selectedDate).toLocaleDateString()}</span>
              <p className="mt-1 text-2xl font-bold text-gray-900">{upcomingReturns.length}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-teal-500">
              <span className="text-xs text-gray-500 font-medium">Total Active Rentals</span>
              <p className="mt-1 text-2xl font-bold text-gray-900">{activeRentals.length}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-red-500">
              <span className="text-xs text-gray-500 font-medium">Overdue Returns</span>
              <p className="mt-1 text-2xl font-bold text-red-600">{overdueRentals.length}</p>
            </Card>
          </div>

          {/* Scheduled Pickups & Returns Columns */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Scheduled Pickups */}
            <Card className="p-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Scheduled Pickups ({upcomingPickups.length})
                </h3>
              </div>

              <div className="space-y-3">
                {upcomingPickups.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                    className="cursor-pointer rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition hover:bg-gray-50 hover:border-[#4f8c89]/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">
                        {o.orderNumber || `#R${o.id.slice(-4)}`}
                      </span>
                      <StatusBadge status={o.status} />
                    </div>
                    <p className="mt-1 text-sm font-semibold text-gray-800">{o.customer?.name || "Customer"}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {o.lines?.[0]?.variant?.product?.name || "Product"}
                    </p>
                  </div>
                ))}
                {upcomingPickups.length === 0 && (
                  <p className="py-6 text-center text-xs text-gray-400">
                    No pickups scheduled for this date.
                  </p>
                )}
              </div>
            </Card>

            {/* Scheduled Returns */}
            <Card className="p-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Scheduled Returns ({upcomingReturns.length})
                </h3>
              </div>

              <div className="space-y-3">
                {upcomingReturns.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                    className="cursor-pointer rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition hover:bg-gray-50 hover:border-[#4f8c89]/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">
                        {o.orderNumber || `#R${o.id.slice(-4)}`}
                      </span>
                      <StatusBadge status={o.status} />
                    </div>
                    <p className="mt-1 text-sm font-semibold text-gray-800">{o.customer?.name || "Customer"}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {o.lines?.[0]?.variant?.product?.name || "Product"}
                    </p>
                  </div>
                ))}
                {upcomingReturns.length === 0 && (
                  <p className="py-6 text-center text-xs text-gray-400">
                    No returns scheduled for this date.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default RentalScheduler;
