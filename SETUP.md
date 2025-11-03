# Urban Threads - Setup Guide

This project consists of a NestJS backend and a React frontend integrated together.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection string and JWT secret:
   ```
   MONGO_URI=mongodb://localhost:27017/urban-threads
   JWT_SECRET=your-secret-key-change-this-in-production
   ```

5. Start the backend server:
   ```bash
   npm run start:dev
   ```

   The backend API will be available at `http://localhost:3000`

6. Create an admin user (optional):
   ```bash
   npm run create-admin
   ```

   This will create an admin user with default credentials:
   - Email: `admin@urbanthreads.com`
   - Password: `admin123`

   You can customize the admin credentials by setting environment variables:
   ```bash
   ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword ADMIN_NAME="Your Name" npm run create-admin
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The `.env` file is already created with:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/admin/login` - Admin login (requires admin privileges)
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)

### Products
- `GET /api/products` - Get all products (supports query params: category, sort, page, limit)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search?q=query` - Search products

### Cart (requires authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders (requires authentication)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order by ID

## Features Integrated

### Frontend Features:
- User authentication with JWT tokens
- Admin dashboard with secure login
- Product browsing with filtering and sorting
- Product search functionality
- Shopping cart management (local + backend sync when authenticated)
- Order creation and history
- Responsive design with dark mode support

### Backend Features:
- RESTful API with NestJS
- MongoDB database integration
- JWT authentication with admin role support
- Protected routes with guards (JWT and Admin guards)
- Input validation
- CORS enabled for frontend communication

## Authentication Flow

### User Authentication
1. User registers or logs in via `/account` page
2. JWT token is stored in localStorage
3. Token is automatically included in API requests via Authorization header
4. Protected routes (cart, orders) require valid authentication
5. User can logout to clear the token

### Admin Authentication
1. Admin logs in via `/admin/login` page
2. Admin credentials are verified and `isAdmin` flag is checked
3. JWT token with admin privileges is stored in localStorage
4. Admin can access the dashboard at `/admin/dashboard`
5. Dashboard displays store statistics, recent orders, and other admin features
6. Admin can logout to clear the token and end the session

## Development Tips

- Backend runs on port 3000
- Frontend runs on port 8080
- CORS is configured to allow requests from frontend
- Hot reload is enabled for both frontend and backend
- Check browser console and backend logs for debugging

## Production Deployment

For production:
1. Set secure JWT_SECRET in backend
2. Update VITE_API_URL to production API URL
3. Build frontend: `npm run build`
4. Build backend: `npm run build`
5. Use environment variables for sensitive data
6. Deploy backend and frontend to separate services

## Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check .env file has correct MONGO_URI
- Run `npm install` to ensure all dependencies are installed

### Frontend can't connect to backend
- Verify backend is running on port 3000
- Check VITE_API_URL in frontend/.env
- Check browser console for CORS errors

### Authentication issues
- Clear localStorage and try logging in again
- Check JWT_SECRET is set in backend .env
- Verify token is being sent in Authorization header
