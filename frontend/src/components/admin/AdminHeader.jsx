import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function AdminHeader() {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/v1/dashboard/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/v1/dashboard/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (e) {}
  };

  const unreadCount = notifications.filter(n => n.status !== "SENT").length;

  const getPageTitle = (pathname) => {
    if (pathname.includes("/admin/orders/new")) return "New Rental Order";
    if (pathname.includes("/admin/orders/")) return "Order Details";
    if (pathname.includes("/admin/orders")) return "Rental Orders";
    if (pathname.includes("/admin/products/new")) return "Add New Product";
    if (pathname.includes("/admin/products/") && pathname.includes("/edit")) return "Edit Product";
    if (pathname.includes("/admin/products")) return "Product Management";
    if (pathname.includes("/admin/scheduler")) return "Rental Schedule";
    if (pathname.includes("/admin/invoices")) return "Rental Invoices";
    if (pathname.includes("/admin/customers")) return "Customer Directory";
    if (pathname.includes("/admin/reports")) return "Reports & Analytics";
    if (pathname.includes("/admin/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-gray-200 bg-white px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-black">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Top Search bar */}
        <div className="relative w-72">
          <input
            type="text"
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            placeholder="Search (min 4 characters)..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
          />
          <svg
            className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {headerSearch.trim().length > 0 && headerSearch.trim().length < 4 && (
            <span className="absolute -bottom-5 left-1 text-[11px] font-medium text-amber-600">
              Type at least 4 letters to search...
            </span>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 font-semibold text-black">
                Notifications
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`cursor-pointer border-b border-gray-100 px-4 py-3 hover:bg-gray-50 ${n.status !== "SENT" ? "bg-white" : "opacity-60"}`}
                    >
                      <p className="text-sm font-medium text-black">
                        New order confirmed {n.order?.orderNumber && `(${n.order.orderNumber})`}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Click to mark as read
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
