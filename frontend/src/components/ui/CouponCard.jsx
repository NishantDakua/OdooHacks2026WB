import { useState } from "react";

function CouponCard() {
  const couponCode = "RENTEASE10";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="rounded-2xl border border-black bg-white p-6 shadow-2xl shadow-black/10">

      {/* Heading */}
      <div className="text-center">
        <p className="text-sm font-medium text-[#4f8c89]">
          Welcome to RentEase
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-black">
          Your New-User Coupon
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Get 10% off your first rental.
        </p>
      </div>

      {/* Coupon Code */}
      <div className="mt-6 rounded-xl border-2 border-dashed border-[#4f8c89] bg-[#a8dada]/20 px-4 py-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Coupon Code
        </p>

        <p className="mt-2 text-2xl font-bold tracking-widest text-black">
          {couponCode}
        </p>
      </div>

      {/* Copy Button */}
      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
      >
        {copied ? "Copied!" : "Copy Code"}
      </button>

    </div>
  );
}

export default CouponCard;