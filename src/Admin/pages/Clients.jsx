import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  deleteProduct,
  getAllUser,
  getProducts,
} from "../../api-services/apiService";
import { getDateInFormat } from "../../utils/commonService";

export default function Clients() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /* -------------------- FETCH PRODUCTS -------------------- */
  const fetchAllUsers = async () => {
    setLoading(true);
    const resData = await getAllUser();

    if (resData?.success) {
      debugger;
      // handle both possible response structures
      setUsers(resData.data?.data || resData.data || []);
    } else {
      setUsers([]);
      alert("Failed to load users.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  /* -------------------- DELETE PRODUCT -------------------- */
  const deleteProductById = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setDeletingId(id);
    const resData = await deleteProduct(id);

    if (resData?.success) {
      fetchAllProducts();
    } else {
      alert("Something went wrong.");
    }

    setDeletingId(null);
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Clients</h1>

        {/* Add Product Button - better name would be Add Client */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
          // onClick={handleAddClient} ← add your handler
        >
          Add Client
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 text-gray-500">Loading Users...</div>
      )}

      {/* Empty State */}
      {!loading && users?.length === 0 && (
        <div className="text-center py-12 text-gray-500">No Users found.</div>
      )}

      {/* Table - responsive version */}
      {!loading && users?.length > 0 && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          {/* Desktop/tablet view */}
          <table className="min-w-full divide-y divide-gray-200 hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((product) => (
                <tr
                  key={product.id || product.email}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {product.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {product?.phone || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                    {getDateInFormat(product.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                    {getDateInFormat(product.lastLogin)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile/card view */}
          <div className="md:hidden divide-y divide-gray-200">
            {users.map((product) => (
              <div
                key={product.id || product.email}
                className="p-4 bg-white hover:bg-gray-50"
              >
                <div className="font-medium mb-1">{product.name}</div>
                <div className="text-sm text-gray-600 mb-1">
                  {product.email}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <br />
                    {product?.phone || "—"}
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <br />
                    {getDateInFormat(product.createdAt)}
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Last Login:</span>
                    <br />
                    {getDateInFormat(product.lastLogin)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
