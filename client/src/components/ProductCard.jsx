import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { addToCart } from '../APICalls/cartCalls';
import { addToWishlist, removeFromWishlist } from '../APICalls/productCalls';

function ProductCard({ product, inWishlist = false, onWishlistChange = null }) {
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(inWishlist);
  const [processingWishlist, setProcessingWishlist] = useState(false);
  
  const { userData } = useSelector(state => state.user);

  const {
    _id = '',
    name = 'Product Name',
    price = 0,
    image = 'https://via.placeholder.com/300',
    discount = 0
  } = product || {};

  const discountedPrice = price - (price * (discount / 100));
  
  useEffect(() => {
    setIsInWishlist(inWishlist);
  }, [inWishlist]);

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
  
  const handleToggleWishlist = async () => {
    if (!userData) {
      setCartMessage({ type: 'error', text: 'Please login to add items to wishlist' });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }
    
    try {
      setProcessingWishlist(true);
      
      if (isInWishlist) {
        await removeFromWishlist(_id);
        setIsInWishlist(false);
        setCartMessage({ type: 'success', text: `${name} removed from wishlist!` });
      } else {
        await addToWishlist(_id);
        setIsInWishlist(true);
        setCartMessage({ type: 'success', text: `${name} added to wishlist!` });
      }
      
      // Call parent's callback if provided
      if (onWishlistChange) {
        onWishlistChange(_id, !isInWishlist);
      }
      
      setTimeout(() => setCartMessage(null), 3000);
    } catch (error) {
      const action = isInWishlist ? 'remove from' : 'add to';
      setCartMessage({ type: 'error', text: `Failed to ${action} wishlist: ${error.message}` });
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setProcessingWishlist(false);
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
          className={`absolute right-2 top-2 rounded-full p-1.5 shadow-sm transition-all flex items-center justify-center w-8 h-8 ${
            isInWishlist ? 'bg-white' : 'bg-white'
          }`}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleToggleWishlist}
          disabled={processingWishlist}
        >
          {processingWishlist ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-amber-500 rounded-full animate-spin" />
          ) : (
            <img 
              src={isInWishlist 
                ? "https://cdn-icons-png.flaticon.com/128/2107/2107845.png" // Filled heart
                : "https://cdn-icons-png.flaticon.com/128/1077/1077035.png" // Outline heart
              }
              alt={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className="w-4 h-4"
            />
          )}
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