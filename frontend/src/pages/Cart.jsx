import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Modal from "../components/ui/Modal";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  const {
    cart,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const subtotal = cartTotal;
  const isCouponApplied = appliedCoupon === "RENTEASE10";
  const discountAmount = useMemo(
    () => (isCouponApplied ? Math.round(subtotal * 0.1) : 0),
    [isCouponApplied, subtotal]
  );
  const finalTotal = Math.max(subtotal - discountAmount, 0);

  const openCouponModal = () => {
    setCouponInput(appliedCoupon);
    setCouponError("");
    setIsCouponModalOpen(true);
  };

  const closeCouponModal = () => {
    setIsCouponModalOpen(false);
    setCouponError("");
  };

  const handleApplyCoupon = () => {
    const normalizedCoupon = couponInput.trim().toUpperCase();

    if (normalizedCoupon === "RENTEASE10") {
      setAppliedCoupon("RENTEASE10");
      setCouponError("");
      setIsCouponModalOpen(false);
      return;
    }

    setCouponError("Invalid coupon code.");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponInput("");
    setCouponError("");
  };

  if (cart.length === 0) {
    return (
      <AppLayout
        title="Your Cart"
        subtitle="Review the products you want to rent"
        cartCount={0}
      >
        <div className="min-h-full bg-[#f7fbfb] p-7">

          <div className="flex min-h-[500px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f6f5] text-[#4f8c89]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4h2l2.2 11h10.6L20 7H6"
                  />
                  <circle cx="9" cy="19" r="1.5" />
                  <circle cx="17" cy="19" r="1.5" />
                </svg>
              </div>

              <h2 className="mt-5 text-xl font-semibold text-black">
                Your cart is empty
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Browse products and add something to your cart.
              </p>

              <button
                type="button"
                onClick={() => navigate("/home")}
                className="mt-6 rounded-xl bg-[#4f8c89] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#376c69]"
              >
                Browse Products
              </button>

            </div>

          </div>

        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Your Cart"
      subtitle={`${cartCount} item${cartCount !== 1 ? "s" : ""} in your cart`}
      cartCount={cartCount}
    >
      <div className="min-h-full bg-[#f7fbfb] p-7">

        <div className="mb-5 flex items-center justify-between">

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#4f8c89]"
          >
            ← Continue Shopping
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-semibold text-red-500 hover:text-red-600"
          >
            Clear Cart
          </button>

        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">

          {/* Cart Items */}
          <div className="space-y-4">

            {cart.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >

                <div className="flex gap-5">

                  {/* Image */}
                  <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-[#eef9f8]">

                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />

                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">

                    <div className="flex justify-between gap-4">

                      <div>
                        <span className="rounded-md bg-[#e9f6f5] px-2 py-1 text-xs font-semibold text-[#4f8c89]">
                          {item.product.category}
                        </span>

                        <h3 className="mt-2 text-lg font-semibold text-black">
                          {item.product.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.product.brand} •{" "}
                          {item.product.color}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>

                    </div>

                    {/* Configuration */}
                    {Object.keys(item.configuration || {})
                      .length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">

                        {Object.entries(
                          item.configuration
                        ).map(([key, value]) => (
                          <span
                            key={key}
                            className="rounded-lg bg-gray-50 px-3 py-1 text-xs text-gray-600"
                          >
                            {key}:{" "}
                            <strong>{value}</strong>
                          </span>
                        ))}

                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">

                      {/* Quantity */}
                      <div className="flex h-9 overflow-hidden rounded-lg border border-gray-200">

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          className="w-9 hover:bg-gray-50"
                        >
                          −
                        </button>

                        <div className="flex w-10 items-center justify-center border-x border-gray-200 text-sm font-semibold">
                          {item.quantity}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          className="w-9 hover:bg-gray-50"
                        >
                          +
                        </button>

                      </div>

                      <div className="text-right">

                        <span className="text-lg font-bold text-black">
                          ₹
                          {item.product.price *
                            item.quantity}
                        </span>

                        <span className="ml-1 text-xs text-gray-500">
                          /{" "}
                          {item.product.duration ===
                          "Monthly"
                            ? "month"
                            : "day"}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-black">
              Order Summary
            </h2>

            <div className="my-5 border-t border-gray-100" />

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Items
                </span>

                <span className="font-medium">
                  {cartCount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Rental Subtotal
                </span>

                <span className="font-medium">
                  ₹{subtotal}
                </span>
              </div>

              {isCouponApplied && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Coupon Applied
                    </span>

                    <span className="font-semibold text-[#4f8c89]">
                      RENTEASE10
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Discount
                    </span>

                    <span className="font-medium text-green-600">
                      -₹{discountAmount}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Delivery Charges
                </span>

                <span className="font-medium text-green-600">
                  Free
                </span>
              </div>

            </div>

            <div className="my-5 border-t border-gray-100" />

            <div className="flex items-center justify-between">

              <span className="font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold">
                ₹{finalTotal}
              </span>

            </div>

            <button
              type="button"
              onClick={openCouponModal}
              className="mt-4 w-full rounded-xl border border-[#4f8c89] bg-[#e9f6f5] py-3 text-sm font-semibold text-[#4f8c89] transition hover:bg-[#d9f0ee]"
            >
              Apply Coupon
            </button>

            {isCouponApplied && (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="mt-3 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Remove Coupon
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-xl bg-[#4f8c89] py-3 text-sm font-semibold text-white transition hover:bg-[#376c69]"
            >
              Proceed to Checkout
            </button>

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="mt-3 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Continue Shopping
            </button>

          </aside>

        </div>

        <Modal
          open={isCouponModalOpen}
          title="Apply Coupon"
          onClose={closeCouponModal}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-black">
                Coupon Code
              </label>

              <input
                type="text"
                value={couponInput}
                onChange={(event) => {
                  setCouponInput(event.target.value);
                  setCouponError("");
                }}
                placeholder="Enter coupon code"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
              />

              {couponError && (
                <p className="mt-2 text-sm text-red-500">
                  {couponError}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-[#e9f6f5] bg-[#f7fbfb] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Available Coupon
              </p>

              <p className="mt-2 text-sm font-bold text-[#4f8c89]">
                RENTEASE10
              </p>

              <p className="mt-1 text-sm text-gray-600">
                10% off your first rental
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="flex-1 rounded-xl bg-[#4f8c89] py-3 text-sm font-semibold text-white transition hover:bg-[#376c69]"
              >
                Apply
              </button>

              <button
                type="button"
                onClick={closeCouponModal}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </AppLayout>
  );
}

export default Cart;