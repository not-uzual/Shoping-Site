import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useLogoutUser } from '../hooks/useLogoutUser';
import AddressForm from '../components/AddressForm';
import { getWishlist } from '../APICalls/productCalls';
import ProductCard from '../components/ProductCard';

function Profile() {
  const { userData } = useSelector(state => state.user);
  
  const { logoutUser, loading: logoutLoading } = useLogoutUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  // Fetch wishlist items when the wishlist tab is selected
  useEffect(() => {
    if (activeTab === 'wishlist' && userData) {
      fetchWishlistItems();
    }
  }, [activeTab, userData]);
  
  const fetchWishlistItems = async () => {
    if (!userData) return;
    
    try {
      setWishlistLoading(true);
      setWishlistError(null);
      const data = await getWishlist();
      setWishlistItems(data.wishlist || []);
      console.log(data.wishlist);
      
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistError(error.message || 'Failed to fetch wishlist items');
    } finally {
      setWishlistLoading(false);
    }
  };
  
  const handleWishlistChange = (productId, isAdded) => {
    if (!isAdded) {
      // Remove item from wishlist UI immediately
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
    } else {
      // If somehow an item was added, refresh the list
      fetchWishlistItems();
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <section className="relative h-[200px] md:h-[250px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600">
          <div className="absolute inset-0 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path fill="currentColor" d="M0,0 L100,0 L100,100 L0,100 Z" />
              <circle cx="20" cy="20" r="25" fill="currentColor" />
              <circle cx="80" cy="80" r="25" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      <section className="container mx-auto px-4 -mt-16 z-10">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* User Info Section */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* User Avatar */}
            <div className="rounded-full bg-amber-100 h-24 w-24 md:h-32 md:w-32 flex items-center justify-center shadow-md border-2 border-white">
              <span className="text-3xl md:text-5xl font-bold text-amber-500">
                {userData.name ? userData.name.charAt(0).toUpperCase() : '?'}
              </span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{userData.name}</h1>
              <p className="text-gray-500 mt-1">{userData.email}</p>
              <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                <button 
                  onClick={handleLogout}
                  disabled={logoutLoading} 
                  className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors disabled:opacity-70"
                >
                  {logoutLoading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto">
              <button 
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'profile' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Information
              </button>
              <button 
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'wishlist' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('wishlist')}
              >
                Wishlist
              </button>
              <button 
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'settings' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'wishlist' && (
              <div>
                <h3 className="font-medium text-gray-900 mb-4">My Wishlist</h3>
                
                {wishlistLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                  </div>
                ) : wishlistError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{wishlistError}</p>
                    <button 
                      onClick={fetchWishlistItems}
                      className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : wishlistItems.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Your Wishlist is Empty</h3>
                        <p className="text-gray-500 mb-4">Save items you love to your wishlist.</p>
                        <button className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors">
                          Continue Shopping
                        </button>
                      </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistItems.map(product => (
                      <ProductCard 
                        key={product._id} 
                        product={product} 
                        inWishlist={true}
                        onWishlistChange={handleWishlistChange}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900">Account Information</h3>
                  <div className="mt-4 bg-gray-50 rounded-md p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{userData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Shipping Addresses</h3>
                  
                  <div className="mt-4">
                    { userData.addresses.length > 0 ? (
                      <div className="space-y-4">
                        <div className='space-y-4 flex gap-2.5'>
                          { userData.addresses.map((address, index) => (
                          <div key={index} className="h-36 bg-amber-50 rounded-md p-4 border border-amber-500">
                            <div className="flex flex-col">
                                <div className="flex items-center mb-2">
                                  <span className="ml-2 bg-amber-500 text-gray-800 text-xs px-2 py-0.5 rounded-full capitalize">
                                    {address.type}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{address.phone}</p>
                                <p className="text-sm text-gray-600">{address.street}</p>
                                <p className="text-sm text-gray-600">
                                  {address.city}, {address.state} {address.zipCode}
                                </p>
                                <p className="text-sm text-gray-600">{address.country}</p>
                            </div>
                          </div>
                        ))}
                        </div>
                        
                        <button 
                          className=" mt-4 py-2 px-4 border border-dashed border-amber-500 text-amber-500 rounded-md hover:bg-amber-50 transition-colors flex items-center justify-center"
                          onClick={() => setShowAddressForm(true)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Add New Address
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-md p-6 text-center">
                        <p className="text-gray-500">No shipping addresses found.</p>
                        <button 
                          className="mt-3 text-amber-500 font-medium hover:text-amber-600"
                          onClick={() => setShowAddressForm(true)}
                        >
                          + Add New Address
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {showAddressForm && (
                    <AddressForm setShowAddressForm={setShowAddressForm}/>
                  )}
                </div>
              </div>
            )}

            

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900">Password</h3>
                  <div className="mt-4 bg-gray-50 rounded-md p-4">
                    <button className="text-amber-500 font-medium hover:text-amber-600">
                      Change Password
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                  <div className="mt-4 bg-gray-50 rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Order Updates</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-red-600">Danger Zone</h3>
                  <div className="mt-4 bg-gray-50 rounded-md p-4">
                    <button className="text-red-500 font-medium hover:text-red-600">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <div className="h-16"></div>
    </main>
  );
}

export default Profile;