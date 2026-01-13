import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../../api-services/apiService";
import WishlistLoginModal from "../Modals/WishlistLoginModal"; // Reuse for guest

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check if logged in (client or admin)
  const isLoggedIn =
    !!localStorage.getItem("token") || !!localStorage.getItem("adminToken");

  const fetchCart = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getCart();

      if (result?.success && Array.isArray(result?.data?.data)) {
        // Ensure each item has product data
        const validItems = result?.data?.data.filter(
          (item) => item && item.product && (item._id || item.product._id)
        );
        setCartItems(validItems);
      } else {
        setCartItems([]);
        if (result?.message) setError(result.message);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      setError("Failed to load cart");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]);

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;

    // Optimistic update
    setCartItems((prev) =>
      prev.map((item) =>
        (item.product._id || item.product.id) === productId
          ? { ...item, quantity: newQty }
          : item
      )
    );

    const result = await updateCartItem(productId, newQty);
    if (!result?.success) {
      alert(result?.message || "Failed to update quantity");
      fetchCart(); // rollback
    }
  };

  const removeItem = async (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => (item.product._id || item.product.id) !== productId)
    );

    const result = await removeFromCart(productId);
    if (!result?.success) {
      alert(result?.message || "Failed to remove item");
      fetchCart();
    }
  };

  const clearAll = async () => {
    if (!confirm("Clear your entire cart?")) return;

    const result = await clearCart();
    if (result?.success) {
      setCartItems([]);
    } else {
      alert(result?.message || "Failed to clear cart");
    }
  };

  // Safe calculations
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

  const shipping = subtotal >= 100 ? 0 : 12.9;
  const total = subtotal + shipping;
  const totalItemsCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-b-4 border-amber-600 mx-auto"></div>
          <p className="mt-6 sm:mt-8 text-xl sm:text-2xl text-gray-700">
            Loading your cart...
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
          <ShoppingBagIcon className="w-24 h-24 sm:w-32 sm:h-32 text-gray-300 mx-auto mb-6 sm:mb-8" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-5 sm:mb-6">
            Sign in to view your cart
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10">
            Your cart is saved when you sign in.
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 sm:py-6 px-12 sm:px-14 rounded-full text-lg sm:text-xl transition shadow-2xl"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 sm:py-20">
        <div className="text-center max-w-md px-5 sm:px-6">
          <ShoppingBagIcon className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6 sm:mb-8" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Oops!
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            {error}
          </p>
          <button
            onClick={fetchCart}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-10 rounded-full transition text-base sm:text-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center px-5 sm:px-6">
          <div className="bg-gray-100 rounded-full p-12 sm:p-16 w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-8 sm:mb-10 flex items-center justify-center">
            <ShoppingBagIcon className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-5 sm:mb-6">
            Your cart is empty
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Looks like you haven't added any handmade treasures yet. Start
            exploring!
          </p>
          <Link
            to="/products"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 sm:py-6 px-12 sm:px-14 rounded-full text-lg sm:text-xl transition shadow-2xl transform hover:scale-105"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-3 sm:gap-4">
              <ShoppingBagIcon className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
              Your Cart
              <span className="text-lg sm:text-2xl font-normal text-gray-600">
                ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})
              </span>
            </h1>
            <button
              onClick={clearAll}
              className="text-red-600 hover:text-red-700 font-medium transition text-base sm:text-lg self-start sm:self-auto"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {cartItems.map((item) => {
              const product = item.product || {};
              const id = product._id || product.id;
              const name = product.name || "Unknown Product";
              const price = product.price || 0;
              const stock = product.stock || 0;
              const image =
                product.images?.[0]?.url || "https://via.placeholder.com/400";

              return (
                <div
                  key={id}
                  className={`bg-white rounded-2xl sm:rounded-3xl shadow-lg border overflow-hidden transition-all hover:shadow-2xl ${
                    stock === 0 ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 p-6 sm:p-8">
                    <Link
                      to={`/products/${id}`}
                      className="flex-shrink-0 mx-auto sm:mx-0"
                    >
                      <div className="w-44 h-44 sm:w-36 sm:h-36 bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200">
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
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-5 gap-4">
                        <div className="w-full sm:w-auto">
                          <Link
                            to={`/products/${id}`}
                            className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-amber-600 transition block mb-1.5 sm:mb-2"
                          >
                            {name}
                          </Link>
                          <p className="text-gray-600">
                            by {product.artist || "Artisan"}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(id)}
                          className="text-gray-400 hover:text-red-600 transition-transform hover:scale-110 self-center sm:self-start"
                        >
                          <XMarkIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                        </button>
                      </div>

                      {stock === 0 && (
                        <p className="text-red-600 font-medium mb-5 sm:mb-6 text-center sm:text-left">
                          Out of Stock — Will be removed at checkout
                        </p>
                      )}

                      <div className="flex flex-col xs:flex-row items-center justify-between gap-6 sm:gap-0 mt-6 sm:mt-8">
                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden w-full xs:w-auto">
                          <button
                            onClick={() =>
                              updateQuantity(id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1 || stock === 0}
                            className="px-5 sm:px-6 py-3.5 sm:py-4 hover:bg-gray-100 disabled:opacity-50 transition"
                          >
                            <MinusIcon className="w-5 h-5" />
                          </button>
                          <span className="px-8 sm:px-10 py-3.5 sm:py-4 font-bold text-xl sm:text-2xl min-w-[80px] sm:min-w-32 text-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(id, item.quantity + 1)
                            }
                            disabled={stock === 0}
                            className="px-5 sm:px-6 py-3.5 sm:py-4 hover:bg-gray-100 disabled:opacity-50 transition"
                          >
                            <PlusIcon className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="text-center xs:text-right">
                          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                            ${(price * (item.quantity || 1)).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            ${price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-10 sticky top-4 sm:top-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center sm:text-left">
                Order Summary
              </h2>

              <div className="space-y-4 sm:space-y-5 text-base sm:text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping</span>
                  <span
                    className={
                      shipping === 0 ? "text-green-600 font-bold" : "font-bold"
                    }
                  >
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-green-600 font-medium flex items-center justify-center sm:justify-start gap-2 pt-2">
                    <TruckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    Congratulations! Free shipping applied
                  </p>
                )}
                <div className="border-t-2 border-dashed border-amber-200 pt-5 sm:pt-6 mt-5 sm:mt-6">
                  <div className="flex justify-between text-2xl sm:text-3xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-amber-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full mt-8 sm:mt-10 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xl sm:text-2xl py-5 sm:py-6 rounded-2xl block text-center transition transform hover:scale-105 shadow-2xl"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-5 text-gray-700 text-sm sm:text-base">
                <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
                  <ShieldCheckIcon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                  <span>Secure checkout • Buyer protection guaranteed</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
                  <TruckIcon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                  <span>Free shipping on orders over $100</span>
                </div>
              </div>

              <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t text-center">
                <Link
                  to="/products"
                  className="text-amber-700 hover:text-amber-800 font-semibold text-base sm:text-lg transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal for Guests */}
      <WishlistLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
