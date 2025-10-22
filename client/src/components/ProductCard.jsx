import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../APICalls/cartCalls';

function ProductCard({ product }) {
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);

  const {
    _id = '',
    name = 'Product Name',
    price = 0,
    image = 'https://via.placeholder.com/300',
    discount = 0
  } = product || {};

  const discountedPrice = price - (price * (discount / 100));
  
  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(_id, 1);
      setCartMessage({ type: 'success', text: `${name} added to cart!` });
      setTimeout(() => setCartMessage(null), 3000);
    } catch (error) {
      setCartMessage({ type: 'error', text: error.message || 'Failed to add to cart' });
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setAddingToCart(false);
    }
  };
  
  return (
    <div className="group relative">
      <div className="overflow-hidden rounded-md bg-neutral-100">
        <Link to={`/product/${_id}`}>
          <img 
            src={image} 
            alt={name}
            className="h-[250px] w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {discount > 0 && (
          <div className="absolute top-2 left-2 rounded-full bg-black px-2 py-1 text-xs font-semibold text-white">
            {discount}% OFF
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
          <Link to={`/product/${_id}`}>{name}</Link>
        </h3>
        
        <div className="mt-1 flex items-center">
          {discount > 0 ? (
            <>
              <span className="text-sm font-semibold text-neutral-900">₹{discountedPrice.toFixed(2)}</span>
              <span className="ml-2 text-xs text-neutral-500 line-through">₹{price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-neutral-900">₹{price.toFixed(2)}</span>
          )}
        </div>
        
        {cartMessage && (
          <div className={`mt-2 text-xs p-1 text-center rounded ${cartMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {cartMessage.text}
          </div>
        )}
        <button 
          className="mt-3 w-full rounded-md bg-black py-2 text-xs font-medium text-white hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={addingToCart}
          onClick={handleAddToCart}
        >
          {addingToCart ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </div>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;