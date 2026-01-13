// import { Link, useLocation } from 'react-router-dom';
// import {
//     HomeIcon,
//     ShoppingBagIcon,
//     TagIcon,
//     InboxIcon,
//     ChartBarIcon,
//     ArrowRightOnRectangleIcon     // ✅ updated icon
// } from '@heroicons/react/24/outline';

// const menu = [
//     { name: 'Dashboard', icon: HomeIcon, path: '/' },
//     { name: 'Products', icon: ShoppingBagIcon, path: '/products' },
//     { name: 'Categories', icon: TagIcon, path: '/categories' },
//     { name: 'Orders', icon: InboxIcon, path: '/orders' },
// ];

// export default function Sidebar() {
//     const { pathname } = useLocation();

//     const handleLogout = () => {
//         localStorage.removeItem('adminToken');
//         window.location.href = '/login';
//     };

//     return (
//         <div className="w-64 bg-gray-900 text-white flex flex-col">
//             <div className="p-6 text-2xl font-bold border-b border-gray-800">
//                 E-Shop Admin
//             </div>

//             <nav className="flex-1 p-4">
//                 {menu.map((item) => {
//                     const Icon = item.icon;
//                     return (
//                         <Link
//                             key={item.name}
//                             to={item.path}
//                             className={`flex items-center space-x-3 p-3 rounded-lg mb-2 transition ${pathname === item.path
//                                     ? 'bg-blue-600'
//                                     : 'hover:bg-gray-800'
//                                 }`}
//                         >
//                             <Icon className="w-6 h-6" />
//                             <span>{item.name}</span>
//                         </Link>
//                     );
//                 })}
//             </nav>

//             <button
//                 onClick={handleLogout}
//                 className="p-4 border-t border-gray-800 hover:bg-gray-800 flex items-center space-x-3"
//             >
//                 <ArrowRightOnRectangleIcon className="w-6 h-6" /> {/* ✅ updated */}
//                 <span>Logout</span>
//             </button>
//         </div>
//     );
// }
// src/Admin/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ShoppingBagIcon,
  QueueListIcon,
  TagIcon,
  InboxIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const menu = [
  { name: "Dashboard", icon: HomeIcon, path: "/admin" },
  { name: "Clients", icon: QueueListIcon, path: "/admin/clients" },
  { name: "Products", icon: ShoppingBagIcon, path: "/admin/products" },
  { name: "Categories", icon: TagIcon, path: "/admin/categories" },
  { name: "Orders", icon: InboxIcon, path: "/admin/orders" },
];

export default function AdminSidebar({ mobile = false }) {
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  // Common classes – slightly adjusted spacing/padding for mobile
  const itemBase = `
    flex items-center gap-3 px-4 py-3 rounded-lg group transition-all
  `;
  const activeClasses = "bg-blue-600/90 border-l-4 border-blue-300 text-white";
  const inactiveClasses =
    "hover:bg-gray-800/70 border-l-4 border-transparent text-gray-300 group-hover:text-white";

  return (
    <div
      className={`
      ${
        mobile
          ? "bg-gray-900 text-white flex flex-col h-full"
          : "w-64 bg-gray-900 text-white flex flex-col shadow-lg h-screen sticky top-0"
      }
    `}
    >
      {/* Logo / Brand */}
      <div
        className={`
        ${mobile ? "p-5" : "p-6"} 
        text-xl sm:text-2xl font-extrabold tracking-wide border-b border-gray-800/70
      `}
      >
        <span className="text-blue-500">E-Shop</span> Admin
      </div>

      {/* Menu items */}
      <nav
        className={`
        flex-1 ${mobile ? "p-3 sm:p-4" : "p-4"} space-y-1 overflow-y-auto
      `}
      >
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                ${itemBase}
                ${isActive ? activeClasses : inactiveClasses}
                ${mobile ? "text-base" : "text-sm"}
              `}
            >
              <Icon
                className={`
                  w-6 h-6 flex-shrink-0 transition
                  ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }
                `}
              />
              <span
                className={`
                font-medium transition
                ${
                  isActive
                    ? "text-white"
                    : "text-gray-300 group-hover:text-white"
                }
              `}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout section */}
      <div
        className={`
        p-4 border-t border-gray-800/70 mt-auto
      `}
      >
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-lg
            hover:bg-red-600/20 active:bg-red-600/30 transition-all
            ${mobile ? "text-base" : "text-sm"}
          `}
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-400 flex-shrink-0" />
          <span className="font-medium text-red-400">Logout</span>
        </button>
      </div>
    </div>
  );
}
