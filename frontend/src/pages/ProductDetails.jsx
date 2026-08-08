import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

const products = [
  {
    id: 1,
    name: "Premium Sofa",
    category: "Furniture",
    brand: "Ikea",
    color: "Gray",
    duration: "Monthly",
    price: 850,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000",
    description:
      "Comfortable premium sofa suitable for homes, offices, events and temporary spaces.",
  },
  {
    id: 2,
    name: "Gaming Laptop",
    category: "Electronics",
    brand: "Dell",
    color: "Black",
    duration: "Daily",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000",
    description:
      "High-performance gaming laptop suitable for gaming, development, editing and professional work.",
  },
  {
    id: 3,
    name: "Smart TV",
    category: "Electronics",
    brand: "Samsung",
    color: "Black",
    duration: "Daily",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1000",
    description:
      "Smart television suitable for entertainment, presentations and everyday viewing.",
  },
  {
    id: 4,
    name: "Professional Camera",
    category: "Electronics",
    brand: "Sony",
    color: "Black",
    duration: "Daily",
    price: 900,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000",
    description:
      "Professional camera suitable for photography, events, content creation and production.",
  },
  {
    id: 5,
    name: "MacBook Pro",
    category: "Electronics",
    brand: "Apple",
    color: "Gray",
    duration: "Daily",
    price: 750,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1000",
    description:
      "Powerful laptop for development, creative work, business and everyday productivity.",
  },
  {
    id: 6,
    name: "PlayStation 5",
    category: "Gaming",
    brand: "Sony",
    color: "White",
    duration: "Daily",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1000",
    description:
      "PlayStation 5 available for gaming sessions, events and entertainment.",
  },
  {
    id: 7,
    name: "King Size Bed",
    category: "Furniture",
    brand: "Ikea",
    color: "White",
    duration: "Monthly",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000",
    description:
      "Comfortable king-size bed suitable for temporary accommodation and furnished spaces.",
  },
  {
    id: 8,
    name: "Studio Speakers",
    category: "Audio",
    brand: "Sony",
    color: "Black",
    duration: "Daily",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1000",
    description:
      "Studio-quality speakers suitable for events, music production and entertainment.",
  },
];

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const product = useMemo(() => {
    return products.find((item) => item.id === Number(id));
  }, [id]);

  if (!product) {
    return (
      <div className="h-screen bg-[#f5fbfb]">
        <Sidebar />

        <main className="ml-[250px] flex h-screen items-center justify-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold">
              Product not found
            </h1>

            <button
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

  const addToCart = () => {
    if (!duration) {
      alert("Please select a rental duration.");
      return;
    }

    setCartCount((previous) => previous + quantity);
  };

  const rentNow = () => {
    if (!duration) {
      alert("Please select a rental duration.");
      return;
    }

    navigate("/cart");
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f5fbfb] text-black">

      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN ================= */}
      <main className="ml-[250px] flex h-screen min-h-0 flex-col">

        {/* ================= HEADER ================= */}
        <header className="h-[68px] shrink-0 border-b border-gray-200 bg-white">

          <div className="flex h-full items-center justify-between px-7">

            <div>
              <h1 className="text-xl font-semibold text-black">
                Product Details
              </h1>

              <p className="text-xs text-gray-500">
                View product information and rental options
              </p>
            </div>

            <div className="flex items-center gap-2">

              {/* Wishlist */}
              <button
                type="button"
                onClick={() =>
                  setIsWishlisted((previous) => !previous)
                }
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                  isWishlisted
                    ? "border-[#4f8c89] bg-[#e9f6f5] text-[#4f8c89]"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#4f8c89]"
                }`}
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

              {/* Cart */}
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

        {/* ================= CONTENT ================= */}
        <div className="flex min-h-0 flex-1 flex-col px-7 py-4">

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="mb-3 flex h-8 shrink-0 items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#4f8c89]"
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

          {/* ================= PRODUCT CARD ================= */}
          <section className="min-h-0 flex-1 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

            <div className="grid h-full min-h-0 grid-cols-[47%_53%]">

              {/* ================= IMAGE ================= */}
              <div className="relative flex min-h-0 items-center justify-center bg-[#e9f6f5] p-5">

                {/* Availability */}
                <div className="absolute left-5 top-5 z-10 rounded-full bg-white px-4 py-2 text-xs font-semibold text-green-600 shadow-sm">
                  Available for Rent
                </div>

                {/* Image Container */}
                <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-2xl bg-white">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />

                </div>

              </div>

              {/* ================= PRODUCT INFORMATION ================= */}
              <div className="flex min-h-0 flex-col p-5">

                {/* Category / Brand */}
                <div className="flex shrink-0 items-center justify-between">

                  <span className="rounded-full bg-[#e9f6f5] px-3 py-1.5 text-xs font-semibold text-[#4f8c89]">
                    {product.category}
                  </span>

                  <span className="text-sm text-gray-500">
                    {product.brand}
                  </span>

                </div>

                {/* Name */}
                <h2 className="mt-2 shrink-0 text-3xl font-bold tracking-tight">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="mt-1 flex shrink-0 items-center gap-2">

                  <span className="text-[#4f8c89]">
                    ★
                  </span>

                  <span className="text-sm font-semibold">
                    4.8
                  </span>

                  <span className="text-sm text-gray-500">
                    (98 reviews)
                  </span>

                </div>

                {/* Description */}
                <p className="mt-3 max-w-2xl shrink-0 text-sm leading-5 text-gray-600">
                  {product.description}
                </p>

                <div className="my-3 shrink-0 border-t border-gray-100" />

                {/* Price */}
                <div className="shrink-0">

                  <p className="text-xs text-gray-500">
                    Rental price
                  </p>

                  <div className="mt-0.5 flex items-baseline gap-2">

                    <span className="text-3xl font-bold">
                      ₹{product.price}
                    </span>

                    <span className="text-sm text-gray-500">
                      /{" "}
                      {product.duration === "Monthly"
                        ? "month"
                        : "day"}
                    </span>

                  </div>

                </div>

                {/* Small Information Cards */}
                <div className="mt-3 grid shrink-0 grid-cols-3 gap-3">

                  <div className="rounded-xl bg-[#f5fbfb] px-3 py-2">
                    <p className="text-[10px] text-gray-500">
                      Category
                    </p>

                    <p className="mt-0.5 text-sm font-semibold">
                      {product.category}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f5fbfb] px-3 py-2">
                    <p className="text-[10px] text-gray-500">
                      Brand
                    </p>

                    <p className="mt-0.5 text-sm font-semibold">
                      {product.brand}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f5fbfb] px-3 py-2">
                    <p className="text-[10px] text-gray-500">
                      Color
                    </p>

                    <p className="mt-0.5 text-sm font-semibold">
                      {product.color}
                    </p>
                  </div>

                </div>

                {/* Rental Duration */}
                <div className="mt-3 shrink-0">

                  <label className="mb-1.5 block text-sm font-semibold">
                    Rental Duration
                  </label>

                  <select
                    value={duration}
                    onChange={(event) =>
                      setDuration(event.target.value)
                    }
                    className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
                  >
                    <option value="">
                      Select rental duration
                    </option>

                    {durationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                </div>

                {/* Quantity */}
                <div className="mt-3 shrink-0">

                  <label className="mb-1.5 block text-sm font-semibold">
                    Quantity
                  </label>

                  <div className="flex h-10 w-fit overflow-hidden rounded-xl border border-gray-200">

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((previous) =>
                          Math.max(1, previous - 1)
                        )
                      }
                      className="w-10 text-lg text-gray-600 transition hover:bg-[#e9f6f5] hover:text-[#4f8c89]"
                    >
                      −
                    </button>

                    <span className="flex w-12 items-center justify-center border-x border-gray-200 text-sm font-semibold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((previous) => previous + 1)
                      }
                      className="w-10 text-lg text-gray-600 transition hover:bg-[#e9f6f5] hover:text-[#4f8c89]"
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* ================= ACTION BUTTONS ================= */}
                <div className="mt-auto flex shrink-0 gap-3 pt-4">

                  <button
                    type="button"
                    onClick={addToCart}
                    className="flex-1 rounded-xl bg-[#4f8c89] py-3 text-sm font-semibold text-white transition hover:bg-[#376c69] active:scale-[0.98]"
                  >
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    onClick={rentNow}
                    className="flex-1 rounded-xl border border-[#4f8c89] bg-white py-3 text-sm font-semibold text-[#4f8c89] transition hover:bg-[#e9f6f5] active:scale-[0.98]"
                  >
                    Rent Now
                  </button>

                </div>

              </div>
            </div>

          </section>

        </div>
      </main>
    </div>
  );
}

export default ProductDetails;