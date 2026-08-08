import { useLocation } from "react-router-dom";

function AdminHeader() {
  const location = useLocation();

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
    <header className="sticky top-0 z-30 shrink-0 border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between gap-4">
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
              placeholder="Search..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
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
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
