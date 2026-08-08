import { Link } from "react-router-dom";
import ProductForm from "../../components/admin/ProductForm";

function CreateProduct() {
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
          <h2 className="text-2xl font-bold text-gray-900">Add New Rental Product</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Publish inventory with pricing, deposit, and variant details.
          </p>
        </div>
      </div>

      <ProductForm isEdit={false} />
    </div>
  );
}

export default CreateProduct;
