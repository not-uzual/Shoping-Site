import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, updateCartItemQuantity, removeFromCart, applyCoupon, removeCoupon } from '../APICalls/cartCalls';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await getCart();
        
        if (response.cart && response.cart.items) {

          const formattedItems = response.cart.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            image: item.product.image,
          }));
          
          setCartItems(formattedItems);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load cart');
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, []);

  const calculateSummary = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    let discount = 0;
    
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        discount = subtotal * (appliedCoupon.value / 100);
      } else {
        discount = appliedCoupon.value;
      }
    }
    
    const total = subtotal + shipping + tax - discount;
    
    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setLoading(true);
      await updateCartItemQuantity(id, newQuantity);
      
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to update quantity');
      console.error('Error updating quantity:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      setLoading(true);
      await removeFromCart(id);
      
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to remove item');
      console.error('Error removing item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      setLoading(true);
      const response = await applyCoupon(couponCode);
      
      if (response.cart && response.cart.couponApplied) {
        setAppliedCoupon({
          code: response.cart.couponApplied.code,
          type: response.cart.couponApplied.discountAmount ? 'fixed' : 'percentage',
          value: response.cart.couponApplied.discountAmount || 0
        });
      } else {
        setError('Invalid coupon code');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to apply coupon');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      setLoading(true);
      await removeCoupon();
      setAppliedCoupon(null);
      setCouponCode('');
    } catch (err) {
      setError(err.message || 'Failed to remove coupon');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const summary = calculateSummary();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh] flex flex-col justify-center items-center">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" 
          alt="Empty Cart" 
          className="w-24 h-24 mb-6 opacity-60"
        />
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added any products to your cart yet. 
          Continue shopping to find products you'll love.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-amber-500 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="hidden md:flex border-b pb-3 mb-4 text-sm font-medium text-gray-500">
              <div className="w-2/5">Product</div>
              <div className="w-1/5 text-center">Price</div>
              <div className="w-1/5 text-center">Quantity</div>
              <div className="w-1/5 text-right">Total</div>
            </div>
            
            {cartItems.map(item => (
              <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center py-4 border-b last:border-b-0">
                {/* Product */}
                <div className="w-full md:w-2/5 flex items-center mb-4 md:mb-0">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={`${item.image}?w=128&h=128&fit=crop&auto=format`} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <Link to={`/product/${item.id}`} className="text-base font-medium text-gray-800 hover:text-amber-500 transition duration-200">
                      {item.name}
                    </Link>
                    <div className="text-sm text-gray-500 mt-1">
                      {item.color} {item.size && `/ ${item.size}`}
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.id)} 
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium mt-2 inline-flex items-center md:hidden"
                    >
                      <span className="mr-1">×</span> Remove
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-1/5 text-left md:text-center mb-2 md:mb-0">
                  <div className="md:hidden text-xs text-gray-500 mb-1">Price:</div>
                  <div className="text-gray-700">${item.price.toFixed(2)}</div>
                </div>

                <div className="w-full md:w-1/5 text-left md:text-center mb-2 md:mb-0">
                  <div className="md:hidden text-xs text-gray-500 mb-1">Quantity:</div>
                  <div className="inline-flex items-center border rounded-md">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-600 hover:text-amber-600"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-gray-700 min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:text-amber-600"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="w-full md:w-1/5 text-left md:text-right">
                  <div className="md:hidden text-xs text-gray-500 mb-1">Total:</div>
                  <div className="text-gray-800 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.id)} 
                    className="text-xs text-amber-600 hover:text-amber-700 font-medium mt-2 items-center hidden md:inline-flex"
                  >
                    <span className="mr-1">×</span> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="coupon">
                Apply Coupon Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:ring-amber-500 focus:border-amber-500 text-sm"
                  placeholder="Enter coupon code"
                  disabled={appliedCoupon !== null}
                />
                {appliedCoupon ? (
                  <button
                    onClick={handleRemoveCoupon}
                    className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-r-md border border-l-0 border-gray-300 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-r-md text-sm font-medium transition-colors"
                  >
                    Apply
                  </button>
                )}
              </div>
              {error && (
                <div className="mt-2 text-sm text-red-600">{error}</div>
              )}
              {appliedCoupon && (
                <div className="mt-2 text-sm text-green-600">
                  Coupon {appliedCoupon.code} applied! 
                  {appliedCoupon.type === 'percentage' ? 
                    ` (${appliedCoupon.value}% off)` : 
                    ` ($${appliedCoupon.value} off)`
                  }
                </div>
              )}
            </div>
            
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-medium">${summary.subtotal}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800 font-medium">
                  {summary.shipping === '0.00' ? 'Free' : `$${summary.shipping}`}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-800 font-medium">${summary.tax}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between py-2">
                  <span className="text-amber-600">Discount</span>
                  <span className="text-amber-600">- ${summary.discount}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t mt-2 text-lg font-bold">
                <span className="text-gray-800">Total</span>
                <span className="text-amber-500">${summary.total}</span>
              </div>
            </div>
            
            <button
              className="w-full py-3 px-4 bg-amber-500 text-white text-sm font-medium rounded-md hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors"
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-4 text-center">
              <Link to="/" className="text-amber-500 hover:text-amber-600 text-sm font-medium">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Cart;
