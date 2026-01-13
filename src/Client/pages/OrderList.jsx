// src/Client/pages/OrderList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { getMyOrders } from "../../api-services/apiService";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Check if user is logged in (client or admin)
  const isLoggedIn =
    !!localStorage.getItem("token") || !!localStorage.getItem("adminToken");

  const fetchOrders = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getMyOrders();

      if (result?.success && Array.isArray(result?.data?.data)) {
        setOrders(result?.data?.data);
      } else {
        setOrders([]);
        if (result?.message) setError(result.message);
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isLoggedIn]);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case "shipped":
        return <TruckIcon className="w-6 h-6 text-blue-600" />;
      case "processing":
        return <ClockIcon className="w-6 h-6 text-amber-600" />;
      case "cancelled":
        return <XCircleIcon className="w-6 h-6 text-red-600" />;
      default:
        return <ClockIcon className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-b-4 border-amber-600 mx-auto"></div>
          <p className="mt-6 sm:mt-8 text-xl sm:text-2xl text-gray-700">
            Loading your orders...
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
            Sign in to view your orders
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10">
            Track your purchases and see your order history.
          </p>
          <Link
            to="/login"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 sm:py-6 px-12 sm:px-14 rounded-full text-lg sm:text-xl transition shadow-2xl"
          >
            Sign In Now
          </Link>
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
            onClick={fetchOrders}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-10 rounded-full transition text-base sm:text-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No orders
  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-5 sm:px-6">
          <div className="bg-gray-100 rounded-full p-12 sm:p-16 w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-8 sm:mb-10 flex items-center justify-center">
            <ShoppingBagIcon className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-5 sm:mb-6">
            No Orders Yet
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Start shopping and your orders will appear here. Every purchase
            supports independent artisans!
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

  // Main orders list
  return (
    <>
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <ShoppingBagIcon className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
            My Orders
            <span className="text-lg sm:text-2xl font-normal text-gray-600">
              ({orders.length} {orders.length === 1 ? "order" : "orders"})
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-12">
        <div className="space-y-6 sm:space-y-8">
          {orders.map((order) => {
            const id = order._id || order.id;
            const items = Array.isArray(order.items) ? order.items : [];
            const totalItems = items.reduce(
              (sum, i) => sum + (i.quantity || 1),
              0
            );

            return (
              <div
                key={id}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition"
              >
                {/* Order Header – clickable area */}
                <div
                  onClick={() => toggleExpand(id)}
                  className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer gap-5 sm:gap-0"
                >
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex-shrink-0">
                      <ShoppingBagIcon className="w-10 h-10 sm:w-12 sm:h-12 text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-1.5 sm:mb-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                          {order.orderNumber ||
                            `ORD-${id.slice(-8).toUpperCase()}`}
                        </h3>
                        <span
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-0 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status
                            ? order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)
                            : "Pending"}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        • {totalItems} {totalItems === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6">
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        ₹{Number(order.total || 0).toFixed(2)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {order.paymentStatus === "paid"
                          ? "Paid"
                          : "Payment Pending"}
                      </p>
                    </div>
                    {expandedOrder === id ? (
                      <ChevronUpIcon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === id && (
                  <div className="border-t px-6 sm:px-8 py-6 sm:py-8 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                      {/* Items */}
                      <div>
                        <h4 className="font-bold text-lg sm:text-xl text-gray-900 mb-5 sm:mb-6">
                          Items Ordered ({totalItems})
                        </h4>
                        <div className="space-y-4 sm:space-y-5">
                          {items.map((item) => (
                            <div
                              key={item._id || Math.random()}
                              className="flex gap-4 sm:gap-5 pb-4 sm:pb-5 border-b last:border-0"
                            >
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden border flex-shrink-0">
                                <img
                                  src={
                                    item.image ||
                                    "https://via.placeholder.com/300"
                                  }
                                  alt={item.name || "Product"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                                  {item.name || "Unknown Product"}
                                </p>
                                <p className="text-sm text-gray-600 mt-0.5 sm:mt-1">
                                  Quantity: {item.quantity || 1}
                                </p>
                                <p className="font-bold text-base sm:text-lg text-gray-900 mt-1.5 sm:mt-2">
                                  ₹
                                  {(
                                    (item.price || 0) * (item.quantity || 1)
                                  ).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <h4 className="font-bold text-lg sm:text-xl text-gray-900 mb-5 sm:mb-6 flex items-center gap-2 sm:gap-3">
                          <MapPinIcon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                          Shipping Address
                        </h4>
                        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border text-sm sm:text-base">
                          <p className="font-semibold text-gray-900">
                            {order.shippingAddress?.fullName ||
                              "Name not available"}
                          </p>
                          <p className="text-gray-700 mt-1">
                            {order.shippingAddress?.street || ""}
                            {order.shippingAddress?.apartment &&
                              `, ${order.shippingAddress.apartment}`}
                          </p>
                          <p className="text-gray-700">
                            {order.shippingAddress?.city &&
                              `${order.shippingAddress.city}, `}
                            {order.shippingAddress?.state}{" "}
                            {order.shippingAddress?.zipCode}
                          </p>
                          <p className="text-gray-700 mt-1">India</p>
                          <p className="font-medium mt-2 sm:mt-3">
                            Phone:{" "}
                            {order.shippingAddress?.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            to="/products"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold py-5 sm:py-6 px-12 sm:px-16 rounded-full text-lg sm:text-xl transition shadow-2xl transform hover:scale-105"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}
