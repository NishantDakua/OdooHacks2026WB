import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import OrderSummary from "../../components/ui/OrderSummary";
import { useCart } from "../../context/CartContext";
import AlertPopup from "../../components/ui/AlertPopup";

const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

function Payment() {
  const navigate = useNavigate();
  const { cart, cartCount, checkoutData, setCheckoutData, clearCart, cartTotal, discountAmount, finalTotal } = useCart();

  const [alertMessage, setAlertMessage] = useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayReady(true);
      return undefined;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    script.onerror = () => setAlertMessage("Unable to load Razorpay checkout.");
    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  useEffect(() => {
    if (cart.length === 0 || !checkoutData) {
      navigate("/cart");
    }
  }, [cart, checkoutData, navigate]);

  const handlePayNow = async () => {
    if (!razorpayKeyId) {
      setAlertMessage("Missing Razorpay key in frontend environment.");
      return;
    }

    if (!razorpayReady || !window.Razorpay) {
      setAlertMessage("Razorpay checkout is still loading. Please wait…");
      return;
    }

    if (processing) return;
    setProcessing(true);

    const amountInPaise = Math.max(Math.round(finalTotal * 100), 100);

    try {
      // ── Step 1: Create an order on the backend ──────────────────────────
      const orderResponse = await fetch("/api/v1/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rent-${Date.now()}`,
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok || !orderResult.success) {
        throw new Error(orderResult.message || "Failed to create Razorpay order.");
      }

      // ── Step 2: Open the Razorpay checkout modal ────────────────────────
      const options = {
        key: orderResult.data.key_id || razorpayKeyId,
        amount: orderResult.data.amount,
        currency: orderResult.data.currency,
        order_id: orderResult.data.order_id,
        name: "RentEase",
        description: "Rental payment",
        prefill: {
          name:
            checkoutData?.deliveryAddress?.fullName ||
            checkoutData?.billingAddress?.fullName ||
            "Customer",
          contact: checkoutData?.deliveryAddress?.phone || "",
        },
        notes: {
          source: "rent-ease-checkout",
        },

        // ── Payment success handler ─────────────────────────────────────
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch("/api/v1/payments/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyResult.success) {
              setAlertMessage(verifyResult.message || "Payment verification failed.");
              setProcessing(false);
              return;
            }

            // ── Verification passed — persist order locally ─────────────
            const newOrder = {
              id: Date.now().toString(),
              orderNumber: `RENT-${Math.floor(100000 + Math.random() * 900000)}`,
              userId: "demo-user-1",
              items: cart,
              deliveryMethod: checkoutData.deliveryMethod,
              deliveryAddress: checkoutData.deliveryAddress,
              billingAddress: checkoutData.billingAddress,
              subtotal: cartTotal,
              discountAmount,
              total: finalTotal,
              paymentStatus: "Paid",
              orderStatus: "Confirmed",
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              createdAt: new Date().toISOString(),
            };

            const existingOrders = JSON.parse(localStorage.getItem("rentals") || "[]");
            localStorage.setItem("rentals", JSON.stringify([newOrder, ...existingOrders]));
            localStorage.setItem("latestOrder", JSON.stringify(newOrder));

            setCheckoutData(null);
            clearCart();
            navigate("/checkout/success");
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            setAlertMessage(verifyError.message || "Payment verification failed. Please contact support.");
            setProcessing(false);
          }
        },

        modal: {
          ondismiss: () => {
            setAlertMessage("Payment cancelled.");
            setProcessing(false);
          },
        },
        theme: {
          color: "#4f8c89",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (event) => {
        setAlertMessage(event?.error?.description || "Payment failed.");
        setProcessing(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Razorpay order creation error:", error);
      setAlertMessage(error.message || "Failed to start Razorpay payment.");
      setProcessing(false);
    }
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
          
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black">Payment Method</h2>
                <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                  Razorpay Checkout
                </span>
              </div>

              <div className="rounded-xl border border-[#4f8c89] bg-[#e9f6f5] p-5 text-sm text-gray-700">
                Clicking <span className="font-semibold">Pay Now</span> opens the Razorpay payment modal.
                Use the test cards, UPI IDs, or wallet options inside the Razorpay popup.
              </div>
            </section>
          </div>

          {/* Right Side - Order Summary */}
          <div>
            <OrderSummary
              buttonContent={processing ? "Processing…" : "Pay Now"}
              onConfirm={handlePayNow}
              deliveryCharges={0}
              isPaymentPage={true}
            />
            
            <button
              type="button"
              onClick={() => navigate("/checkout/address")}
              disabled={processing}
              className="mt-4 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
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
