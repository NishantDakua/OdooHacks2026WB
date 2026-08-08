import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Sidebar from "../components/layout/Sidebar";
import ConfigureModal from "../components/ui/ConfigureModal";
import ProductImage from "../components/ui/ProductImage";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import AlertPopup from "../components/ui/AlertPopup";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const todayStr = new Date().toISOString().split("T")[0];
  const defaultEndStr = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndStr);
  const [quantity, setQuantity] = useState(1);
  const [showConfigure, setShowConfigure] = useState(false);
  const [configuration, setConfiguration] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const calculateDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };
  const durationDays = calculateDays(startDate, endDate);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/v1/products/${id}`, {
          signal: abortController.signal
        });
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
            image: item.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000",
            description: item.description || "High-quality rental product available now.",
            quantityAvailable: variant.quantityAvailable || 0,
          });
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch product details:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
    
    return () => abortController.abort();
  }, [id]);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="h-screen bg-[#f5fbfb]">
        <Sidebar />
        <main className="ml-[250px] flex h-screen items-center justify-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold">Product not found</h1>
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="mt-5 rounded-xl bg-[#4f8c89] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Back to Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  const durationOptions =
    product.duration === "Monthly"
      ? ["1 Month", "6 Months", "1 Year"]
      : ["1 Day", "3 Days", "7 Days", "1 Month"];
  const handleAddToCart = () => {
    addToCart(product, quantity, {
      "Rental Start": startDate,
      "Rental End": endDate,
      "Rental Duration": durationDays,
    });
    setAlertMessage(`Added ${quantity} x ${product.name} (${durationDays} Days) to cart!`);
  };

  const handleRentNow = () => {
    addToCart(product, quantity, {
      "Rental Start": startDate,
      "Rental End": endDate,
      "Rental Duration": durationDays,
    });
    navigate("/cart");
  };

  const handleConfigurationConfirm = (options) => {
    addToCart(product, quantity, {
      ...options,
      "Rental Start": startDate,
      "Rental End": endDate,
      "Rental Duration": durationDays,
    });
    setAlertMessage(`Added ${quantity} x ${product.name} to cart!`);
  };

  const handleConfigurationConfirm = (options) => {
    addToCart(product, quantity, options);
    setToastMessage(`Added ${quantity} x ${product.name} to cart with custom configuration!`);
    setTimeout(() => setToastMessage(""), 2200);
  };

              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#4f8c89] hover:text-[#4f8c89]"
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
                    d="M2.25 3h2.1l2.1 10.5a2 2 0 0 0 1.96 1.6h8.9a2 2 0 0 0 1.94-1.5L21 6H6"
                  />
                  <circle cx="9" cy="19" r="1.2" />
                  <circle cx="18" cy="19" r="1.2" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4f8c89] px-1 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

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

          <section className="min-h-0 flex-1 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="grid h-full min-h-0 grid-cols-[47%_53%]">
              <div className="relative flex min-h-0 items-center justify-center bg-[#e9f6f5] p-5">
                <div className={`absolute left-5 top-5 z-10 rounded-full bg-white px-4 py-2 text-xs font-semibold shadow-sm ${product.quantityAvailable > 0 ? "text-green-600" : "text-red-500"}`}>
                  {product.quantityAvailable > 0 ? "Available for Rent" : "Out of Stock"}
                </div>
                <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-2xl bg-white">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full"
                    width={800}
                  />
                </div>
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

                <div className="mt-3 shrink-0 grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Rental Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      min={todayStr}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs outline-none transition focus:border-[#4f8c89] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Rental End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs outline-none transition focus:border-[#4f8c89] focus:bg-white"
                    />
                  </div>

                  <div className="col-span-2 flex items-center justify-between rounded-xl bg-[#e9f6f5] px-3 py-1.5 text-xs">
                    <span className="font-semibold text-[#4f8c89]">Duration: {durationDays} Day(s)</span>
                    <span className="text-gray-500">Deposit: ₹1,500 (Refundable)</span>
                  </div>
                </div>

                <div className="mt-3 shrink-0">
                  <label className="mb-1.5 block text-sm font-semibold">
                    Quantity
                  </label>
                  <div className="flex h-11 w-fit overflow-hidden rounded-xl border border-gray-200">
                    <button
                      type="button"
                      disabled={product.quantityAvailable === 0}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex w-11 items-center justify-center bg-gray-50 text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:opacity-50"
                    >
                      -
                    </button>
                    <div className="flex w-12 items-center justify-center border-x border-gray-200 text-sm font-semibold">
                      {product.quantityAvailable === 0 ? 0 : quantity}
                    </div>
                    <button
                      type="button"
                      disabled={product.quantityAvailable === 0 || quantity >= product.quantityAvailable}
                      onClick={() => setQuantity(Math.min(product.quantityAvailable, quantity + 1))}
                      className="flex w-11 items-center justify-center bg-gray-50 text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-auto flex shrink-0 gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.quantityAvailable === 0}
                    className="flex-1 rounded-xl bg-[#4f8c89] py-3 text-sm font-semibold text-white transition hover:bg-[#376c69] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-sm font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleRentNow}
                    disabled={product.quantityAvailable === 0}
                    className="flex-1 rounded-xl border border-[#4f8c89] bg-white py-3 text-sm font-semibold text-[#4f8c89] transition hover:bg-[#e9f6f5] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
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

      </main>
    </div>
  );
}

export default ProductDetails;