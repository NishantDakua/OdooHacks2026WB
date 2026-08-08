import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import OrderSummary from "../../components/ui/OrderSummary";
import { useCart } from "../../context/CartContext";
import Input from "../../components/ui/Input";
import AlertPopup from "../../components/ui/AlertPopup";

function Address() {
  const navigate = useNavigate();
  const { cart, cartCount, checkoutData, setCheckoutData } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState(
    checkoutData?.deliveryMethod || "Standard Delivery"
  );
  
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true);

  const [deliveryAddress, setDeliveryAddress] = useState(
    checkoutData?.deliveryAddress || {
      fullName: "John Doe",
      phone: "+91 9876543210",
      addressLine: "123, Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    }
  );

  const [billingAddress, setBillingAddress] = useState(
    checkoutData?.billingAddress || { ...deliveryAddress }
  );
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const handleDeliveryAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingAddressChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    // Basic validation
    if (!deliveryAddress.fullName || !deliveryAddress.addressLine || !deliveryAddress.city) {
      setAlertMessage("Please fill in all required delivery address fields.");
      return;
    }

    if (!billingSameAsDelivery && (!billingAddress.fullName || !billingAddress.addressLine || !billingAddress.city)) {
      setAlertMessage("Please fill in all required billing address fields.");
      return;
    }

    const finalBillingAddress = billingSameAsDelivery ? deliveryAddress : billingAddress;

    setCheckoutData({
      ...checkoutData,
      deliveryMethod,
      deliveryAddress,
      billingAddress: finalBillingAddress,
    });

    navigate("/checkout/payment");
  };

  if (cart.length === 0) return null;

  return (
    <AppLayout title="Checkout" subtitle="Delivery and Billing Address" cartCount={cartCount}>
      <div className="min-h-full bg-[#f7fbfb] p-7">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
          <span className="cursor-pointer hover:text-[#4f8c89]" onClick={() => navigate("/home")}>Products</span>
          <span className="mx-2">→</span>
          <span className="cursor-pointer hover:text-[#4f8c89]" onClick={() => navigate("/cart")}>Cart</span>
          <span className="mx-2">→</span>
          <span className="text-[#4f8c89]">Address</span>
          <span className="mx-2">→</span>
          <span>Payment</span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          
          {/* Left Side */}
          <div className="space-y-6">
            
            {/* Delivery Method */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-black">Delivery Method</h2>
              <div className="space-y-3">
                <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${deliveryMethod === "Standard Delivery" ? "border-[#4f8c89] bg-[#e9f6f5]" : "border-gray-200"}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="Standard Delivery"
                      checked={deliveryMethod === "Standard Delivery"}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="h-4 w-4 text-[#4f8c89] focus:ring-[#4f8c89]"
                    />
                    <span className="font-medium text-black">Standard Delivery</span>
                  </div>
                  <span className="text-gray-600">Free</span>
                </label>

                <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${deliveryMethod === "Pick up from Store" ? "border-[#4f8c89] bg-[#e9f6f5]" : "border-gray-200"}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="Pick up from Store"
                      checked={deliveryMethod === "Pick up from Store"}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="h-4 w-4 text-[#4f8c89] focus:ring-[#4f8c89]"
                    />
                    <span className="font-medium text-black">Pick up from Store</span>
                  </div>
                  <span className="text-gray-600">Free</span>
                </label>
              </div>
            </section>

            {/* Delivery Address */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black">Delivery Address</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full Name" name="fullName" value={deliveryAddress.fullName} onChange={handleDeliveryAddressChange} placeholder="John Doe" required />
                <Input label="Phone" name="phone" value={deliveryAddress.phone} onChange={handleDeliveryAddressChange} placeholder="+91 9876543210" required />
                <div className="sm:col-span-2">
                  <Input label="Address Line" name="addressLine" value={deliveryAddress.addressLine} onChange={handleDeliveryAddressChange} placeholder="123, Main Street" required />
                </div>
                <Input label="City" name="city" value={deliveryAddress.city} onChange={handleDeliveryAddressChange} placeholder="Mumbai" required />
                <Input label="State" name="state" value={deliveryAddress.state} onChange={handleDeliveryAddressChange} placeholder="Maharashtra" required />
                <Input label="Postal Code" name="postalCode" value={deliveryAddress.postalCode} onChange={handleDeliveryAddressChange} placeholder="400001" required />
                <Input label="Country" name="country" value={deliveryAddress.country} onChange={handleDeliveryAddressChange} placeholder="India" required />
              </div>
            </section>

            {/* Billing Address */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-black">Billing Address</h2>
              
              <label className="mb-4 flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={billingSameAsDelivery}
                  onChange={(e) => setBillingSameAsDelivery(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#4f8c89] focus:ring-[#4f8c89]"
                />
                <span className="text-sm font-medium text-black">Billing address same as delivery address</span>
              </label>

              {!billingSameAsDelivery && (
                <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2">
                  <Input label="Full Name" name="fullName" value={billingAddress.fullName} onChange={handleBillingAddressChange} placeholder="John Doe" required />
                  <Input label="Phone" name="phone" value={billingAddress.phone} onChange={handleBillingAddressChange} placeholder="+91 9876543210" required />
                  <div className="sm:col-span-2">
                    <Input label="Address Line" name="addressLine" value={billingAddress.addressLine} onChange={handleBillingAddressChange} placeholder="123, Main Street" required />
                  </div>
                  <Input label="City" name="city" value={billingAddress.city} onChange={handleBillingAddressChange} placeholder="Mumbai" required />
                  <Input label="State" name="state" value={billingAddress.state} onChange={handleBillingAddressChange} placeholder="Maharashtra" required />
                  <Input label="Postal Code" name="postalCode" value={billingAddress.postalCode} onChange={handleBillingAddressChange} placeholder="400001" required />
                  <Input label="Country" name="country" value={billingAddress.country} onChange={handleBillingAddressChange} placeholder="India" required />
                </div>
              )}
            </section>

          </div>

          {/* Right Side - Order Summary */}
          <div>
            <OrderSummary
              buttonContent="Confirm & Continue to Payment"
              onConfirm={handleConfirm}
              deliveryCharges={0}
            />
            
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="mt-4 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to Cart
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

export default Address;
