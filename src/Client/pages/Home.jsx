// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ShoppingBagIcon, TruckIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
// import { getFeaturedProducts, getProducts } from '../../api-services/apiService';

// export default function Home() {
//     const [featuredProducts, setFeaturedProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentSlide, setCurrentSlide] = useState(0);

//     // Real beautiful hero images (handmade theme)
//     const heroImages = [
//         'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop',
//         'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop',
//         'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1920&h=1080&fit=crop'
//     ];

//     // Real product images from Unsplash (handmade items)
//     const productImages = [
//         'https://images.unsplash.com/photo-1574781441080-428a4e9d52be?w=800&h=800&fit=crop',
//         'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&h=800&fit=crop',
//         'https://images.unsplash.com/photo-1544967929-8a11a6f23c7b?w=800&h=800&fit=crop',
//         'https://images.unsplash.com/photo-1606787504718-d6a2f32ea8d7?w=800&h=800&fit=crop',
//         'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&h=800&fit=crop',
//         'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&h=800&fit=crop'
//     ];

//     const transformProduct = (productList, product) => {
//         // Note: Since all input 'images' arrays are empty,
//         // we use the index to pick a placeholder image for demo purposes.
//         const index = productList.findIndex(p => p.id === product.id);
//         const placeholderImage = productImages[index % productImages.length];

//         const imageUrl = product.images && product.images.length > 0
//             ? product.images[0].url || product.images[0].secure_url
//             : placeholderImage; // Use placeholder if no image URL is available

//         const ratingValue = product.rating?.average ?? 0;

//         return {
//             id: product.id,
//             name: product.name,
//             price: product.price,
//             rating: ratingValue,
//             image: imageUrl,
//         };
//     };

//     const fetchFeaturedProducts = async () => {
//         setLoading(true)
//         // let resData = await getFeaturedProducts()
//         let resData = await getProducts()

//         if (resData?.success) {
//             let simplifiedData = []
//             resData?.data?.forEach(element => {
//                 simplifiedData?.push(transformProduct(resData?.data, element));
//             });
//             setFeaturedProducts(simplifiedData)
//             setLoading(false)
//         } else {
//             setFeaturedProducts([])
//             setLoading(false)
//         }
//     };

//     useEffect(() => {
//         fetchFeaturedProducts()
//     }, [])

//     return (
//         <>
//             {/* Hero Section */}
//             <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
//                 <div className="absolute inset-0">
//                     <img
//                         src={heroImages[currentSlide]}
//                         alt="Handmade craftsmanship"
//                         className="w-full h-full object-cover opacity-60"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
//                 </div>

//                 <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
//                     <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
//                         Artistry in Every Detail
//                     </h1>
//                     <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto drop-shadow">
//                         Discover unique, handcrafted treasures made with love by artisans around the world.
//                     </p>
//                     <div className="flex flex-col sm:flex-row gap-6 justify-center">
//                         <Link
//                             to="/products"
//                             className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 px-12 rounded-full text-xl transition shadow-2xl"
//                         >
//                             Shop Collection
//                         </Link>
//                         <Link
//                             to="/products"
//                             className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-5 px-12 rounded-full text-xl transition shadow-2xl"
//                         >
//                             Explore Artisans
//                         </Link>
//                     </div>
//                 </div>

//                 {/* Slider Dots */}
//                 <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3">
//                     {heroImages.map((_, i) => (
//                         <button
//                             key={i}
//                             onClick={() => setCurrentSlide(i)}
//                             className={`transition-all duration-300 ${i === currentSlide ? 'bg-white w-12 h-3 rounded-full' : 'bg-white/50 w-3 h-3 rounded-full hover:bg-white/80'}`}
//                         />
//                     ))}
//                 </div>
//             </section>

//             {/* Features */}
//             <section className="py-20 bg-gray-50">
//                 <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
//                     {[
//                         { icon: SparklesIcon, title: '100% Handmade', desc: 'Every piece crafted with care' },
//                         { icon: ShieldCheckIcon, title: 'Quality Guaranteed', desc: 'Made to last a lifetime' },
//                         { icon: TruckIcon, title: 'Fast Shipping', desc: 'Free delivery on orders over $100' },
//                         { icon: ShoppingBagIcon, title: 'Easy Returns', desc: '30-day return policy' },
//                     ].map((feature, i) => (
//                         <div key={i} className="text-center group">
//                             <div className="mb-6 inline-block p-6 bg-amber-100 rounded-full group-hover:bg-amber-200 transition">
//                                 <feature.icon className="w-12 h-12 text-amber-700" />
//                             </div>
//                             <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
//                             <p className="text-gray-600">{feature.desc}</p>
//                         </div>
//                     ))}
//                 </div>
//             </section>

//             {/* Featured Products */}
//             <section className="py-20 bg-white">
//                 <div className="max-w-7xl mx-auto px-6">
//                     <div className="text-center mb-16">
//                         <h2 className="text-5xl font-bold text-gray-900 mb-4">Featured Creations</h2>
//                         <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//                             Handpicked pieces that tell a story of tradition, skill, and passion.
//                         </p>
//                     </div>

//                     {loading ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                             {[...Array(6)].map((_, i) => (
//                                 <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//                             {
//                                 featuredProducts?.length > 0 &&
//                                 featuredProducts?.map((product) => (
//                                     <Link
//                                         key={product.id}
//                                         to={`/products/${product.id}`}
//                                         className="group block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
//                                     >
//                                         <div className="aspect-square overflow-hidden bg-gray-50">
//                                             <img
//                                                 src={product.image}
//                                                 alt={product.name}
//                                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                                             />
//                                         </div>
//                                         <div className="p-8">
//                                             <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition">
//                                                 {product.name}
//                                             </h3>
//                                             <div className="flex items-center gap-2 mb-4">
//                                                 <div className="flex text-yellow-500">
//                                                     {[...Array(5)].map((_, i) => (
//                                                         <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
//                                                             <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
//                                                         </svg>
//                                                     ))}
//                                                 </div>
//                                                 <span className="text-gray-600 font-medium">({product.rating})</span>
//                                             </div>
//                                             <div className="flex justify-between items-center">
//                                                 <span className="text-3xl font-bold text-gray-900">${product.price}</span>
//                                                 <span className="text-sm font-medium text-amber-700 bg-amber-100 px-4 py-2 rounded-full">
//                                                     Handmade
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </Link>
//                                 ))}
//                         </div>
//                     )}

//                     <div className="text-center mt-16">
//                         <Link
//                             to="/products"
//                             className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold py-5 px-14 rounded-full text-xl transition shadow-xl"
//                         >
//                             View All Products →
//                         </Link>
//                     </div>
//                 </div>
//             </section>

//             {/* Final CTA */}
//             <section className="py-24 bg-gradient-to-br from-amber-50 to-orange-50">
//                 <div className="max-w-4xl mx-auto text-center px-6">
//                     <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
//                         Bring Home Something Special
//                     </h2>
//                     <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
//                         Each piece supports independent artisans and preserves traditional crafts that might otherwise be lost.
//                     </p>
//                     <Link
//                         to="/products"
//                         className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 px-16 rounded-full text-2xl transition shadow-2xl"
//                     >
//                         Start Shopping Now
//                     </Link>
//                 </div>
//             </section>
//         </>
//     );
// }

// src/Client/pages/Home.jsx
// src/Client/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  SparklesIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import {
  addToWishlist,
  removeFromWishlist,
  getFeaturedProducts,
  getProducts,
} from "../../api-services/apiService";
import WishlistLoginModal from "../Modals/WishlistLoginModal";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState({}); // Per-product loading

  // Get user from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!localStorage.getItem("token");

  // Hero images
  const heroImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1920&h=1080&fit=crop",
  ];

  // Fallback product images
  const productImages = [
    "https://images.unsplash.com/photo-1574781441080-428a4e9d52be?w=800",
    "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800",
    "https://images.unsplash.com/photo-1544967929-8a11a6f23c7b?w=800",
    "https://images.unsplash.com/photo-1606787504718-d6a2f32ea8d7?w=800",
    "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800",
    "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800",
  ];

  // Transform product with wishlist status
  const transformProduct = (product) => {
    const index = featuredProducts.findIndex((p) => p.id === product._id);
    const placeholderImage = productImages[index % productImages.length];

    const imageUrl =
      product.images && product.images.length > 0
        ? product.images[0].url || product.images[0].secure_url
        : placeholderImage;

    const ratingValue = product.rating?.average ?? 0;

    return {
      id: product._id,
      name: product.name,
      price: product.price,
      rating: ratingValue,
      image: imageUrl,
      isWishlisted: user?.wishlist?.includes(product._id) || false,
    };
  };

  // Fetch featured products
  const fetchFeaturedProducts = async () => {
    setLoading(true);
    const resData = await getFeaturedProducts(); // or getProducts()
    if (resData?.success) {
      const simplifiedData = resData?.data?.data?.map(transformProduct) || [];
      setFeaturedProducts(simplifiedData);
    } else {
      setFeaturedProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  // Handle wishlist toggle
  const handleWishlistClick = async (productId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const product = featuredProducts.find((p) => p.id === productId);
    const newWishlistedState = !product.isWishlisted;

    // Optimistic UI update
    setFeaturedProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isWishlisted: newWishlistedState } : p
      )
    );

    setWishlistLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      if (newWishlistedState) {
        await addToWishlist(productId);
      } else {
        await removeFromWishlist(productId);
      }

      // Update localStorage with new wishlist state
      const updatedUser = { ...user };
      if (newWishlistedState) {
        if (!updatedUser.wishlist.includes(productId)) {
          updatedUser.wishlist.push(productId);
        }
      } else {
        updatedUser.wishlist = updatedUser.wishlist.filter(
          (id) => id !== productId
        );
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      // Rollback on error
      setFeaturedProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isWishlisted: !newWishlistedState } : p
        )
      );
      alert("Failed to update wishlist. Please try again.");
    } finally {
      setWishlistLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img
            src={heroImages[currentSlide]}
            alt="Handmade craftsmanship"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Artistry in Every Detail
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto drop-shadow">
            Discover unique, handcrafted treasures made with love by artisans
            around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/products"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 px-12 rounded-full text-xl transition shadow-2xl"
            >
              Shop Collection
            </Link>
            <Link
              to="/products"
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-5 px-12 rounded-full text-xl transition shadow-2xl"
            >
              Explore Artisans
            </Link>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3">
          {heroImages.map((_, i) => (
            <div
              key={i}
              className={`transition-all duration-300 ${
                i === currentSlide
                  ? "bg-white w-12 h-3 rounded-full"
                  : "bg-white/50 w-3 h-3 rounded-full hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          {[
            {
              icon: SparklesIcon,
              title: "100% Handmade",
              desc: "Every piece crafted with care",
            },
            {
              icon: ShieldCheckIcon,
              title: "Quality Guaranteed",
              desc: "Made to last a lifetime",
            },
            {
              icon: TruckIcon,
              title: "Fast Shipping",
              desc: "Free delivery on orders over $100",
            },
            {
              icon: ShoppingBagIcon,
              title: "Easy Returns",
              desc: "30-day return policy",
            },
          ].map((feature, i) => (
            <div key={i} className="text-center group">
              <div className="mb-6 inline-block p-6 bg-amber-100 rounded-full group-hover:bg-amber-200 transition">
                <feature.icon className="w-12 h-12 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Featured Creations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked pieces that tell a story of tradition, skill, and
              passion.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-3xl h-96 animate-pulse"
                />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">
                No featured products available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                >
                  <Link to={`/products/${product.id}`}>
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </Link>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={() => handleWishlistClick(product.id)}
                    disabled={wishlistLoading[product.id]}
                    className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition disabled:opacity-50"
                  >
                    {wishlistLoading[product.id] ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-amber-600" />
                    ) : product.isWishlisted ? (
                      <HeartSolid className="w-6 h-6 text-red-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6 text-gray-600 hover:text-red-500 transition" />
                    )}
                  </button>

                  <div className="p-8">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(product.rating)
                                ? "fill-current"
                                : "fill-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.rating.toFixed(1)})
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-gray-900">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <span className="text-sm font-medium text-amber-700 bg-amber-100 px-4 py-2 rounded-full">
                        Handmade
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              to="/products"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold py-5 px-14 rounded-full text-xl transition shadow-xl"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Bring Home Something Special
          </h2>
          <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Each piece supports independent artisans and preserves traditional
            crafts.
          </p>
          <Link
            to="/products"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 px-16 rounded-full text-2xl transition shadow-2xl transform hover:scale-105"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>

      {/* Wishlist Login Modal */}
      <WishlistLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
