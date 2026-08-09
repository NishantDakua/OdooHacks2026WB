import React from "react";
import ProductImage from "./ProductImage";

const ProductCard = React.memo(function ProductCard({
  product,
  isWishlisted,
  onNavigate,
  onToggleWishlist,
  onAddToCart,
}) {
  return (
    <article
      onClick={() => onNavigate(product.id)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-[#4f8c89]/40 hover:shadow-xl"
    >
      <div className="relative aspect-[1.15/1] overflow-hidden bg-[#f1f8f8]">
        <ProductImage
          src={product.image}
          alt={product.name}
          className={`h-full w-full ${product.quantityAvailable === 0 ? "grayscale opacity-75" : ""}`}
        />
        {product.quantityAvailable === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-md uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleWishlist(product);
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
          <span className={`text-xs ${product.quantityAvailable > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-bold'}`}>
            {product.quantityAvailable > 0 ? `${product.quantityAvailable} Available` : "Out of Stock"}
          </span>
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
            disabled={product.quantityAvailable === 0}
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart(product);
            }}
            className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#4f8c89] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.quantityAvailable === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
});

export default ProductCard;
