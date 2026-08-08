import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/ui/PasswordInput";

function Login() {
  const navigate = useNavigate();

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
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-black">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage your rentals
            </p>
          </div>

          {/* Login ID */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-black">
              Login ID
            </label>

            <input
              type="text"
              placeholder="Enter your login ID"
              className="w-full rounded-xl border border-black bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/20"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-black">
              Password
            </label>

            <PasswordInput placeholder="Enter your password" />
          </div>

          {/* Login Button */}
          <button
            type="button"
            className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >
            Log In
          </button>

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