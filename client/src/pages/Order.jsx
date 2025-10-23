import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders, cancelOrder } from '../APICalls/orderCalls';

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);
  
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const handleCancelOrder = async (orderId) => {

    if (!orderId) return;
    
    try {
      setCancellingOrderId(orderId);
      const response = await cancelOrder(orderId, 'Cancelled by customer');
      
      if (response.success) {
      
        setOrders(prevOrders => prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: 'cancelled' } 
            : order
        ));
      } else {
        setError('Failed to cancel order: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel order. Please try again.');
      console.error('Error cancelling order:', err);
    } finally {
      setCancellingOrderId(null);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
          const response = await getUserOrders();
          if (response.success && response.orders) {
            setOrders(response.orders);
          } else {
            setError('Could not fetch your orders');
          }
        
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.message || 'Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    if (activeTab === 'processing') {
      
      return orders.filter(order => 
        order.orderStatus === 'processing' || 
        order.orderStatus === 'confirmed' || 
        order.orderStatus === 'shipped'
      );
    }
    return orders.filter(order => order.orderStatus === activeTab);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
      case 'confirmed':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh] flex flex-col justify-center items-center">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3900/3900101.png" 
          alt="No Orders" 
          className="w-24 h-24 mb-6 opacity-60"
        />
        <h2 className="text-2xl font-bold text-gray-700 mb-4">No orders yet</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          You haven't placed any orders yet. Start shopping to see your orders here!
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition duration-300"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-amber-500 mb-6">Your Orders</h1>
      
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
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'all' 
                ? 'border-amber-500 text-amber-500' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveTab('processing')}
            className={`inline-flex items-center py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'processing' 
                ? 'border-amber-500 text-amber-500' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap`}
          >
            Processing
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`inline-flex items-center py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'delivered' 
                ? 'border-amber-500 text-amber-500' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap`}
          >
            Delivered
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`inline-flex items-center py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'cancelled' 
                ? 'border-amber-500 text-amber-500' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap`}
          >
            Cancelled
          </button>
        </nav>
      </div>
      
      
      <div className="space-y-6">
        {getFilteredOrders().map(order => (
          <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
        
            <div className="bg-gray-50 p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-900">Order #{order._id.substring(0, 8)}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.orderStatus)}`}>
                    {order.orderStatus === 'confirmed' || order.orderStatus === 'shipped' ? 
                      'Processing' : 
                      order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
                    }
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row sm:space-x-4 items-start sm:items-center">
                <div className="text-sm font-medium text-gray-700">
                  Total: <span className="text-amber-500">${order.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex space-x-4">                  
                  {(order.orderStatus === 'processing' || order.orderStatus === 'confirmed' || order.orderStatus === 'shipped') && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this order?')) {
                          handleCancelOrder(order._id);
                        }
                      }}
                      disabled={cancellingOrderId === order._id}
                      className={`${
                        cancellingOrderId === order._id 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-red-500 hover:text-red-600'
                      } text-sm font-medium flex items-center mt-2 sm:mt-0`}
                    >
                      {cancellingOrderId === order._id ? (
                        <>
                          <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></span>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          Cancel Order
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items.map(item => (
                  <div key={item.product._id || item._id} className="flex space-x-3">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={item.image || (item.product && item.product.image) || 'https://via.placeholder.com/128'} 
                        alt={item.name || (item.product && item.product.name) || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <Link to={`/product/${item.product._id || item._id}`} className="text-sm font-medium text-gray-800 hover:text-amber-500">
                        {item.name || (item.product && item.product.name) || 'Product'}
                      </Link>
                      <div className="text-sm text-gray-500">
                        <span>${item.price?.toFixed(2) || '0.00'}</span>
                        <span className="mx-1">×</span>
                        <span>{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
              {order.orderStatus === 'delivered' && (
                <div>Delivered on {formatDate(order.statusUpdates.find(s => s.status === 'delivered')?.date)}</div>
              )}
              {(order.orderStatus === 'processing' || order.orderStatus === 'confirmed' || order.orderStatus === 'shipped') && (
                <div>
                  {order.orderStatus === 'shipped' ? 
                    `Estimated delivery by ${formatDate(order.deliveryExpected)}` : 
                    'Processing your order'}
                </div>
              )}
              {order.orderStatus === 'cancelled' && (
                <div>Cancelled: {order.cancelReason || 'No reason provided'}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Order;
