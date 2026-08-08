import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/ui/PasswordInput";

function Signup() {
  const navigate = useNavigate();

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
          <div className="mb-5">
            <h1 className="text-3xl font-semibold tracking-tight text-black">
              Create your account
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Sign up to start managing your rentals
            </p>
          </div>

          {/* First Name + Last Name */}
          <div className="grid grid-cols-2 gap-4 mb-3">

            <div>
              <label className="mb-1 block text-sm font-medium text-black">
                First Name
              </label>

              <input
                type="text"
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

              <PasswordInput placeholder="Create password" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-black">
                Confirm Password
              </label>

              <PasswordInput placeholder="Confirm password" />
            </div>

          </div>

          {/* Register Button */}
          <button
            type="button"
            onClick={() => navigate("/coupon")}
            className="w-full rounded-xl bg-black py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >
            Register
          </button>

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