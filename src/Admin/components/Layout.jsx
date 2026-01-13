// // src/Admin/components/Layout.jsx
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import { useEffect } from "react";
// import AdminSidebar from "./Sidebar"; // Your existing Sidebar component
// import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

// export default function AdminLayout() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/admin/login");
//   };

//   // Optional: Redirect to dashboard if directly accessing /admin
//   useEffect(() => {
//     if (location.pathname === "/admin") {
//       navigate("/admin", { replace: true });
//     }
//   }, [location.pathname, navigate]);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <AdminSidebar />

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Header */}
//         <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-semibold text-gray-800">
//               {/* Dynamic title based on route */}
//               {location.pathname.includes("products")
//                 ? "Products"
//                 : location.pathname.includes("categories")
//                 ? "Categories"
//                 : location.pathname.includes("orders")
//                 ? "Orders"
//                 : location.pathname.includes("clients")
//                 ? "Clients"
//                 : "Dashboard"}
//             </h2>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="text-red-600 hover:text-red-800 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
//           >
//             <ArrowRightOnRectangleIcon className="w-5 h-5" />
//             Logout
//           </button>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-auto p-6">
//           <Outlet /> {/* Renders: Dashboard, Products, etc. */}
//         </main>
//       </div>
//     </div>
//   );
// }

// src/Admin/components/Layout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar"; // Your existing Sidebar component
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  // Optional: Redirect to dashboard if directly accessing /admin
  useEffect(() => {
    if (location.pathname === "/admin") {
      navigate("/admin", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay + drawer */}
      <div
        className={`
          fixed inset-0 z-40 lg:hidden transition-opacity duration-300
          ${
            sidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar drawer */}
        <div
          className={`
            relative h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Admin</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <AdminSidebar mobile={true} />
        </div>
      </div>

      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>

            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
              {location.pathname.includes("products")
                ? "Products"
                : location.pathname.includes("categories")
                ? "Categories"
                : location.pathname.includes("orders")
                ? "Orders"
                : location.pathname.includes("clients")
                ? "Clients"
                : "Dashboard"}
            </h2>
          </div>

          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
