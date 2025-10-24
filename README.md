# Cash Kart - Full Stack E-Commerce Platform

Cash Kart is a modern, full-stack e-commerce platform built with the MERN stack, featuring a robust backend API and a responsive React frontend with Redux state management.

## 📌 Live Links

- [Live Website](https://shoping-site-opal.vercel.app)
- [API Endpoint](https://shoping-site-3cui.onrender.com)
- [GitHub Repository](https://github.com/not-uzual/Shoping-Site)

## 🎯 Key Features

### User Features
- **Authentication System**
  - Secure signup and login
  - JWT-based authentication
  - Protected routes for authenticated users
  - Persistent user sessions

- **Shopping Experience**
  - Browse products with detailed information
  - Add/remove items to cart
  - Real-time cart updates
  - Secure checkout process
  - Order history tracking

- **User Profile Management**
  - View and update profile information
  - Track order history
  - Manage shipping addresses

### Technical Features
- **Frontend**
  - Responsive design using Tailwind CSS
  - Redux state management
  - Custom hooks for authentication
  - Protected routing
  - API integration with Axios

- **Backend**
  - RESTful API architecture
  - MongoDB database integration
  - JWT authentication
  - Input validation
  - Error handling middleware

## 🏗️ Project Structure

### Frontend Structure
```
client/
├── src/
│   ├── APICalls/           # API integration layer
│   │   ├── authCalls.js    # Authentication API calls
│   │   ├── cartCalls.js    # Cart management
│   │   ├── orderCalls.js   # Order operations
│   │   ├── productCalls.js # Product fetching
│   │   └── userCalls.js    # User profile management
│   │
│   ├── components/         # Reusable UI components
│   │   ├── NavBar.jsx      # Navigation component
│   │   ├── OrderSuccess.jsx# Order confirmation
│   │   └── ProductCard.jsx # Product display card
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── useCurrentUser.jsx # User authentication
│   │   └── useLogoutUser.jsx  # Logout functionality
│   │
│   ├── pages/             # Main application pages
│   │   ├── Cart.jsx       # Shopping cart
│   │   ├── Checkout.jsx   # Payment process
│   │   ├── Home.jsx       # Landing page
│   │   ├── Login.jsx      # User login
│   │   ├── Order.jsx      # Order management
│   │   ├── Product.jsx    # Product details
│   │   ├── Profile.jsx    # User profile
│   │   └── Signup.jsx     # User registration
│   │
│   └── redux/            # State management
│       ├── store.js      # Redux store configuration
│       └── userSlice.js  # User state management
```

### Backend Structure
```
server/
├── config/
│   ├── db.js           # Database configuration
│   └── genToken.js     # JWT token generation
│
├── controllers/        # Business logic
│   ├── auth.controllers.js  # Authentication
│   ├── cart.controllers.js  # Cart operations
│   ├── order.controllers.js # Order management
│   ├── product.controllers.js # Product operations
│   └── user.controllers.js    # User management
│
├── middlewares/       # Custom middleware
│   ├── isAuth.js     # Authentication check
│   └── validateResponse.js # Response validation
│
├── models/           # Database schemas
│   ├── cart.model.js    # Cart schema
│   ├── order.model.js   # Order schema
│   ├── product.model.js # Product schema
│   └── user.model.js    # User schema
│
└── routes/          # API routes
    ├── auth.routes.js   # Authentication endpoints
    ├── cart.routes.js   # Cart endpoints
    ├── order.routes.js  # Order endpoints
    ├── product.routes.js# Product endpoints
    └── user.routes.js   # User endpoints
```

## 🛠️ Tech Stack

### Frontend
- React.js (v19)
- Redux Toolkit for state management
- React Router DOM for navigation
- Tailwind CSS for styling
- Vite as build tool
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Cookie Parser for session management

## � API Documentation

### Authentication Endpoints
```
POST /api/auth/signup
- Register new user
- Body: { name, email, password }

POST /api/auth/login
- User login
- Body: { email, password }

GET /api/auth/logout
- User logout
- Requires: Authentication
```

### User Endpoints
```
GET /api/user/profile
- Get user profile
- Requires: Authentication

PUT /api/user/profile
- Update user profile
- Requires: Authentication
- Body: { name, email, ... }
```

### Product Endpoints
```
GET /api/products
- Get all products
- Query params: { page, limit, category }

GET /api/products/:id
- Get single product details
```

### Cart Endpoints
```
GET /api/cart
- Get user's cart
- Requires: Authentication

POST /api/cart/add
- Add item to cart
- Requires: Authentication
- Body: { productId, quantity }

PUT /api/cart/update
- Update cart item
- Requires: Authentication
- Body: { productId, quantity }

DELETE /api/cart/remove/:productId
- Remove item from cart
- Requires: Authentication
```

### Order Endpoints
```
POST /api/orders
- Create new order
- Requires: Authentication
- Body: { items, shippingAddress, paymentMethod }

GET /api/orders
- Get user's orders
- Requires: Authentication

GET /api/orders/:id
- Get specific order details
- Requires: Authentication
```

## � Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas URI)
- npm or yarn package manager

### Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   CORS_ORIGIN=http://localhost:5173
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## � Deployment

### Backend Deployment (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy with following settings:
   - Build Command: `npm install`
   - Start Command: `node server.js`

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy with automatic build settings
4. Configure custom domain if needed

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the ISC License.

## 👨‍💻 Author
**Ujjwal Sahu**

## 🔗 Links
- [Live Demo](https://shoping-site-opal.vercel.app)
- [Backend API](https://shoping-site-3cui.onrender.com)
- [GitHub Repository](https://github.com/not-uzual/Shoping-Site)
