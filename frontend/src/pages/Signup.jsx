import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/ui/PasswordInput";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect directly to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Registration failed");
      }

      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      alert("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#a8dada] text-black flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <header className="text-4xl font-bold text-black">
            RentEase
          </header>
        </div>

        {/* Signup Card */}
        <div className="rounded-2xl border border-black bg-white p-6 shadow-2xl shadow-black/10">

          {/* Heading */}
          <div className="mb-4">
            <h1 className="text-3xl font-semibold tracking-tight text-black">
              Create your account
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Sign up to start managing your rentals
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-500 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* First Name + Last Name */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-black">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full rounded-xl border border-black bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-black">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full rounded-xl border border-black bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/20"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-black">
                Email ID
              </label>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-black bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/20"
              />
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-black">
                  Password
                </label>

                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-black">
                  Confirm Password
                </label>

                <PasswordInput
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Become a Vendor */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => navigate("/vendor-signup")}
              className="w-full rounded-xl border border-black bg-white py-2.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white active:scale-[0.98]"
            >
              Become a Vendor
            </button>
          </div>

        </div>

        {/* Login Navigation */}
        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-black underline-offset-4 hover:underline"
          >
            Login Here
          </button>
        </p>

      </div>
    </div>
  );
}

export default Signup;