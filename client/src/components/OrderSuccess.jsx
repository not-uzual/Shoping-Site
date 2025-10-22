import { useNavigate, Link } from 'react-router-dom';

function OrderSuccess({ orderId, totalAmount }) {
  const navigate = useNavigate();
  
  const displayOrderId = orderId ? 
    (orderId.length > 8 ? orderId.substring(0, 8) + '...' : orderId) 
    : 'N/A';

  return (
    <div className="fixed inset-0 bg-amber-500 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
          <p className="text-gray-600">
            Thank you for your order. Your order has been placed successfully.
          </p>
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 mt-3 text-sm">
            <div className="flex">
              <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Order confirmation</p>
                <p className="mt-1">We've sent an order confirmation email to your registered email address.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-md p-4 mb-6">
            <p className="text-sm text-gray-500">Order ID: <span className="font-medium text-amber-600">{displayOrderId}</span></p>
            {totalAmount && (
              <p className="text-sm text-gray-500 mt-1">
                Total Amount: <span className="font-medium text-amber-600">${typeof totalAmount === 'number' ? totalAmount.toFixed(2) : totalAmount}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 text-white font-medium rounded-md hover:bg-amber-600 transition-colors"
            >
              Back to Home
            </button>
            <Link
              to="/orders"
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors text-center"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;