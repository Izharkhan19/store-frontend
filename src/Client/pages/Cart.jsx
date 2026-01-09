// // // src/Client/pages/Cart.jsx
// // import { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import {
// //     XMarkIcon,
// //     PlusIcon,
// //     MinusIcon,
// //     ShoppingBagIcon,
// //     TruckIcon,
// //     ShieldCheckIcon
// // } from '@heroicons/react/24/outline';

// // export default function Cart() {
// //     const [cartItems, setCartItems] = useState([]);
// //     const [loading, setLoading] = useState(true);

// //     // Mock cart data (replace with real cart state later)
// //     useEffect(() => {
// //         setTimeout(() => {
// //             setCartItems([
// //                 {
// //                     id: 1,
// //                     name: 'Handmade Ceramic Vase - Ocean Blue',
// //                     price: 78,
// //                     quantity: 1,
// //                     image: '/api/placeholder/300/300',
// //                     artist: 'Maya Chen',
// //                     inStock: true
// //                 },
// //                 {
// //                     id: 3,
// //                     name: 'Silver Moon Necklace',
// //                     price: 89,
// //                     quantity: 2,
// //                     image: '/api/placeholder/300/300',
// //                     artist: 'Luna Silver',
// //                     inStock: true
// //                 },
// //                 {
// //                     id: 5,
// //                     name: 'Lavender Soy Candle Gift Set',
// //                     price: 42,
// //                     quantity: 1,
// //                     image: '/api/placeholder/300/300',
// //                     artist: 'Emma Glow',
// //                     inStock: false
// //                 }
// //             ]);
// //             setLoading(false);
// //         }, 600);
// //     }, []);

// //     const updateQuantity = (id, newQuantity) => {
// //         if (newQuantity === 0) {
// //             removeFromCart(id);
// //             return;
// //         }
// //         setCartItems(prev =>
// //             prev.map(item =>
// //                 item.id === id ? { ...item, quantity: newQuantity } : item
// //             )
// //         );
// //     };

// //     const removeFromCart = (id) => {
// //         setCartItems(prev => prev.filter(item => item.id !== id));
// //     };

// //     const subtotal = cartItems
// //         .filter(item => item.inStock)
// //         .reduce((sum, item) => sum + item.price * item.quantity, 0);

// //     const shipping = subtotal >= 100 ? 0 : 12.90;
// //     const total = subtotal + shipping;

// //     if (loading) {
// //         return (
// //             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-600"></div>
// //             </div>
// //         );
// //     }

// //     if (cartItems.length === 0) {
// //         return (
// //             <div className="min-h-screen bg-gray-50 py-20">
// //                 <div className="max-w-3xl mx-auto text-center px-6">
// //                     <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 mx-auto mb-8" />
// //                     <h2 className="text-4xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
// //                     <p className="text-xl text-gray-600 mb-10">
// //                         Looks like you haven't added any handmade treasures yet.
// //                     </p>
// //                     <Link
// //                         to="/products"
// //                         className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 px-12 rounded-full text-lg transition shadow-lg"
// //                     >
// //                         Continue Shopping
// //                     </Link>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <>
// //             {/* Header */}
// //             <div className="bg-white border-b">
// //                 <div className="max-w-7xl mx-auto px-6 py-8">
// //                     <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-4">
// //                         <ShoppingBagIcon className="w-12 h-12 text-amber-600" />
// //                         Your Cart
// //                         <span className="text-2xl font-normal text-gray-600 ml-4">
// //                             ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)
// //                         </span>
// //                     </h1>
// //                 </div>
// //             </div>

// //             <div className="max-w-7xl mx-auto px-6 py-12">
// //                 <div className="grid lg:grid-cols-3 gap-12">
// //                     {/* Cart Items */}
// //                     <div className="lg:col-span-2 space-y-6">
// //                         {cartItems.map((item) => (
// //                             <div
// //                                 key={item.id}
// //                                 className={`bg-white rounded-2xl shadow-sm border ${!item.inStock ? 'opacity-60' : ''} overflow-hidden transition-all hover:shadow-lg`}
// //                             >
// //                                 <div className="flex gap-6 p-6">
// //                                     {/* Image */}
// //                                     <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex-shrink-0 overflow-hidden">
// //                                         <div className="w-full h-full bg-gray-200" />
// //                                         {!item.inStock && (
// //                                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
// //                                                 <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">
// //                                                     Out of Stock
// //                                                 </span>
// //                                             </div>
// //                                         )}
// //                                     </div>

// //                                     {/* Details */}
// //                                     <div className="flex-1">
// //                                         <div className="flex justify-between items-start mb-3">
// //                                             <div>
// //                                                 <Link
// //                                                     to={`/products/${item.id}`}
// //                                                     className="text-xl font-semibold text-gray-900 hover:text-amber-600 transition"
// //                                                 >
// //                                                     {item.name}
// //                                                 </Link>
// //                                                 <p className="text-gray-600 mt-1">by {item.artist}</p>
// //                                             </div>
// //                                             <button
// //                                                 onClick={() => removeFromCart(item.id)}
// //                                                 className="text-gray-400 hover:text-red-600 transition"
// //                                             >
// //                                                 <XMarkIcon className="w-6 h-6" />
// //                                             </button>
// //                                         </div>

// //                                         <div className="flex items-center justify-between mt-6">
// //                                             {/* Quantity */}
// //                                             <div className="flex items-center border rounded-xl overflow-hidden">
// //                                                 <button
// //                                                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
// //                                                     className="p-3 hover:bg-gray-100 transition"
// //                                                     disabled={!item.inStock}
// //                                                 >
// //                                                     <MinusIcon className="w-5 h-5" />
// //                                                 </button>
// //                                                 <span className="px-6 py-3 font-bold text-lg">{item.quantity}</span>
// //                                                 <button
// //                                                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
// //                                                     className="p-3 hover:bg-gray-100 transition"
// //                                                     disabled={!item.inStock}
// //                                                 >
// //                                                     <PlusIcon className="w-5 h-5" />
// //                                                 </button>
// //                                             </div>

// //                                             {/* Price */}
// //                                             <div className="text-right">
// //                                                 <p className="text-3xl font-bold text-gray-900">
// //                                                     ${(item.price * item.quantity).toFixed(2)}
// //                                                 </p>
// //                                                 {item.quantity > 1 && (
// //                                                     <p className="text-sm text-gray-500">
// //                                                         ${item.price} each
// //                                                     </p>
// //                                                 )}
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>

// //                     {/* Order Summary */}
// //                     <div className="lg:col-span-1">
// //                         <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
// //                             <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

// //                             <div className="space-y-4 text-lg">
// //                                 <div className="flex justify-between">
// //                                     <span className="text-gray-600">Subtotal</span>
// //                                     <span className="font-semibold">${subtotal.toFixed(2)}</span>
// //                                 </div>
// //                                 <div className="flex justify-between">
// //                                     <span className="text-gray-600">Shipping</span>
// //                                     <span className={shipping === 0 ? 'text-green-600 font-bold' : 'font-semibold'}>
// //                                         {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
// //                                     </span>
// //                                 </div>
// //                                 {shipping === 0 && (
// //                                     <p className="text-sm text-green-600 flex items-center gap-2">
// //                                         <TruckIcon className="w-5 h-5" />
// //                                         Congrats! You've earned free shipping
// //                                     </p>
// //                                 )}
// //                                 <div className="border-t pt-4">
// //                                     <div className="flex justify-between text-2xl font-bold text-gray-900">
// //                                         <span>Total</span>
// //                                         <span>${total.toFixed(2)}</span>
// //                                     </div>
// //                                 </div>
// //                             </div>

// //                             <Link
// //                                 to="/checkout"
// //                                 className="w-full mt-8 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xl py-6 rounded-2xl block text-center transition shadow-lg"
// //                             >
// //                                 Proceed to Checkout
// //                             </Link>

// //                             <div className="mt-8 space-y-4 text-sm text-gray-600">
// //                                 <div className="flex items-center gap-3">
// //                                     <ShieldCheckIcon className="w-6 h-6 text-amber-600" />
// //                                     <span>Secure checkout guaranteed</span>
// //                                 </div>
// //                                 <div className="flex items-center gap-3">
// //                                     <TruckIcon className="w-6 h-6 text-amber-600" />
// //                                     <span>Free shipping on orders over $100</span>
// //                                 </div>
// //                             </div>

// //                             <div className="mt-10 pt-8 border-t text-center">
// //                                 <Link to="/products" className="text-amber-600 hover:text-amber-700 font-medium">
// //                                     ← Continue Shopping
// //                                 </Link>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </>
// //     );
// // }


// // src/Client/pages/Cart.jsx
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//     XMarkIcon,
//     PlusIcon,
//     MinusIcon,
//     ShoppingBagIcon,
//     TruckIcon,
//     ShieldCheckIcon,
// } from "@heroicons/react/24/outline";
// import { useApi } from "../../api-services/hooks/useApi";
// import {
//     getCart,
//     updateCartItem,
//     removeFromCart,
//     clearCart,
// } from "../../api-services/apiService";

// export default function Cart() {
//     const [cartItems, setCartItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Fetch real cart from backend
//     const {
//         data: cartResponse,
//         loading: loadingCart,
//         error: cartError,
//         request: fetchCart,
//     } = useApi(getCart);

//     // Update quantity
//     const { request: updateQty } = useApi(updateCartItem);
//     // Remove item
//     const { request: removeItem } = useApi(removeFromCart);
//     // Clear cart
//     const { request: clearCartApi } = useApi(clearCart);

//     // Load cart on mount
//     useEffect(() => {
//         const loadCart = async () => {
//             setLoading(true);
//             setError(null);
//             const result = await fetchCart();
//             if (result.success) {
//                 setCartItems(result.data || []);
//             } else {
//                 setError(result.message || "Failed to load cart");
//             }
//             setLoading(false);
//         };
//         loadCart();
//     }, []);

//     const handleUpdateQuantity = async (productId, newQty) => {
//         if (newQty < 1) return;
//         const result = await updateQty(productId, newQty);
//         if (result.success) {
//             setCartItems(result.data);
//         }
//     };

//     const handleRemoveItem = async (productId) => {
//         const result = await removeItem(productId);
//         if (result.success) {
//             setCartItems(result.data);
//         }
//     };

//     const handleClearCart = async () => {
//         const result = await clearCartApi();
//         if (result.success) {
//             setCartItems([]);
//         }
//     };

//     // Calculate totals
//     const subtotal = cartItems
//         .filter((item) => item.product?.stock > 0)
//         .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

//     const shipping = subtotal >= 100 ? 0 : 12.9;
//     const total = subtotal + shipping;

//     const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//     // Loading
//     if (loading || loadingCart) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-amber-600 mx-auto"></div>
//                     <p className="mt-8 text-2xl text-gray-700">Loading your cart...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Error
//     if (error || cartError) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center max-w-md px-6">
//                     <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
//                     <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
//                     <p className="text-gray-600 mb-8">{error || cartError}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-10 rounded-full transition"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // Empty cart
//     if (!cartItems || cartItems.length === 0) {
//         return (
//             <div className="min-h-screen bg-gray-50 py-20">
//                 <div className="max-w-3xl mx-auto text-center px-6">
//                     <div className="bg-gray-100 rounded-full p-16 w-48 h-48 mx-auto mb-10 flex items-center justify-center">
//                         <ShoppingBagIcon className="w-24 h-24 text-gray-300" />
//                     </div>
//                     <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
//                         Your cart is empty
//                     </h2>
//                     <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
//                         Looks like you haven't added any handmade treasures yet. Start exploring our collection!
//                     </p>
//                     <Link
//                         to="/products"
//                         className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 px-14 rounded-full text-xl transition shadow-2xl transform hover:scale-105"
//                     >
//                         Start Shopping
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             {/* Header */}
//             <div className="bg-white border-b">
//                 <div className="max-w-7xl mx-auto px-6 py-10">
//                     <div className="flex justify-between items-center">
//                         <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-4">
//                             <ShoppingBagIcon className="w-12 h-12 text-amber-600" />
//                             Your Cart
//                             <span className="text-2xl font-normal text-gray-600">
//                                 ({totalItems} {totalItems === 1 ? "item" : "items"})
//                             </span>
//                         </h1>
//                         <button
//                             onClick={handleClearCart}
//                             className="text-red-600 hover:text-red-700 font-medium transition"
//                         >
//                             Clear Cart
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className="max-w-7xl mx-auto px-6 py-12">
//                 <div className="grid lg:grid-cols-3 gap-12">
//                     {/* Cart Items */}
//                     <div className="lg:col-span-2 space-y-8">
//                         {cartItems.map((item) => {
//                             const product = item.product;
//                             const inStock = product?.stock > 0;

//                             return (
//                                 <div
//                                     key={item._id || product._id}
//                                     className={`bg-white rounded-3xl shadow-lg border overflow-hidden transition-all hover:shadow-2xl ${!inStock ? "opacity-70" : ""
//                                         }`}
//                                 >
//                                     <div className="flex gap-6 p-8">
//                                         {/* Image */}
//                                         <Link to={`/products/${product._id}`} className="flex-shrink-0">
//                                             <div className="w-36 h-36 bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200">
//                                                 <img
//                                                     src={product.images?.[0]?.url}
//                                                     alt={product.name}
//                                                     className="w-full h-full object-cover"
//                                                     onError={(e) => {
//                                                         e.target.src = "https://via.placeholder.com/300?text=No+Image";
//                                                     }}
//                                                 />
//                                             </div>
//                                         </Link>

//                                         {/* Details */}
//                                         <div className="flex-1">
//                                             <div className="flex justify-between items-start mb-4">
//                                                 <div>
//                                                     <Link
//                                                         to={`/products/${product._id}`}
//                                                         className="text-2xl font-bold text-gray-900 hover:text-amber-600 transition"
//                                                     >
//                                                         {product.name}
//                                                     </Link>
//                                                     <p className="text-gray-600 mt-2">by {product.artist || "Artisan"}</p>
//                                                 </div>
//                                                 <button
//                                                     onClick={() => handleRemoveItem(product._id)}
//                                                     className="text-gray-400 hover:text-red-600 transition-transform hover:scale-110"
//                                                 >
//                                                     <XMarkIcon className="w-7 h-7" />
//                                                 </button>
//                                             </div>

//                                             {!inStock && (
//                                                 <p className="text-red-600 font-medium mb-4">
//                                                     Out of Stock — Will be removed at checkout
//                                                 </p>
//                                             )}

//                                             <div className="flex items-center justify-between mt-8">
//                                                 <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
//                                                     <button
//                                                         onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
//                                                         disabled={item.quantity <= 1 || !inStock}
//                                                         className="px-6 py-4 hover:bg-gray-100 disabled:opacity-50 transition"
//                                                     >
//                                                         <MinusIcon className="w-5 h-5" />
//                                                     </button>
//                                                     <span className="px-10 py-4 font-bold text-2xl min-w-32 text-center">
//                                                         {item.quantity}
//                                                     </span>
//                                                     <button
//                                                         onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
//                                                         disabled={!inStock}
//                                                         className="px-6 py-4 hover:bg-gray-100 disabled:opacity-50 transition"
//                                                     >
//                                                         <PlusIcon className="w-5 h-5" />
//                                                     </button>
//                                                 </div>

//                                                 <div className="text-right">
//                                                     <p className="text-3xl font-bold text-gray-900">
//                                                         ${(product.price * item.quantity).toFixed(2)}
//                                                     </p>
//                                                     <p className="text-sm text-gray-500 mt-1">
//                                                         ${product.price.toFixed(2)} each
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>

//                     {/* Order Summary */}
//                     <div className="lg:col-span-1">
//                         <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-xl p-10 sticky top-8">
//                             <h2 className="text-3xl font-bold text-gray-900 mb-8">Order Summary</h2>

//                             <div className="space-y-5 text-lg">
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-700">Subtotal</span>
//                                     <span className="font-bold">${subtotal.toFixed(2)}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-700">Shipping</span>
//                                     <span className={shipping === 0 ? "text-green-600 font-bold" : "font-bold"}>
//                                         {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
//                                     </span>
//                                 </div>
//                                 {shipping === 0 && (
//                                     <p className="text-green-600 font-medium flex items-center gap-2 pt-2">
//                                         <TruckIcon className="w-6 h-6" />
//                                         Congratulations! Free shipping applied
//                                     </p>
//                                 )}
//                                 <div className="border-t-2 border-dashed border-amber-200 pt-6 mt-6">
//                                     <div className="flex justify-between text-3xl font-bold text-gray-900">
//                                         <span>Total</span>
//                                         <span className="text-amber-600">${total.toFixed(2)}</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             <Link
//                                 to="/checkout"
//                                 className="w-full mt-10 bg-amber-600 hover:bg-amber-700 text-white font-bold text-2xl py-6 rounded-2xl block text-center transition transform hover:scale-105 shadow-2xl"
//                             >
//                                 Proceed to Checkout
//                             </Link>

//                             <div className="mt-10 space-y-5 text-gray-700">
//                                 <div className="flex items-center gap-4">
//                                     <ShieldCheckIcon className="w-7 h-7 text-amber-600" />
//                                     <span>Secure checkout • Buyer protection guaranteed</span>
//                                 </div>
//                                 <div className="flex items-center gap-4">
//                                     <TruckIcon className="w-7 h-7 text-amber-600" />
//                                     <span>Free shipping on orders over $100</span>
//                                 </div>
//                             </div>

//                             <div className="mt-12 pt-8 border-t text-center">
//                                 <Link
//                                     to="/products"
//                                     className="text-amber-700 hover:text-amber-800 font-semibold text-lg transition"
//                                 >
//                                     Continue Shopping
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// src/Client/pages/Cart.jsx
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
    const isLoggedIn = !!localStorage.getItem("token") || !!localStorage.getItem("adminToken");

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
    const totalItemsCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-amber-600 mx-auto"></div>
                    <p className="mt-8 text-2xl text-gray-700">Loading your cart...</p>
                </div>
            </div>
        );
    }

    // Not logged in
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 py-20">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <ShoppingBagIcon className="w-32 h-32 text-gray-300 mx-auto mb-8" />
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        Sign in to view your cart
                    </h2>
                    <p className="text-xl text-gray-600 mb-10">
                        Your cart is saved when you sign in.
                    </p>
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 px-14 rounded-full text-xl transition shadow-2xl"
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
                <div className="text-center max-w-md px-6">
                    <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-8" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops!</h2>
                    <p className="text-lg text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={fetchCart}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-10 rounded-full transition"
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
            <div className="min-h-screen bg-gray-50 py-20">
                <div className="max-w-3xl mx-auto text-center px-6">
                    <div className="bg-gray-100 rounded-full p-16 w-48 h-48 mx-auto mb-10 flex items-center justify-center">
                        <ShoppingBagIcon className="w-24 h-24 text-gray-300" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        Your cart is empty
                    </h2>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Looks like you haven't added any handmade treasures yet. Start exploring!
                    </p>
                    <Link
                        to="/products"
                        className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 px-14 rounded-full text-xl transition shadow-2xl transform hover:scale-105"
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
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="flex justify-between items-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-4">
                            <ShoppingBagIcon className="w-12 h-12 text-amber-600" />
                            Your Cart
                            <span className="text-2xl font-normal text-gray-600">
                                ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})
                            </span>
                        </h1>
                        <button
                            onClick={clearAll}
                            className="text-red-600 hover:text-red-700 font-medium transition"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {cartItems.map((item) => {
                            const product = item.product || {};
                            const id = product._id || product.id;
                            const name = product.name || "Unknown Product";
                            const price = product.price || 0;
                            const stock = product.stock || 0;
                            const image = product.images?.[0]?.url || "https://via.placeholder.com/400";

                            return (
                                <div
                                    key={id}
                                    className={`bg-white rounded-3xl shadow-lg border overflow-hidden transition-all hover:shadow-2xl ${stock === 0 ? "opacity-70" : ""}`}
                                >
                                    <div className="flex gap-6 p-8">
                                        <Link to={`/products/${id}`} className="flex-shrink-0">
                                            <div className="w-36 h-36 bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200">
                                                <img
                                                    src={image}
                                                    alt={name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/400?text=No+Image";
                                                    }}
                                                />
                                            </div>
                                        </Link>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <Link
                                                        to={`/products/${id}`}
                                                        className="text-2xl font-bold text-gray-900 hover:text-amber-600 transition block mb-2"
                                                    >
                                                        {name}
                                                    </Link>
                                                    <p className="text-gray-600">by {product.artist || "Artisan"}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(id)}
                                                    className="text-gray-400 hover:text-red-600 transition-transform hover:scale-110"
                                                >
                                                    <XMarkIcon className="w-7 h-7" />
                                                </button>
                                            </div>

                                            {stock === 0 && (
                                                <p className="text-red-600 font-medium mb-4">
                                                    Out of Stock — Will be removed at checkout
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between mt-8">
                                                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1 || stock === 0}
                                                        className="px-6 py-4 hover:bg-gray-100 disabled:opacity-50 transition"
                                                    >
                                                        <MinusIcon className="w-5 h-5" />
                                                    </button>
                                                    <span className="px-10 py-4 font-bold text-2xl min-w-32 text-center">
                                                        {item.quantity || 1}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(id, item.quantity + 1)}
                                                        disabled={stock === 0}
                                                        className="px-6 py-4 hover:bg-gray-100 disabled:opacity-50 transition"
                                                    >
                                                        <PlusIcon className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-3xl font-bold text-gray-900">
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
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-xl p-10 sticky top-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Order Summary</h2>

                            <div className="space-y-5 text-lg">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Subtotal</span>
                                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Shipping</span>
                                    <span className={shipping === 0 ? "text-green-600 font-bold" : "font-bold"}>
                                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                {shipping === 0 && (
                                    <p className="text-green-600 font-medium flex items-center gap-2 pt-2">
                                        <TruckIcon className="w-6 h-6" />
                                        Congratulations! Free shipping applied
                                    </p>
                                )}
                                <div className="border-t-2 border-dashed border-amber-200 pt-6 mt-6">
                                    <div className="flex justify-between text-3xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-amber-600">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full mt-10 bg-amber-600 hover:bg-amber-700 text-white font-bold text-2xl py-6 rounded-2xl block text-center transition transform hover:scale-105 shadow-2xl"
                            >
                                Proceed to Checkout
                            </Link>

                            <div className="mt-10 space-y-5 text-gray-700">
                                <div className="flex items-center gap-4">
                                    <ShieldCheckIcon className="w-7 h-7 text-amber-600" />
                                    <span>Secure checkout • Buyer protection guaranteed</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <TruckIcon className="w-7 h-7 text-amber-600" />
                                    <span>Free shipping on orders over $100</span>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t text-center">
                                <Link
                                    to="/products"
                                    className="text-amber-700 hover:text-amber-800 font-semibold text-lg transition"
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