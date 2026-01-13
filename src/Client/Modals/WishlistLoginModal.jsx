import { Link } from "react-router-dom";
// import { XMarkIcon, HeartIcon as HeartSolidIcon } from "@heroicons/react/24/outline";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

export default function WishlistLoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
      relative 
      bg-white 
      rounded-2xl sm:rounded-3xl 
      shadow-xl sm:shadow-2xl 
      w-full 
      max-w-[95%] sm:max-w-md 
      p-6 sm:p-8 
      animate-in fade-in zoom-in duration-200
    "
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="w-7 h-7 sm:w-6 sm:h-6" />
        </button>

        <div className="text-center">
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-red-50 rounded-full flex items-center justify-center mb-5 sm:mb-6">
            <HeartSolidIcon className="w-7 h-7 sm:w-6 sm:h-6 text-red-500" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Save to Wishlist
          </h3>

          <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 px-2 sm:px-0">
            Sign in to save this item and access your wishlist from any device.
          </p>

          <div className="space-y-3 sm:space-y-4">
            <Link
              to="/login"
              state={{ from: window.location.pathname }}
              onClick={onClose}
              className="
              block w-full 
              bg-amber-600 hover:bg-amber-700 
              text-white 
              font-semibold 
              py-3.5 sm:py-4 
              rounded-xl 
              text-center 
              transition-colors
              text-base sm:text-[1.05rem]
            "
            >
              Sign In
            </Link>

            <Link
              to="/register"
              state={{ from: window.location.pathname }}
              onClick={onClose}
              className="
              block w-full 
              border-2 border-gray-300 hover:border-gray-400 
              text-gray-800 
              font-semibold 
              py-3.5 sm:py-4 
              rounded-xl 
              text-center 
              transition-colors
              text-base sm:text-[1.05rem]
            "
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
