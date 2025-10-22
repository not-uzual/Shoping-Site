import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSingleProduct } from '../APICalls/productCalls';
import { addToCart } from '../APICalls/cartCalls';

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await getSingleProduct(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value >= 1 ? value : 1);
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      
      setCartMessage({ type: 'success', text: `${product.name} added to cart!` });
      setTimeout(() => setCartMessage(null), 3000);
    } catch (error) {
      setCartMessage({ type: 'error', text: error.message || 'Failed to add to cart' });
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-xl mb-4">Product not found</div>
        <button 
          onClick={() => navigate('/')} 
          className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm">
            <button onClick={() => navigate('/')} className="text-amber-600 hover:underline">Home</button>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600 font-medium">{product?.name || "Product"}</span>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-8 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Product Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Image */}
            <div className="rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center h-[300px] md:h-[500px]">
              {product?.image ? (
                <img 
                  src={product.image} 
                  alt={product.name || "Product"} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x400?text=Image+Not+Available";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                  No image available
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product?.name || "Product Name"}</h1>
              
              {(product?.rating > 0) && (
                <div className="flex items-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star}
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 ${star <= product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">{product.rating} out of 5</span>
                </div>
              )}
              
              <div className="mt-6 mb-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                {product?.discount > 0 ? (
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{calculateDiscountedPrice(product?.price || 0, product?.discount || 0).toFixed(0)}
                      </span>
                      <span className="ml-3 text-lg text-gray-500 line-through">
                        ₹{product?.price || 0}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                        {product?.discount || 0}% OFF
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        You save: ₹{((product?.price || 0) * (product?.discount || 0) / 100).toFixed(0)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product?.price || 0}
                  </span>
                )}
              </div>

              {product?.stock > 0 ? (
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-medium text-green-700">In Stock</span> 
                  {product?.stock < 10 && (
                    <span className="ml-1 text-sm text-gray-500">
                      (Only {product?.stock} left)
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="font-medium text-red-700">Out of Stock</span>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Free delivery available</span>
                </div>
                <div className="flex items-center mt-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>1 year warranty</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
                <div className="flex w-36 h-10 rounded-lg overflow-hidden border border-gray-300">
                  <button 
                    onClick={decrementQuantity}
                    className="w-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 border-r border-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 text-center focus:outline-none focus:ring-0 border-0"
                    min="1"
                    max={product?.stock || 10}
                  />
                  <button 
                    onClick={incrementQuantity}
                    className="w-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 border-l border-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                {cartMessage && (
                  <div className={`mb-3 px-4 py-2 rounded ${cartMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cartMessage.text}
                  </div>
                )}
                <button 
                  onClick={handleAddToCart}
                  disabled={!product || product.stock === 0 || addingToCart}
                  className="px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors flex-1 flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Wishlist
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8">
            <div className="px-6 pt-4 pb-0">
              <div className="flex overflow-x-auto -mb-px space-x-8">
                <button 
                  className={`pb-4 font-medium text-sm whitespace-nowrap border-b-2 px-1 ${
                    activeTab === 'description' 
                      ? 'border-amber-500 text-amber-500' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button 
                  className={`pb-4 font-medium text-sm whitespace-nowrap border-b-2 px-1 ${
                    activeTab === 'specifications' 
                      ? 'border-amber-500 text-amber-500' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('specifications')}
                >
                  Details & Specs
                </button>
                <button 
                  className={`pb-4 font-medium text-sm whitespace-nowrap border-b-2 px-1 ${
                    activeTab === 'reviews' 
                      ? 'border-amber-500 text-amber-500' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Customer Reviews
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {product?.description || 'No description available for this product.'}
                  </p>
                  {(!product?.description || product?.description === "") && (
                    <div className="mt-4 p-4 bg-amber-50 text-amber-800 rounded-md flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>
                        This product doesn't have a detailed description yet. Our team is working on updating this information. Please check back later.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Specifications</h3>
                    <div className="overflow-hidden border border-gray-200 rounded-md">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="divide-y divide-gray-200">
                          <tr className="bg-white">
                            <td className="px-6 py-3 text-sm font-medium text-gray-900 w-1/3">Product ID</td>
                            <td className="px-6 py-3 text-sm text-gray-500">{product?._id}</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-6 py-3 text-sm font-medium text-gray-900">Price</td>
                            <td className="px-6 py-3 text-sm text-gray-500">₹{product?.price}</td>
                          </tr>
                          {product?.discount > 0 && (
                            <tr className="bg-white">
                              <td className="px-6 py-3 text-sm font-medium text-gray-900">Discount</td>
                              <td className="px-6 py-3 text-sm text-gray-500">{product?.discount}%</td>
                            </tr>
                          )}
                          <tr className={`${product?.discount > 0 ? 'bg-gray-50' : 'bg-white'}`}>
                            <td className="px-6 py-3 text-sm font-medium text-gray-900">Stock</td>
                            <td className="px-6 py-3 text-sm text-gray-500">{product?.stock || 0} units</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-6 py-3 text-sm font-medium text-gray-900">Date Added</td>
                            <td className="px-6 py-3 text-sm text-gray-500">
                              {product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {product?.tags && product?.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-1">No Reviews Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Be the first to share your experience with this product and help other shoppers make informed decisions.
                  </p>
                  <button className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors font-medium">
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Product;