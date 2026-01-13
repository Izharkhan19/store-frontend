import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api-services/apiService";

export default function Categories() {
  /* -------------------- STATE -------------------- */
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  /* -------------------- API CALLS -------------------- */

  const fetchCategories = async () => {
    setLoadingCategories(true);
    setCategoriesError(null);

    const result = await getCategories();
    if (result?.success) {
      setCategories(result?.data?.data || []);
    } else {
      setCategories([]);
      setCategoriesError("Failed to load categories");
    }

    setLoadingCategories(false);
  };

  const saveCategory = async () => {
    setSaving(true);

    const payload = { name: formData.name.trim() };
    const result = editingCategory
      ? await updateCategory(editingCategory._id, payload)
      : await createCategory(payload);

    setSaving(false);
    return result;
  };

  const removeCategory = async (id) => {
    setDeletingId(id);
    const result = await deleteCategory(id);
    setDeletingId(null);
    return result;
  };

  /* -------------------- EFFECT -------------------- */
  useEffect(() => {
    fetchCategories();
  }, []);

  /* -------------------- HANDLERS -------------------- */

  const openModal = (category = null) => {
    setEditingCategory(category);
    setFormData({ name: category?.name || "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const result = await saveCategory();
    if (result?.success) {
      fetchCategories();
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this category? Products will become uncategorized."
      )
    )
      return;

    const result = await removeCategory(id);
    if (result?.success) {
      fetchCategories();
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Categories
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Organize your products effectively
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 sm:gap-3 shadow-md hover:shadow-lg transition w-full sm:w-auto"
        >
          <PlusIcon className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Loading skeletons */}
      {loadingCategories && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border animate-pulse"
            >
              <div className="h-7 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4" />
              <div className="h-16 sm:h-20 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {categoriesError && !loadingCategories && (
        <div className="text-center py-12 sm:py-16 md:py-20">
          <p className="text-red-600 text-base sm:text-lg">{categoriesError}</p>
          <button
            onClick={fetchCategories}
            className="mt-4 sm:mt-5 px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Categories grid */}
      {!loadingCategories && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-md border p-5 sm:p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start mb-4 sm:mb-5">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    /{category.slug || "no-slug"}
                  </p>
                </div>

                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={() => openModal(category)}
                    className="p-2 sm:p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(category._id)}
                    disabled={
                      deletingId === category._id ||
                      (category.productCount ?? 0) > 0
                    }
                    className="p-2 sm:p-2.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40 transition"
                  >
                    {deletingId === category._id ? (
                      <span className="text-sm">...</span>
                    ) : (
                      <TrashIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {category.productCount || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">products</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loadingCategories && categories.length === 0 && (
        <div className="text-center py-16 sm:py-20 md:py-24">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">
            No categories found
          </h3>
          <button
            onClick={() => openModal()}
            className="mt-5 sm:mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-md transition w-full sm:w-auto"
          >
            Create First Category
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-5 sm:mb-6 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                placeholder="Category name"
                required
              />

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-60 transition order-1 sm:order-2"
                >
                  {saving ? "Saving..." : editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
