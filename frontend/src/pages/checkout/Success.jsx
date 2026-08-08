import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { useCart } from "../../context/CartContext";

function Success() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const latestOrder = localStorage.getItem("latestOrder");
    if (latestOrder) {
      setOrder(JSON.parse(latestOrder));
    } else {
      navigate("/home");
    }
  }, [navigate]);

  if (!order) return null;

  return (
    <AppLayout title="Order Successful" subtitle="Thank you for renting with us" cartCount={cartCount}>
      <div className="min-h-full bg-[#f7fbfb] p-7 print-container">
        
        <div className="mx-auto max-w-3xl">
          
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            
            {/* Header */}
            <div className="mb-8 text-center print-header">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-black">Thank you for your order!</h1>
              <p className="mt-2 text-gray-500">Your payment has been processed successfully.</p>
              <p className="mt-1 font-semibold text-[#4f8c89]">Order {order.orderNumber}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Delivery Info */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-black border-b pb-2">Delivery Information</h3>
                <p className="font-medium text-black">{order.deliveryAddress.fullName}</p>
                <p className="text-gray-600">{order.deliveryAddress.phone}</p>
                <p className="text-gray-600 mt-1">{order.deliveryAddress.addressLine}</p>
                <p className="text-gray-600">{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}</p>
                <p className="text-gray-600">{order.deliveryAddress.country}</p>
                
                <p className="mt-3 font-medium text-black">Method:</p>
                <p className="text-gray-600">{order.deliveryMethod}</p>
              </div>

              {/* Billing Info */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-black border-b pb-2">Billing Information</h3>
                <p className="font-medium text-black">{order.billingAddress.fullName}</p>
                <p className="text-gray-600">{order.billingAddress.phone}</p>
                <p className="text-gray-600 mt-1">{order.billingAddress.addressLine}</p>
                <p className="text-gray-600">{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}</p>
                <p className="text-gray-600">{order.billingAddress.country}</p>

                <p className="mt-3 font-medium text-black">Payment Status:</p>
                <p className="text-green-600 font-semibold">{order.paymentStatus}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold text-black border-b pb-2">Order Summary</h3>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#eef9f8]">
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <h4 className="font-semibold text-black">{item.product.name}</h4>
                      <p className="text-gray-500">Qty: {item.quantity} • {item.product.duration}</p>
                    </div>
                    <div className="text-right text-sm font-medium text-black">
                      ₹{item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col items-end space-y-2 text-sm">
                <div className="flex w-full max-w-xs justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-black">₹{order.subtotal}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex w-full max-w-xs justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{order.discountAmount}</span>
                  </div>
                )}
                <div className="flex w-full max-w-xs justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="font-medium text-black">Free</span>
                </div>
                <div className="flex w-full max-w-xs justify-between border-t border-gray-200 pt-3 text-lg font-bold text-black">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>

            {/* Actions (Hidden on Print) */}
            <div className="mt-10 flex gap-4 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 rounded-xl border border-[#4f8c89] bg-white py-3 font-semibold text-[#4f8c89] transition hover:bg-[#e9f6f5]"
              >
                Print Invoice
              </button>
              <button
                type="button"
                onClick={() => navigate("/rentals")}
                className="flex-1 rounded-xl bg-[#4f8c89] py-3 font-semibold text-white transition hover:bg-[#376c69]"
              >
                View My Rentals
              </button>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Success;
