import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../APICalls/authCalls';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setSignupError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() && !formData.email.trim() && !formData.password) {
      alert("All fields are required.");
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert('Email is invalid');
    }
    
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
    }
    
    setIsLoading(true);
    
    try {
      const data = await signUp(formData);
      
      console.log('Signup successful', data);
      
      navigate('/login');
      
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError(error.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-amber-500">Create Account</h1>
            <p className="text-neutral-600 mt-2">Sign up for your CashKart account</p>
          </div>
          
          {signupError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
              {signupError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-[5px] text-neutral-700 focus:outline-none focus:ring-2`}
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
            
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
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-[5px] text-neutral-700 focus:outline-none focus:ring-2`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Password must be at least 6 characters
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-neutral-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-500 hover:text-black font-medium transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;