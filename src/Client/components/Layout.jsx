// import { useEffect, useState } from "react";
// import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   ShoppingBagIcon,
//   HeartIcon,
//   UserIcon,
//   // MenuIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
// import { useApi } from "../../api-services/hooks/useApi";
// import { getCart, getWishlist } from "../../api-services/apiService";

// export default function ClientLayout() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Get user from localStorage
//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;
//   const isLoggedIn = !!localStorage.getItem("token");

//   // Fetch cart & wishlist count
//   const { data: cartData = [] } = useApi(getCart);
//   const { data: wishlistData = [] } = useApi(getWishlist);

//   const cartCount = cartData?.length || 0;
//   const wishlistCount = wishlistData?.length || 0;

//   // Listen to login/logout
//   useEffect(() => {
//     const handleUserChange = () => {
//       window.location.reload(); // Simple refresh on auth change
//     };
//     window.addEventListener("userChanged", handleUserChange);
//     return () => window.removeEventListener("userChanged", handleUserChange);
//   }, []);

//   const isActive = (path) => {
//     if (path === "/") return location.pathname === "/";
//     return location.pathname.startsWith(path);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     window.dispatchEvent(new Event("userChanged"));
//     navigate("/");
//   };

//   const navLinks = [
//     { to: "/", label: "Home" },
//     { to: "/products", label: "Products" },
//     {
//       to: "/wishlist",
//       label: "Wishlist",
//       badge: wishlistCount,
//       protected: true,
//     },
//     { to: "/orders", label: "Orders", protected: true },
//     { to: "/cart", label: "Cart", badge: cartCount, protected: true },
//   ];

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <Link to="/" className="flex items-center">
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
//                 Handmade Store
//               </h1>
//             </Link>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center gap-8">
//               {navLinks.map(
//                 (link) =>
//                   (!link.protected || isLoggedIn) && (
//                     <Link
//                       key={link.to}
//                       to={link.to}
//                       className={`relative text-sm font-medium transition-colors pb-1 ${
//                         isActive(link.to)
//                           ? "text-amber-600 border-b-2 border-amber-600"
//                           : "text-gray-700 hover:text-amber-600"
//                       }`}
//                     >
//                       <span className="flex items-center gap-2">
//                         {link.label}
//                         {link.badge > 0 && (
//                           <span className="absolute -top-3 -right-5 bg-amber-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
//                             {link.badge}
//                           </span>
//                         )}
//                       </span>
//                     </Link>
//                   )
//               )}

//               {/* User Menu */}
//               {isLoggedIn ? (
//                 <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center">
//                       <UserIcon className="w-5 h-5 text-amber-700" />
//                     </div>
//                     <span className="text-sm font-medium text-gray-700">
//                       Hi, {user?.name?.split(" ")[0] || "User"}
//                     </span>
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="text-sm text-red-600 hover:text-red-700 font-medium transition"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <Link
//                   to="/login"
//                   state={{ from: location }}
//                   className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition"
//                 >
//                   Sign In
//                 </Link>
//               )}
//             </nav>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
//             >
//               {mobileMenuOpen
//                 ? "OPEN"
//                 : // <XMarkIcon className="w-6 h-6 text-gray-700" />
//                   "CLOSE"
//                   // <MenuIcon className="w-6 h-6 text-gray-700" />
//               }
//             </button>
//           </div>

//           {/* Mobile Menu */}
//           {mobileMenuOpen && (
//             <div className="md:hidden border-t border-gray-200 pt-4 pb-6">
//               <nav className="flex flex-col gap-4">
//                 {navLinks.map(
//                   (link) =>
//                     (!link.protected || isLoggedIn) && (
//                       <Link
//                         key={link.to}
//                         to={link.to}
//                         onClick={() => setMobileMenuOpen(false)}
//                         className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${
//                           isActive(link.to)
//                             ? "bg-amber-50 text-amber-700 font-semibold"
//                             : "text-gray-700 hover:bg-gray-50"
//                         }`}
//                       >
//                         <span className="flex items-center gap-3">
//                           {link.label}
//                           {link.badge > 0 && (
//                             <span className="bg-amber-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
//                               {link.badge}
//                             </span>
//                           )}
//                         </span>
//                       </Link>
//                     )
//                 )}

//                 {/* Mobile User Section */}
//                 <div className="border-t border-gray-200 pt-4 mt-4">
//                   {isLoggedIn ? (
//                     <div className="px-4">
//                       <div className="flex items-center gap-3 mb-4">
//                         <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
//                           <UserIcon className="w-6 h-6 text-amber-700" />
//                         </div>
//                         <span className="font-medium text-gray-900">
//                           {user?.name || "User"}
//                         </span>
//                       </div>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left text-red-600 hover:text-red-700 font-medium py-2"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   ) : (
//                     <Link
//                       to="/login"
//                       state={{ from: location }}
//                       onClick={() => setMobileMenuOpen(false)}
//                       className="block px-4 py-3 text-amber-600 font-semibold hover:bg-amber-50 rounded-lg"
//                     >
//                       Sign In
//                     </Link>
//                   )}
//                 </div>
//               </nav>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1">
//         <Outlet />
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-16">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h2 className="text-2xl font-bold mb-4">Handmade Store</h2>
//           <p className="text-gray-400 mb-8">
//             © {new Date().getFullYear()} All rights reserved. Made with love for
//             artisans.
//           </p>
//           <div className="flex justify-center gap-8 text-sm text-gray-400">
//             <a href="#" className="hover:text-white transition">
//               Privacy Policy
//             </a>
//             <a href="#" className="hover:text-white transition">
//               Terms of Service
//             </a>
//             <a href="#" className="hover:text-white transition">
//               Contact Us
//             </a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  XMarkIcon,
  Bars3Icon, // ← added (heroicons v2 name for hamburger)
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useApi } from "../../api-services/hooks/useApi";
import { getCart, getWishlist } from "../../api-services/apiService";

export default function ClientLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!localStorage.getItem("token");

  const { data: cartData = [] } = useApi(getCart);
  const { data: wishlistData = [] } = useApi(getWishlist);

  const cartCount = cartData?.length || 0;
  const wishlistCount = wishlistData?.length || 0;

  useEffect(() => {
    const handleUserChange = () => {
      window.location.reload();
    };
    window.addEventListener("userChanged", handleUserChange);
    return () => window.removeEventListener("userChanged", handleUserChange);
  }, []);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    {
      to: "/wishlist",
      label: "Wishlist",
      badge: wishlistCount,
      protected: true,
    },
    { to: "/orders", label: "Orders", protected: true },
    { to: "/cart", label: "Cart", badge: cartCount, protected: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Handmade Store
              </h1>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map(
                (link) =>
                  (!link.protected || isLoggedIn) && (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`relative text-sm font-medium transition-colors pb-1 ${
                        isActive(link.to)
                          ? "text-amber-600 border-b-2 border-amber-600"
                          : "text-gray-700 hover:text-amber-600"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {link.label}
                        {link.badge > 0 && (
                          <span className="absolute -top-3 -right-4 sm:-right-5 bg-amber-600 text-white text-xs font-bold rounded-full min-w-[1.5rem] h-5 sm:h-6 flex items-center justify-center px-1 animate-pulse">
                            {link.badge}
                          </span>
                        )}
                      </span>
                    </Link>
                  )
              )}

              {/* Desktop Auth */}
              {isLoggedIn ? (
                <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-amber-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-700" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      Hi, {user?.name?.split(" ")[0] || "User"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition px-3 py-1.5 rounded-md hover:bg-amber-50"
                >
                  Sign In
                </Link>
              )}
            </nav>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition touch-manipulation"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-7 h-7 text-gray-700" />
              ) : (
                <Bars3Icon className="w-7 h-7 text-gray-700" />
              )}
            </button>
          </div>

          {/* ── Mobile Menu ──────────────────────────────────────────────── */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-5 max-h-[75vh] overflow-y-auto bg-white">
              <nav className="flex flex-col gap-1.5 px-2">
                {navLinks.map(
                  (link) =>
                    (!link.protected || isLoggedIn) && (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-5 py-4 rounded-xl text-[17px] transition ${
                          isActive(link.to)
                            ? "bg-amber-50 text-amber-800 font-semibold"
                            : "text-gray-800 hover:bg-gray-100 active:bg-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span>{link.label}</span>
                          {link.badge > 0 && (
                            <span className="bg-amber-600 text-white text-xs font-bold rounded-full min-w-[1.6rem] h-6 flex items-center justify-center px-2">
                              {link.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    )
                )}
              </nav>

              {/* Mobile Auth Section */}
              <div className="mt-6 pt-6 border-t border-gray-200 mx-2">
                {isLoggedIn ? (
                  <div className="px-5 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                        <UserIcon className="w-6 h-6 text-amber-700" />
                      </div>
                      <span className="font-medium text-gray-900 text-[17px] truncate">
                        {user?.name || "User"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-medium py-3.5 rounded-xl transition active:bg-red-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    state={{ from: location }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-4 px-5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-center rounded-xl shadow-sm transition text-[17px]"
                  >
                    Sign In / Create Account
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer – minor mobile tweaks */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Handmade Store
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
            © {new Date().getFullYear()} All rights reserved. Made with love for
            artisans.
          </p>
          <div className="flex justify-center gap-6 sm:gap-10 text-sm sm:text-base text-gray-400 flex-wrap">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
