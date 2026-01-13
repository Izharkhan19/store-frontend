import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  CreditCardIcon,
  BanknotesIcon,
  CheckBadgeIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import {
  getCart,
  createOrder,
  getCurrentUser,
} from "../../api-services/apiService";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  // Fetch cart & user
  useEffect(() => {
    const loadData = async () => {
      const cartResult = await getCart();
      if (cartResult.success) setCartItems(cartResult.data?.data || []);
      setLoadingCart(false);

      const userResult = await getCurrentUser();
      if (userResult.success && userResult.data) {
        const user = userResult?.data?.data;
        setFormData({
          email: user.email || "",
          firstName: user.name?.split(" ")[0] || "",
          lastName: user.name?.split(" ").slice(1).join(" ") || "",
          phone: user.phone || "",
          address: user.address?.street || "",
          apartment: user.address?.apartment || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          pincode: user.address?.zipCode || "",
        });
      }
      setLoadingUser(false);
    };
    loadData();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingCost = subtotal >= 100 ? 0 : 12.9;
  const total = subtotal + shippingCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handlePlaceOrder = async () => {
  //   if (cartItems.length === 0) {
  //     alert("Your cart is empty!");
  //     return;
  //   }

  //   setPlacingOrder(true);
  //   setError(null);

  //   try {
  //     let stripeToken = null;

  //     if (paymentMethod === "credit_card") {
  //       if (!stripe || !elements) throw new Error("Stripe not loaded");

  //       const cardElement = elements.getElement(CardElement);

  //       const { error, token } = await stripe.createToken(cardElement, {
  //         name: `${formData.firstName} ${formData.lastName}`,
  //         address_line1: formData.address,
  //         address_city: formData.city,
  //         address_state: formData.state,
  //         address_zip: formData.pincode,
  //         address_country: "IN",
  //       });

  //       if (error) {
  //         setError(error.message);
  //         return;
  //       }

  //       stripeToken = token;
  //     }

  //     const orderData = {
  //       items: cartItems.map((item) => ({
  //         product: item.product._id,
  //         quantity: item.quantity,
  //       })),
  //       shippingAddress: {
  //         fullName: `${formData.firstName} ${formData.lastName}`.trim(),
  //         phone: formData.phone,
  //         street: formData.address,
  //         apartment: formData.apartment || "",
  //         city: formData.city,
  //         state: formData.state,
  //         zipCode: formData.pincode,
  //         country: "India",
  //       },
  //       paymentMethod,
  //       subtotal: Number(subtotal.toFixed(2)),
  //       shippingCost: Number(shippingCost.toFixed(2)),
  //       total,
  //       stripeToken,
  //     };

  //     const result = await createOrder(orderData);

  //     if (result.success) {
  //       alert(
  //         "Order placed successfully! Thank you for supporting artisans ❤️"
  //       );
  //       navigate("/orders");
  //     } else {
  //       setError(result.message || "Failed to place order.");
  //     }
  //   } catch (err) {
  //     setError(err.message || "Something went wrong.");
  //   } finally {
  //     setPlacingOrder(false);
  //   }
  // };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setPlacingOrder(true);
    setError(null);

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          street: formData.address,
          apartment: formData.apartment || "",
          city: formData.city,
          state: formData.state,
          zipCode: formData.pincode,
          country: "India",
        },
        paymentMethod,
        subtotal: Number(subtotal.toFixed(2)),
        shippingCost: Number(shippingCost.toFixed(2)),
        total,
        notes: "",
      };

      // Step 1: Create PaymentIntent or COD order
      const result = await createOrder(orderData);

      if (paymentMethod === "cash_on_delivery") {
        // COD: Order already created
        if (result.success) {
          alert(
            "Order placed successfully! Thank you for supporting artisans ❤️"
          );
          navigate("/orders"); // Now order exists in user's list
        } else {
          setError(result.message || "Failed to place order");
        }
      } else if (paymentMethod === "credit_card") {
        // Card: Confirm PaymentIntent
        debugger;
        if (!stripe || !elements || !result?.data?.clientSecret) {
          debugger;
          throw new Error("Stripe not loaded or client secret missing");
        }
        debugger;
        const { error: confirmError } = await stripe.confirmCardPayment(
          result?.data?.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                address: {
                  line1: formData.address,
                  city: formData.city,
                  state: formData.state,
                  postal_code: formData.pincode,
                  country: "IN",
                },
              },
            },
          }
        );

        if (confirmError) {
          setError(confirmError.message);
          return;
        }

        // Step 2: Payment succeeded → Confirm order on backend
        const confirmResult = await axios.post(
          `${API_BASE_URL}/orders/confirm`,
          {
            clientSecret: result?.data?.clientSecret,
            orderData: result?.data?.orderData,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (confirmResult.data.success) {
          alert("Payment successful! Order placed.");
          navigate("/orders"); // Order now exists in user's list
        } else {
          setError(confirmResult.data.message || "Failed to confirm order");
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      console.error("Order error:", err);
    } finally {
      setPlacingOrder(false);
    }
  };

  // Loading
  if (loadingCart || loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-b-4 border-amber-600 mx-auto"></div>
          <p className="mt-6 sm:mt-8 text-xl sm:text-2xl text-gray-700">
            Preparing checkout...
          </p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-5 sm:px-6">
          <ShoppingBagIcon className="w-24 h-24 sm:w-32 sm:h-32 text-gray-300 mx-auto mb-6 sm:mb-8" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-5 sm:mb-6">
            Your cart is empty
          </h2>
          <Link
            to="/products"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 sm:py-6 px-10 sm:px-14 rounded-full text-lg sm:text-xl transition shadow-2xl"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-5 sm:mb-6 text-base sm:text-lg"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Cart
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-3 sm:gap-4">
            <CheckBadgeIcon className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Left: Form */}
          <div className="space-y-8 sm:space-y-10 order-2 lg:order-1">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">
                Contact Information
              </h2>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-5 sm:px-6 py-3.5 sm:py-4 border rounded-xl bg-gray-100 text-base sm:text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">
                Shipping Address
              </h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-base sm:text-lg"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-base sm:text-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Street address
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-5 sm:px-6 py-3.5 sm:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-base sm:text-lg"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="apartment"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    id="apartment"
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="w-full px-5 sm:px-6 py-3.5 sm:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-base sm:text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-base sm:text-lg"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-base sm:text-lg"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="pincode"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      PIN code
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-base sm:text-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Phone number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-5 sm:px-6 py-3.5 sm:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-base sm:text-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">
                Payment Method
              </h2>
              <div className="space-y-4">
                <label
                  className={`flex items-center gap-3 sm:gap-4 p-5 sm:p-6 border-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all text-base sm:text-lg ${
                    paymentMethod === "credit_card"
                      ? "border-amber-600 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-amber-600 flex-shrink-0"
                    id="credit_card"
                  />
                  <CreditCardIcon className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Credit / Debit Card</p>
                    <p className="text-sm text-gray-600">
                      Visa, Mastercard, UPI
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 sm:gap-4 p-5 sm:p-6 border-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all text-base sm:text-lg ${
                    paymentMethod === "cash_on_delivery"
                      ? "border-amber-600 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="cash_on_delivery"
                    checked={paymentMethod === "cash_on_delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-amber-600 flex-shrink-0"
                    id="cash_on_delivery"
                  />
                  <BanknotesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">
                      Pay when you receive
                    </p>
                  </div>
                </label>
              </div>

              {paymentMethod === "credit_card" && (
                <div className="mt-5 sm:mt-6 p-5 sm:p-6 border border-gray-300 rounded-xl sm:rounded-2xl bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card details
                  </label>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#32325d",
                          "::placeholder": { color: "#aab7c4" },
                        },
                        invalid: { color: "#fa755a" },
                      },
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-3">
                    Secure payment powered by Stripe
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 sticky top-4 sm:top-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                Order Summary
              </h2>

              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 sm:gap-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        src={
                          item.product.images?.[0]?.url ||
                          "https://via.placeholder.com/300"
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-base sm:text-lg line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-base sm:text-lg whitespace-nowrap">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t-2 pt-5 sm:pt-6 space-y-3 sm:space-y-4 text-base sm:text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span
                    className={
                      shippingCost === 0 ? "text-green-600 font-bold" : ""
                    }
                  >
                    {shippingCost === 0
                      ? "FREE"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t-2 pt-5 sm:pt-6">
                  <div className="flex justify-between text-xl sm:text-3xl font-bold">
                    <span>Total</span>
                    <span className="text-amber-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-5 sm:mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm sm:text-base">
                  {error}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full mt-6 sm:mt-8 bg-amber-600 hover:bg-amber-700 disabled:opacity-70 text-white font-bold text-xl sm:text-2xl py-5 sm:py-6 rounded-2xl transition shadow-2xl flex items-center justify-center gap-3"
              >
                {placingOrder ? (
                  "Processing..."
                ) : (
                  <>
                    <ShieldCheckIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function CheckoutWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
