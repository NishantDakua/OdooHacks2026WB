import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/ui/PasswordInput";

function VendorSignup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#a8dada] text-black flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <header className="text-4xl font-bold text-black">
            RentEase
          </header>
        </div>

        {/* Vendor Signup Card */}
        <div className="rounded-2xl border border-black bg-white p-6 shadow-2xl shadow-black/10">

          {/* Heading */}
          <div className="mb-5">
            <h1 className="text-3xl font-semibold tracking-tight text-black">
              Become a Vendor
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Register your business to start renting products
            </p>
          </div>

          {/* First Name + Last Name */}
          <div className="grid grid-cols-2 gap-4 mb-3">

            {/* First Name */}
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

            {/* Last Name */}
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

          {/* Company Name */}
          <div className="mb-3">
            <label className="mb-1 block text-sm font-medium text-black">
              Company Name
            </label>

            <input
              type="text"
              placeholder="Enter company name"
              className="w-full rounded-xl border border-black bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/20"
            />
          </div>

          {/* Product Category */}
          <div className="mb-3">
            <label className="mb-1 block text-sm font-medium text-black">
              Product Category
            </label>

            <select
              defaultValue=""
              className="w-full rounded-xl border border-black bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/20"
            >
              <option value="" disabled>
                Select product category
              </option>

              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="vehicles">Vehicles</option>
              <option value="appliances">Appliances</option>
              <option value="tools">Tools & Equipment</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* GST Number */}
          <div className="mb-3">
            <label className="mb-1 block text-sm font-medium text-black">
              GST Number
            </label>

            <input
              type="text"
              placeholder="Enter GST number"
              className="w-full rounded-xl border border-black bg-white px-3 py-2.5 text-sm text-black uppercase outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/20"
            />
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

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-black">
                Password
              </label>

              <PasswordInput placeholder="Create password" />
            </div>

            {/* Confirm Password */}
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
            className="w-full rounded-xl bg-black py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >
            Register
          </button>

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

export default VendorSignup;