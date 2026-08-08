import { useState } from "react";

function ConfigureModal({
  isOpen,
  onClose,
  onConfirm,
  product,
}) {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [duration, setDuration] = useState("");

  if (!isOpen) return null;

  const options = product?.options || [
    {
      name: "Color",
      values: ["Black", "White", "Gray"],
    },
    {
      name: "Size",
      values: ["Small", "Medium", "Large"],
    },
  ];

  const handleSelect = (optionName, value) => {
    setSelectedOptions((previous) => ({
      ...previous,
      [optionName]: value,
    }));
  };

  const handleConfirm = () => {
    onConfirm({
      ...selectedOptions,
      "Rental Duration": duration || "1"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      {/* Modal */}
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

          <div>
            <h2 className="text-xl font-semibold text-black">
              Configure
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select your preferred product options.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            ×
          </button>

        </div>

        {/* Options */}
        <div className="space-y-5 p-6">

          {options.map((option) => (
            <div key={option.name}>

              <label className="mb-2 block text-sm font-semibold text-black">
                {option.name}
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                {option.values.map((value) => {
                  const selected =
                    selectedOptions[option.name] === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        handleSelect(option.name, value)
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
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

          {/* Duration Input */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-black">
              Rental Duration ({product?.duration === "Monthly" ? "Months" : "Days"})
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
              placeholder={`Enter number of ${product?.duration === "Monthly" ? "months" : "days"}`}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 p-6">

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
            className="flex-1 rounded-xl bg-[#4f8c89] py-3 text-sm font-semibold text-white transition hover:bg-[#376c69]"
          >
            Configure
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfigureModal;