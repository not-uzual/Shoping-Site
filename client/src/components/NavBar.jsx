import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useLogoutUser } from "../hooks/useLogoutUser";

function NavBar({ userData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logoutUser, loading }  = useLogoutUser()
  
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  async function handleLogout() {
    try {
      await logoutUser()
            
      setMobileOpen(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white shadow-sm">
      <nav className="mx-auto flex justify-between items-center px-4 py-3 md:px-6 max-w-7xl w-full">

        <Link to="/" className="text-xl font-bold text-amber-500 hover:text-amber-600 transition-colors">
          CashKart
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          {userData ? (
            <>
              <Link to="/orders" className="text-gray-600 hover:text-amber-500">Orders</Link>
              <Link to="/cart" className="text-gray-600 hover:text-amber-500">Cart</Link>
              <Link to="/profile" className="text-gray-600 hover:text-amber-500">Profile</Link>
              <button 
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-amber-500">Login</Link>
              <Link 
                to="/signup"
                className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
              >
                {loading ? 'Logging out...' : 'Logout'}
              </Link>
            </>
          )}
        </div>
        
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 z-[100]"
        >
          {mobileOpen ? (
            <img 
              src="https://cdn-icons-png.flaticon.com/128/2723/2723639.png" 
              alt="Close menu" 
              className="w-7 h-7"
            />
          ) : (
            <img 
              src="https://cdn-icons-png.flaticon.com/128/4254/4254068.png" 
              alt="Open menu" 
              className="w-6 h-6"
            />
          )}
        </button>
      </nav>
      
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-90 bg-white md:hidden pt-16">
          <div className="p-5 flex flex-col space-y-6">
            {userData ? (
              <>
                <Link 
                  to="/orders" 
                  className="text-lg py-2 border-b border-gray-200" 
                  onClick={() => setMobileOpen(false)}
                >
                  Orders
                </Link>
                <Link 
                  to="/cart" 
                  className="text-lg py-2 border-b border-gray-200"
                  onClick={() => setMobileOpen(false)}
                >
                  Cart
                </Link>
                <Link 
                  to="/profile" 
                  className="text-lg py-2 border-b border-gray-200"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  disabled={loading}
                  className="mt-4 w-full py-3 bg-amber-500 text-white rounded text-lg hover:bg-amber-600 transition-colors"
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-lg py-2 border-b border-gray-200"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="mt-4 w-full py-3 bg-amber-500 text-white rounded text-lg text-center hover:bg-amber-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;