import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ConfigureModal from "../components/ui/ConfigureModal";
import AlertPopup from "../components/ui/AlertPopup";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState("");
  const [showConfigure, setShowConfigure] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/v1/products/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          const item = json.data;
          const variant = item.variants?.[0] || {};
          const rule = item.pricelistRules?.[0] || {};
          setProduct({
            id: item.id,
            name: item.name,
            category: item.category?.name || "General",
            brand: variant.brand || "Standard",
            color: variant.color || "Standard",
            duration: rule.durationUnit === "MONTHLY" ? "Monthly" : "Daily",
            price: Number(rule.price || 500),
            image:
              item.images?.[0] ||
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000",
            description:
              item.description ||
              "High-quality rental product available now.",
            options: item.options || [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const durationOptions = product
    ? product.duration === "Monthly"
      ? ["1 Month", "3 Months", "6 Months", "1 Year"]
      : ["1 Day", "3 Days", "7 Days", "14 Days", "1 Month"]
    : [];

  const handleAddToCart = () => {
    if (!duration) {
      setAlertMessage("Please select a rental duration.");
      return;
    }
    const durationNum = parseInt(duration) || 1;
    addToCart(product, quantity, { "Rental Duration": durationNum });
    setToastMessage(`Added ${quantity} x ${product.name} to cart!`);
    setTimeout(() => setToastMessage(""), 2200);
  };

  const handleRentNow = () => {
    if (!duration) {
      setAlertMessage("Please select a rental duration.");
      return;
    }
    const durationNum = parseInt(duration) || 1;
    addToCart(product, quantity, { "Rental Duration": durationNum });
    navigate("/cart");
  };

  const handleConfigurationConfirm = (options) => {
    addToCart(product, quantity, options);
    setToastMessage(`Added ${quantity} x ${product.name} to cart with custom configuration!`);
    setTimeout(() => setToastMessage(""), 2200);
  };

  if (loading) {
    return (
      <AppLayout
        title="Product Details"
        subtitle="View product information and rental options"
      >
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout
        title="Product Details"
        subtitle="View product information and rental options"
      >
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Product not found
          </h2>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="rounded-xl bg-[#4f8c89] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#376c69]"
          >
            Back to Products
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Product Details"
      subtitle="View product information and rental options"
    >
      <div className="flex flex-col p-7">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#4f8c89]"
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
              d="m15 18-6-6 6-6"
            />
          </svg>
          Back to Products
        </button>

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Product Image */}
            <div className="relative flex items-center justify-center bg-[#e9f6f5] p-8 min-h-[350px]">
              <div className="absolute left-5 top-5 z-10 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-green-600 shadow-sm">
                Available for Rent
              </div>
              <div className="flex h-full w-full max-w-md items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[320px] w-full object-contain"
                />
              </div>
            </div>

            {/* Right: Product Info & Actions */}
            <div className="flex flex-col p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#e9f6f5] px-3.5 py-1.5 text-xs font-semibold text-[#4f8c89]">
                  {product.category}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    {product.brand}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                      isWishlisted
                        ? "border-[#4f8c89] bg-[#e9f6f5] text-[#4f8c89]"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#4f8c89]"
                    }`}
                    title={
                      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isWishlisted ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-amber-400">★</span>
                <span className="text-sm font-semibold">4.8</span>
                <span className="text-sm text-gray-500">(98 reviews)</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>

              <div className="my-5 border-t border-gray-100" />

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Rental Rate
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    / {product.duration === "Monthly" ? "month" : "day"}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-gray-100 bg-[#f5fbfb] p-3">
                  <p className="text-[11px] font-medium text-gray-500">
                    Category
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-800">
                    {product.category}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-[#f5fbfb] p-3">
                  <p className="text-[11px] font-medium text-gray-500">Brand</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-800">
                    {product.brand}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-[#f5fbfb] p-3">
                  <p className="text-[11px] font-medium text-gray-500">Color</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-800">
                    {product.color}
                  </p>
                </div>
              </div>

              {/* Rental Duration Selection */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Rental Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
                >
                  <option value="">Select rental duration</option>
                  {durationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Picker */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Quantity
                </label>
                <div className="flex h-11 w-36 items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-full w-11 items-center justify-center text-lg font-semibold text-gray-600 transition hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-sm font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-full w-11 items-center justify-center text-lg font-semibold text-gray-600 transition hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 rounded-xl bg-[#4f8c89] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#376c69] active:scale-[0.98]"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleRentNow}
                  className="flex-1 rounded-xl border border-[#4f8c89] bg-white py-3.5 text-sm font-semibold text-[#4f8c89] transition hover:bg-[#e9f6f5] active:scale-[0.98]"
                >
                  Rent Now
                </button>
              </div>

              {toastMessage && (
                <p className="mt-3 text-center text-sm font-medium text-emerald-600">
                  ✓ {toastMessage}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      <ConfigureModal
        isOpen={showConfigure}
        onClose={() => setShowConfigure(false)}
        product={product}
        onConfirm={handleConfigurationConfirm}
      />

      <AlertPopup
        isOpen={!!alertMessage}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
    </AppLayout>
  );
}

export default ProductDetails;