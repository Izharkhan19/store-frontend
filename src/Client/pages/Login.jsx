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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        {/* Logo / Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-3">Sign in to continue shopping</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-amber-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            onClick={handleLogin}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold text-lg py-5 rounded-2xl transition shadow-lg transform hover:scale-105 disabled:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500 bg-white">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              state={{ from: location.state?.from }}
              className="font-bold text-amber-600 hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>

        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500 bg-white">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            Log-in as Admin?{" "}
            <Link
              to="/admin/login"
              state={{ from: location.state?.from }}
              className="font-bold text-amber-600 hover:underline"
            >
              Admin Login
            </Link>
          </p>
        </div>

        {/* Demo Credentials (Remove in production!) */}
        <div className="mt-10 p-5 bg-gray-50 rounded-xl text-center text-sm text-gray-500">
          <p className="font-medium text-gray-700">Demo Account</p>
          <p>Email: user@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
}
