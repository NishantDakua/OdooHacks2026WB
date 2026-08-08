import { useCart } from "../../context/CartContext";

function OrderSummary({ buttonContent, onConfirm, deliveryCharges = 0, isPaymentPage = false }) {
  const { cart, cartTotal, discountAmount, finalTotal } = useCart();
  const total = finalTotal + deliveryCharges;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-black">Order Summary</h2>

      {/* Cart Items Summary (limited) */}
      <div className="mb-6 space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#eef9f8]">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 text-sm">
              <h3 className="font-semibold text-black">{item.product.name}</h3>
              <p className="mt-1 text-gray-500">
                Qty: {item.quantity} • {item.product.duration}
              </p>
              <div className="mt-1 flex items-center justify-between font-medium text-black">
                <span>₹{item.product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-black">₹{cartTotal}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span className="font-medium">-₹{discountAmount}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Delivery Charges</span>
          <span className="font-medium text-black">
            {deliveryCharges === 0 ? "Free" : `₹${deliveryCharges}`}
          </span>
        </div>

        <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-bold text-black">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {buttonContent && (
        <button
          type="button"
          onClick={onConfirm}
          className="mt-6 w-full rounded-xl bg-[#4f8c89] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#376c69]"
        >
          {buttonContent}
        </button>
      )}
    </div>
  );
}

export default OrderSummary;
