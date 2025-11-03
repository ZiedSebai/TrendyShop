# Cloudinary Setup for Admin Product Management

The admin panel now includes product management with image upload functionality using Cloudinary.

## Backend Setup

1. **Install Dependencies** (Already done):
   ```bash
   cd backend
   npm install cloudinary multer
   npm install --save-dev @types/multer
   ```

2. **Configure Environment Variables**:

   Create or update `backend/.env` file with your Cloudinary credentials:
   ```
   MONGO_URI=mongodb://localhost:27017/urban-threads
   JWT_SECRET=your-secret-key-change-this-in-production

   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Get Cloudinary Credentials**:
   - Sign up for a free account at [Cloudinary](https://cloudinary.com/)
   - Go to your Dashboard
   - Copy the Cloud Name, API Key, and API Secret
   - Add them to your `.env` file

## Admin Panel Features

### Sidebar Navigation
The admin panel now includes a sidebar with the following sections:
- **Home** (`/admin/dashboard`) - Dashboard with statistics and recent orders
- **Products** (`/admin/products`) - Full product management (working)
- **Orders** (`/admin/orders`) - Coming soon
- **Users** (`/admin/users`) - Coming soon

### Product Management (`/admin/products`)

Features:
- **View all products** with search functionality
- **Add new products** with:
  - Product name, price, description
  - Category
  - Multiple sizes (comma-separated)
  - Multiple colors (comma-separated)
  - Stock status
  - Upload up to 5 images (stored in Cloudinary)
- **Edit products** - Update product details and optionally replace images
- **Delete products** - Remove products from the catalog

### API Endpoints (Admin Only)

All admin endpoints require JWT authentication with admin privileges:

- `GET /api/admin/products` - Get all products with pagination and search
- `GET /api/admin/products/:id` - Get single product
- `POST /api/admin/products` - Create new product (multipart/form-data)
- `PUT /api/admin/products/:id` - Update product (multipart/form-data)
- `DELETE /api/admin/products/:id` - Delete product

## Usage

1. **Login as Admin**:
   - Navigate to `/admin/login`
   - Use your admin credentials (created with `npm run create-admin`)

2. **Access Product Management**:
   - Click on "Products" in the sidebar
   - Or navigate to `/admin/products`

3. **Add a Product**:
   - Click "Add Product" button
   - Fill in the form:
     - Name: Product name
     - Price: Numeric value
     - Category: Product category
     - Description: Product details
     - Sizes: Comma-separated (e.g., "XS, S, M, L, XL")
     - Colors: Comma-separated (e.g., "Black, White, Blue")
     - Stock Status: In Stock or Out of Stock
     - Images: Select up to 5 images
   - Click "Create Product"

4. **Edit a Product**:
   - Click the edit icon next to a product
   - Update the desired fields
   - Optionally upload new images (will replace existing ones)
   - Click "Update Product"

5. **Delete a Product**:
   - Click the trash icon next to a product
   - Confirm the deletion

## Image Upload Details

- Images are uploaded to Cloudinary with the folder name "urban-threads"
- Maximum 5 images per product
- Accepted formats: All image formats supported by Cloudinary
- Images are stored securely with HTTPS URLs
- When editing, leaving the image field empty keeps existing images

## Security

- All admin routes are protected with `JwtAuthGuard` and `AdminGuard`
- Only users with `isAdmin: true` can access admin endpoints
- Image uploads are validated server-side
- All data is sanitized before database operations

## Troubleshooting

**Images not uploading:**
- Verify Cloudinary credentials in `.env`
- Check that the credentials are correct (no extra spaces)
- Ensure MongoDB is running
- Check backend logs for detailed error messages

**Cannot access admin panel:**
- Ensure you have an admin user (run `npm run create-admin`)
- Verify you're logged in with admin credentials
- Check browser console for authentication errors

**Product creation fails:**
- Ensure all required fields are filled
- Check that prices are numeric values
- Verify image file sizes are reasonable
- Check backend logs for validation errors
