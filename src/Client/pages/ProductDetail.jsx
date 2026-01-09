// // src/Client/pages/ProductDetail.jsx
// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//     HeartIcon,
//     ArrowLeftIcon,
//     TruckIcon,
//     ShieldCheckIcon,
//     ArrowPathIcon,
// } from "@heroicons/react/24/outline";
// import { HeartIcon as HeartFilledIcon } from "@heroicons/react/24/solid";
// import { addToCart, addToWishlist, getProduct, getWishlist, removeFromWishlist } from "../../api-services/apiService";

// export default function ProductDetail() {
//     const { id } = useParams();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [selectedImage, setSelectedImage] = useState(0);
//     const [quantity, setQuantity] = useState(1);
//     const [wishlist, setWishlist] = useState(false);


//     const fetchProductDetails = async (id) => {
//         try {
//             setLoading(true);
//             const result = await getWishlist();
//             let ids = []
//             if (result.success) {
//                 ids = result.data.map((item) => item.id || item);
//             }

//             const resData = await getProduct(id);

//             if (resData?.success && resData?.data) {
//                 const api = resData.data;
//                 const formattedProduct = {
//                     id: api.id,
//                     name: api.name,
//                     price: api.price,
//                     stock: api.stock,
//                     description: api.description,

//                     // Not in API — set defaults or fallback values
//                     artist: api.artist || "Unknown Artist",
//                     location: api.location || "Unknown Location",
//                     materials: api.materials || "Not specified",

//                     // API has dimensions.unit only, no actual size → fallback
//                     dimensions: api.dimensions?.value
//                         ? `${api.dimensions.value} ${api.dimensions.unit}`
//                         : "Dimensions not provided",

//                     inStock: api.stock > 0,

//                     rating: api.rating?.average ?? 0,
//                     reviews: api.rating?.count ?? 0,

//                     // If API returns empty array, provide placeholder images
//                     images:
//                         api.images?.length > 0
//                             ? api.images
//                             : [
//                                 "/api/placeholder/800/800",
//                                 "/api/placeholder/800/800",
//                                 "/api/placeholder/800/800",
//                             ],

//                     // not provided in API → sample tags or fallback
//                     features: api.tags?.length > 0 ? api.tags : ["No features listed"],
//                 };
//                 setWishlist(ids?.includes(api.id))
//                 setProduct(formattedProduct);
//             } else {
//                 setProduct(null);
//             }
//         } catch (error) {
//             console.error("Error fetching product:", error);
//             setProduct(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (id) fetchProductDetails(id);
//     }, [id]);

//     // Safe addInToCart — only runs if product exists
//     const addInToCart = async () => {
//         if (!product) return;
//         let res = await addToCart(id, quantity)
//         if (res?.success) {
//             alert(`Added ${quantity} × ${product.name} to cart!`);
//         }
//     };

//     const toggleWishlist = async (isWished) => {
//         setWishlist(isWished)
//         try {
//             if (!isWished) {
//                 await removeFromWishlist(id);
//             } else {
//                 await addToWishlist(id);
//             }
//         } catch (error) {
//             console.error(error);
//             // rollback UI
//             setWishlist(isWished)
//         }
//     };

//     // Show loading state
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="animate-pulse text-center">
//                     <div className="bg-gray-300 rounded-full w-32 h-32 mx-auto mb-8" />
//                     <div className="h-8 bg-gray-300 rounded w-96 mx-auto mb-4" />
//                     <div className="h-6 bg-gray-300 rounded w-64 mx-auto" />
//                 </div>
//             </div>
//         );
//     }

//     // Show 404 if product not found
//     if (!product) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <h2 className="text-3xl font-bold text-gray-800 mb-4">
//                         Product Not Found
//                     </h2>
//                     <Link to="/products" className="text-amber-600 hover:underline">
//                         ← Back to Products
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             {/* Breadcrumb */}
//             <div className="bg-white border-b">
//                 <div className="max-w-7xl mx-auto px-6 py-4">
//                     <nav className="flex items-center gap-2 text-sm">
//                         <Link to="/" className="text-gray-500 hover:text-gray-700">
//                             Home
//                         </Link>
//                         <span className="text-gray-400">/</span>
//                         <Link to="/products" className="text-gray-500 hover:text-gray-700">
//                             Products
//                         </Link>
//                         <span className="text-gray-400">/</span>
//                         <span className="text-gray-900 font-medium">{product.name}</span>
//                     </nav>
//                 </div>
//             </div>

//             <div className="max-w-7xl mx-auto px-6 py-12">
//                 <div className="grid lg:grid-cols-2 gap-12">
//                     {/* Image Gallery */}
//                     <div className="space-y-6">
//                         <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
//                             <div className="w-full h-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
//                                 <span className="text-6xl font-bold text-white/30">
//                                     Image {selectedImage + 1}
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-4 gap-4">
//                             {product.images.map((_, index) => (
//                                 <button
//                                     key={index}
//                                     onClick={() => setSelectedImage(index)}
//                                     className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
//                                         ? "border-amber-600 shadow-lg"
//                                         : "border-gray-200 hover:border-gray-400"
//                                         }`}
//                                 >
//                                     <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100" />
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Product Info */}
//                     <div className="space-y-8">
//                         <div>
//                             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//                                 {product.name}
//                             </h1>

//                             <div className="flex items-center gap-6 mb-6">
//                                 <div className="flex items-center gap-2">
//                                     <div className="flex text-yellow-500">
//                                         {[...Array(5)].map((_, i) => (
//                                             <svg
//                                                 key={i}
//                                                 className="w-5 h-5 fill-current"
//                                                 viewBox="0 0 20 20"
//                                             >
//                                                 <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
//                                             </svg>
//                                         ))}
//                                     </div>
//                                     <span className="text-lg font-medium text-gray-700">
//                                         {product.rating} ({product.reviews} reviews)
//                                     </span>
//                                 </div>

//                                 <button
//                                     onClick={() => toggleWishlist(!wishlist)}
//                                     className="ml-auto"
//                                 >
//                                     {wishlist ? (
//                                         <HeartFilledIcon className="w-8 h-8 text-red-500" />
//                                     ) : (
//                                         <HeartIcon className="w-8 h-8 text-gray-400 hover:text-red-500 transition" />
//                                     )}
//                                 </button>
//                             </div>

//                             <div className="text-5xl font-bold text-gray-900 mb-8">
//                                 ${product.price}
//                             </div>

//                             <div className="bg-amber-50 rounded-2xl p-6 mb-8">
//                                 <h3 className="font-semibold text-lg mb-2">Handmade by</h3>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {product.artist}
//                                 </p>
//                                 <p className="text-gray-600">{product.location}</p>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4 mb-8">
//                                 {product.features.map((feature, i) => (
//                                     <div key={i} className="flex items-center gap-3">
//                                         <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
//                                             <ShieldCheckIcon className="w-6 h-6 text-amber-700" />
//                                         </div>
//                                         <span className="text-gray-700">{feature}</span>
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="space-y-4 text-gray-700 mb-8">
//                                 <div>
//                                     <span className="font-semibold">Materials:</span>{" "}
//                                     {product.materials}
//                                 </div>
//                                 <div>
//                                     <span className="font-semibold">Dimensions:</span>{" "}
//                                     {product.dimensions}
//                                 </div>
//                             </div>

//                             <div className="flex items-center gap-6 mb-8">
//                                 {product.stock === 0 ? (
//                                     <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
//                                         Out of Stock
//                                     </span>
//                                 )
//                                     : <>
//                                         <div className="flex items-center border rounded-xl overflow-hidden">
//                                             <button

//                                                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                                 className="px-4 py-3 hover:bg-gray-100 transition"
//                                             >
//                                                 −
//                                             </button>
//                                             <span className="px-8 py-3 font-bold text-lg">
//                                                 {quantity}
//                                             </span>
//                                             <button

//                                                 onClick={() => setQuantity(quantity + 1)}
//                                                 className="px-4 py-3 hover:bg-gray-100 transition"
//                                             >
//                                                 +
//                                             </button>
//                                         </div>
//                                         <button

//                                             onClick={addInToCart}
//                                             className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 px-10 rounded-2xl text-lg transition shadow-lg"
//                                         >
//                                             Add to Cart
//                                         </button>
//                                     </>
//                                 }
//                             </div>


//                             <div className="grid grid-cols-3 gap-6 pt-8 border-t">
//                                 <div className="text-center">
//                                     <TruckIcon className="w-10 h-10 mx-auto mb-2 text-amber-600" />
//                                     <p className="text-sm font-medium">Free Shipping</p>
//                                     <p className="text-xs text-gray-500">Orders over $100</p>
//                                 </div>
//                                 <div className="text-center">
//                                     <ArrowPathIcon className="w-10 h-10 mx-auto mb-2 text-amber-600" />
//                                     <p className="text-sm font-medium">30-Day Returns</p>
//                                     <p className="text-xs text-gray-500">No questions asked</p>
//                                 </div>
//                                 <div className="text-center">
//                                     <ShieldCheckIcon className="w-10 h-10 mx-auto mb-2 text-amber-600" />
//                                     <p className="text-sm font-medium">Secure Checkout</p>
//                                     <p className="text-xs text-gray-500">SSL Encrypted</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="max-w-4xl mx-auto mt-20">
//                     <h2 className="text-3xl font-bold mb-8">About This Piece</h2>
//                     <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
//                         {product.description}
//                     </p>
//                 </div>
//             </div>
//         </>
//     );
// }


// src/Client/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
    HeartIcon,
    ArrowLeftIcon,
    TruckIcon,
    ShieldCheckIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilledIcon } from "@heroicons/react/24/solid";
import { getProduct, addToCart, addToWishlist, removeFromWishlist } from "../../api-services/apiService";
import WishlistLoginModal from "../Modals/WishlistLoginModal";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Check login
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const isLoggedIn = !!localStorage.getItem("token");

    // Fetch product
    const fetchProduct = async () => {
        setLoading(true);
        try {
            const result = await getProduct(id);
            if (result?.success && result?.data) {
                const p = result.data?.data;
                setProduct({
                    id: p._id,
                    name: p.name,
                    price: p.price,
                    stock: p.stock,
                    description: p.description || "No description available.",
                    images: p.images?.length > 0 ? p.images : [{ url: "https://via.placeholder.com/800" }],
                    rating: p.rating?.average || 0,
                    reviews: p.rating?.count || 0,
                    artist: p.artist || "Handmade Artisan",
                    location: p.location || "Global",
                    materials: p.materials || "Premium materials",
                    dimensions: p.dimensions?.value
                        ? `${p.dimensions.value} ${p.dimensions.unit || "cm"}`
                        : "Not specified",
                    features: p.tags?.length > 0 ? p.tags : ["Handcrafted", "Unique", "Sustainable"],
                });

                // Check if in wishlist
                setIsWishlisted(user?.wishlist?.includes(p._id) || false);
            } else {
                setProduct(null);
            }
        } catch (error) {
            console.error("Error loading product:", error);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            alert("Please sign in to add items to cart");
            return;
        }

        try {
            const res = await addToCart(id, quantity);
            if (res?.success) {
                alert(`Added ${quantity} × ${product.name} to cart!`);
            }
        } catch (err) {
            alert("Failed to add to cart");
        }
    };

    const handleWishlistToggle = async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        const newState = !isWishlisted;
        setIsWishlisted(newState);

        try {
            if (newState) {
                await addToWishlist(id);
            } else {
                await removeFromWishlist(id);
            }
        } catch (error) {
            setIsWishlisted(!newState); // rollback
            alert("Failed to update wishlist");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-amber-600 mx-auto"></div>
                    <p className="mt-6 text-xl text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                    <Link to="/products" className="text-amber-600 hover:underline text-lg">
                        ← Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm text-gray-600">
                        <Link to="/" className="hover:text-amber-600">Home</Link>
                        <span>/</span>
                        <Link to="/products" className="hover:text-amber-600">Products</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium truncate max-w-xs">
                            {product.name}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-xl">
                            <img
                                src={product.images[0]?.url || "https://via.placeholder.com/800"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-amber-500 transition"
                                    >
                                        <img
                                            src={img.url}
                                            alt={`View ${i + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-6 h-6 ${i < Math.round(product.rating) ? "fill-current" : "fill-gray-300"}`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="ml-3 text-lg text-gray-600">
                                        {product.rating.toFixed(1)} ({product.reviews} reviews)
                                    </span>
                                </div>

                                <button
                                    onClick={handleWishlistToggle}
                                    className="ml-auto transition-transform hover:scale-110"
                                >
                                    {isWishlisted ? (
                                        <HeartFilledIcon className="w-9 h-9 text-red-500" />
                                    ) : (
                                        <HeartIcon className="w-9 h-9 text-gray-400 hover:text-red-500 transition" />
                                    )}
                                </button>
                            </div>

                            <div className="text-5xl font-bold text-gray-900 mb-8">
                                ${Number(product.price).toFixed(2)}
                            </div>

                            <div className="bg-amber-50 rounded-2xl p-6 mb-8">
                                <h3 className="font-semibold text-lg mb-2">Handmade by</h3>
                                <p className="text-2xl font-bold text-gray-900">{product.artist}</p>
                                <p className="text-gray-600">{product.location}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                {product.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                            <ShieldCheckIcon className="w-6 h-6 text-amber-700" />
                                        </div>
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 text-gray-700 mb-8">
                                <p><span className="font-semibold">Materials:</span> {product.materials}</p>
                                <p><span className="font-semibold">Dimensions:</span> {product.dimensions}</p>
                            </div>

                            {/* Add to Cart */}
                            <div className="flex items-center gap-6">
                                {product.stock === 0 ? (
                                    <span className="bg-red-100 text-red-700 px-6 py-3 rounded-full font-medium">
                                        Out of Stock
                                    </span>
                                ) : (
                                    <>
                                        <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-5 py-3 hover:bg-gray-100 transition text-xl"
                                            >
                                                −
                                            </button>
                                            <span className="px-8 py-3 font-bold text-xl">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="px-5 py-3 hover:bg-gray-100 transition text-xl"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xl py-5 rounded-2xl transition shadow-xl transform hover:scale-105"
                                        >
                                            Add to Cart
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-6 pt-10 border-t">
                                <div className="text-center">
                                    <TruckIcon className="w-10 h-10 mx-auto mb-2 text-amber-600" />
                                    <p className="font-medium">Free Shipping</p>
                                    <p className="text-xs text-gray-500">Orders over $100</p>
                                </div>
                                <div className="text-center">
                                    <ArrowPathIcon className="w-10 h-10 mx-auto mb-2 text-amber-600" />
                                    <p className="font-medium">30-Day Returns</p>
                                </div>
                                <div className="text-center">
                                    <ShieldCheckIcon className="w-10 h-10 mx-auto mb-2 text-amber-600" />
                                    <p className="font-medium">Secure Checkout</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="max-w-4xl mx-auto mt-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">About This Piece</h2>
                    <div className="mt-6 text-lg text-gray-700 leading-relaxed prose max-w-none">
                        {product.description}
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