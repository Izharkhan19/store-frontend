import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import {
  getProducts,
  getCategories,
  addToWishlist,
  removeFromWishlist,
} from "../../api-services/apiService";
import WishlistLoginModal from "../Modals/WishlistLoginModal";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check login
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!localStorage.getItem("token");

  // Fetch categories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    const result = await getCategories();

    if (result?.success) {
      setCategories([
        { _id: "all", name: "All Products" },
        ...result?.data?.data,
      ]);
    } else {
      setCategories([{ _id: "all", name: "All Products" }]);
    }
    setLoadingCategories(false);
  };

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true);
    const filters = {
      search: searchTerm || undefined,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      sort:
        sortBy === "featured"
          ? "-createdAt"
          : sortBy === "price-low"
          ? "price"
          : sortBy === "price-high"
          ? "-price"
          : sortBy === "name"
          ? "name"
          : "-rating",
      limit: 50,
    };

    const result = await getProducts(filters);
    if (result?.success) {
      const transformed = result?.data?.data?.map((p) => ({
        ...p,
        isWishlisted: user?.wishlist?.includes(p._id) || false,
      }));
      setProducts(transformed);
    } else {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy]);

  // Wishlist toggle
  const toggleWishlist = async (productId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const product = products.find((p) => p._id === productId);
    const isCurrentlyWishlisted = product?.isWishlisted;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId ? { ...p, isWishlisted: !isCurrentlyWishlisted } : p
      )
    );

    try {
      if (isCurrentlyWishlisted) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }

      // Sync localStorage with new wishlist state
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        let updatedWishlist = [...(user.wishlist || [])];

        if (isCurrentlyWishlisted) {
          updatedWishlist = updatedWishlist.filter((id) => id !== productId);
        } else {
          if (!updatedWishlist.includes(productId)) {
            updatedWishlist.push(productId);
          }
        }

        user.wishlist = updatedWishlist;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      // Rollback on error
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? { ...p, isWishlisted: isCurrentlyWishlisted }
            : p
        )
      );
      alert("Failed to update wishlist. Please try again.");
    }
  };

  return (
    <>
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Handcrafted with Love
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto px-2 sm:px-0">
            Discover one-of-a-kind pieces made by passionate artisans from
            around the world.
          </p>
        </div>
      </section>

      {/* Filters & Search – sticky on all screens */}
      <section className="sticky top-0 bg-white shadow-sm z-40 py-4 sm:py-6 border-b">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6">
            {/* Search */}
            <div className="relative w-full sm:w-80 lg:w-96 order-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-base"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 order-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 sm:px-6 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
                <option value="rating">Highest Rated</option>
              </select>

              <div className="flex border rounded-lg overflow-hidden text-sm sm:text-base">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 ${
                    viewMode === "grid"
                      ? "bg-amber-100 text-amber-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 ${
                    viewMode === "list"
                      ? "bg-amber-100 text-amber-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Sidebar – hidden on mobile, can be added later as modal/drawer if needed */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-28">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <FunnelIcon className="w-5 h-5" />
                Categories
              </h3>

              {loadingCategories ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-6 bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat._id}
                          onChange={() => setSelectedCategory(cat._id)}
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                        />
                        <span
                          className={`text-gray-700 ${
                            selectedCategory === cat._id ? "font-semibold" : ""
                          }`}
                        >
                          {cat.name}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                } gap-6 sm:gap-8`}
              >
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={`bg-gray-200 animate-pulse rounded-2xl ${
                      viewMode === "grid" ? "h-80 sm:h-96" : "h-52"
                    }`}
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <p className="text-xl sm:text-2xl text-gray-600">
                  No products found
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSortBy("featured");
                  }}
                  className="mt-5 sm:mt-6 text-amber-600 hover:underline text-base sm:text-lg"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                } gap-6 sm:gap-8`}
              >
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <Link to={`/products/${product._id}`} className="block">
                      <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        <img
                          src={
                            product.images?.[0]?.url ||
                            "https://via.placeholder.com/600"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500 sm:duration-700"
                        />
                        {!product.stock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-5 sm:px-6 py-2 rounded-full font-bold text-sm sm:text-base">
                              Sold Out
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-5 sm:p-6">
                      <div className="flex justify-between items-start mb-3 gap-3">
                        <Link to={`/products/${product._id}`}>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-amber-600 transition line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>

                        <button
                          onClick={() => toggleWishlist(product._id)}
                          className="shrink-0 transition-transform hover:scale-110 pt-1"
                        >
                          {product.isWishlisted ? (
                            <HeartSolidIcon className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
                          ) : (
                            <HeartIcon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400 hover:text-red-500 transition" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.rating?.average?.toFixed(1) || "0.0"})
                        </span>
                      </div>

                      <div className="flex flex-wrap justify-between items-center gap-3">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <Link
                          to={`/products/${product._id}`}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <WishlistLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
