// import { useEffect, useState } from "react";
// import {
//     EyeIcon,
//     InboxIcon,
//     ClockIcon,
//     Cog6ToothIcon,
//     TruckIcon,
//     CheckCircleIcon,
//     XCircleIcon,
//     MagnifyingGlassIcon,
// } from "@heroicons/react/24/outline";

// import { useApi } from "../../api-services/hooks/useApi";
// import {
//     getOrders,
//     updateOrderStatus,
//     getOrderById,
// } from "../../api-services/apiService";
// import useDebounce from "../../hooks/useDebounce";

// // Fixed: Proper object syntax
// const statusConfig = {
//     pending: { icon: ClockIcon, color: "bg-yellow-100 text-yellow-800", label: "Pending" },
//     processing: { icon: Cog6ToothIcon, color: "bg-blue-100 text-blue-800", label: "Processing" },
//     shipped: { icon: TruckIcon, color: "bg-purple-100 text-purple-800", label: "Shipped" },
//     delivered: { icon: CheckCircleIcon, color: "bg-green-100 text-green-800", label: "Delivered" },
//     cancelled: { icon: XCircleIcon, color: "bg-red-100 text-red-800", label: "Cancelled" },
// };

// export default function Orders() {
//     const [filter, setFilter] = useState("all");
//     const [searchTerm, setSearchTerm] = useState("");
//     const debouncingValue = useDebounce(searchTerm, 500);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
//     const [newStatus, setNewStatus] = useState("");

//     // Fetch all orders
//     const {
//         data: orders = [],
//         loading: loadingOrders,
//         error: ordersError,
//         request: fetchOrders,
//     } = useApi(getOrders);

//     const {
//         request: fetchOrderDetail,
//         data: orderDetail,
//         loading: loadingDetail,
//     } = useApi(getOrderById);

//     const { request: saveStatus, loading: updatingStatus } = useApi(updateOrderStatus);

//     // Load orders on mount
//     useEffect(() => {
//         fetchOrders();
//     }, []);

//     // Safe filtering with optional chaining
//     const filteredOrders = orders
//         ?.filter((order) => filter === "all" || order.status === filter)
//         ?.filter((order) => {
//             const search = debouncingValue.toLowerCase();
//             return (
//                 order.orderNumber?.toLowerCase().includes(search) ||
//                 order.user?.name?.toLowerCase().includes(search) ||
//                 order.user?.email?.toLowerCase().includes(search)
//             );
//         }) || [];

//     // Safe status counts
//     const statusCounts = {
//         all: orders?.length || 0,
//         pending: orders?.filter((o) => o.status === "pending").length || 0,
//         processing: orders?.filter((o) => o.status === "processing").length || 0,
//         shipped: orders?.filter((o) => o.status === "shipped").length || 0,
//         delivered: orders?.filter((o) => o.status === "delivered").length || 0,
//         cancelled: orders?.filter((o) => o.status === "cancelled").length || 0,
//     };

//     const openOrderModal = async (orderId) => {
//         await fetchOrderDetail(orderId);
//     };

//     useEffect(() => {
//         if (orderDetail) {
//             setSelectedOrder(orderDetail);
//         }
//     }, [orderDetail]);

//     const handleStatusUpdate = async () => {
//         if (!selectedOrder?._id || !newStatus) return;

//         const result = await saveStatus(selectedOrder._id, { status: newStatus });
//         if (result?.success) {
//             fetchOrders(); // Refresh list
//             setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
//             setIsStatusModalOpen(false);
//             setNewStatus("");
//         }
//     };

//     return (
//         // <div className="max-w-7xl mx-auto p-6">
//         <div className="p-6">
//             {/* Header */}
//             <div className="mb-8">
//                 <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
//                 <p className="text-gray-600 mt-1">Track and manage all customer orders</p>
//             </div>

//             {/* Search Bar */}
//             <div className="mb-6">
//                 <div className="relative max-w-md">
//                     <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                         type="text"
//                         placeholder="Search by order ID, name, or email..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     />
//                 </div>
//             </div>

//             {/* Status Filter Cards */}
//             <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
//                 {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => {
//                     const config =
//                         status === "all"
//                             ? { icon: InboxIcon, color: "bg-gray-100 text-gray-800", label: "Total" }
//                             : statusConfig[status] || { icon: InboxIcon };
//                     const Icon = config.icon;

//                     return (
//                         <button
//                             key={status}
//                             onClick={() => setFilter(status)}
//                             className={`p-5 rounded-xl border-2 transition-all transform hover:scale-105 ${filter === status
//                                 ? "bg-blue-600 text-white border-blue-600 shadow-xl"
//                                 : "bg-white border-gray-200 hover:border-blue-400"
//                                 }`}
//                         >
//                             <Icon className={`w-10 h-10 mx-auto mb-3 ${filter === status ? "text-white" : "text-gray-600"}`} />
//                             <div className="text-2xl font-bold">{statusCounts[status]}</div>
//                             <div className={`text-sm mt-1 ${filter === status ? "text-white/90" : "text-gray-500"}`}>
//                                 {config.label || status.charAt(0).toUpperCase() + status.slice(1)}
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* Loading State */}
//             {loadingOrders && (
//                 <div className="text-center py-16">
//                     <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
//                     <p className="mt-4 text-gray-600">Loading orders...</p>
//                 </div>
//             )}

//             {/* Error State */}
//             {ordersError && !loadingOrders && (
//                 <div className="text-center py-16 bg-red-50 rounded-xl">
//                     <p className="text-red-600 text-lg mb-4">Failed to load orders</p>
//                     <button
//                         onClick={fetchOrders}
//                         className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             )}

//             {/* Orders Table */}
//             {!loadingOrders && filteredOrders.length > 0 && (
//                 <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead className="bg-gray-50 border-b-2 border-gray-200">
//                                 <tr>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Order ID</th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Customer</th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Items</th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Total</th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-100">
//                                 {filteredOrders?.map((order) => {
//                                     const config = statusConfig[order.status] || {};
//                                     const StatusIcon = config.icon || ClockIcon;
//                                     const statusStyle = config.color || "bg-gray-100 text-gray-800";

//                                     return (
//                                         <tr key={order._id} className="hover:bg-gray-50 transition">
//                                             <td className="px-6 py-4 font-bold text-blue-600 font-mono">
//                                                 {order.orderNumber || `#${order._id?.slice(-8) || "N/A"}`}
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div>
//                                                     <div className="font-medium text-gray-900">{order.user?.name || "Guest"}</div>
//                                                     <div className="text-sm text-gray-500">{order.user?.email || "N/A"}</div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 text-gray-600">
//                                                 {order.createdAt
//                                                     ? new Date(order.createdAt).toLocaleDateString("en-US", {
//                                                         month: "short",
//                                                         day: "numeric",
//                                                         year: "numeric",
//                                                     })
//                                                     : "N/A"}
//                                             </td>
//                                             <td className="px-6 py-4 text-center font-medium">{order.items?.length || 0}</td>
//                                             <td className="px-6 py-4 font-bold text-gray-900">
//                                                 ₹{(order.total || 0).toFixed(2)}
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusStyle}`}>
//                                                     <StatusIcon className="w-5 h-5" />
//                                                     {config.label || order.status || "Unknown"}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <button
//                                                     onClick={() => openOrderModal(order._id)}
//                                                     className="text-blue-600 hover:text-blue-800 transition"
//                                                 >
//                                                     <EyeIcon className="w-6 h-6" />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}

//             {/* Empty State */}
//             {!loadingOrders && filteredOrders?.length === 0 && (
//                 <div className="text-center py-20 bg-gray-50 rounded-2xl">
//                     <InboxIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
//                     <h3 className="text-xl font-semibold text-gray-700">No orders found</h3>
//                     <p className="text-gray-500 mt-2">
//                         {searchTerm ? "Try adjusting your search" : "No orders match the selected filter"}
//                     </p>
//                 </div>
//             )}

//             {/* Order Detail Modal */}
//             {selectedOrder && (
//                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
//                         <div className="p-8">
//                             <div className="flex justify-between items-start mb-8">
//                                 <div>
//                                     <h2 className="text-3xl font-bold text-gray-900">
//                                         Order {selectedOrder.orderNumber || `#${selectedOrder._id?.slice(-8) || "N/A"}`}
//                                     </h2>
//                                     <p className="text-gray-600 mt-1">
//                                         Placed on{" "}
//                                         {selectedOrder.createdAt
//                                             ? new Date(selectedOrder.createdAt).toLocaleDateString()
//                                             : "N/A"}
//                                     </p>
//                                 </div>
//                                 <button
//                                     onClick={() => setSelectedOrder(null)}
//                                     className="text-gray-400 hover:text-gray-600"
//                                 >
//                                     <XCircleIcon className="w-8 h-8" />
//                                 </button>
//                             </div>

//                             <div className="grid md:grid-cols-2 gap-8 mb-8">
//                                 <div>
//                                     <h3 className="font-bold text-gray-700 mb-3">Customer Details</h3>
//                                     <div className="space-y-2">
//                                         <p className="font-medium">{selectedOrder.user?.name || "Guest User"}</p>
//                                         <p className="text-gray-600">{selectedOrder.user?.email || "N/A"}</p>
//                                         <p className="text-gray-600">{selectedOrder.shippingAddress?.phone || "No phone"}</p>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <h3 className="font-bold text-gray-700 mb-3">Current Status</h3>
//                                     <div className="flex items-center gap-4">
//                                         {/* <span className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-lg font-medium ${statusConfig[selectedOrder.status]?.color || "bg-gray-100 text-gray-800"}`}>
//                                             {statusConfig[selectedOrder.status]?.icon && (
//                                                 <statusConfig[selectedOrder.status].icon className="w-6 h-6" />
//                       )}
//                                             {statusConfig[selectedOrder.status]?.label || selectedOrder.status || "Unknown"}
//                                         </span> */}
//                                         <button
//                                             onClick={() => {
//                                                 setNewStatus(selectedOrder.status || "pending");
//                                                 setIsStatusModalOpen(true);
//                                             }}
//                                             className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
//                                         >
//                                             Change Status
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="border-t pt-6">
//                                 <h3 className="font-bold text-gray-700 mb-4">Order Items</h3>
//                                 <div className="space-y-4">
//                                     {(selectedOrder.items || []).map((item, i) => (
//                                         <div key={i} className="flex items-center justify-between py-4 border-b">
//                                             <div className="flex items-center gap-4">
//                                                 <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
//                                                 <div>
//                                                     <p className="font-medium">{item.product?.name || "Unknown Product"}</p>
//                                                     <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
//                                                 </div>
//                                             </div>
//                                             <p className="font-bold">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="mt-8 pt-6 border-t-2 border-gray-200">
//                                 <div className="flex justify-between text-xl font-bold">
//                                     <span>Total Amount</span>
//                                     <span className="text-blue-600">₹{(selectedOrder.total || 0).toFixed(2)}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Status Update Modal */}
//             {isStatusModalOpen && selectedOrder && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-2xl p-8 max-w-md w-full">
//                         <h3 className="text-2xl font-bold mb-6">Update Order Status</h3>
//                         <select
//                             value={newStatus}
//                             onChange={(e) => setNewStatus(e.target.value)}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500"
//                         >
//                             {Object.entries(statusConfig).map(([key, config]) => (
//                                 <option key={key} value={key}>
//                                     {config.label}
//                                 </option>
//                             ))}
//                         </select>
//                         <div className="flex gap-4">
//                             <button
//                                 onClick={() => setIsStatusModalOpen(false)}
//                                 className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleStatusUpdate}
//                                 disabled={updatingStatus}
//                                 className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-2"
//                             >
//                 >
//                                 {updatingStatus ? (
//                                     <>
//                                         <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                                         </svg>
//                                         Updating...
//                                     </>
//                                 ) : (
//                                     "Update Status"
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
import { useEffect, useState } from "react";
import {
  EyeIcon,
  InboxIcon,
  ClockIcon,
  Cog6ToothIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../../api-services/apiService";
import useDebounce from "../../hooks/useDebounce";

/* ---------------- STATUS CONFIG ---------------- */
const statusConfig = {
  pending: {
    icon: ClockIcon,
    color: "bg-yellow-100 text-yellow-800",
    label: "Pending",
  },
  processing: {
    icon: Cog6ToothIcon,
    color: "bg-blue-100 text-blue-800",
    label: "Processing",
  },
  shipped: {
    icon: TruckIcon,
    color: "bg-purple-100 text-purple-800",
    label: "Shipped",
  },
  delivered: {
    icon: CheckCircleIcon,
    color: "bg-green-100 text-green-800",
    label: "Delivered",
  },
  cancelled: {
    icon: XCircleIcon,
    color: "bg-red-100 text-red-800",
    label: "Cancelled",
  },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  /* ---------------- FETCH ORDERS ---------------- */
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    const res = await getOrders();
    if (res?.success) {
      setOrders(res?.data?.data || []);
    } else {
      setOrders([]);
      setError("Failed to load orders");
    }
    setLoading(false);
  };

  /* ---------------- FETCH ORDER DETAIL ---------------- */
  const fetchOrderDetail = async (orderId) => {
    if (!orderId) return;

    setLoadingDetail(true);
    const res = await getOrderById(orderId);

    if (res?.success) {
      setSelectedOrder(res?.data?.data);
      setIsStatusModalOpen(true);
    } else {
      alert("Failed to load order details");
    }
    setLoadingDetail(false);
  };

  /* ---------------- UPDATE STATUS ---------------- */
  const handleStatusUpdate = async () => {
    if (!selectedOrder?._id || !newStatus) return;

    setUpdatingStatus(true);
    const res = await updateOrderStatus(selectedOrder._id, {
      status: newStatus,
    });

    if (res?.success) {
      await fetchOrders();
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      setIsStatusModalOpen(false);
      setNewStatus("");
    } else {
      alert("Failed to update status");
    }
    setUpdatingStatus(false);
  };

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------- FILTERING ---------------- */
  const filteredOrders = orders
    .filter((o) => filter === "all" || o.status === filter)
    .filter((o) => {
      const q = debouncedSearch.toLowerCase();
      return (
        o.orderNumber?.toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q)
      );
    });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-1">
          Track and manage all customer orders
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md relative">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order ID, name, email..."
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        {["all", ...Object.keys(statusConfig)].map((status) => {
          const config =
            status === "all"
              ? { icon: InboxIcon, label: "Total" }
              : statusConfig[status];
          const Icon = config.icon;

          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`p-5 rounded-xl border-2 transition ${
                filter === status
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-200 hover:border-blue-400"
              }`}
            >
              <Icon className="w-10 h-10 mx-auto mb-3" />
              <div className="text-2xl font-bold">{statusCounts[status]}</div>
              <div className="text-sm mt-1">{config.label}</div>
            </button>
          );
        })}
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center py-16 text-gray-500">Loading orders...</div>
      )}

      {error && !loading && (
        <div className="text-center py-16 text-red-600">{error}</div>
      )}

      {/* Orders Table */}
      {!loading && filteredOrders.length > 0 && (
        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Date",
                  "Items",
                  "Total",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const cfg = statusConfig[order.status];
                const StatusIcon = cfg?.icon || ClockIcon;

                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-blue-600">
                      {order.orderNumber || `#${order._id.slice(-8)}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {order.user?.name || "Guest"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {order.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${cfg.color}`}
                      >
                        <StatusIcon className="w-5 h-5" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => fetchOrderDetail(order._id)}
                        className="text-blue-600"
                      >
                        <EyeIcon className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty */}
      {!loading && filteredOrders.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <InboxIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          No orders found
        </div>
      )}

      {/* Status Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Update Status</h3>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border px-4 py-3 rounded-xl mb-4"
            >
              {Object.entries(statusConfig).map(([key, c]) => (
                <option key={key} value={key}>
                  {c.label}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1 border py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updatingStatus}
                className="flex-1 bg-blue-600 text-white py-2 rounded-xl"
              >
                {updatingStatus ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
