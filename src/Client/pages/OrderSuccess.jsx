// src/Client/pages/OrderSuccess.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckBadgeIcon,
  TruckIcon,
  HeartIcon,
  ShareIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";

export default function OrderSuccess() {
  const [orderNumber] = useState(
    "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  );
  const [orderDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  // Simulate confetti animation
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#3b82f6"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#3b82f6"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Success Section */}
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 py-12 sm:py-16 md:py-20 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center w-full">
          {/* Big Checkmark */}
          <div className="relative inline-block mb-8 sm:mb-10 md:mb-12">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75 scale-90 sm:scale-100"></div>
            <div className="relative bg-green-500 rounded-full p-6 sm:p-8 md:p-10 shadow-2xl">
              <CheckIcon className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-white" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Order Confirmed!
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-3 sm:mb-4">
            Thank you for supporting handmade artisans
          </p>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10">
            Your order has been successfully placed
          </p>

          {/* Order Info Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8 md:p-10 mb-10 sm:mb-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-5 sm:mb-6">
              <CheckBadgeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 break-all sm:break-normal">
                {orderNumber}
              </span>
            </div>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Placed on <span className="font-semibold">{orderDate}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 text-center">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-5 sm:p-6">
                <TruckIcon className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  Estimated Delivery
                </p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1 sm:mt-2">
                  7-10 days
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-5 sm:p-6">
                <ShoppingBagIcon className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  Total Items
                </p>
                <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1 sm:mt-2">
                  3
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-5 sm:p-6">
                <HeartIcon className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  Artisans Supported
                </p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1 sm:mt-2">
                  3
                </p>
              </div>
            </div>
          </div>

          {/* Share & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-10 sm:mb-12">
            <button className="flex items-center justify-center gap-3 px-6 sm:px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold text-base sm:text-lg transition shadow-lg w-full sm:w-auto min-w-[180px]">
              <ShareIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              Share Order
            </button>
            <Link
              to="/orders"
              className="flex items-center justify-center gap-3 px-6 sm:px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-50 transition shadow-lg w-full sm:w-auto min-w-[180px]"
            >
              View Order Details
            </Link>
          </div>

          {/* Final CTA */}
          <div className="max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Keep Shopping
            </h3>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8">
              Discover more unique, handcrafted treasures made with love
            </p>
            <Link
              to="/products"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 sm:py-6 px-12 sm:px-16 rounded-full text-xl sm:text-2xl transition shadow-2xl transform hover:scale-105 w-full sm:w-auto"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Footer Message */}
          <div className="mt-16 sm:mt-20 text-center text-gray-600 text-sm sm:text-base">
            <p>
              Questions? Email us at{" "}
              <a
                href="mailto:support@handmadestore.com"
                className="text-amber-600 hover:underline font-medium"
              >
                support@handmadestore.com
              </a>
            </p>
            <p className="mt-3 sm:mt-4">
              © 2025 Handmade Store. Every purchase supports independent
              artisans
            </p>
          </div>
        </div>
      </div>
    </>
  );
}