import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ConfigureModal from "../components/ui/ConfigureModal";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const products = [
  {
    id: 1,
    name: "Premium Sofa",
    category: "Furniture",
    brand: "Ikea",
    color: "Gray",
    duration: "Monthly",
    price: 850,
    rating: 4.7,
    reviews: 64,
    description:
      "Comfortable premium sofa suitable for homes, offices and events.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000",
    options: [
      { name: "Color", values: ["Gray", "Black", "White"] },
      { name: "Size", values: ["2 Seater", "3 Seater", "4 Seater"] },
    ],
  },
  {
    id: 2,
    name: "Gaming Laptop",
    category: "Electronics",
    brand: "Dell",
    color: "Black",
    duration: "Daily",
    price: 500,
    rating: 4.8,
    reviews: 98,
    description:
      "High-performance gaming laptop suitable for gaming, development, editing and professional work.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000",
    options: [
      { name: "RAM", values: ["8 GB", "16 GB", "32 GB"] },
      { name: "Storage", values: ["512 GB", "1 TB", "2 TB"] },
    ],
  },
  {
    id: 3,
    name: "Smart TV",
    category: "Electronics",
    brand: "Samsung",
    color: "Black",
    duration: "Daily",
    price: 650,
    rating: 4.6,
    reviews: 71,
    description:
      "Smart television with a large display, streaming support and modern connectivity.",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1000",
    options: [
      { name: "Screen Size", values: ["43 inch", "55 inch", "65 inch"] },
    ],
  },
  {
    id: 4,
    name: "Professional Camera",
    category: "Electronics",
    brand: "Sony",
    color: "Black",
    duration: "Daily",
    price: 900,
    rating: 4.9,
    reviews: 52,
    description:
      "Professional camera suitable for photography, events and content creation.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000",
    options: [
      { name: "Lens", values: ["18-55mm", "24-70mm", "70-200mm"] },
    ],
  },
  {
    id: 5,
    name: "MacBook Pro",
    category: "Electronics",
    brand: "Apple",
    color: "Gray",
    duration: "Daily",
    price: 750,
    rating: 4.9,
    reviews: 86,
    description:
      "Powerful MacBook suitable for development, editing, design and professional work.",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
    options: [
      { name: "RAM", values: ["8 GB", "16 GB", "32 GB"] },
      { name: "Storage", values: ["512 GB", "1 TB", "2 TB"] },
    ],
  },
  {
    id: 6,
    name: "PlayStation 5",
    category: "Gaming",
    brand: "Sony",
    color: "White",
    duration: "Daily",
    price: 450,
    rating: 4.8,
    reviews: 103,
    description:
      "Latest generation gaming console suitable for personal entertainment and events.",
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1000",
    options: [
      { name: "Edition", values: ["Digital", "Disc"] },
    ],
  },
  {
    id: 7,
    name: "King Size Bed",
    category: "Furniture",
    brand: "Ikea",
    color: "White",
    duration: "Monthly",
    price: 1200,
    rating: 4.5,
    reviews: 38,
    description:
      "Comfortable king-size bed suitable for homes, guest rooms and temporary stays.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000",
    options: [
      { name: "Size", values: ["King", "California King"] },
    ],
  },
  {
    id: 8,
    name: "Studio Speakers",
    category: "Audio",
    brand: "Sony",
    color: "Black",
    duration: "Daily",
    price: 350,
    rating: 4.6,
    reviews: 41,
    description:
      "Powerful studio speakers suitable for events, recording and entertainment.",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1000",
    options: [
      { name: "Configuration", values: ["2.0", "2.1", "5.1"] },
    ],
  },
];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, cartCount } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [showConfigure, setShowConfigure] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [configuration, setConfiguration] = useState(null);

  if (!product) {
    return (
      <AppLayout
        title="Product Details"
        subtitle="Product information"
        cartCount={cartCount}
      >
        <div className="flex h-full items-center justify-center bg-[#f7fbfb]">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold">
              Product not found
            </h2>

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="mt-5 rounded-xl bg-[#4f8c89] px-5 py-3 text-sm font-semibold text-white"
            >
              Back to Products
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const increaseQuantity = () => {
    setQuantity((previous) => previous + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((previous) =>
      previous > 1 ? previous - 1 : 1
    );
  };

  const handleAddToCart = () => {
    if (!selectedDuration) {
      alert("Please select a rental duration.");
      return;
    }

    setShowConfigure(true);
  };

  const handleConfiguration = (options) => {
    const finalConfiguration = {
      ...options,
      "Rental Duration": selectedDuration,
    };

    addToCart(
      product,
      quantity,
      finalConfiguration
    );

    setConfiguration(finalConfiguration);
    setShowConfigure(false);

    navigate("/cart");
  };

  return (
    <AppLayout
      title="Product Details"
      subtitle="View product information and rental options"
      cartCount={cartCount}
    >
      <div className="h-full overflow-y-auto overflow-x-hidden bg-[#f7fbfb] p-4 lg:p-5">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#4f8c89]"
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

        {/* Product */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">

            {/* LEFT */}
            <div className="relative flex min-h-[320px] items-center justify-center bg-[#eef9f8] p-5 lg:min-h-[540px]">

              <div className="absolute left-5 top-5 z-10 rounded-full bg-white px-4 py-2 text-xs font-semibold text-green-600 shadow-sm">
                Available for Rent
              </div>

              <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-2xl bg-white">

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />

              </div>

            </div>

            {/* RIGHT */}
            <div className="flex min-h-0 flex-col p-5 lg:p-6">

              {/* Category / Brand */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#e9f6f5] px-4 py-2 text-xs font-semibold text-[#4f8c89]">
                    {product.category}
                  </span>

                  <span className="text-sm font-medium text-gray-500">
                    {product.brand}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                    isInWishlist(product.id)
                      ? "border-[#4f8c89] bg-[#e9f6f5] text-[#4f8c89]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#4f8c89] hover:text-[#4f8c89]"
                  }`}
                  aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill={isInWishlist(product.id) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78Z" />
                  </svg>
                </button>
              </div>

              {/* Name */}
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-black">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-1 flex items-center gap-2">

                <span className="text-[#4f8c89]">
                  ★
                </span>

                <span className="font-semibold">
                  {product.rating}
                </span>

                <span className="text-sm text-gray-500">
                  ({product.reviews} reviews)
                </span>

              </div>

              {/* Description */}
              <p className="mt-3 text-sm leading-5 text-gray-600">
                {product.description}
              </p>

              <div className="my-3 border-t border-gray-100" />

              {/* Price */}
              <div>

                <p className="text-sm text-gray-500">
                  Rental price
                </p>

                <div className="mt-1 flex items-baseline gap-2">

                  <span className="text-3xl font-bold text-black">
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

              {/* Info */}
              <div className="mt-4 grid grid-cols-3 gap-2">

                <div className="rounded-xl bg-[#f4fafa] p-3">
                  <p className="text-xs text-gray-500">
                    Category
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {product.category}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f4fafa] p-3">
                  <p className="text-xs text-gray-500">
                    Brand
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {product.brand}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f4fafa] p-3">
                  <p className="text-xs text-gray-500">
                    Color
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {product.color}
                  </p>
                </div>

              </div>

              {/* Duration */}
              <div className="mt-4">

                <label className="mb-2 block text-sm font-semibold">
                  Rental Duration
                </label>

                <select
                  value={selectedDuration}
                  onChange={(event) =>
                    setSelectedDuration(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
                >
                  <option value="">
                    Select rental duration
                  </option>

                  <option value="1 Day">
                    1 Day
                  </option>

                  <option value="3 Days">
                    3 Days
                  </option>

                  <option value="1 Week">
                    1 Week
                  </option>

                  <option value="1 Month">
                    1 Month
                  </option>
                </select>

              </div>

              {/* Quantity */}
              <div className="mt-3">

                <label className="mb-2 block text-sm font-semibold">
                  Quantity
                </label>

                <div className="flex h-11 w-fit overflow-hidden rounded-xl border border-gray-200">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="w-11 text-gray-600 hover:bg-gray-50"
                  >
                    −
                  </button>

                  <div className="flex w-12 items-center justify-center border-x border-gray-200 text-sm font-semibold">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="w-11 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>

                </div>

              </div>

              {/* Configuration */}
              {configuration && (
                <div className="mt-3 rounded-xl bg-[#e9f6f5] p-3">

                  <p className="text-xs font-semibold text-[#4f8c89]">
                    Selected Configuration
                  </p>

                  <div className="mt-1 flex flex-wrap gap-3">

                    {Object.entries(configuration).map(
                      ([key, value]) => (
                        <span
                          key={key}
                          className="text-xs text-gray-600"
                        >
                          {key}:{" "}
                          <strong className="text-gray-800">
                            {value}
                          </strong>
                        </span>
                      )
                    )}

                  </div>

                </div>
              )}

              {/* Buttons */}
              <div className="mt-auto flex gap-3 pt-4">

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 rounded-xl bg-[#4f8c89] py-3 text-sm font-semibold text-white transition hover:bg-[#376c69] active:scale-[0.98]"
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 rounded-xl border border-[#4f8c89] bg-white py-3 text-sm font-semibold text-[#4f8c89] transition hover:bg-[#e9f6f5] active:scale-[0.98]"
                >
                  Rent Now
                </button>

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* Configure Modal */}
      <ConfigureModal
        isOpen={showConfigure}
        onClose={() => setShowConfigure(false)}
        product={product}
        onConfirm={handleConfiguration}
      />

    </AppLayout>
  );
}

export default ProductDetails;