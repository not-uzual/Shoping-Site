import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import useCurrentUser from "./hooks/useCurrentUser.jsx";
import Profile from "./pages/Profile.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Order from "./pages/Order.jsx";
import Footer from "./pages/Footer.jsx";

function App() {

  const { userData } = useSelector(state => state.user) 
    
  useCurrentUser()

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <NavBar userData={ userData }/>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/orders/:id" element={<Order />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/search" element={<div className="p-6">Search results (coming soon)</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
