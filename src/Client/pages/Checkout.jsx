// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   CreditCardIcon,
//   BanknotesIcon,
//   CheckBadgeIcon,
//   TruckIcon,
//   ShieldCheckIcon,
//   ArrowLeftIcon,
//   ShoppingBagIcon,
// } from "@heroicons/react/24/outline";
// import { useApi } from "../../api-services/hooks/useApi";
// import {
//   getCart,
//   createOrder,
//   getCurrentUser,
// } from "../../api-services/apiService";

// export default function Checkout() {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
//   const [cartResponse, setCartResponse] = useState([]);
//   const [loadingCart, setLoadingCart] = useState(true);
//   const [cartError, setCartError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [error, setError] = useState(null);

//   const [paymentMethod, setPaymentMethod] = useState("card");

//   const [formData, setFormData] = useState({
//     email: "",
//     firstName: "",
//     lastName: "",
//     address: "",
//     apartment: "",
//     city: "",
//     state: "",
//     pincode: "",
//     phone: "",
//     saveInfo: true,
//   });

//   // Fetch cart + current user
// ------------
// r. No
// Position
// Experience
// Looking For
// 1
// Frontend Developer (3+ years).
// 3+ years’ experience in React & Next.js with Azure Cloud
// • 3+ years’ experience in React & TypeScript, and 3+ years in Next.js with Azure services
// • Strong experience with responsive UI development and AI-enabled interfaces; ability to collaborate with AI/ML engineers
// • Tailwind CSS, design systems, component-driven development, performance & security best practices
// • Experience in Chatbot/AI UI integration is a plus
// • Git, Azure DevOps with branching strategy
// • Ability to build multilingual, accessible, scalable front-end applications
// • Strong collaboration experience with AI Engineers
// ------------
//   // const {
//   //     data: cartResponse,
//   //     loading: loadingCart,
//   //     error: cartError,
//   // } = useApi(getCart);

//   // const { data: user } = useApi(getCurrentUser);

//   const fetchCartResp = async () => {
//     setLoadingCart(true);
//     const result = await getCart();
//     if (result.success) {
//       setCartResponse(result.data?.data || []);
//       setLoadingCart(false);
//     } else {
//       setCartResponse([]);
//       setLoadingCart(false);
//       setCartError("Error to fetch card details.");
//     }
//   };

//   const fetchCurrUser = async () => {
//     setLoading(true);
//     const resultUser = await getCurrentUser();
//     if (resultUser.success) {
//       setFormData((prev) => ({
//         ...prev,
//         email: resultUser?.data?.email || "",
//         firstName: resultUser?.data?.name?.split(" ")[0] || "",
//         lastName: resultUser?.data?.name?.split(" ").slice(1).join(" ") || "",
//         phone: resultUser?.data?.phone || "",
//         address: resultUser?.data?.address?.street || "",
//         city: resultUser?.data?.address?.city || "",
//         state: resultUser?.data?.address?.state || "",
//         pincode: resultUser?.data?.address?.zipCode || "",
//       }));
//     } else {
//       setFormData({
//         email: "",
//         firstName: "",
//         lastName: "",
//         address: "",
//         apartment: "",
//         city: "",
//         state: "",
//         pincode: "",
//         phone: "",
//         saveInfo: true,
//       });
//     }
//     setLoading(false);
//   };

//   const loadData = async () => {
//     await fetchCurrUser();
//     await fetchCartResp();
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   // Load user data into form
//   // useEffect(() => {
//   //     if (user) {
//   //         setFormData((prev) => ({
//   //             ...prev,
//   //             email: user.email || "",
//   //             firstName: user.name?.split(" ")[0] || "",
//   //             lastName: user.name?.split(" ").slice(1).join(" ") || "",
//   //             phone: user.phone || "",
//   //             address: user.address?.street || "",
//   //             city: user.address?.city || "",
//   //             state: user.address?.state || "",
//   //             pincode: user.address?.zipCode || "",
//   //         }));
//   //     }
//   // }, [user]);

//   // Load cart
//   useEffect(() => {
//     if (cartResponse) {
//       setCartItems(cartResponse || []);
//       setLoading(false);
//     }
//   }, [cartResponse]);

//   const subtotal = cartItems
//     ?.filter((item) => item?.product?.stock > 0)
//     ?.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

//   const shipping = subtotal >= 100 ? 0 : 12.9;
//   const total = subtotal + shipping;

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();

//     if (cartItems?.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     // Check stock
//     const outOfStock = cartItems?.filter(
//       (item) => !item.product?.stock || item.product.stock < item.quantity
//     );
//     if (outOfStock?.length > 0) {
//       alert("Some items are out of stock or quantity exceeds available stock.");
//       return;
//     }

//     setPlacingOrder(true);
//     setError(null);

//     try {
//       const orderData = {
//         items: cartItems?.map((item) => ({
//           product: item.product._id,
//           quantity: item.quantity,
//         })),
//         shippingAddress: {
//           fullName: `${formData.firstName} ${formData.lastName}`.trim(),
//           phone: formData.phone,
//           street: formData.address,
//           apartment: formData.apartment,
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.pincode,
//           country: "India",
//         },
//         paymentMethod:
//           paymentMethod === "card" ? "credit_card" : "cash_on_delivery",
//         subtotal,
//         shippingCost: shipping,
//         total,
//       };

//       const result = await createOrder(orderData);

//       if (result.success) {
//         alert("Order placed successfully! Thank you for supporting artisans");
//         navigate("/order-success"); // Create this page or redirect to orders
//       } else {
//         setError(result.message || "Failed to place order");
//       }
//     } catch (err) {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setPlacingOrder(false);
//     }
//   };

//   // Loading
//   if (loading || loadingCart) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-amber-600 mx-auto"></div>
//           <p className="mt-8 text-2xl text-gray-700">Preparing checkout...</p>
//         </div>
//       </div>
//     );
//   }

//   // Empty cart
//   if (!cartItems || cartItems?.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-20">
//         <div className="max-w-4xl mx-auto text-center px-6">
//           <ShoppingBagIcon className="w-32 h-32 text-gray-300 mx-auto mb-8" />
//           <h2 className="text-4xl font-bold text-gray-800 mb-6">
//             Your cart is empty
//           </h2>
//           <p className="text-xl text-gray-600 mb-10">
//             Add some beautiful handmade items to proceed to checkout.
//           </p>
//           <Link
//             to="/products"
//             className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 px-14 rounded-full text-xl transition shadow-2xl"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Header */}
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-6 py-10">
//           <Link
//             to="/cart"
//             className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
//           >
//             <ArrowLeftIcon className="w-5 h-5" />
//             Back to Cart
//           </Link>
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-4">
//             <CheckBadgeIcon className="w-12 h-12 text-amber-600" />
//             Checkout
//           </h1>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="grid lg:grid-cols-2 gap-12">
//           {/* Left: Checkout Form */}
//           <div className="space-y-10">
//             {/* Contact Info */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Contact Information
//               </h2>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
//                 required
//               />
//             </div>

//             {/* Shipping Address */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Shipping Address
//               </h2>
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <input
//                   type="text"
//                   name="firstName"
//                   placeholder="First name"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="lastName"
//                   placeholder="Last name"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//               </div>

//               <input
//                 type="text"
//                 name="address"
//                 placeholder="Address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 className="w-full px-6 py-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 required
//               />
//               <input
//                 type="text"
//                 name="apartment"
//                 placeholder="Apartment, suite, etc. (optional)"
//                 value={formData.apartment}
//                 onChange={handleInputChange}
//                 className="w-full px-6 py-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
//               />

//               <div className="grid grid-cols-3 gap-4 mb-4">
//                 <input
//                   type="text"
//                   name="city"
//                   placeholder="City"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="state"
//                   placeholder="State"
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="pincode"
//                   placeholder="PIN Code"
//                   value={formData.pincode}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//               </div>

//               <input
//                 type="tel"
//                 name="phone"
//                 placeholder="Phone number"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 className="w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 required
//               />

//               <label className="flex items-center gap-3 mt-6 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   name="saveInfo"
//                   checked={formData.saveInfo}
//                   onChange={handleInputChange}
//                   className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
//                 />
//                 <span className="text-gray-700">
//                   Save this information for next time
//                 </span>
//               </label>
//             </div>

//             {/* Payment Method */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Payment Method
//               </h2>

//               <div className="space-y-4">
//                 <label
//                   className={`flex items-center gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all ${
//                     paymentMethod === "card"
//                       ? "border-amber-600 bg-amber-50 shadow-md"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="card"
//                     checked={paymentMethod === "card"}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                     className="w-5 h-5 text-amber-600"
//                   />
//                   <CreditCardIcon className="w-10 h-10 text-amber-600" />
//                   <div>
//                     <p className="font-semibold text-gray-900">
//                       Credit / Debit Card
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Visa, Mastercard, UPI, Netbanking
//                     </p>
//                   </div>
//                 </label>

//                 <label
//                   className={`flex items-center gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all ${
//                     paymentMethod === "cod"
//                       ? "border-amber-600 bg-amber-50 shadow-md"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="cod"
//                     checked={paymentMethod === "cod"}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                     className="w-5 h-5 text-amber-600"
//                   />
//                   <BanknotesIcon className="w-10 h-10 text-green-600" />
//                   <div>
//                     <p className="font-semibold text-gray-900">
//                       Cash on Delivery
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Pay when you receive your order
//                     </p>
//                   </div>
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Right: Order Summary */}
//           <div>
//             <div className="bg-white rounded-3xl shadow-xl p-10 sticky top-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-8">
//                 Order Summary
//               </h2>

//               <div className="space-y-6 mb-8">
//                 {cartItems?.length > 0 &&
//                   cartItems?.map((item) => {
//                     const product = item.product;
//                     return (
//                       <div key={item._id} className="flex gap-6">
//                         <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden border">
//                           <img
//                             src={
//                               product.images?.[0]?.url ||
//                               "https://via.placeholder.com/300"
//                             }
//                             alt={product.name}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="font-semibold text-gray-900 line-clamp-2">
//                             {product.name}
//                           </h4>
//                           <p className="text-sm text-gray-600 mt-1">
//                             Quantity: {item.quantity}
//                           </p>
//                           {!product.stock && (
//                             <p className="text-red-600 text-sm font-medium mt-2">
//                               Out of stock!
//                             </p>
//                           )}
//                         </div>
//                         <p className="font-bold text-lg">
//                           ${(product.price * item.quantity).toFixed(2)}
//                         </p>
//                       </div>
//                     );
//                   })}
//               </div>

//               <div className="border-t-2 border-gray-200 pt-6 space-y-4 text-lg">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-semibold">${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Shipping</span>
//                   <span
//                     className={
//                       shipping === 0
//                         ? "text-green-600 font-bold"
//                         : "font-semibold"
//                     }
//                   >
//                     {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
//                   </span>
//                 </div>
//                 {shipping === 0 && (
//                   <p className="text-green-600 font-medium flex items-center gap-2">
//                     <TruckIcon className="w-6 h-6" />
//                     Yay! You got free shipping
//                   </p>
//                 )}
//                 <div className="border-t-2 border-dashed pt-6">
//                   <div className="flex justify-between text-3xl font-bold text-gray-900">
//                     <span>Total</span>
//                     <span className="text-amber-600">${total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               {error && (
//                 <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
//                   {error}
//                 </div>
//               )}

//               <button
//                 onClick={handlePlaceOrder}
//                 disabled={placingOrder}
//                 className="w-full mt-8 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold text-2xl py-6 rounded-2xl transition shadow-2xl flex items-center justify-center gap-3"
//               >
//                 {placingOrder ? (
//                   <>
//                     <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-white"></div>
//                     Placing Order...
//                   </>
//                 ) : (
//                   <>
//                     <ShieldCheckIcon className="w-8 h-8" />
//                     Place Order
//                   </>
//                 )}
//               </button>

//               <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
//                 <p className="flex items-center justify-center gap-2">
//                   <ShieldCheckIcon className="w-5 h-5 text-green-600" />
//                   Secure checkout • SSL encrypted
//                 </p>
//                 <p className="text-xs">
//                   By placing your order, you agree to our{" "}
//                   <a href="#" className="text-amber-600 hover:underline">
//                     Terms
//                   </a>{" "}
//                   and{" "}
//                   <a href="#" className="text-amber-600 hover:underline">
//                     Privacy Policy
//                   </a>
//                 </p>
//               </div>

//               <div className="mt-10 pt-8 border-t text-center">
//                 <Link
//                   to="/cart"
//                   className="text-amber-600 hover:text-amber-700 font-medium text-lg transition"
//                 >
//                   Return to Cart
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// src/Client/pages/Checkout.jsx
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   CreditCardIcon,
//   BanknotesIcon,
//   CheckBadgeIcon,
//   TruckIcon,
//   ShieldCheckIcon,
//   ArrowLeftIcon,
//   ShoppingBagIcon,
// } from "@heroicons/react/24/outline";
// import {
//   getCart,
//   createOrder,
//   getCurrentUser,
// } from "../../api-services/apiService";

// export default function Checkout() {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
//   const [loadingCart, setLoadingCart] = useState(true);
//   const [cartError, setCartError] = useState(null);
//   const [loadingUser, setLoadingUser] = useState(true);
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [error, setError] = useState(null);

//   const [paymentMethod, setPaymentMethod] = useState("credit_card"); // matches enum

//   const [formData, setFormData] = useState({
//     email: "",
//     firstName: "",
//     lastName: "",
//     address: "",
//     apartment: "",
//     city: "",
//     state: "",
//     pincode: "",
//     phone: "",
//   });

//   // Fetch cart
//   const fetchCart = async () => {
//     setLoadingCart(true);
//     const result = await getCart();
//     if (result.success) {
//       setCartItems(result.data?.data || []);
//     } else {
//       setCartError("Failed to load cart.");
//       setCartItems([]);
//     }
//     setLoadingCart(false);
//   };

//   // Fetch current user
//   const fetchUser = async () => {
//     setLoadingUser(true);
//     const result = await getCurrentUser();
//     if (result.success && result.data) {
//       const user = result.data;
//       setFormData({
//         email: user.email || "",
//         firstName: user.name?.split(" ")[0] || "",
//         lastName: user.name?.split(" ").slice(1).join(" ") || "",
//         phone: user.phone || "",
//         address: user.address?.street || "",
//         apartment: user.address?.apartment || "",
//         city: user.address?.city || "",
//         state: user.address?.state || "",
//         pincode: user.address?.zipCode || "",
//       });
//     }
//     setLoadingUser(false);
//   };

//   useEffect(() => {
//     fetchUser();
//     fetchCart();
//   }, []);

//   // Calculate totals
//   const subtotal = cartItems.reduce(
//     (sum, item) => sum + item.product.price * item.quantity,
//     0
//   );
//   const shippingCost = subtotal >= 100 ? 0 : 12.9;
//   const tax = 0; // You can add tax logic later
//   const discount = 0;
//   const total = subtotal + shippingCost + tax - discount;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();

//     if (cartItems.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     setPlacingOrder(true);
//     setError(null);

//     try {
//       const orderData = {
//         items: cartItems.map((item) => ({
//           product: item.product._id,
//           quantity: item.quantity,
//         })),
//         shippingAddress: {
//           fullName: `${formData.firstName} ${formData.lastName}`.trim(),
//           phone: formData.phone,
//           street: formData.address,
//           apartment: formData.apartment || "",
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.pincode,
//           country: "India", // or make dynamic
//         },
//         paymentMethod: paymentMethod, // already matches enum: 'credit_card' or 'cash_on_delivery'
//         subtotal: Number(subtotal.toFixed(2)),
//         tax: tax,
//         shippingCost: Number(shippingCost.toFixed(2)),
//         discount: discount,
//         notes: "", // optional
//       };

//       const result = await createOrder(orderData);

//       if (result.success) {
//         alert(
//           "Order placed successfully! Thank you for supporting artisans ❤️"
//         );
//         navigate("/orders"); // or "/order-success" page
//       } else {
//         setError(result.message || "Failed to place order. Please try again.");
//       }
//     } catch (err) {
//       console.error("Order error:", err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setPlacingOrder(false);
//     }
//   };

//   // Loading state
//   if (loadingCart || loadingUser) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-amber-600 mx-auto"></div>
//           <p className="mt-8 text-2xl text-gray-700">
//             Preparing your checkout...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Empty cart
//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-20">
//         <div className="max-w-4xl mx-auto text-center px-6">
//           <ShoppingBagIcon className="w-32 h-32 text-gray-300 mx-auto mb-8" />
//           <h2 className="text-4xl font-bold text-gray-800 mb-6">
//             Your cart is empty
//           </h2>
//           <p className="text-xl text-gray-600 mb-10">
//             Add some beautiful handmade items to proceed.
//           </p>
//           <Link
//             to="/products"
//             className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 px-14 rounded-full text-xl transition shadow-2xl"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Header */}
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-6 py-10">
//           <Link
//             to="/cart"
//             className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
//           >
//             <ArrowLeftIcon className="w-5 h-5" />
//             Back to Cart
//           </Link>
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-4">
//             <CheckBadgeIcon className="w-12 h-12 text-amber-600" />
//             Checkout
//           </h1>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="grid lg:grid-cols-2 gap-12">
//           {/* Left: Form */}
//           <div className="space-y-10">
//             {/* Contact */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Contact Information
//               </h2>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 required
//                 disabled
//               />
//             </div>

//             {/* Shipping Address */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Shipping Address
//               </h2>
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <input
//                   type="text"
//                   name="firstName"
//                   placeholder="First name"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="lastName"
//                   placeholder="Last name"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//               </div>

//               <input
//                 type="text"
//                 name="address"
//                 placeholder="Street address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 className="w-full px-6 py-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 required
//               />
//               <input
//                 type="text"
//                 name="apartment"
//                 placeholder="Apartment, suite, etc. (optional)"
//                 value={formData.apartment}
//                 onChange={handleInputChange}
//                 className="w-full px-6 py-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
//               />

//               <div className="grid grid-cols-3 gap-4 mb-4">
//                 <input
//                   type="text"
//                   name="city"
//                   placeholder="City"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="state"
//                   placeholder="State"
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="pincode"
//                   placeholder="PIN Code"
//                   value={formData.pincode}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//               </div>

//               <input
//                 type="tel"
//                 name="phone"
//                 placeholder="Phone number"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 className="w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 required
//               />
//             </div>

//             {/* Payment Method */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Payment Method
//               </h2>
//               <div className="space-y-4">
//                 <label
//                   className={`flex items-center gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all ${
//                     paymentMethod === "credit_card"
//                       ? "border-amber-600 bg-amber-50 shadow-md"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     value="credit_card"
//                     checked={paymentMethod === "credit_card"}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                     className="w-5 h-5 text-amber-600"
//                   />
//                   <CreditCardIcon className="w-10 h-10 text-amber-600" />
//                   <div>
//                     <p className="font-semibold">Credit / Debit Card</p>
//                     <p className="text-sm text-gray-600">
//                       Visa, Mastercard, UPI
//                     </p>
//                   </div>
//                 </label>

//                 <label
//                   className={`flex items-center gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all ${
//                     paymentMethod === "cash_on_delivery"
//                       ? "border-amber-600 bg-amber-50 shadow-md"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     value="cash_on_delivery"
//                     checked={paymentMethod === "cash_on_delivery"}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                     className="w-5 h-5 text-amber-600"
//                   />
//                   <BanknotesIcon className="w-10 h-10 text-green-600" />
//                   <div>
//                     <p className="font-semibold">Cash on Delivery</p>
//                     <p className="text-sm text-gray-600">
//                       Pay when you receive
//                     </p>
//                   </div>
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Right: Summary */}
//           <div>
//             <div className="bg-white rounded-3xl shadow-xl p-10 sticky top-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-8">
//                 Order Summary
//               </h2>

//               <div className="space-y-6 mb-8">
//                 {cartItems.map((item) => (
//                   <div key={item._id} className="flex gap-6">
//                     <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden">
//                       <img
//                         src={
//                           item.product.images?.[0]?.url ||
//                           "https://via.placeholder.com/300"
//                         }
//                         alt={item.product.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-semibold text-gray-900 line-clamp-2">
//                         {item.product.name}
//                       </h4>
//                       <p className="text-sm text-gray-600 mt-1">
//                         Qty: {item.quantity}
//                       </p>
//                     </div>
//                     <p className="font-bold text-lg">
//                       ${(item.product.price * item.quantity).toFixed(2)}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               <div className="border-t-2 pt-6 space-y-4 text-lg">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Shipping</span>
//                   <span
//                     className={
//                       shippingCost === 0 ? "text-green-600 font-bold" : ""
//                     }
//                   >
//                     {shippingCost === 0
//                       ? "FREE"
//                       : `$${shippingCost.toFixed(2)}`}
//                   </span>
//                 </div>
//                 {shippingCost === 0 && (
//                   <p className="text-green-600 flex items-center gap-2">
//                     <TruckIcon className="w-6 h-6" />
//                     Free shipping unlocked!
//                   </p>
//                 )}
//                 <div className="border-t-2 pt-6">
//                   <div className="flex justify-between text-3xl font-bold">
//                     <span>Total</span>
//                     <span className="text-amber-600">${total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               {error && (
//                 <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
//                   {error}
//                 </div>
//               )}

//               <button
//                 onClick={handlePlaceOrder}
//                 disabled={placingOrder}
//                 className="w-full mt-8 bg-amber-600 hover:bg-amber-700 disabled:opacity-70 text-white font-bold text-2xl py-6 rounded-2xl transition shadow-2xl flex items-center justify-center gap-3"
//               >
//                 {placingOrder ? (
//                   "Placing Order..."
//                 ) : (
//                   <>
//                     <ShieldCheckIcon className="w-8 h-8" />
//                     Place Order
//                   </>
//                 )}
//               </button>

//               <div className="mt-8 text-center text-sm text-gray-600">
//                 <p className="flex items-center justify-center gap-2">
//                   <ShieldCheckIcon className="w-5 h-5 text-green-600" />
//                   Secure checkout • SSL encrypted
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// src/Client/pages/Checkout.jsx
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   CreditCardIcon,
//   BanknotesIcon,
//   CheckBadgeIcon,
//   TruckIcon,
//   ShieldCheckIcon,
//   ArrowLeftIcon,
//   ShoppingBagIcon,
// } from "@heroicons/react/24/outline";
// import {
//   getCart,
//   createOrder,
//   getCurrentUser,
// } from "../../api-services/apiService";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// export default function Checkout() {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
//   const [loadingCart, setLoadingCart] = useState(true);
//   const [cartError, setCartError] = useState(null);
//   const [loadingUser, setLoadingUser] = useState(true);
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [error, setError] = useState(null);

//   const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery"); // Default to COD

//   const [formData, setFormData] = useState({
//     email: "",
//     firstName: "",
//     lastName: "",
//     address: "",
//     apartment: "",
//     city: "",
//     state: "",
//     pincode: "",
//     phone: "",
//   });

//   // Fetch cart
//   const fetchCart = async () => {
//     setLoadingCart(true);
//     const result = await getCart();
//     if (result.success) {
//       setCartItems(result.data?.data || []);
//     } else {
//       setCartError("Failed to load cart.");
//       setCartItems([]);
//     }
//     setLoadingCart(false);
//   };

//   // Fetch current user
//   const fetchUser = async () => {
//     setLoadingUser(true);
//     const result = await getCurrentUser();
//     if (result.success && result.data) {
//       const user = result.data?.data;
//       debugger
//       setFormData({
//         email: user.email || "",
//         firstName: user.name?.split(" ")[0] || "",
//         lastName: user.name?.split(" ").slice(1).join(" ") || "",
//         phone: user.phone || "",
//         address: user.address?.street || "",
//         apartment: user.address?.apartment || "",
//         city: user.address?.city || "",
//         state: user.address?.state || "",
//         pincode: user.address?.zipCode || "",
//       });
//     }
//     setLoadingUser(false);
//   };

//   useEffect(() => {
//     fetchUser();
//     fetchCart();
//   }, []);

//   // Calculate totals
//   const subtotal = cartItems.reduce(
//     (sum, item) => sum + item.product.price * item.quantity,
//     0
//   );
//   const shippingCost = subtotal >= 100 ? 0 : 12.9;
//   const tax = 0;
//   const discount = 0;
//   const total = subtotal + shippingCost + tax - discount;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePlaceOrder = async () => {
//     if (cartItems.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     setPlacingOrder(true);
//     setError(null);

//     try {
//       let stripeToken = null;
// debugger
//       if (paymentMethod === "credit_card") {
//         const stripe = await stripePromise;
//         const { error, token } = await stripe.createToken({
//           name: `${formData.firstName} ${formData.lastName}`,
//           address_line1: formData.address,
//           address_city: formData.city,
//           address_state: formData.state,
//           address_zip: formData.pincode,
//           address_country: "IN",
//         });

//         if (error) {
//           setError(error.message || "Payment error");
//           return;
//         }

//         stripeToken = token;
//       }
// debugger
//       const orderData = {
//         items: cartItems.map((item) => ({
//           product: item.product._id,
//           quantity: item.quantity,
//         })),
//         shippingAddress: {
//           fullName: `${formData.firstName} ${formData.lastName}`.trim(),
//           phone: formData.phone,
//           street: formData.address,
//           apartment: formData.apartment || "",
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.pincode,
//           country: "India",
//         },
//         paymentMethod: paymentMethod,
//         subtotal: Number(subtotal.toFixed(2)),
//         tax,
//         shippingCost: Number(shippingCost.toFixed(2)),
//         discount,
//         notes: "",
//         stripeToken, // Only sent for card payments
//       };
//       debugger;

//       const result = await createOrder(orderData);
//       debugger;

//       if (result.success) {
//         alert(
//           "Order placed successfully! Thank you for supporting artisans ❤️"
//         );
//         navigate("/orders"); // Or "/order-success"
//       } else {
//         setError(result.message || "Failed to place order.");
//       }
//     } catch (err) {
//       console.error("Order error:", err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setPlacingOrder(false);
//     }
//   };

//   // Loading state
//   if (loadingCart || loadingUser) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-amber-600 mx-auto"></div>
//           <p className="mt-8 text-2xl text-gray-700">
//             Preparing your checkout...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Empty cart
//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-20">
//         <div className="max-w-4xl mx-auto text-center px-6">
//           <ShoppingBagIcon className="w-32 h-32 text-gray-300 mx-auto mb-8" />
//           <h2 className="text-4xl font-bold text-gray-800 mb-6">
//             Your cart is empty
//           </h2>
//           <p className="text-xl text-gray-600 mb-10">
//             Add some beautiful handmade items to proceed.
//           </p>
//           <Link
//             to="/products"
//             className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 px-14 rounded-full text-xl transition shadow-2xl"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Header */}
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-6 py-10">
//           <Link
//             to="/cart"
//             className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
//           >
//             <ArrowLeftIcon className="w-5 h-5" />
//             Back to Cart
//           </Link>
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-4">
//             <CheckBadgeIcon className="w-12 h-12 text-amber-600" />
//             Checkout
//           </h1>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="grid lg:grid-cols-2 gap-12">
//           {/* Left: Form */}
//           <div className="space-y-10">
//             {/* Contact */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Contact Information
//               </h2>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 disabled
//               />
//             </div>

//             {/* Shipping Address */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Shipping Address
//               </h2>
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <input
//                   type="text"
//                   name="firstName"
//                   placeholder="First name"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="lastName"
//                   placeholder="Last name"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//               </div>

//               <input
//                 type="text"
//                 name="address"
//                 placeholder="Street address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 className="w-full px-6 py-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 required
//               />
//               <input
//                 type="text"
//                 name="apartment"
//                 placeholder="Apartment, suite, etc. (optional)"
//                 value={formData.apartment}
//                 onChange={handleInputChange}
//                 className="w-full px-6 py-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
//               />

//               <div className="grid grid-cols-3 gap-4 mb-4">
//                 <input
//                   type="text"
//                   name="city"
//                   placeholder="City"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="state"
//                   placeholder="State"
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="pincode"
//                   placeholder="PIN Code"
//                   value={formData.pincode}
//                   onChange={handleInputChange}
//                   className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   required
//                 />
//               </div>

//               <input
//                 type="tel"
//                 name="phone"
//                 placeholder="Phone number"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 className="w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 required
//               />
//             </div>

//             {/* Payment Method */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Payment Method
//               </h2>
//               <div className="space-y-4">
//                 <label
//                   className={`flex items-center gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all ${
//                     paymentMethod === "credit_card"
//                       ? "border-amber-600 bg-amber-50 shadow-md"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     value="credit_card"
//                     checked={paymentMethod === "credit_card"}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                     className="w-5 h-5 text-amber-600"
//                   />
//                   <CreditCardIcon className="w-10 h-10 text-amber-600" />
//                   <div>
//                     <p className="font-semibold">Credit / Debit Card</p>
//                     <p className="text-sm text-gray-600">
//                       Visa, Mastercard, UPI
//                     </p>
//                   </div>
//                 </label>

//                 <label
//                   className={`flex items-center gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all ${
//                     paymentMethod === "cash_on_delivery"
//                       ? "border-amber-600 bg-amber-50 shadow-md"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     value="cash_on_delivery"
//                     checked={paymentMethod === "cash_on_delivery"}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                     className="w-5 h-5 text-amber-600"
//                   />
//                   <BanknotesIcon className="w-10 h-10 text-green-600" />
//                   <div>
//                     <p className="font-semibold">Cash on Delivery</p>
//                     <p className="text-sm text-gray-600">
//                       Pay when you receive
//                     </p>
//                   </div>
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Right: Summary */}
//           <div>
//             <div className="bg-white rounded-3xl shadow-xl p-10 sticky top-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-8">
//                 Order Summary
//               </h2>

//               <div className="space-y-6 mb-8">
//                 {cartItems.map((item) => (
//                   <div key={item._id} className="flex gap-6">
//                     <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden">
//                       <img
//                         src={
//                           item.product.images?.[0]?.url ||
//                           "https://via.placeholder.com/300"
//                         }
//                         alt={item.product.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-semibold text-gray-900 line-clamp-2">
//                         {item.product.name}
//                       </h4>
//                       <p className="text-sm text-gray-600 mt-1">
//                         Qty: {item.quantity}
//                       </p>
//                     </div>
//                     <p className="font-bold text-lg">
//                       ${(item.product.price * item.quantity).toFixed(2)}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               <div className="border-t-2 pt-6 space-y-4 text-lg">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Shipping</span>
//                   <span
//                     className={
//                       shippingCost === 0 ? "text-green-600 font-bold" : ""
//                     }
//                   >
//                     {shippingCost === 0
//                       ? "FREE"
//                       : `$${shippingCost.toFixed(2)}`}
//                   </span>
//                 </div>
//                 {shippingCost === 0 && (
//                   <p className="text-green-600 flex items-center gap-2">
//                     <TruckIcon className="w-6 h-6" />
//                     Free shipping unlocked!
//                   </p>
//                 )}
//                 <div className="border-t-2 pt-6">
//                   <div className="flex justify-between text-3xl font-bold">
//                     <span>Total</span>
//                     <span className="text-amber-600">${total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               {error && (
//                 <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
//                   {error}
//                 </div>
//               )}

//               <button
//                 onClick={handlePlaceOrder}
//                 disabled={placingOrder}
//                 className="w-full mt-8 bg-amber-600 hover:bg-amber-700 disabled:opacity-70 text-white font-bold text-2xl py-6 rounded-2xl transition shadow-2xl flex items-center justify-center gap-3"
//               >
//                 {placingOrder ? (
//                   <div className="flex items-center gap-3">
//                     <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
//                     Placing Order...
//                   </div>
//                 ) : (
//                   <>
//                     <ShieldCheckIcon className="w-8 h-8" />
//                     Place Order
//                   </>
//                 )}
//               </button>

//               <div className="mt-8 text-center text-sm text-gray-600">
//                 <p className="flex items-center justify-center gap-2">
//                   <ShieldCheckIcon className="w-5 h-5 text-green-600" />
//                   Secure checkout • SSL encrypted
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// src/Client/pages/Checkout.jsx
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-amber-600 mx-auto"></div>
          <p className="mt-8 text-2xl text-gray-700">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <ShoppingBagIcon className="w-32 h-32 text-gray-300 mx-auto mb-8" />
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Your cart is empty
          </h2>
          <Link
            to="/products"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 px-14 rounded-full text-xl transition shadow-2xl"
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
        <div className="max-w-7xl mx-auto px-6 py-10">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Cart
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-4">
            <CheckBadgeIcon className="w-12 h-12 text-amber-600" />
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Form */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-6 py-4 border rounded-xl bg-gray-100"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-6 py-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
                className="w-full px-6 py-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <div className="grid grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Payment Method
              </h2>
              <div className="space-y-4">
                <label
                  className={`flex items-center gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all ${
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
                    className="w-5 h-5 text-amber-600"
                  />
                  <CreditCardIcon className="w-10 h-10 text-amber-600" />
                  <div>
                    <p className="font-semibold">Credit / Debit Card</p>
                    <p className="text-sm text-gray-600">
                      Visa, Mastercard, UPI
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all ${
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
                    className="w-5 h-5 text-amber-600"
                  />
                  <BanknotesIcon className="w-10 h-10 text-green-600" />
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">
                      Pay when you receive
                    </p>
                  </div>
                </label>
              </div>

              {paymentMethod === "credit_card" && (
                <div className="mt-6 p-6 border border-gray-300 rounded-2xl bg-gray-50">
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
                  <p className="text-sm text-gray-500 mt-2">
                    Secure payment powered by Stripe
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="bg-white rounded-3xl shadow-xl p-10 sticky top-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Order Summary
              </h2>

              <div className="space-y-6 mb-8">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden">
                      <img
                        src={
                          item.product.images?.[0]?.url ||
                          "https://via.placeholder.com/300"
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-lg">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t-2 pt-6 space-y-4 text-lg">
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
                <div className="border-t-2 pt-6">
                  <div className="flex justify-between text-3xl font-bold">
                    <span>Total</span>
                    <span className="text-amber-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full mt-8 bg-amber-600 hover:bg-amber-700 disabled:opacity-70 text-white font-bold text-2xl py-6 rounded-2xl transition shadow-2xl flex items-center justify-center gap-3"
              >
                {placingOrder ? (
                  "Processing..."
                ) : (
                  <>
                    <ShieldCheckIcon className="w-8 h-8" />
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
