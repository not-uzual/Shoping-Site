import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logIn } from '../APICalls/authCalls';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim() && !formData.password) {
      alert('All fields are required')
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert('Email is invalid');
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
    }
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      const data = await logIn(formData);
      
      console.log('Login successful', data);
      
      navigate('/');

      window.location.reload()
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-amber-500">Welcome Back</h1>
            <p className="text-neutral-600 mt-2">Log in to your CashKart account</p>
          </div>
          
          {loginError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-[5px] text-neutral-700 focus:outline-none focus:ring-2`}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-neutral-700"
                >
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-amber-500 hover:text-black transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-[5px] text-neutral-700 focus:outline-none focus:ring-2`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-neutral-600 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-amber-500 hover:text-black font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;