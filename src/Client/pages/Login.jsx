// src/Client/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../api-services/apiService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path (e.g. user came from Cart → go back after login)
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await loginUser({ email, password });
      if (result.success) {
        // Save auth data
        debugger;
        localStorage.setItem("token", result?.data?.data?.token);
        localStorage.setItem("user", JSON.stringify(result.data?.data?.user));

        // Trigger re-render in layout/header
        window.dispatchEvent(new Event("userChanged"));

        // Success! Redirect back to where user came from
        navigate(from, { replace: true });
      } else {
        setError(result.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 lg:p-10 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mb-5 shadow-lg">
            <span className="text-3xl sm:text-4xl font-bold text-white">H</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-600 mt-2 sm:mt-3 text-base sm:text-lg">
            Sign in to discover handcrafted treasures
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-200/70 text-red-700 rounded-xl text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-white/70 border border-gray-300/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200 backdrop-blur-sm text-base sm:text-lg placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-white/70 border border-gray-300/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200 backdrop-blur-sm text-base sm:text-lg placeholder-gray-400"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-600 select-none">
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base sm:text-lg py-4 sm:py-5 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="my-7 sm:my-8 flex items-center">
          <div className="flex-1 h-px bg-gray-300/70"></div>
          <span className="px-4 text-sm text-gray-500 bg-white/80 backdrop-blur-sm">
            or
          </span>
          <div className="flex-1 h-px bg-gray-300/70"></div>
        </div>

        {/* Links */}
        <div className="space-y-4 text-center text-sm sm:text-base">
          <p className="text-gray-600">
            New here?{" "}
            <Link
              to="/register"
              state={{ from: location.state?.from }}
              className="font-semibold text-amber-700 hover:text-amber-800 transition-colors"
            >
              Create an account
            </Link>
          </p>

          <p className="text-gray-600">
            Admin?{" "}
            <Link
              to="/admin/login"
              state={{ from: location.state?.from }}
              className="font-semibold text-amber-700 hover:text-amber-800 transition-colors"
            >
              Admin Login
            </Link>
          </p>
        </div>

        {/* Demo */}
        {/* <div className="mt-8 sm:mt-10 p-4 sm:p-5 bg-amber-50/50 border border-amber-100 rounded-xl text-center text-xs sm:text-sm text-gray-600">
          <p className="font-medium text-amber-800 mb-1.5">Demo credentials</p>
          <p className="font-mono">user@example.com</p>
          <p className="font-mono">password123</p>
        </div> */}
      </div>
    </div>
  );
}
