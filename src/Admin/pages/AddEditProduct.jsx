import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  createProduct,
  updateProduct,
  getProduct,
  getCategories,
} from "../../api-services/apiService";
import axios from "axios";

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    isFeatured: false,
  });

  const [images, setImages] = useState([]); // New files to upload
  const [existingImages, setExistingImages] = useState([]); // Existing images from backend

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [loadingProduct, setLoadingProduct] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await getCategories();
        if (res.success) {
          setCategories(res.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Load product in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadProduct = async () => {
        setLoadingProduct(true);
        setError(null);
        try {
          const res = await getProduct(id);
          if (res.success && res.data) {
            const product = res.data?.data;
            debugger;
            setFormData({
              name: product.name || "",
              price: product.price || "",
              stock: product.stock || "",
              category: product.category?._id || product.category || "",
              description: product.description || "",
              isFeatured: product.isFeatured || false,
            });
            setExistingImages(product.images || []);
          } else {
            setError("Product not found");
          }
        } catch (err) {
          console.error("Failed to load product", err);
          setError("Failed to load product details");
        } finally {
          setLoadingProduct(false);
        }
      };
      loadProduct();
    }
  }, [id, isEditMode]);
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    const totalImages = existingImages.length + images.length + files.length;

    if (totalImages > maxImages) {
      alert(`Maximum ${maxImages} images allowed.`);
      e.target.value = null;
      return;
    }

    setImages((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setExistingImages((prev) =>
      prev.filter((img) => (img._id || img.public_id) !== imageId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("isFeatured", formData.isFeatured);

    // Append new images
    images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    // Append existing images to keep (edit mode only)
    if (isEditMode) {
      existingImages.forEach((img) => {
        formDataToSend.append("existingImages", img._id || img.public_id);
      });
    }

    try {
      let response;
      if (isEditMode) {
        // Independent PUT call for update
        response = await axios.put(
          `${API_BASE_URL}/products/${id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${
                localStorage.getItem("adminToken") || ""
              }`,
            },
          }
        );
      } else {
        // Independent POST call for create
        response = await axios.post(
          `${API_BASE_URL}/products`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${
                localStorage.getItem("adminToken") || ""
              }`,
            },
          }
        );
      }

      const result = response.data;

      if (result.success) {
        alert(`Product ${isEditMode ? "updated" : "added"} successfully!`);
        navigate("/admin/products");
      } else {
        setError(result.message || "Failed to save product");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const getImageUrl = (img) =>
    img.url || img.secure_url || URL.createObjectURL(img);
  const getImageId = (img) => img._id || img.public_id || img.name;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Header with back button */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
        <button
          onClick={() => navigate("/admin/products")}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeftIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <hr className="my-6 border-gray-200" />

      {loadingProduct ? (
        <div className="text-center py-12 md:py-20">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 md:py-16 text-red-600 text-lg">
          {error}
        </div>
      ) : (
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md border border-gray-100">
          <form onSubmit={handleSubmit}>
            {/* Grid for form fields */}
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-6 lg:gap-8">
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Category
                </label>
                {loadingCategories ? (
                  <p className="text-gray-500 py-3">Loading categories...</p>
                ) : (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Is Featured - full width on mobile */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block mb-2 font-medium text-gray-700">
                  Is Featured
                </label>
                <div className="flex items-center gap-3 sm:gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured || false}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          isFeatured: e.target.checked,
                        }));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 sm:w-12 sm:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="text-gray-600 text-sm sm:text-base">
                    {formData.isFeatured
                      ? "Marked as Featured Product"
                      : "Not featured"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 md:mt-8">
              <label className="block mb-1.5 font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4 sm:rows-5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition min-h-[120px]"
                required
              />
            </div>

            {/* Image Upload Section */}
            <div className="mt-8 md:mt-10">
              <label className="block mb-2 font-medium text-gray-700">
                Product Images
              </label>

              {/* Existing Images (Edit Mode) */}
              {isEditMode && existingImages.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3">Current Images</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {existingImages.map((img) => (
                      <div
                        key={getImageId(img)}
                        className="relative group aspect-square"
                      >
                        <img
                          src={getImageUrl(img)}
                          alt="product"
                          className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(getImageId(img))}
                          className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 p-6 sm:p-8 md:p-10 rounded-xl text-center bg-gray-50 hover:bg-gray-100 transition relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-gray-500 text-sm sm:text-base">
                  Drop images here or click to upload (multiple allowed)
                </p>
              </div>

              {/* New Image Previews */}
              {images.length > 0 && (
                <div className="mt-5 sm:mt-6">
                  <p className="text-sm text-gray-500 mb-3">
                    New images to upload
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {images.map((file, i) => (
                      <div key={i} className="relative group aspect-square">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(i)}
                          className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md text-lg font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-600 mt-6 text-center text-sm sm:text-base">
                {error}
              </p>
            )}

            {/* Action Buttons */}
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5 justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="px-6 sm:px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || loadingProduct}
                className="px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md disabled:opacity-60 font-medium transition order-1 sm:order-2"
              >
                {saving
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update Product"
                  : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
