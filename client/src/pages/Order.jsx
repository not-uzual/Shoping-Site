import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Simulating API call to fetch orders
    setTimeout(() => {
      const sampleOrders = [
        {
          id: 'ORD-12345678',
          date: '2025-10-10',
          status: 'delivered',
          totalAmount: 354.97,
          paymentMethod: 'Credit Card',
          items: [
            {
              id: 1,
              name: 'Wireless Headphones',
              price: 129.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
            },
            {
              id: 2,
              name: 'Premium Cotton T-Shirt',
              price: 24.99,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
            }
          ],
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main Street',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'United States'
          },
          deliveryDate: '2025-10-15'
        },
        {
          id: 'ORD-23456789',
          date: '2025-09-28',
          status: 'shipped',
          totalAmount: 199.99,
          paymentMethod: 'PayPal',
          items: [
            {
              id: 3,
              name: 'Smart Watch',
              price: 199.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
            }
          ],
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main Street',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'United States'
          },
          estimatedDelivery: '2025-10-20'
        },
        {
          id: 'ORD-34567890',
          date: '2025-08-15',
          status: 'processing',
          totalAmount: 89.97,
          paymentMethod: 'Credit Card',
          items: [
            {
              id: 4,
              name: 'Bluetooth Speaker',
              price: 79.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab',
            },
            {
              id: 5,
              name: 'Phone Case',
              price: 9.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1603313011825-57bbf97ff0ed',
            }
          ],
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main Street',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'United States'
          }
        },
        {
          id: 'ORD-45678901',
          date: '2025-07-20',
          status: 'delivered',
          totalAmount: 249.98,
          paymentMethod: 'Credit Card',
          items: [
            {
              id: 6,
              name: 'Running Shoes',
              price: 119.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            },
            {
              id: 7,
              name: 'Fitness Tracker',
              price: 129.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288',
            }
          ],
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main Street',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'United States'
          },
          deliveryDate: '2025-07-27'
        },
        {
          id: 'ORD-56789012',
          date: '2025-06-05',
          status: 'cancelled',
          totalAmount: 59.99,
          paymentMethod: 'Credit Card',
          items: [
            {
              id: 8,
              name: 'Desk Lamp',
              price: 59.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c',
            }
          ],
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main Street',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'United States'
          },
          cancellationReason: 'Changed mind'
        }
      ];
      
      setOrders(sampleOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
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
      
      {/* Tab navigation */}
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
            onClick={() => setActiveTab('shipped')}
            className={`inline-flex items-center py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'shipped' 
                ? 'border-amber-500 text-amber-500' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap`}
          >
            Shipped
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
      
      {/* Orders list */}
      <div className="space-y-6">
        {getFilteredOrders().map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order header */}
            <div className="bg-gray-50 p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-900">Order #{order.id}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Placed on {formatDate(order.date)}</p>
              </div>
              <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row sm:space-x-4 items-start sm:items-center">
                <div className="text-sm font-medium text-gray-700">
                  Total: <span className="text-amber-500">${order.totalAmount.toFixed(2)}</span>
                </div>
                <Link 
                  to={`/orders/${order.id}`} 
                  className="text-amber-500 hover:text-amber-600 text-sm font-medium flex items-center mt-2 sm:mt-0"
                >
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Order items */}
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex space-x-3">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={`${item.image}?w=128&h=128&fit=crop&auto=format`} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <Link to={`/product/${item.id}`} className="text-sm font-medium text-gray-800 hover:text-amber-500">
                        {item.name}
                      </Link>
                      <div className="text-sm text-gray-500">
                        <span>${item.price.toFixed(2)}</span>
                        <span className="mx-1">×</span>
                        <span>{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order footer with delivery info */}
            <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
              {order.status === 'delivered' && (
                <div>Delivered on {formatDate(order.deliveryDate)}</div>
              )}
              {order.status === 'shipped' && (
                <div>Estimated delivery by {formatDate(order.estimatedDelivery)}</div>
              )}
              {order.status === 'processing' && (
                <div>Processing your order</div>
              )}
              {order.status === 'cancelled' && (
                <div>Cancelled: {order.cancellationReason}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Order;
