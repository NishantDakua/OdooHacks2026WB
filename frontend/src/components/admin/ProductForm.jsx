import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminProductService } from "../../services/adminProductService";
import Card from "../ui/Card";

function ProductForm({ initialData = null, isEdit = false, onSubmitSuccess }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isRentable, setIsRentable] = useState(
    initialData ? Boolean(initialData.isRentable) : true
  );
  const [imageUrl, setImageUrl] = useState(
    initialData?.images?.[0] || ""
  );

  // Rental Configuration
  const defaultRule = initialData?.pricelistRules?.[0] || {};
  const defaultLateFee = initialData?.lateFeeRules?.[0] || {};
  const [rentalPeriod, setRentalPeriod] = useState(defaultRule.durationUnit || "DAILY");
  const [rentalPrice, setRentalPrice] = useState(defaultRule.fixedPrice || 500);
  const [depositAmount, setDepositAmount] = useState(1000);
  const [gracePeriod, setGracePeriod] = useState(defaultLateFee.gracePeriodHours || 1);
  const [lateFeeRate, setLateFeeRate] = useState(defaultLateFee.rate || 100);

  // Variants & Inventory
  const defaultVariants = initialData?.variants?.length
    ? initialData.variants.map((v) => ({
        id: v.id,
        sku: v.sku || "",
        brand: v.brand || "",
        color: v.color || "",
        size: v.size || "",
        quantityTotal: v.quantityTotal || 1,
        quantityAvailable: v.quantityAvailable || 1,
        price: v.price || rentalPrice,
      }))
    : [
        {
          sku: "",
          brand: "Standard",
          color: "Default",
          size: "Regular",
          quantityTotal: 5,
          quantityAvailable: 5,
          price: 500,
        },
      ];

  const [variants, setVariants] = useState(defaultVariants);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const list = await adminProductService.getCategories();
        setCategories(list || []);
        if (!categoryId && list?.length > 0) {
          setCategoryId(list[0].id);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const created = await adminProductService.createCategory(newCategoryName.trim());
      if (created?.id) {
        setCategories((prev) => [...prev, created]);
        setCategoryId(created.id);
        setNewCategoryName("");
      }
    } catch (err) {
      setError(err.message || "Failed to create category");
    }
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      const formData = new FormData();
      formData.append("image", file);
      const res = await adminProductService.uploadImage(formData);
      if (res?.url) {
        setImageUrl(res.url);
      }
    } catch (err) {
      setError(err.message || "Image upload failed. You can also paste an image URL directly.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        sku: "",
        brand: "Standard",
        color: "",
        size: "",
        quantityTotal: 1,
        quantityAvailable: 1,
        price: rentalPrice,
      },
    ]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: name.trim(),
        description: description.trim(),
        categoryId: categoryId || null,
        isRentable,
        images: imageUrl ? [imageUrl] : [],
        variants: variants.map((v, idx) => ({
          sku: v.sku || `${name.toUpperCase().replace(/\s+/g, "_")}_V${idx + 1}`,
          brand: v.brand || "Standard",
          color: v.color || null,
          size: v.size || null,
          quantityTotal: Number(v.quantityTotal || 1),
          quantityAvailable: Number(v.quantityAvailable || v.quantityTotal || 1),
        })),
      };

      if (isEdit && initialData?.id) {
        await adminProductService.updateProduct(initialData.id, payload);
      } else {
        await adminProductService.createProduct(payload);
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        navigate("/admin/products");
      }
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* General Information */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">General Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sony Alpha A7 IV Camera"
              className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-[#4f8c89]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-[#4f8c89]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Or Add New Category</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New Category"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-[#4f8c89]"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="rounded-xl bg-gray-100 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed rental description and specifications..."
              className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-[#4f8c89]"
            />
          </div>

          {/* Image Upload & URL */}
          <div>
            <label className="block text-xs font-medium text-gray-700">Product Image URL or Upload</label>
            <div className="mt-1 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-[#4f8c89]"
              />
              <label className="flex cursor-pointer items-center justify-center rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 whitespace-nowrap">
                <span>{uploading ? "Uploading..." : "Upload File"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {imageUrl && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Rental & Pricing Configuration */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Rental Configuration & Pricing</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">Rental Periodicity</label>
            <select
              value={rentalPeriod}
              onChange={(e) => setRentalPeriod(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-[#4f8c89]"
            >
              <option value="DAILY">Daily</option>
              <option value="HOURLY">Hourly</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Rental Price (₹)</label>
            <input
              type="number"
              min="0"
              value={rentalPrice}
              onChange={(e) => setRentalPrice(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-[#4f8c89]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Security Deposit (₹)</label>
            <input
              type="number"
              min="0"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-[#4f8c89]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Grace Period (Hours)</label>
            <input
              type="number"
              min="0"
              value={gracePeriod}
              onChange={(e) => setGracePeriod(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-[#4f8c89]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Late Fee Rate (₹/day)</label>
            <input
              type="number"
              min="0"
              value={lateFeeRate}
              onChange={(e) => setLateFeeRate(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-[#4f8c89]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Publishing State</label>
            <select
              value={isRentable ? "PUBLISHED" : "DRAFT"}
              onChange={(e) => setIsRentable(e.target.value === "PUBLISHED")}
              className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-[#4f8c89]"
            >
              <option value="PUBLISHED">Published (Visible to Customers)</option>
              <option value="DRAFT">Draft (Hidden)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Basic Product Variants & Inventory */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Inventory & Basic Variants</h3>
            <p className="text-xs text-gray-500">Configure item variants, SKU codes, and stock quantities.</p>
          </div>
          <button
            type="button"
            onClick={handleAddVariant}
            className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#4f8c89] hover:bg-white transition"
          >
            + Add Variant
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((v, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3.5"
            >
              <div className="min-w-[120px] flex-1">
                <label className="block text-[11px] font-medium text-gray-500">SKU Code</label>
                <input
                  type="text"
                  value={v.sku}
                  placeholder={`SKU-00${idx + 1}`}
                  onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 text-xs outline-none focus:border-[#4f8c89]"
                />
              </div>

              <div className="min-w-[110px] flex-1">
                <label className="block text-[11px] font-medium text-gray-500">Brand / Option</label>
                <input
                  type="text"
                  value={v.brand}
                  placeholder="Standard / Pro"
                  onChange={(e) => handleVariantChange(idx, "brand", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 text-xs outline-none focus:border-[#4f8c89]"
                />
              </div>

              <div className="w-24">
                <label className="block text-[11px] font-medium text-gray-500">Total Qty</label>
                <input
                  type="number"
                  min="1"
                  value={v.quantityTotal}
                  onChange={(e) => handleVariantChange(idx, "quantityTotal", Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 text-xs outline-none focus:border-[#4f8c89]"
                />
              </div>

              <div className="w-24">
                <label className="block text-[11px] font-medium text-gray-500">Available</label>
                <input
                  type="number"
                  min="0"
                  value={v.quantityAvailable}
                  onChange={(e) => handleVariantChange(idx, "quantityAvailable", Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 text-xs outline-none focus:border-[#4f8c89]"
                />
              </div>

              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="mt-4 p-1.5 text-gray-400 hover:text-red-600 transition"
                  title="Remove variant"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Form Submission Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#4f8c89] px-7 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#3d726f] disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
