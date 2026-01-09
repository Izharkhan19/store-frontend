// // src/Client/pages/Wishlist.jsx
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//     XMarkIcon,
//     ShoppingBagIcon,
//     HeartIcon as HeartOutline,
// } from "@heroicons/react/24/outline";
// import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
// import { useApi } from "../../api-services/hooks/useApi";
// import {
//     getWishlist,
//     removeFromWishlist,
//     clearWishlist,
//     addToCart,
// } from "../../api-services/apiService";

// export default function Wishlist() {
//     const [wishlistItems, setWishlistItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const {
//         data: wishlistResponse,
//         loading: loadingWishlist,
//         error: wishlistError,
//         request: fetchWishlist,
//     } = useApi(getWishlist);

//     const { request: removeItem } = useApi(removeFromWishlist);
//     const { request: clearAll } = useApi(clearWishlist);
//     const { request: addToCartApi } = useApi(addToCart);

//     const loadWishlist = async () => {
//         setLoading(true);
//         setError(null);
//         const result = await getWishlist();
//         if (result.success) {
//             setWishlistItems(result.data || []);
//         } else {
//             setError(result.message || "Failed to load wishlist");
//         }
//         setLoading(false);
//     };

//     // Load wishlist
//     useEffect(() => {
//         loadWishlist();
//     }, []);

//     const handleRemove = async (productId) => {
//         let tmpList = [...wishlistItems]
//         let filteredList = tmpList?.filter((item) => item?.id !== productId)
//         setWishlistItems(filteredList);
//         const result = await removeItem(productId);
//         if (result.success) {
//         } else {
//             setWishlistItems(wishlistItems);
//         }
//     };

//     const handleClearAll = async () => {
//         if (confirm("Remove all items from wishlist?")) {
//             const result = await clearAll();
//             if (result.success) {
//                 setWishlistItems([]);
//             }
//         }
//     };

//     const handleAddToCart = async (productId) => {
//         const result = await addToCartApi(productId, 1);
//         if (result.success) {
//             alert("Added to cart!");
//             // Optional: remove from wishlist after adding to cart
//             // handleRemove(productId);
//         }
//     };

//     // Loading
//     if (loading || loadingWishlist) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <HeartSolid className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
//                     <p className="text-2xl text-gray-700">Loading your wishlist...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Error
//     if (error || wishlistError) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center max-w-md px-6">
//                     <HeartSolid className="w-24 h-24 text-gray-300 mx-auto mb-6" />
//                     <h2 className="text-3xl font-bold text-gray-800 mb-4">Something went wrong</h2>
//                     <p className="text-gray-600 mb-8">{error || wishlistError}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full transition"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // Empty Wishlist
//     if (!wishlistItems || wishlistItems.length === 0) {
//         return (
//             <div className="min-h-screen bg-gray-50 py-20">
//                 <div className="max-w-4xl mx-auto text-center px-6">
//                     <div className="bg-gray-100 rounded-full p-16 w-48 h-48 mx-auto mb-10 flex items-center justify-center">
//                         <HeartOutline className="w-24 h-24 text-gray-300" />
//                     </div>
//                     <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
//                         Your wishlist is empty
//                     </h2>
//                     <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
//                         Save your favorite handmade treasures here so you can find them later!
//                     </p>
//                     <Link
//                         to="/products"
//                         className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 px-14 rounded-full text-xl transition shadow-2xl transform hover:scale-105"
//                     >
//                         Start Browsing
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
//                             <HeartSolid className="w-12 h-12 text-red-500" />
//                             My Wishlist
//                             <span className="text-2xl font-normal text-gray-600">
//                                 ({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"})
//                             </span>
//                         </h1>
//                         <button
//                             onClick={handleClearAll}
//                             className="text-red-600 hover:text-red-700 font-medium transition"
//                         >
//                             Clear All
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className="max-w-7xl mx-auto px-6 py-12">
//                 <div className="grid lg:grid-cols-4 gap-8">
//                     {/* Wishlist Items */}
//                     <div className="lg:col-span-3 space-y-8">
//                         {wishlistItems.map((product) => (
//                             <div
//                                 key={product._id}
//                                 className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
//                             >
//                                 <div className="flex gap-8 p-8">
//                                     {/* Image */}
//                                     <Link to={`/products/${product._id}`} className="flex-shrink-0">
//                                         <div className="w-40 h-40 bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200">
//                                             <img
//                                                 src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
//                                                 alt={product.name}
//                                                 className="w-full h-full object-cover"
//                                                 onError={(e) => {
//                                                     e.target.src = "https://via.placeholder.com/400?text=No+Image";
//                                                 }}
//                                             />
//                                         </div>
//                                     </Link>

//                                     {/* Details */}
//                                     <div className="flex-1">
//                                         <div className="flex justify-between items-start mb-6">
//                                             <div>
//                                                 <Link
//                                                     to={`/products/${product._id}`}
//                                                     className="text-2xl font-bold text-gray-900 hover:text-amber-600 transition block mb-2"
//                                                 >
//                                                     {product.name}
//                                                 </Link>
//                                                 <p className="text-gray-600">by {product.artist || "Artisan"}</p>
//                                             </div>
//                                             <button
//                                                 onClick={() => handleRemove(product._id)}
//                                                 className="text-gray-400 hover:text-red-600 transition-transform hover:scale-110"
//                                             >
//                                                 <XMarkIcon className="w-8 h-8" />
//                                             </button>
//                                         </div>

//                                         <div className="flex items-center gap-4 mb-6">
//                                             <span className="text-3xl font-bold text-gray-900">
//                                                 ${Number(product.price || 0).toFixed(2)}
//                                             </span>
//                                             {!product.stock && (
//                                                 <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
//                                                     Out of Stock
//                                                 </span>
//                                             )}
//                                         </div>

//                                         <div className="flex gap-4">
//                                             <button
//                                                 onClick={() => handleAddToCart(product._id)}
//                                                 disabled={!product.stock}
//                                                 className={`flex-1 py-4 rounded-2xl font-bold text-lg transition shadow-md ${product.stock
//                                                     ? "bg-amber-600 hover:bg-amber-700 text-white"
//                                                     : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                                                     }`}
//                                             >
//                                                 {product.stock ? "Add to Cart" : "Out of Stock"}
//                                             </button>
//                                             <button
//                                                 onClick={() => handleRemove(product._id)}
//                                                 className="px-6 py-4 border-2 border-red-600 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition"
//                                             >
//                                                 Remove
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Summary Sidebar */}
//                     <div className="lg:col-span-1">
//                         <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl shadow-xl p-10 sticky top-8">
//                             <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
//                                 <HeartSolid className="w-10 h-10 text-red-500" />
//                                 Saved for Later
//                             </h2>
//                             <p className="text-gray-700 mb-8">
//                                 {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} in your wishlist
//                             </p>
//                             <Link
//                                 to="/products"
//                                 className="block w-full text-center bg-white border-2 border-amber-600 text-amber-600 font-bold py-5 rounded-2xl hover:bg-amber-50 transition shadow-lg"
//                             >
//                                 Continue Shopping
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// src/Client/pages/Wishlist.jsx
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
    const isLoggedIn = !!localStorage.getItem("token") || !!localStorage.getItem("adminToken");

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
        setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));

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
                <div className="text-center">
                    <HeartSolid className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
                    <p className="text-2xl text-gray-700">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    // Not logged in
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 py-20">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <div className="bg-gray-100 rounded-full p-16 w-48 h-48 mx-auto mb-10 flex items-center justify-center">
                        <HeartOutline className="w-24 h-24 text-gray-300" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        Sign in to view your wishlist
                    </h2>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Save your favorite handmade treasures and access them from any device.
                    </p>
                    <button
                        onClick={openLoginModal}
                        className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 px-14 rounded-full text-xl transition shadow-2xl transform hover:scale-105"
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
                <div className="text-center max-w-md px-6">
                    <HeartSolid className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops!</h2>
                    <p className="text-lg text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={fetchWishlist}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-10 rounded-full transition"
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
            <div className="min-h-screen bg-gray-50 py-20">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <div className="bg-gray-100 rounded-full p-16 w-48 h-48 mx-auto mb-10 flex items-center justify-center">
                        <HeartOutline className="w-24 h-24 text-gray-300" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        Your wishlist is empty
                    </h2>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Save your favorite handmade treasures here so you can find them later!
                    </p>
                    <Link
                        to="/products"
                        className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 px-14 rounded-full text-xl transition shadow-2xl transform hover:scale-105"
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
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="flex justify-between items-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-4">
                            <HeartSolid className="w-12 h-12 text-red-500" />
                            My Wishlist
                            <span className="text-2xl font-normal text-gray-600">
                                ({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"})
                            </span>
                        </h1>
                        <button
                            onClick={handleClearAll}
                            className="text-red-600 hover:text-red-700 font-medium transition"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Items */}
                    <div className="lg:col-span-3 space-y-8">
                        {
                            wishlistItems?.length > 0 &&
                            wishlistItems.map((product) => {
                                const id = product._id || product.id;
                                const name = product.name || "Unnamed Product";
                                const price = product.price || 0;
                                const image = product.images?.[0]?.url || "https://via.placeholder.com/400";
                                const stock = product.stock ?? 0;

                                return (
                                    <div
                                        key={id}
                                        className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                                    >
                                        <div className="flex gap-8 p-8">
                                            <Link to={`/products/${id}`} className="flex-shrink-0">
                                                <div className="w-40 h-40 bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200">
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
                                                <div className="flex justify-between items-start mb-6">
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
                                                        onClick={() => handleRemove(id)}
                                                        className="text-gray-400 hover:text-red-600 transition-transform hover:scale-110"
                                                    >
                                                        <XMarkIcon className="w-8 h-8" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-4 mb-6">
                                                    <span className="text-3xl font-bold text-gray-900">
                                                        ${Number(price).toFixed(2)}
                                                    </span>
                                                    {stock === 0 && (
                                                        <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => handleAddToCart(id)}
                                                        disabled={stock === 0}
                                                        className={`flex-1 py-4 rounded-2xl font-bold text-lg transition shadow-md ${stock > 0
                                                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                            }`}
                                                    >
                                                        {stock > 0 ? "Add to Cart" : "Out of Stock"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemove(id)}
                                                        className="px-6 py-4 border-2 border-red-600 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition"
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
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl shadow-xl p-10 sticky top-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <HeartSolid className="w-10 h-10 text-red-500" />
                                Saved for Later
                            </h2>
                            <p className="text-gray-700 mb-8">
                                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} in your wishlist
                            </p>
                            <Link
                                to="/products"
                                className="block w-full text-center bg-white border-2 border-amber-600 text-amber-600 font-bold py-5 rounded-2xl hover:bg-amber-50 transition shadow-lg"
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