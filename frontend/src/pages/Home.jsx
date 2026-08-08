import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

const products = [
  {
    id: 1,
    name: "Premium Sofa",
    category: "Furniture",
    brand: "Ikea",
    color: "Gray",
    duration: "Monthly",
    price: 850,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  },
  {
    id: 2,
    name: "Gaming Laptop",
    category: "Electronics",
    brand: "Dell",
    color: "Black",
    duration: "Daily",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
  },
  {
    id: 3,
    name: "Smart TV",
    category: "Electronics",
    brand: "Samsung",
    color: "Black",
    duration: "Daily",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
  },
  {
    id: 4,
    name: "Professional Camera",
    category: "Electronics",
    brand: "Sony",
    color: "Black",
    duration: "Daily",
    price: 900,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
  },
  {
    id: 5,
    name: "MacBook Pro",
    category: "Electronics",
    brand: "Apple",
    color: "Gray",
    duration: "Daily",
    price: 750,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=800",
  },
  {
    id: 6,
    name: "PlayStation 5",
    category: "Gaming",
    brand: "Sony",
    color: "White",
    duration: "Daily",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
      
  },
  {
    id: 7,
    name: "King Size Bed",
    category: "Furniture",
    brand: "Ikea",
    color: "White",
    duration: "Monthly",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
  },
  {
    id: 8,
    name: "Studio Speakers",
    category: "Audio",
    brand: "Sony",
    color: "Black",
    duration: "Daily",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
  },
];

function Home() {
  const navigate = useNavigate();

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

  /* ================= WISHLIST ================= */

  const [wishlist, setWishlist] = useState([]);

  /* ================= CART ================= */

  const [cartCount, setCartCount] = useState(0);

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
          product.brand.toLowerCase().includes(query),
      );
    }

    /* Brand */
    if (brand) {
      result = result.filter(
        (product) => product.brand === brand,
      );
    }

    /* Color */
    if (color) {
      result = result.filter(
        (product) => product.color === color,
      );
    }

    /* Duration */
    if (duration) {
      result = result.filter(
        (product) => product.duration === duration,
      );
    }

    /* Minimum price */
    if (minPrice !== "") {
      result = result.filter(
        (product) => product.price >= Number(minPrice),
      );
    }

    /* Maximum price */
    if (maxPrice !== "") {
      result = result.filter(
        (product) => product.price <= Number(maxPrice),
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
      result.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
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

  /* =========================================================
     WISHLIST
  ========================================================= */

  const toggleWishlist = (productId) => {
    setWishlist((previous) => {
      if (previous.includes(productId)) {
        return previous.filter((id) => id !== productId);
      }

      return [...previous, productId];
    });
  };

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const addToCart = (product) => {
    setCartCount((previous) => previous + 1);

    console.log("Added to cart:", product.name);
  };

  /* =========================================================
     SHARED SELECT CLASS
  ========================================================= */

  const selectClass =
    "h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-black outline-none transition focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10";

  return (
    <div className="min-h-screen bg-[#f5fbfb] text-black">


<Sidebar wishlistCount={wishlist.length} />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="ml-[220px] min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">

          <div className="flex h-[76px] items-center justify-between gap-6 px-8">

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Explore Products
              </h1>

              <p className="mt-0.5 text-sm text-gray-500">
                Find something you need. Rent it easily.
              </p>
            </div>

            <div className="flex items-center gap-3">

              {/* Search */}
              <div className="relative w-[320px]">

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search products..."
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pr-11 text-sm outline-none transition focus:border-[#4f8c89] focus:bg-white focus:ring-2 focus:ring-[#4f8c89]/10"
                />

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">

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

              {/* Wishlist */}
              <button
                type="button"
                onClick={() =>
                  alert(
                    wishlist.length
                      ? `${wishlist.length} item(s) in wishlist.`
                      : "Your wishlist is empty.",
                  )
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#4f8c89] hover:bg-[#e9f6f5] hover:text-[#4f8c89]"
              >

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
                    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78Z"
                  />
                </svg>

              </button>

              {/* Cart */}
              <button
                type="button"
                onClick={() =>
                  alert(
                    cartCount
                      ? `${cartCount} item(s) in cart.`
                      : "Your cart is empty.",
                  )
                }
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#4f8c89] hover:bg-[#e9f6f5] hover:text-[#4f8c89]"
              >

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
                    d="M2.25 3h2.1l2.1 10.5a2 2 0 001.96 1.6h8.9a2 2 0 001.94-1.5L21 6H6"
                  />

                  <circle cx="9" cy="19" r="1.2" />
                  <circle cx="18" cy="19" r="1.2" />
                </svg>

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4f8c89] px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}

              </button>

            </div>

          </div>

        </header>


        {/* Content */}
        <div className="px-8 py-7">

          {/* =================================================
              FILTER BAR
          ================================================= */}

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

            <div className="flex flex-wrap items-end gap-4">

              {/* Brand */}
              <div className="min-w-[180px] flex-1">

                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Brand
                </label>

                <select
                  value={brand}
                  onChange={(event) =>
                    setBrand(event.target.value)
                  }
                  className={selectClass}
                >
                  <option value="">
                    Select brand
                  </option>

                  <option value="Sony">Sony</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Apple">Apple</option>
                  <option value="LG">LG</option>
                  <option value="Dell">Dell</option>
                  <option value="Ikea">Ikea</option>
                </select>

              </div>


              {/* Color */}
              <div className="min-w-[180px] flex-1">

                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Color
                </label>

                <select
                  value={color}
                  onChange={(event) =>
                    setColor(event.target.value)
                  }
                  className={selectClass}
                >
                  <option value="">
                    Select color
                  </option>

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
              <div className="min-w-[180px] flex-1">

                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Duration
                </label>

                <select
                  value={duration}
                  onChange={(event) =>
                    setDuration(event.target.value)
                  }
                  className={selectClass}
                >
                  <option value="">
                    Select duration
                  </option>

                  <option value="Daily">
                    Per Day
                  </option>

                  <option value="Weekly">
                    Per Week
                  </option>

                  <option value="Monthly">
                    Per Month
                  </option>
                </select>

              </div>


              {/* Price */}
              <div className="min-w-[210px] flex-1">

                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
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
                    className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
                  />

                  <span className="text-gray-400">
                    —
                  </span>

                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(event) =>
                      setMaxPrice(event.target.value)
                    }
                    placeholder="Max"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
                  />

                </div>

              </div>


              {/* Clear */}
              <button
                type="button"
                onClick={clearFilters}
                className="h-10 rounded-lg px-4 text-sm font-semibold text-[#4f8c89] transition hover:bg-[#e9f6f5]"
              >
                Clear
              </button>

            </div>

          </section>


          {/* =================================================
              PRODUCTS HEADER
          ================================================= */}

          <div className="mb-5 mt-8 flex items-end justify-between">

            <div>

              <div className="flex items-center gap-3">

                <h2 className="text-xl font-semibold">
                  Available Products
                </h2>

                <span className="rounded-full bg-[#e9f6f5] px-2.5 py-1 text-xs font-semibold text-[#4f8c89]">
                  {filteredProducts.length} items
                </span>

              </div>

              <p className="mt-1 text-sm text-gray-500">
                Browse products available for rental.
              </p>

            </div>


            {/* SORTING */}
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
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

            <section className="grid grid-cols-2 gap-5 xl:grid-cols-4">

              {filteredProducts.map((product) => {

                const isWishlisted =
                  wishlist.includes(product.id);

                return (
                  <article
                   key={product.id}
                   onClick={() => navigate(`/product/${product.id}`)}
                   className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-[#4f8c89]/40 hover:shadow-xl"
                  >

                    {/* Image */}
                    <div className="relative aspect-[1.15/1] overflow-hidden bg-[#f1f8f8]">

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
                        toggleWishlist(product.id);
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


                    {/* Details */}
                    <div className="p-4">

                      <div className="mb-2 flex items-center justify-between">

                        <span className="rounded-md bg-[#e9f6f5] px-2 py-1 text-[11px] font-semibold text-[#4f8c89]">
                          {product.category}
                        </span>

                        <span className="text-xs text-green-600">
                          Available
                        </span>

                      </div>


                      <h3 className="truncate text-base font-semibold">
                        {product.name}
                      </h3>


                      <div className="mt-4 flex items-center justify-between">

                        <div>

                          <span className="text-lg font-bold">
                            ₹{product.price}
                          </span>

                          <span className="ml-1 text-xs text-gray-500">
                            / {product.duration === "Monthly"
                              ? "month"
                              : "day"}
                          </span>

                        </div>


                        <button
                          type="button"
                          onClick={(event) => {
                          event.stopPropagation();
                          addToCart(product);
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

          ) : (

            /* =================================================
               EMPTY STATE
            ================================================= */

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

      </main>

    </div>
  );
}

export default Home;