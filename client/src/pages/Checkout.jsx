import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart } from '../APICalls/cartCalls';
import { createOrder } from '../APICalls/orderCalls';
import { useSelector } from 'react-redux';
import OrderSuccess from '../components/OrderSuccess';

function Checkout() {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  

  const [selectedAddressId, setSelectedAddressId] = useState(userData?.addresses?.[0]||null);
  
  const [paymentInfo, setPaymentInfo] = useState({
    method: '',
    upiId: ''
  });

  useEffect(() => {
    if (!userData) {
      navigate('/login?redirect=checkout');
      return;
    }
    
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await getCart();
        
        if (response.cart && response.cart.items && response.cart.items.length > 0) {
          const formattedItems = response.cart.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            image: item.product.image,
          }));
          
          setCartItems(formattedItems);
        } else {
          navigate('/cart');
        }
      } catch (err) {
        setError(err.message || 'Failed to load cart');
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, [userData, navigate]);


  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const selectAddress = (addressId) => {
    setSelectedAddressId(addressId);
  };
  

  const calculateSummary = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setOrderProcessing(true);
    setError(null);
    
    try {
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Your cart is empty. Please add items to your cart before checkout.');
      }
      
      let shippingAddress;
      
      if (selectedAddressId) {
        const selectedAddress = userData.addresses.find(addr => addr._id === selectedAddressId);
        if (!selectedAddress) {
          throw new Error('Please select a valid shipping address');
        }
        
        shippingAddress = {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country
        };
      } 
      else {
        throw new Error('Please select a shipping address');
      }
      
      if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
        throw new Error('Shipping address is incomplete. Please provide all required information.');
      }
      
      if (paymentInfo.method === 'upi') {
        if (!paymentInfo.upiId) {
          throw new Error('Please enter a valid UPI ID');
        }
        
        if (!paymentInfo.upiId.includes('@')) {
          throw new Error('Invalid UPI ID format. Please enter a valid UPI ID.');
        }
      }
      
      const paymentData = {
        method: paymentInfo.method === 'cod' ? 'cod' : 'upi', // Match the enum values in the model
        transactionId: paymentInfo.method === 'upi' ? paymentInfo.upiId : undefined,
        status: 'pending' // Payment status starts as pending
      };
      
      const response = await createOrder({
        shippingAddress,
        paymentInfo: paymentData
      });

      console.log('Order creation response:', response);

      if (!response) {
        throw new Error('No response received from the server');
      }
      
      if (!response.success) {
        throw new Error(response.message || 'Order creation failed on the server');
      }
      
      if (!response.order) {
        throw new Error('Order was created but details are missing');
      }

      setOrderProcessing(false);
      setOrderDetails({
        orderId: response.order._id || 'Unknown',
        totalAmount: parseFloat(summary.total)
      });
      setOrderSuccess(true);
      
    } catch (err) {
      setOrderProcessing(false);
      
      if (err.message) {
        setError(err.message);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to place order. Please try again later.');
      }
      
      console.error('Error creating order:', err);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const summary = calculateSummary();
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading checkout information...</p>
        </div>
      </div>
    );
  }
  
  if (orderSuccess && orderDetails) {
    return (
      <main className="container mx-auto px-4 py-8">
        <OrderSuccess orderId={orderDetails.orderId} totalAmount={orderDetails.totalAmount} />
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-amber-500">Checkout</h1>
        <p className="text-gray-600 mt-2">Complete your order by providing shipping and payment details.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmitOrder}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Customer Information & Shipping */}
          <div className="lg:w-2/3">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Shipping Information</h2>
              
              {userData.addresses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Addresses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.addresses.map(address => (
                      <div 
                        key={address._id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedAddressId === address._id 
                            ? 'border-amber-500 bg-amber-50' 
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                        onClick={() => selectAddress(address._id)}
                      >
                        <div className="flex justify-between">
                          <div className="font-medium text-gray-800">
                            {userData.name}
                            {console.log(userData)
                            }
                          </div>
                          <div className="flex items-center justify-center w-5 h-5 border-2 rounded-full shrink-0 mt-1">
                            {selectedAddressId === address._id && (
                              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{address.type}</div>
                        <div className="text-sm text-gray-600 mt-2">
                          {address.street}, {address.city}, {address.state} {address.zipCode}
                        </div>
                        <div className="text-sm text-gray-600">{address.country}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentInfo.method === 'cod' 
                      ? 'border-amber-500 bg-amber-50' 
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                  onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'cod' }))}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800 flex items-center">
                        Cash on Delivery
                        
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Pay with cash when your order is delivered
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-5 h-5 border-2 rounded-full shrink-0">
                      {paymentInfo.method === 'cod' && (
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentInfo.method === 'upi' 
                      ? 'border-amber-500 bg-amber-50' 
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                  onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'upi' }))}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">UPI Payment</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Pay via UPI apps like Google Pay, PhonePe, etc.
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-5 h-5 border-2 rounded-full shrink-0">
                      {paymentInfo.method === 'upi' && (
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center mt-3 space-x-2">
                    <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="Google Pay" className="h-6 w-auto" />
                    <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="PhonePe" className="h-6 w-auto" />
                    <img src="https://cdn-icons-png.flaticon.com/128/5977/5977576.png" alt="Paytm" className="h-6 w-auto" />
                  </div>
                </div>
              </div>
              
              {paymentInfo.method === 'upi' && (
                <div className="border-t pt-4 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="upiId">
                    Enter UPI ID*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="upiId"
                      name="upiId"
                      placeholder="username@upi"
                      value={paymentInfo.upiId || ''}
                      onChange={handlePaymentInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">Example: yourname@okhdfcbank, yourname@ybl, etc.</p>
                  </div>
                </div>
              )}
              
              {paymentInfo.method === 'cod' && (
                <div className="border-t pt-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-800">Cash on Delivery Information</h4>
                        <p className="mt-1 text-sm text-gray-600">Pay in cash at the time of delivery. Please have the exact amount ready.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="max-h-64 overflow-y-auto mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center py-3 border-b last:border-b-0">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</h3>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
                <div className="flex justify-between py-3 border-t mt-2 text-lg font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="text-amber-500">${summary.total}</span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={orderProcessing}
                className="w-full py-3 px-4 bg-amber-500 text-white text-base font-medium rounded-md hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {orderProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                  </div>
                ) : (
                  <>
                    {paymentInfo.method === 'cod' ? 
                      'Place Order with Cash on Delivery' : 
                      'Place Order with UPI Payment'
                    }
                  </>
                )}
              </button>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                  {error}
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Link to="/cart" className="text-amber-500 hover:text-amber-600 text-sm font-medium">
                  ← Return to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

export default Checkout;
