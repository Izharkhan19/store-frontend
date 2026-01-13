// src/Client/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { registerUser } from "../../api-services/apiService";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back after registration
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await registerUser({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
      });

      if (result.success) {
        // Auto-login after registration
        localStorage.setItem("token", result?.data?.data.token);
        localStorage.setItem("user", JSON.stringify(result?.data?.data?.user));

        // Trigger global update
        window.dispatchEvent(new Event("userChanged"));

        // Welcome!
        alert("Welcome! Your account has been created.");
        navigate(from, { replace: true });
      } else {
        setError(result.message || "Registration failed. Try again.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2 sm:mt-3">
            Join our handmade community
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 sm:px-5 py-3.5 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-base sm:text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 sm:px-5 py-3.5 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-base sm:text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 sm:px-5 py-3.5 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-base sm:text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 sm:px-5 py-3.5 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-base sm:text-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-base sm:text-lg py-4 sm:py-5 rounded-2xl transition shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-t-2 border-b-2 border-white"></div>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 sm:my-8 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 sm:px-4 text-sm text-gray-500 bg-white">
            or
          </span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              state={{ from: location.state?.from }}
              className="font-bold text-amber-600 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="text-xs sm:text-sm text-center text-gray-500 mt-8 sm:mt-10 leading-relaxed">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-amber-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-amber-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
