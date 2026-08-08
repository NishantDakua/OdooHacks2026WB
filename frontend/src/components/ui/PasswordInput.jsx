import { useState } from "react";

function PasswordInput({ placeholder = "Password" }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black bg-white px-3 py-2.5 pr-11 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/20"
      />

      <button
        type="button"
        onClick={() => setShowPassword((previous) => !previous)}
        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-500 transition hover:text-black"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          /* Eye Off */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.58 10.58a2 2 0 102.83 2.83"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.88 4.24A10.94 10.94 0 0112 4c5 0 8.5 4 9.5 6a11.8 11.8 0 01-4.06 4.64"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.61 6.61C4.67 7.77 3.4 9.34 2.5 10c1 2 4.5 6 9.5 6 1.13 0 2.17-.17 3.12-.47"
            />
          </svg>
        ) : (
          /* Eye */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
            />

            <circle
              cx="12"
              cy="12"
              r="2.5"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default PasswordInput;