import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ConfigureModal from "../components/ui/ConfigureModal";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { products as productCatalog } from "../data/products";

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [duration, setDuration] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [configuringProduct, setConfiguringProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    let result = [...productCatalog];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
    }

    if (brand) {
      result = result.filter((product) => product.brand === brand);
    }

    if (color) {
      result = result.filter((product) => product.color === color);
    }

    if (duration) {
      result = result.filter((product) => product.duration === duration);
    }

    if (minPrice !== "") {
      result = result.filter((product) => product.price >= Number(minPrice));
    }

    if (maxPrice !== "") {
      result = result.filter((product) => product.price <= Number(maxPrice));
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [brand, color, duration, maxPrice, minPrice, search, sortBy]);

  const clearFilters = () => {
    setBrand("");
    setColor("");
    setDuration("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setSortBy("relevance");
  };

  const handleAddToCart = (product) => {
    if (product.options?.length) {
      setConfiguringProduct(product);
      return;
    }

    addToCart(product, 1, { "Rental Duration": "1" });
  };

  const handleConfigurationConfirm = (options) => {
    if (configuringProduct) {
      addToCart(configuringProduct, 1, options);
      setConfiguringProduct(null);
    }
  };

  return (
    <AppLayout
      title="Explore Products"
      subtitle="Find something you need. Rent it easily."
      cartCount={0}
    >
      <div className="px-8 py-7">
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[180px] flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Brand
              </label>
              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-black outline-none transition focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
              >
                <option value="">Select brand</option>
                <option value="Sony">Sony</option>
                <option value="Samsung">Samsung</option>
                <option value="Apple">Apple</option>
                <option value="LG">LG</option>
                <option value="Dell">Dell</option>
                <option value="Ikea">Ikea</option>
              </select>
            </div>

            <div className="min-w-[180px] flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Color
              </label>
              <select
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-black outline-none transition focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
              >
                <option value="">Select color</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Gray">Gray</option>
                <option value="Blue">Blue</option>
                <option value="Red">Red</option>
              </select>
            </div>

            <div className="min-w-[180px] flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Duration
              </label>
              <select
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-black outline-none transition focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
              >
                <option value="">Select duration</option>
                <option value="Daily">Per Day</option>
                <option value="Weekly">Per Week</option>
                <option value="Monthly">Per Month</option>
              </select>
            </div>

            <div className="min-w-[210px] flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="Min"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="Max"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="h-10 rounded-lg px-4 text-sm font-semibold text-[#4f8c89] transition hover:bg-[#e9f6f5]"
            >
              Clear
            </button>
          </div>
        </section>

        <div className="mb-5 mt-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Available Products</h2>
              <span className="rounded-full bg-[#e9f6f5] px-2.5 py-1 text-xs font-semibold text-[#4f8c89]">
                {filteredProducts.length} items
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Browse products from the in-memory catalog.
            </p>
          </div>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
          >
            <option value="relevance">Sort by relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        <section className="grid grid-cols-2 gap-5 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistItems.some((item) => item.id === product.id);

            return (
              <article
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-[#4f8c89]/40 hover:shadow-xl"
              >
                <div className="relative aspect-[1.15/1] overflow-hidden bg-[#f1f8f8]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition ${
                      isWishlisted
                        ? "text-[#4f8c89]"
                        : "text-gray-600 hover:text-[#4f8c89]"
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isWishlisted ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78Z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-md bg-[#e9f6f5] px-2 py-1 text-[11px] font-semibold text-[#4f8c89]">
                      {product.category}
                    </span>
                    <span className="text-xs text-green-600">Available</span>
                  </div>

                  <h3 className="truncate text-base font-semibold">{product.name}</h3>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">₹{product.price}</span>
                      <span className="ml-1 text-xs text-gray-500">
                        / {product.duration === "Monthly" ? "month" : "day"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#4f8c89] active:scale-[0.97]"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <ConfigureModal
          isOpen={Boolean(configuringProduct)}
          onClose={() => setConfiguringProduct(null)}
          onConfirm={handleConfigurationConfirm}
          product={configuringProduct}
        />
      </div>
    </AppLayout>
  );
}

export default Home;