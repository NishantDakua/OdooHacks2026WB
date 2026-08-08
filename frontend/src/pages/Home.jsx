import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ConfigureModal from "../components/ui/ConfigureModal";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import { products } from "../data/products";

function Home() {
  const navigate = useNavigate();
  const { cartCount, addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const toastTimerRef = useRef(null);

  /* ================= FILTER STATE ================= */

  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [duration, setDuration] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  /* ================= SEARCH ================= */

  const [search, setSearch] = useState("");

  /* ================= SORT ================= */

  const [sortBy, setSortBy] = useState("relevance");

  /* ================= TOAST ================= */

  const [toastMessage, setToastMessage] = useState("");

  /* ================= CONFIGURE MODAL ================= */

  const [configuringProduct, setConfiguringProduct] = useState(null);

  /* =========================================================
     FILTER + SEARCH + SORT
  ========================================================= */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /* Search */
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
    }

    /* Brand */
    if (brand) {
      result = result.filter((product) => product.brand === brand);
    }

    /* Color */
    if (color) {
      result = result.filter((product) => product.color === color);
    }

    /* Duration */
    if (duration) {
      result = result.filter((product) => product.duration === duration);
    }

    /* Minimum price */
    if (minPrice !== "") {
      result = result.filter(
        (product) => product.price >= Number(minPrice)
      );
    }

    /* Maximum price */
    if (maxPrice !== "") {
      result = result.filter(
        (product) => product.price <= Number(maxPrice)
      );
    }

    /* Sorting */
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [
    search,
    brand,
    color,
    duration,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setBrand("");
    setColor("");
    setDuration("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setSortBy("relevance");
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleAddToCart = (product) => {
    if (product.options && product.options.length > 0) {
      setConfiguringProduct(product);
      return;
    }

    addToCart(product, 1, {});

    setToastMessage(`${product.name} added to cart`);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToastMessage("");
    }, 1800);
  };

  const handleConfigurationConfirm = (options) => {
    if (configuringProduct) {
      addToCart(configuringProduct, 1, options);
      setToastMessage(`${configuringProduct.name} added to cart`);

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }

      toastTimerRef.current = setTimeout(() => {
        setToastMessage("");
      }, 1800);
    }
  };

  /* =========================================================
     SHARED SELECT CLASS
  ========================================================= */

  const selectClass =
    "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-black outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10";

  return (
    <AppLayout
      title="Explore Products"
      subtitle="Find something you need. Rent it easily."
      cartCount={cartCount}
    >
      <div className="min-h-full bg-[#f7fbfb] p-7">

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="mb-6 flex justify-end">
          <div className="relative w-full max-w-md">

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
            />

            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.04 6.04a7.5 7.5 0 0 0 10.61 10.61Z"
                />
              </svg>
            </div>

          </div>
        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-black">
                Filters
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Find the right rental for you.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-[#4f8c89] transition hover:text-[#376c69]"
            >
              Clear All
            </button>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            {/* Brand */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Brand
              </label>

              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className={selectClass}
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

            {/* Color */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Color
              </label>

              <select
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className={selectClass}
              >
                <option value="">Select color</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Gray">Gray</option>
                <option value="Blue">Blue</option>
                <option value="Red">Red</option>
                <option value="Green">Green</option>
                <option value="Purple">Purple</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Duration
              </label>

              <select
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className={selectClass}
              >
                <option value="">Select duration</option>
                <option value="Daily">Per Day</option>
                <option value="Weekly">Per Week</option>
                <option value="Monthly">Per Month</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Price Range
              </label>

              <div className="flex items-center gap-2">

                <input
                  type="number"
                  value={minPrice}
                  onChange={(event) =>
                    setMinPrice(event.target.value)
                  }
                  placeholder="Min"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
                />

                <span className="text-gray-400">—</span>

                <input
                  type="number"
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(event.target.value)
                  }
                  placeholder="Max"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
                />

              </div>
            </div>

          </div>

        </section>

        {/* =================================================
            PRODUCTS HEADER
        ================================================= */}

        <div className="mb-5 mt-8 flex items-end justify-between">

          <div>
            <div className="flex items-center gap-3">

              <h2 className="text-xl font-semibold text-black">
                Available Products
              </h2>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4f8c89]">
                {filteredProducts.length} items
              </span>

            </div>

            <p className="mt-1 text-sm text-gray-600">
              Browse products available for rental.
            </p>
          </div>

          {/* SORT */}
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
          >
            <option value="relevance">
              Sort by relevance
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="name">
              Name: A to Z
            </option>
          </select>

        </div>

        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        {filteredProducts.length > 0 ? (

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {filteredProducts.map((product) => {

              const isWishlisted = isInWishlist(product.id);

              return (
                <article
                  key={product.id}
                  onClick={() =>
                    navigate(`/product/${product.id}`)
                  }
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#4f8c89]/40 hover:shadow-xl"
                >

                  {/* IMAGE */}

                  <div className="relative aspect-[1.15/1] overflow-hidden bg-[#eef9f8]">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Wishlist */}

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition ${
                        isWishlisted
                          ? "text-[#4f8c89]"
                          : "text-gray-600 hover:text-[#4f8c89]"
                      }`}
                      aria-label="Add to wishlist"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={
                          isWishlisted
                            ? "currentColor"
                            : "none"
                        }
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

                  {/* DETAILS */}

                  <div className="p-4">

                    <div className="mb-2 flex items-center justify-between">

                      <span className="rounded-md bg-[#e9f6f5] px-2 py-1 text-[11px] font-semibold text-[#4f8c89]">
                        {product.category}
                      </span>

                      <span className="text-xs font-medium text-green-600">
                        Available
                      </span>

                    </div>

                    <h3 className="truncate text-base font-semibold text-black">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {product.brand} • {product.color}
                    </p>

                    <div className="mt-4 flex items-center justify-between">

                      <div>
                        <span className="text-lg font-bold text-black">
                          ₹{product.price}
                        </span>

                        <span className="ml-1 text-xs text-gray-500">
                          /{" "}
                          {product.duration === "Monthly"
                            ? "month"
                            : "day"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="rounded-lg bg-[#4f8c89] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#376c69] active:scale-[0.97]"
                      >
                        Add to Cart
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </section>

        ) : (

          /* EMPTY STATE */

          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e9f6f5] text-[#4f8c89]">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.04 6.04a7.5 7.5 0 0 0 10.61 10.61Z"
                />
              </svg>

            </div>

            <h3 className="mt-4 text-lg font-semibold">
              No products found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your filters or search.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-[#4f8c89] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#376c69]"
            >
              Clear Filters
            </button>

          </div>

        )}

      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-[#4f8c89] bg-white px-4 py-3 text-sm font-medium text-black shadow-2xl shadow-black/10">
          <span className="mr-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#4f8c89] align-middle" />
          {toastMessage}
        </div>
      )}

      {/* Configure Modal */}
      <ConfigureModal
        isOpen={Boolean(configuringProduct)}
        onClose={() => setConfiguringProduct(null)}
        onConfirm={handleConfigurationConfirm}
        product={configuringProduct}
      />
    </AppLayout>
  );
}

export default Home;