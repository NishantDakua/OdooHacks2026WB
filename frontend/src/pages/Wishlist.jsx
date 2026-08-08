import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, wishlistCount, removeFromWishlist } = useWishlist();

  return (
    <AppLayout
      title="Wishlist"
      subtitle="Your saved rental items"
      cartCount={0}
    >
      <div className="h-full overflow-y-auto overflow-x-hidden bg-[#f7fbfb] p-7">
        {wishlistItems.length === 0 ? (
          <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-center">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f6f5] text-[#4f8c89]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78Z" />
                </svg>
              </div>

              <h2 className="mt-5 text-xl font-semibold text-black">Your wishlist is empty</h2>
              <p className="mt-2 text-sm text-gray-500">Save products you want to rent later.</p>

              <button
                type="button"
                onClick={() => navigate("/home")}
                className="mt-6 rounded-xl bg-[#4f8c89] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#376c69]"
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-black">Saved products</h2>
                <p className="mt-1 text-sm text-gray-600">{wishlistCount} item{wishlistCount !== 1 ? "s" : ""} in your wishlist</p>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              {wishlistItems.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-[170px_1fr]">
                    <div className="aspect-[1.05/1] bg-[#eef9f8] md:aspect-auto md:h-full">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Badge>{product.category}</Badge>
                          <h3 className="mt-3 text-lg font-semibold text-black">{product.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{product.brand} • {product.color}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromWishlist(product.id)}
                          className="text-sm font-semibold text-[#4f8c89] hover:text-[#376c69]"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-black">₹{product.price}</span>
                          <span className="ml-1 text-xs text-gray-500">/{product.duration === "Monthly" ? "month" : "day"}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default Wishlist;