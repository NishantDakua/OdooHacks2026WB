import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import { useCart } from "../context/CartContext";

function Rentals() {
  const { cartCount } = useCart();
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const savedRentals = localStorage.getItem("rentals");
    if (savedRentals) {
      setRentals(JSON.parse(savedRentals));
    }
  }, []);

  return (
    <AppLayout title="My Rentals" subtitle="Active and past rentals" cartCount={cartCount}>
      <div className="h-full overflow-y-auto overflow-x-hidden bg-[#f7fbfb] p-7">
        <div className="mx-auto max-w-4xl space-y-4">
          <Card className="p-6">
            <h2 className="text-3xl font-semibold tracking-tight text-black">My Rentals</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              This customer page shows demo rentals stored locally for showcase purposes.
            </p>
          </Card>

          {rentals.length === 0 ? (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-black">No active rentals</h3>
              <p className="mt-2 text-sm text-gray-600">Once you complete an order, it will appear here.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {rentals.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="font-semibold text-black">Order {order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {order.orderStatus}
                      </span>
                      <p className="mt-2 text-sm font-semibold text-black">₹{order.total}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {order.items.map((item) => {
                      const duration = Number(item.configuration?.["Rental Duration"]) || 1;
                      const isMonthly = item.product.duration === "Monthly";
                      const totalDays = isMonthly ? duration * 30 : duration;
                      
                      const orderDate = new Date(order.createdAt);
                      const now = new Date();
                      const diffTime = Math.abs(now - orderDate);
                      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                      
                      const remainingDays = Math.max(totalDays - diffDays, 0);

                      return (
                        <div key={item.id} className="flex gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#eef9f8]">
                            <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 text-sm flex justify-between items-center border-b border-gray-50 pb-2">
                            <div>
                              <p className="font-medium text-black">{item.product.name}</p>
                              <p className="text-gray-500 mt-0.5">
                                Qty: {item.quantity} • {duration} {isMonthly ? (duration > 1 ? "Months" : "Month") : (duration > 1 ? "Days" : "Day")}
                              </p>
                            </div>
                            <div className="text-right">
                              {remainingDays > 0 ? (
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#eef9f8] px-2.5 py-1 text-xs font-semibold text-[#4f8c89]">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#4f8c89]"></span>
                                  {remainingDays} {remainingDays === 1 ? 'day' : 'days'} left
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                                  Expired
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default Rentals;