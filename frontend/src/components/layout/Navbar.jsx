import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

function Navbar({
  cartCount = 0,
}) {
  const navigate = useNavigate();
  const { wishlistCount } = useWishlist();

  return (
    <div className="flex items-center gap-3">

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => navigate("/wishlist")}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#4f8c89] hover:bg-[#e9f6f5] hover:text-[#4f8c89]"
            aria-label="Wishlist"
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
                d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78Z"
              />
            </svg>

            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4f8c89] px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#4f8c89] hover:bg-[#e9f6f5] hover:text-[#4f8c89]"
            aria-label="Shopping cart"
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
                d="M3 4h2l2.2 11h10.6L20 7H6"
              />

              <circle cx="9" cy="19" r="1.5" />
              <circle cx="17" cy="19" r="1.5" />
            </svg>

            {/* Cart Count */}
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4f8c89] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

    </div>
  );
}

export default Navbar;