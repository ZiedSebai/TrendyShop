# Stripe Checkout Setup Guide

## Quick Start

### 1. Install Dependencies (Already Done)
```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Get Your Stripe Keys

1. Go to https://stripe.com and sign up or log in
2. Navigate to **Developers** → **API Keys**
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - click "Reveal test key"

### 3. Configure Environment Variables

#### Backend
Edit `backend/.env`:
```bash
MONGO_URI=mongodb://localhost:27017/urban-threads
JWT_SECRET=your-secret-key-change-this-in-production
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
```

#### Frontend
Edit `frontend/.env`:
```bash
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
```

### 4. Start the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### 5. Test the Checkout Flow

1. Navigate to http://localhost:8080
2. Browse products and add items to cart
3. Go to cart and click "Proceed to Checkout"
4. You'll be prompted to login if not authenticated
5. Fill in shipping information
6. Use a test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
7. Click "Pay" and see the success page

## Stripe Test Cards

### Successful Payments
- `4242 4242 4242 4242` - Visa
- `5555 5555 5555 4444` - Mastercard
- `3782 822463 10005` - American Express

### Failed Payments
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds

### 3D Secure Authentication
- `4000 0025 0000 3155` - Requires authentication

Always use:
- Any future expiry date
- Any 3-digit CVC (4 for Amex)
- Any postal code

## Features Implemented

### Checkout Page (`/checkout`)
- Shipping address form
- Stripe payment element (secure card input)
- Real-time order summary
- Loading states
- Error handling
- Authentication check
- Cart validation

### Order Success Page (`/order-success`)
- Payment confirmation
- Order details
- Payment status verification
- Links to continue shopping

### Integration
- Connects to backend checkout API
- Creates Stripe payment intents
- Processes payments securely
- Creates orders in database
- Clears cart after success

## Security

- All card data is handled by Stripe (never touches your server)
- PCI compliance managed by Stripe
- Secure payment processing
- Authentication required
- JWT token validation

## Troubleshooting

### "Failed to initialize payment"
- Check that `STRIPE_SECRET_KEY` is set in backend `.env`
- Ensure backend is running on port 3000
- Check backend console for errors

### "Please login to checkout"
- User must be authenticated
- Click "Account" in header to login/register

### "Payment failed"
- Try using test card `4242 4242 4242 4242`
- Check Stripe dashboard for payment attempts
- Verify Stripe keys are correct

### Build errors
- Run `npm run build` to check for TypeScript errors
- All files should compile successfully

## Production Deployment

Before going live:

1. Get production Stripe keys (start with `pk_live_` and `sk_live_`)
2. Update environment variables with production keys
3. Enable webhooks for payment confirmation
4. Set up proper error logging
5. Configure email notifications
6. Test thoroughly with real cards in test mode first

## Support

For Stripe-specific issues:
- Stripe Documentation: https://stripe.com/docs
- Stripe Dashboard: https://dashboard.stripe.com
- Test Mode: Use test keys to avoid real charges

For implementation issues:
- Check backend logs: `cd backend && npm run start:dev`
- Check browser console for frontend errors
- Verify all environment variables are set
