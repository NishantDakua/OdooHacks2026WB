import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) {
      setError("Please enter your email ID.");
      return;
    }

    setError("");
    setSubmitted(true);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#a8dada] text-black flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <header className="text-4xl font-bold text-black">
            RentEase
          </header>
        </div>

        {/* Reset Password Card */}
        <div className="rounded-2xl border border-black bg-white p-6 shadow-2xl shadow-black/10">

          {!submitted ? (
            <>
              {/* Heading */}
              <div className="mb-6">
                <h1 className="text-3xl font-semibold tracking-tight text-black">
                  Reset Password
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                  Enter your email to receive a password reset link.
                </p>
              </div>

              {/* Email */}
              <div className="mb-2">
                <label className="mb-1 block text-sm font-medium text-black">
                  Email ID
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-black bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/20"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="mb-4 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
              >
                Reset Password
              </button>

              {/* Back to Login */}
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-sm text-gray-600 transition hover:text-black"
                >
                  Back to Login
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Success Icon */}
              <div className="mb-5 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#a8dada]">
                  <span className="text-2xl font-bold text-black">
                    ✓
                  </span>
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-black">
                  Check your email
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  If an account exists for this email, a password reset link
                  has been sent to you.
                </p>
              </div>

              {/* Back to Login */}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="mt-6 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
              >
                Back to Login
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;