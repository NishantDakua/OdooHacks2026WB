import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { adminProductService } from "../../services/adminProductService";
import ProductForm from "../../components/admin/ProductForm";
import PageLoadingFallback from "../../components/ui/PageLoadingFallback";

function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminProductService.getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err.message || "Failed to load product for editing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  if (loading) return <PageLoadingFallback />;

  if (error || !product) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-medium">{error || "Product not found."}</p>
        <button onClick={loadProduct} className="mt-4 font-semibold text-[#4f8c89] underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/admin/products"
          className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50"
        >
          ←
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Product: {product.name}</h2>
          <p className="mt-0.5 text-xs text-gray-500">Update rental pricing, deposit, and stock.</p>
        </div>
      </div>

      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}

export default EditProduct;
