import { useState, useEffect } from "react";

const getTodayYMD = () => new Date().toISOString().split('T')[0];
const getDaysDifference = (end, start) => Math.max(0, Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)));

const API_BASE_URL = "http://localhost:5000/api/v1";

function ConfigureModal({
  isOpen,
  onClose,
  onConfirm,
  product,
}) {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedOptions({});
      setStartDate("");
      setEndDate("");
      setQuantity(1);
      setAvailability(null);
    }
  }, [isOpen]);

  // Compute dynamic options from variants
  const colors = [...new Set(product?.variants?.map(v => v.color).filter(Boolean))];
  const sizes = [...new Set(product?.variants?.map(v => v.size).filter(Boolean))];
  
  const options = [];
  if (colors.length > 0) options.push({ name: "Color", values: colors });
  if (sizes.length > 0) options.push({ name: "Size", values: sizes });

  // Resolve matching variant
  const matchedVariant = product?.variants?.find(v => {
    const colorMatch = !colors.length || v.color === selectedOptions.Color;
    const sizeMatch = !sizes.length || v.size === selectedOptions.Size;
    return colorMatch && sizeMatch;
  });

  useEffect(() => {
    const checkAvailability = async () => {
      if (!startDate || !endDate || !product?.id) {
        setAvailability(null);
        return;
      }
      
      if (options.length > 0 && !matchedVariant) {
        setAvailability(null);
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start >= end) {
        setAvailability(null);
        return; 
      }

      setChecking(true);
      try {
        const variantQuery = matchedVariant ? `&variantId=${matchedVariant.id}` : "";
        const res = await fetch(`${API_BASE_URL}/products/${product.id}/availability?startDate=${startDate}&endDate=${endDate}&quantity=${quantity}${variantQuery}`);
        const data = await res.json();
        if (data.success) {
          setAvailability(data.data);
        } else {
          setAvailability(null);
        }
      } catch (e) {
        console.error(e);
        setAvailability(null);
      } finally {
        setChecking(false);
      }
    };

    const timer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timer);
  }, [startDate, endDate, quantity, product?.id, matchedVariant?.id]);

  if (!isOpen) return null;

  const handleSelect = (optionName, value) => {
    setSelectedOptions((previous) => ({
      ...previous,
      [optionName]: value,
    }));
  };

  // Validation
  let validationMessage = "";
  let isValid = true;

  for (const opt of options) {
    if (!selectedOptions[opt.name]) {
      validationMessage = `Select a ${opt.name.toLowerCase()}`;
      isValid = false;
      break;
    }
  }

  if (isValid && options.length > 0 && !matchedVariant) {
    validationMessage = "This combination is not available.";
    isValid = false;
  }

  if (isValid && (!startDate || !endDate)) {
    validationMessage = "Select rental dates";
    isValid = false;
  } else if (isValid && new Date(startDate) >= new Date(endDate)) {
    validationMessage = "End date must be after start date";
    isValid = false;
  }

  const canAddToCart = isValid && !checking && availability?.isAvailable === true;

  if (isValid && availability && !availability.isAvailable) {
    validationMessage = `Not available for selected dates (Only ${availability.availableQty} left)`;
  } else if (isValid && !checking && !availability) {
    validationMessage = "Unable to check availability. Please try again.";
  }

  const days = startDate && endDate && new Date(startDate) < new Date(endDate) 
    ? getDaysDifference(new Date(endDate), new Date(startDate)) 
    : 0;

  const pricePerDay = product?.pricelistRules?.[0]?.price || product?.price || 500; // fallback
  const subtotal = days * pricePerDay * quantity;

  const handleConfirm = () => {
    if (!canAddToCart) return;
    onConfirm({
      ...selectedOptions,
      "Rental Start": startDate,
      "Rental End": endDate,
      "Rental Duration": days.toString(),
      quantity,
      variantId: matchedVariant ? matchedVariant.id : product?.variants?.[0]?.id
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {/* Modal */}
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-black">Configure Rental</h2>
            <p className="mt-1 text-sm text-gray-500">Select options and rental period</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="space-y-6 p-6 overflow-y-auto">
          
          {/* Options */}
          {options.map((option) => (
            <div key={option.name}>
              <label className="mb-2 block text-sm font-semibold text-black">{option.name}</label>
              <div className="flex flex-wrap gap-3">
                {option.values.map((value) => {
                  const selected = selectedOptions[option.name] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleSelect(option.name, value)}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                        selected
                          ? "border-[#4f8c89] bg-[#e9f6f5] text-[#4f8c89]"
                          : "border-gray-200 bg-white text-gray-700 hover:border-[#4f8c89]"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Rental Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-black">Start Date</label>
              <input
                type="date"
                min={getTodayYMD()}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-black">End Date</label>
              <input
                type="date"
                min={startDate || getTodayYMD()}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-black">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Availability Status */}
          {startDate && endDate && new Date(startDate) < new Date(endDate) && (
            <div className={`rounded-lg p-4 text-sm ${checking ? "bg-gray-50 text-gray-600" : availability?.isAvailable ? "bg-[#e9f6f5] text-[#4f8c89]" : "bg-red-50 text-red-600"}`}>
              {checking ? (
                "Checking availability..."
              ) : availability?.isAvailable ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <strong>Available for selected dates</strong>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg">✕</span>
                  <strong>{validationMessage || "Not available for selected dates"}</strong>
                </div>
              )}
            </div>
          )}

          {/* Price Preview */}
          {days > 0 && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>₹{pricePerDay}/day × {days} days × {quantity} qty</span>
                <span className="font-semibold text-black">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Security Deposit</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 shrink-0">
          {!canAddToCart && !checking && validationMessage && (
            <p className="mb-4 text-center text-sm font-medium text-red-500">
              {validationMessage}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canAddToCart}
              className={`flex-1 rounded-xl py-3 text-sm font-semibold text-white transition ${
                canAddToCart
                  ? "bg-[#4f8c89] hover:bg-[#376c69]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Configure / Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigureModal;