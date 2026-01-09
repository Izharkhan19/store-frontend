// src/Admin/components/Layout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AdminSidebar from "./Sidebar"; // Your existing Sidebar component
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {/* Dynamic title based on route */}
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
            className="text-red-600 hover:text-red-800 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet /> {/* Renders: Dashboard, Products, etc. */}
        </main>
      </div>
    </div>
  );
}
