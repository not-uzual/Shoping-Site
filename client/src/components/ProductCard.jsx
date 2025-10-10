import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  // Default values if product props are missing
  const {
    id = '',
    name = 'Product Name',
    price = 0,
    image = 'https://via.placeholder.com/300',
    discountPercentage = 0
  } = product || {};

  // Calculate discounted price if there's a discount
  const discountedPrice = price - (price * (discountPercentage / 100));
  
  return (
    <div className="group relative">
      <div className="overflow-hidden rounded-md bg-neutral-100">
        <Link to={`/product/${id}`}>
          <img 
            src={image} 
            alt={name}
            className="h-[250px] w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 rounded-full bg-black px-2 py-1 text-xs font-semibold text-white">
            {discountPercentage}% OFF
          </div>
        )}
        
        <button 
          className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-sm transition-all hover:bg-amber-500 flex items-center justify-center w-8 h-8"
          aria-label="Add to wishlist"
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/128/1077/1077035.png"
            alt="Heart"
            className="w-4 h-4"
          />
        </button>
      </div>
      
      <div className="mt-3 flex flex-col">
        <h3 className="text-sm font-medium text-amber-500 line-clamp-1">
          <Link to={`/product/${id}`}>{name}</Link>
        </h3>
        
        <div className="mt-1 flex items-center">
          {discountPercentage > 0 ? (
            <>
              <span className="text-sm font-semibold text-neutral-900">₹{discountedPrice.toFixed(2)}</span>
              <span className="ml-2 text-xs text-neutral-500 line-through">₹{price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-neutral-900">₹{price.toFixed(2)}</span>
          )}
        </div>
        
        <button 
          className="mt-3 w-full rounded-md bg-black py-2 text-xs font-medium text-white hover:bg-amber-500 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;