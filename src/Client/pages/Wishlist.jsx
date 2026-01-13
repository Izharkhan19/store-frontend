import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  XMarkIcon,
  ShoppingBagIcon,
  HeartIcon as HeartOutline,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import {
  getWishlist,
  removeFromWishlist,
  clearWishlist,
  addToCart,
} from "../../api-services/apiService";
import WishlistLoginModal from "../Modals/WishlistLoginModal";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check if user is logged in (client or admin)
  const isLoggedIn =
    !!localStorage.getItem("token") || !!localStorage.getItem("adminToken");

  // Fetch wishlist safely
  const fetchWishlist = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getWishlist();
      if (result?.success && Array.isArray(result?.data?.data)) {
        // Ensure each item has _id and valid structure
        const validItems = result?.data?.data.filter(
          (item) => item && (item._id || item.id)
        );
        setWishlistItems(validItems);
      } else {
        setWishlistItems([]);
        if (result?.message) setError(result.message);
      }
    } catch (err) {
      console.error("Wishlist fetch error:", err);
      setError("Failed to load wishlist");
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isLoggedIn]);

  // Safe remove item
  const handleRemove = async (productId) => {
    if (!productId) return;

    // Optimistic update
    setWishlistItems((prev) =>
      prev.filter((item) => (item._id || item.id) !== productId)
    );

    const result = await removeFromWishlist(productId);
    if (!result?.success) {
      alert(result?.message || "Failed to remove item");
      // Rollback
      fetchWishlist();
    }
  };

  // Safe clear all
  const handleClearAll = async () => {
    if (wishlistItems.length === 0) return;

    if (!confirm("Remove all items from wishlist?")) return;

    const result = await clearWishlist();
    if (result?.success) {
      setWishlistItems([]);
    } else {
      alert(result?.message || "Failed to clear wishlist");
    }
  };

  // Safe add to cart
  const handleAddToCart = async (productId) => {
    if (!productId) return;

    const result = await addToCart(productId, 1);
    if (result?.success) {
      alert("Added to cart!");
    } else {
      alert(result?.message || "Failed to add to cart");
    }
  };

  // Guest clicked heart anywhere
  const openLoginModal = () => setShowLoginModal(true);
  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6">
          <HeartSolid className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto mb-6 animate-pulse" />
          <p className="text-xl sm:text-2xl text-gray-700">
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-5 sm:px-6">
          <div className="bg-gray-100 rounded-full p-12 sm:p-16 w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-8 sm:mb-10 flex items-center justify-center">
            <HeartOutline className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-5 sm:mb-6">
            Sign in to view your wishlist
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Save your favorite handmade treasures and access them from any
            device.
          </p>
          <button
            onClick={openLoginModal}
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 sm:py-6 px-12 sm:px-14 rounded-full text-lg sm:text-xl transition shadow-2xl transform hover:scale-105"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 sm:py-20">
        <div className="text-center max-w-md px-5 sm:px-6">
          <HeartSolid className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Oops!
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            {error}
          </p>
          <button
            onClick={fetchWishlist}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-10 rounded-full transition text-base sm:text-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty wishlist
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-5 sm:px-6">
          <div className="bg-gray-100 rounded-full p-12 sm:p-16 w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-8 sm:mb-10 flex items-center justify-center">
            <HeartOutline className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-5 sm:mb-6">
            Your wishlist is empty
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Save your favorite handmade treasures here so you can find them
            later!
          </p>
          <Link
            to="/products"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 sm:py-6 px-12 sm:px-14 rounded-full text-lg sm:text-xl transition shadow-2xl transform hover:scale-105"
          >
            Start Browsing
          </Link>
        </div>
      </div>
    );
  }

  // Main wishlist view
  return (
    <>
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-3 sm:gap-4">
              <HeartSolid className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
              My Wishlist
              <span className="text-lg sm:text-2xl font-normal text-gray-600">
                ({wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"})
              </span>
            </h1>
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 font-medium transition text-base sm:text-lg self-start sm:self-auto"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Items */}
          <div className="lg:col-span-3 space-y-6 sm:space-y-8">
            {wishlistItems?.length > 0 &&
              wishlistItems.map((product) => {
                const id = product._id || product.id;
                const name = product.name || "Unnamed Product";
                const price = product.price || 0;
                const image =
                  product.images?.[0]?.url || "https://via.placeholder.com/400";
                const stock = product.stock ?? 0;

                return (
                  <div
                    key={id}
                    className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 p-6 sm:p-8">
                      <Link
                        to={`/products/${id}`}
                        className="flex-shrink-0 mx-auto sm:mx-0"
                      >
                        <div className="w-48 h-48 sm:w-40 sm:h-40 bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200">
                          <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/400?text=No+Image";
                            }}
                          />
                        </div>
                      </Link>

                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-5 sm:mb-6 gap-4">
                          <div className="w-full sm:w-auto">
                            <Link
                              to={`/products/${id}`}
                              className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-amber-600 transition block mb-1.5 sm:mb-2"
                            >
                              {name}
                            </Link>
                            <p className="text-gray-600 text-base sm:text-base">
                              by {product.artist || "Artisan"}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(id)}
                            className="text-gray-400 hover:text-red-600 transition-transform hover:scale-110 self-center sm:self-start"
                          >
                            <XMarkIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                          <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                            ${Number(price).toFixed(2)}
                          </span>
                          {stock === 0 && (
                            <span className="bg-red-100 text-red-700 px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col xs:flex-row gap-4">
                          <button
                            onClick={() => handleAddToCart(id)}
                            disabled={stock === 0}
                            className={`flex-1 py-4 rounded-2xl font-bold text-base sm:text-lg transition shadow-md ${
                              stock > 0
                                ? "bg-amber-600 hover:bg-amber-700 text-white"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {stock > 0 ? "Add to Cart" : "Out of Stock"}
                          </button>
                          <button
                            onClick={() => handleRemove(id)}
                            className="px-6 py-4 border-2 border-red-600 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition text-base sm:text-lg"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-10 sticky top-4 sm:top-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-3 justify-center sm:justify-start">
                <HeartSolid className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                Saved for Later
              </h2>
              <p className="text-gray-700 mb-6 sm:mb-8 text-center sm:text-left">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"} in your wishlist
              </p>
              <Link
                to="/products"
                className="block w-full text-center bg-white border-2 border-amber-600 text-amber-600 font-bold py-4 sm:py-5 rounded-2xl hover:bg-amber-50 transition shadow-lg text-base sm:text-lg"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <WishlistLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
