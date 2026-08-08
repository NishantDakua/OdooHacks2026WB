import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ConfigureModal from "../components/ui/ConfigureModal";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { products } from "../data/products";
import AlertPopup from "../components/ui/AlertPopup";

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
  const [alertMessage, setAlertMessage] = useState("");

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
      setAlertMessage("Please enter a rental duration.");
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

                <input
                  type="number"
                  min="1"
                  value={selectedDuration}
                  onChange={(event) =>
                    setSelectedDuration(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
                  placeholder={`Number of ${product.duration === "Monthly" ? "Months" : "Days"}`}
                />

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

      <AlertPopup 
        isOpen={!!alertMessage} 
        message={alertMessage} 
        onClose={() => setAlertMessage("")} 
      />

    </AppLayout>
  );
}

export default ProductDetails;