import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !newPassword.trim()) {
      setError("Please enter your email and new password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to reset password");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
              <div className="mb-5">
                <h1 className="text-3xl font-semibold tracking-tight text-black">
                  Reset Password
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                  Enter your email and new password.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 rounded-xl border border-red-500 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-black">
                    Email ID
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-black bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/20"
                  />
                </div>

                {/* New Password */}
                <div className="mb-5">
                  <label className="mb-1 block text-sm font-medium text-black">
                    New Password
                  </label>

                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-black bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/20"
                  />
                </div>

                {/* Reset Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

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
                  Password Updated
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Your password has been reset successfully. You can now login with your new password.
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