import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import AlertPopup from "../components/ui/AlertPopup";
import ConfigureModal from "../components/ui/ConfigureModal";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { products as productCatalog } from "../data/products";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, cartCount } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = useMemo(
    () => productCatalog.find((item) => String(item.id) === String(id)),
    [id]
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState("1");
  const [showConfigure, setShowConfigure] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  if (!product) {
    return (
      <AppLayout title="Product Details" subtitle="Selected product not found.">
        <div className="flex min-h-[60vh] items-center justify-center px-8 py-10">
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
        </div>
      </AppLayout>
    );
  }

  const durationOptions =
    product.duration === "Monthly"
      ? ["1 Month", "6 Months", "1 Year"]
      : ["1 Day", "3 Days", "7 Days", "1 Month"];

  const handleAddToCart = () => {
    if (product.options?.length) {
      setShowConfigure(true);
      return;
    }

    addToCart(product, quantity, { "Rental Duration": selectedDuration });
    setAlertMessage(`${quantity} x ${product.name} added to cart.`);
  };

  const handleConfigurationConfirm = (options) => {
    addToCart(product, quantity, options);
    setAlertMessage(`${product.name} added to cart.`);
  };

  return (
    <AppLayout title="Product Details" subtitle="View product information and rental options.">
      <div className="px-8 py-7">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="mb-4 text-sm font-medium text-gray-600 transition hover:text-[#4f8c89]"
        >
          Back to Products
        </button>

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="grid min-h-[70vh] grid-cols-1 lg:grid-cols-[47%_53%]">
            <div className="flex items-center justify-center bg-[#e9f6f5] p-6">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[520px] w-full rounded-2xl object-contain bg-white"
              />
            </div>

            <div className="flex flex-col p-6 lg:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#e9f6f5] px-3 py-1.5 text-xs font-semibold text-[#4f8c89]">
                  {product.category}
                </span>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    isInWishlist(product.id)
                      ? "bg-[#e9f6f5] text-[#4f8c89]"
                      : "bg-gray-100 text-gray-600 hover:bg-[#e9f6f5] hover:text-[#4f8c89]"
                  }`}
                >
                  {isInWishlist(product.id) ? "Wishlisted" : "Wishlist"}
                </button>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight">{product.name}</h1>
              <p className="mt-1 text-sm text-gray-500">{product.brand}</p>

              <p className="mt-4 text-sm leading-6 text-gray-600">{product.description}</p>

              <div className="my-5 border-t border-gray-100" />

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-[#f5fbfb] px-3 py-2">
                  <p className="text-[10px] text-gray-500">Category</p>
                  <p className="mt-0.5 font-semibold">{product.category}</p>
                </div>
                <div className="rounded-xl bg-[#f5fbfb] px-3 py-2">
                  <p className="text-[10px] text-gray-500">Brand</p>
                  <p className="mt-0.5 font-semibold">{product.brand}</p>
                </div>
                <div className="rounded-xl bg-[#f5fbfb] px-3 py-2">
                  <p className="text-[10px] text-gray-500">Color</p>
                  <p className="mt-0.5 font-semibold">{product.color}</p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs text-gray-500">Rental price</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">₹{product.price}</span>
                  <span className="text-sm text-gray-500">
                    / {product.duration === "Monthly" ? "month" : "day"}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Rental Duration
                  </label>
                  <select
                    value={selectedDuration}
                    onChange={(event) => setSelectedDuration(event.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
                  >
                    <option value="1">Select rental duration</option>
                    {durationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
                  />
                </div>
              </div>

              <div className="mt-auto flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 rounded-xl bg-[#4f8c89] py-3 text-sm font-semibold text-white transition hover:bg-[#376c69] active:scale-[0.98]"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/rentals")}
                  className="flex-1 rounded-xl border border-[#4f8c89] bg-white py-3 text-sm font-semibold text-[#4f8c89] transition hover:bg-[#e9f6f5] active:scale-[0.98]"
                >
                  Rent Now
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Cart items: {cartCount}
              </div>
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
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
    </AppLayout>
  );
}

export default ProductDetails;