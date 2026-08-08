import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminProductService } from "../../services/adminProductService";
import DataTable from "../../components/admin/DataTable";
import FilterBar from "../../components/admin/FilterBar";
import PageLoadingFallback from "../../components/ui/PageLoadingFallback";

import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [publishFilter, setPublishFilter] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const [data, catList] = await Promise.all([
        adminProductService.getProducts({
          categoryId: categoryFilter,
          search,
          isRentable: publishFilter,
        }),
        adminProductService.getCategories(),
      ]);
      setProducts(data || []);
      setCategories(catList || []);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, publishFilter, search]);

  const handleTogglePublish = async (product) => {
    try {
      await adminProductService.updateProduct(product.id, {
        isRentable: !product.isRentable,
      });
      showToast("success", `Product ${!product.isRentable ? "published" : "unpublished"} successfully.`);
      fetchProducts();
    } catch (err) {
      showToast("error", "Failed to toggle publish status: " + err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await adminProductService.deleteProduct(deleteCandidate.id);
      showToast("success", `Deleted product ${deleteCandidate.name}.`);
      setDeleteCandidate(null);
      fetchProducts();
    } catch (err) {
      showToast("error", "Failed to delete product: " + err.message);
    }
  };

  const columns = [
    {
      header: "Product",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.images?.[0] ? (
            <img
              src={row.images[0]}
              alt={row.name}
              className="h-10 w-10 rounded-lg object-cover border border-gray-100"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400 font-medium">
              No Img
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 leading-tight">{row.name}</p>
            <p className="text-[11px] text-gray-400">
              SKU: {row.variants?.[0]?.sku || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      render: (row) => (
        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 font-medium">
          {row.category?.name || "General"}
        </span>
      ),
    },
    {
      header: "Rental Price",
      accessor: "rentalPrice",
      render: (row) => {
        const rule = row.pricelistRules?.[0];
        const price = rule?.fixedPrice || row.variants?.[0]?.price || 500;
        return <span className="font-bold text-gray-900">₹{price} / {rule?.durationUnit || "day"}</span>;
      },
    },
    {
      header: "Stock",
      accessor: "variants",
      render: (row) => {
        const total = row.variants?.reduce((sum, v) => sum + Number(v.quantityTotal || 0), 0) || 0;
        const avail = row.variants?.reduce((sum, v) => sum + Number(v.quantityAvailable || 0), 0) || 0;
        return (
          <div className="text-xs">
            <span className={avail > 0 ? "font-bold text-emerald-600" : "font-bold text-red-600"}>
              {avail} Available
            </span>
            <span className="text-gray-400"> / {total} Total</span>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessor: "isRentable",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            row.isRentable
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {row.isRentable ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/products/${row.id}/edit`}
            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => handleTogglePublish(row)}
            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
          >
            {row.isRentable ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => setDeleteCandidate(row)}
            className="p-1 text-gray-400 hover:text-red-600 transition"
            title="Delete product"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="mt-1 text-sm text-gray-500">Manage rental inventory, pricing, and variants.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-[#4f8c89] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3d726f]"
        >
          <span>+</span> Add Product
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or SKU..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10 shadow-sm"
          />
          <svg className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-[#4f8c89] shadow-sm"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={publishFilter}
          onChange={(e) => setPublishFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-[#4f8c89] shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>

        {(search || categoryFilter || publishFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategoryFilter("");
              setPublishFilter("");
            }}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between">
          <p>{error}</p>
          <button type="button" onClick={fetchProducts} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <PageLoadingFallback />
      ) : (
        <DataTable
          columns={columns}
          data={products}
          emptyMessage="No products found matching your criteria."
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteCandidate)}
        title="Delete Rental Product"
        onClose={() => setDeleteCandidate(null)}
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{deleteCandidate?.name}</strong>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteCandidate(null)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
          >
            Delete Product
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ProductList;
