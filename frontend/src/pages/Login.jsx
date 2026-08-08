import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/ui/PasswordInput";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invalid email or password");
      }

      // Save token and user in localStorage
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      alert("Login successful!");
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#a8dada] text-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <header className="text-4xl font-bold text-black">
            RentEase
          </header>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-black bg-white p-8 shadow-2xl shadow-black/10">

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-black">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage your rentals
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-500 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-black">
                Email
              </label>

              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-black bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/20"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-black">
                Password
              </label>

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="text-sm text-gray-600 transition hover:text-black"
            >
              Forgot Password?
            </button>
          </div>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-medium text-black underline-offset-4 hover:underline"
            >
              Register Here
            </button>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;