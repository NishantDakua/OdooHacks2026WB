import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Shopkeeper", role: "Shopkeeper" });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name:
            parsedUser.name ||
            parsedUser.firstName ||
            parsedUser.fullName ||
            "Shopkeeper",
          role: parsedUser.role || "Shopkeeper",
        });
      }
    } catch (error) {
      console.error("Unable to load user:", error);
    }
  }, []);

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "S";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const isVendor = user.role === "VENDOR";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-[85px] items-center border-b border-gray-200 px-6">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="text-2xl font-bold tracking-tight"
          aria-label="Go to home"
        >
          Rent<span className="text-[#4f8c89]">Ease</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#e9f6f5] text-[#4f8c89]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#e9f6f5] text-[#4f8c89]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="/admin/scheduler"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#e9f6f5] text-[#4f8c89]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            Schedule
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#e9f6f5] text-[#4f8c89]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/invoices"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#e9f6f5] text-[#4f8c89]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            Invoices
          </NavLink>

          {!isVendor && (
            <>
              <NavLink
                to="/admin/customers"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#e9f6f5] text-[#4f8c89]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                Customers
              </NavLink>

              <NavLink
                to="/admin/reports"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#e9f6f5] text-[#4f8c89]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                Reports
              </NavLink>

              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#e9f6f5] text-[#4f8c89]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                Settings
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {/* User Profile & Logout at Bottom */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4f8c89] text-sm font-semibold text-white">
              {firstLetter}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-black">
                {user.name}
              </p>
              <p className="text-xs text-gray-500">
                {user.role}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H9"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
