import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

function Sidebar({ wishlistCount = 0 }) {
  const navigate = useNavigate();
  const { wishlistCount: sharedWishlistCount } = useWishlist();

  const [user, setUser] = useState({
    name: "Customer",
    role: "Customer",
  });

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
            "Customer",

          role:
            parsedUser.role ||
            "Customer",
        });
      }
    } catch (error) {
      console.error("Unable to load user:", error);
    }
  }, []);

  const firstLetter = user.name
    ? user.name.charAt(0).toUpperCase()
    : "C";
  const effectiveWishlistCount = sharedWishlistCount ?? wishlistCount;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-gray-200 bg-white">

      {/* Logo */}
      <div className="flex h-[85px] items-center border-b border-gray-200 px-6">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="text-2xl font-bold tracking-tight"
          aria-label="Go to home"
        >
          Rent<span className="text-[#4f8c89]">Ease</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5">

        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Browse
        </p>

        {/* Products */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="mb-1 flex w-full items-center gap-3 rounded-xl bg-[#4f8c89] px-4 py-3 text-sm font-semibold text-white shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <rect x="14" y="14" width="6" height="6" rx="1" />
          </svg>

          Products
        </button>

        {/* My Rentals */}
        <button
          type="button"
          onClick={() => navigate("/rentals")}
          className="mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 transition hover:bg-[#e9f6f5] hover:text-[#4f8c89]"
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
              d="M8 7V4m8 3V4M4.5 10.5h15M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2Z"
            />
          </svg>

          My Rentals
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => navigate("/wishlist")}
          className="mb-1 flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-gray-600 transition hover:bg-[#e9f6f5] hover:text-[#4f8c89]"
        >
          <span className="flex items-center gap-3">

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
                d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78Z"
              />
            </svg>

            Wishlist
          </span>

          {effectiveWishlistCount > 0 && (
            <span className="rounded-full bg-[#4f8c89] px-2 py-0.5 text-[10px] font-bold text-white">
              {effectiveWishlistCount}
            </span>
          )}
        </button>

        <div className="my-6 border-t border-gray-100" />

        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Information
        </p>

        {/* About */}
        <button
          type="button"
          onClick={() => navigate("/about")}
          className="mb-1 flex w-full rounded-xl px-4 py-3 text-sm text-gray-600 transition hover:bg-[#e9f6f5] hover:text-[#4f8c89]"
        >
          About Us
        </button>

        {/* Terms */}
        <button
          type="button"
          onClick={() => navigate("/terms")}
          className="mb-1 flex w-full rounded-xl px-4 py-3 text-sm text-gray-600 transition hover:bg-[#e9f6f5] hover:text-[#4f8c89]"
        >
          Terms & Conditions
        </button>

        {/* Contact */}
        <button
          type="button"
          onClick={() => navigate("/contact")}
          className="mb-1 flex w-full rounded-xl px-4 py-3 text-sm text-gray-600 transition hover:bg-[#e9f6f5] hover:text-[#4f8c89]"
        >
          Contact Us
        </button>

      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#e9f6f5]"
        >

          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4f8c89] text-sm font-semibold text-white">
            {firstLetter}
          </div>

          {/* User information */}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-black">
              {user.name}
            </p>

            <p className="text-xs text-gray-500">
              {user.role}
            </p>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="ml-auto h-4 w-4 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 18 6-6-6-6"
            />
          </svg>

        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;