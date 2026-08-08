import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import OrderSummary from "../../components/ui/OrderSummary";
import { useCart } from "../../context/CartContext";
import Input from "../../components/ui/Input";
import AlertPopup from "../../components/ui/AlertPopup";

function Payment() {
  const navigate = useNavigate();
  const { cart, cartCount, checkoutData, setCheckoutData, clearCart, finalTotal } = useCart();

  const [cardName, setCardName] = useState("John Doe");
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [expiry, setExpiry] = useState("12/26");
  const [cvv, setCvv] = useState("123");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (cart.length === 0 || !checkoutData) {
      navigate("/cart");
    }
  }, [cart, checkoutData, navigate]);

  const handlePayNow = () => {
    // Basic validation
    if (!cardName || !cardNumber || !expiry || !cvv) {
      setAlertMessage("Please fill in all card details.");
      return;
    }

    // Demo Order Creation
    const newOrder = {
      id: Date.now().toString(),
      orderNumber: `RENT-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: "demo-user-1", // In real app, from AuthContext
      items: cart,
      deliveryMethod: checkoutData.deliveryMethod,
      deliveryAddress: checkoutData.deliveryAddress,
      billingAddress: checkoutData.billingAddress,
      subtotal: checkoutData.cartTotal, // wait, we don't have cartTotal in checkoutData. We can get it from context. Let's just store totals in the order.
      discountAmount: checkoutData.discountAmount,
      total: finalTotal, // using context finalTotal
      paymentStatus: "Paid",
      orderStatus: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    // Store order in localStorage for My Rentals
    const existingOrders = JSON.parse(localStorage.getItem("rentals") || "[]");
    localStorage.setItem("rentals", JSON.stringify([newOrder, ...existingOrders]));

    // Store the latest order to show on success page
    localStorage.setItem("latestOrder", JSON.stringify(newOrder));

    // Clear checkout session
    setCheckoutData(null);
    clearCart();

    // Navigate to success
    navigate("/checkout/success");
  };

  if (cart.length === 0 || !checkoutData) return null;

  return (
    <AppLayout title="Checkout" subtitle="Complete your payment" cartCount={cartCount}>
      <div className="min-h-full bg-[#f7fbfb] p-7">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
          <span className="cursor-pointer hover:text-[#4f8c89]" onClick={() => navigate("/home")}>Products</span>
          <span className="mx-2">→</span>
          <span className="cursor-pointer hover:text-[#4f8c89]" onClick={() => navigate("/cart")}>Cart</span>
          <span className="mx-2">→</span>
          <span className="cursor-pointer hover:text-[#4f8c89]" onClick={() => navigate("/checkout/address")}>Address</span>
          <span className="mx-2">→</span>
          <span className="text-[#4f8c89]">Payment</span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          
          {/* Left Side */}
          <div className="space-y-6">
            
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black">Payment Method</h2>
                <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                  Demo Payment Mode
                </span>
              </div>
              
              <div className="space-y-4 rounded-xl border border-[#4f8c89] bg-[#e9f6f5] p-5">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked
                    readOnly
                    className="h-4 w-4 text-[#4f8c89] focus:ring-[#4f8c89]"
                  />
                  <span className="font-medium text-black">Credit / Debit Card</span>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input label="Cardholder Name" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className="sm:col-span-2">
                    <Input label="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" />
                  </div>
                  <Input label="Expiry Date" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" />
                  <Input label="CVV" type="password" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" />
                </div>
              </div>
            </section>

          </div>

          {/* Right Side - Order Summary */}
          <div>
            <OrderSummary
              buttonContent="Pay Now"
              onConfirm={handlePayNow}
              deliveryCharges={0}
              isPaymentPage={true}
            />
            
            <button
              type="button"
              onClick={() => navigate("/checkout/address")}
              className="mt-4 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to Address
            </button>
          </div>

        </div>
      </div>

      <AlertPopup 
        isOpen={!!alertMessage} 
        message={alertMessage} 
        onClose={() => setAlertMessage("")} 
      />
    </AppLayout>
  );
}

export default Payment;
