import Card from "../ui/Card";

function OrderTimeline({ order }) {
  const status = order?.status;

  const steps = [
    {
      id: "QUOTATION",
      label: "Quotation Created",
      subtext: order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "",
      done: ["DRAFT", "QUOTATION_SENT", "CONFIRMED", "READY_FOR_PICKUP", "PICKED_UP", "RETURNED", "CLOSED"].includes(status),
      current: status === "DRAFT" || status === "QUOTATION_SENT",
    },
    {
      id: "CONFIRMED",
      label: "Order Confirmed",
      subtext: ["CONFIRMED", "READY_FOR_PICKUP", "PICKED_UP", "RETURNED", "CLOSED"].includes(status) ? "Confirmed" : "Pending",
      done: ["CONFIRMED", "READY_FOR_PICKUP", "PICKED_UP", "RETURNED", "CLOSED"].includes(status),
      current: status === "CONFIRMED" || status === "READY_FOR_PICKUP",
    },
    {
      id: "PICKED_UP",
      label: "Active / Picked Up",
      subtext: order?.actualPickupAt ? new Date(order.actualPickupAt).toLocaleDateString() : "With Customer",
      done: ["PICKED_UP", "RETURNED", "CLOSED"].includes(status),
      current: status === "PICKED_UP",
    },
    {
      id: "RETURNED",
      label: "Returned",
      subtext: order?.actualReturnAt ? new Date(order.actualReturnAt).toLocaleDateString() : "Pending Return",
      done: ["RETURNED", "CLOSED"].includes(status),
      current: status === "RETURNED",
    },
    {
      id: "CLOSED",
      label: "Completed",
      subtext: status === "CLOSED" ? "Closed & Settled" : "",
      done: status === "CLOSED",
      current: status === "CLOSED",
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Order Timeline</h3>
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-start md:flex-col md:items-center gap-3 md:gap-2 flex-1 relative">
            {/* Step dot */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                step.done
                  ? "bg-[#4f8c89] text-white shadow-sm"
                  : "bg-gray-100 text-gray-400 border border-gray-200"
              }`}
            >
              {idx + 1}
            </div>

            {/* Label */}
            <div className="md:text-center">
              <p className={`text-xs font-semibold ${step.done ? "text-gray-900" : "text-gray-400"}`}>
                {step.label}
              </p>
              {step.subtext && (
                <p className="text-[11px] text-gray-500">{step.subtext}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default OrderTimeline;
