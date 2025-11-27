# End-to-End Testing Guide

## Prerequisites
1. Make sure Django backend is running: `python manage.py runserver`
2. Make sure React frontend is running: `npm run dev` (in frontend directory)
3. Both should be accessible at:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:5173

## Complete User Flow Test

### Step 1: User Registration
1. Go to http://localhost:5173
2. Click "Register" in the top right
3. Fill in the registration form:
   - Email: test@example.com
   - Username: testuser
   - Password: testpass123
   - Confirm Password: testpass123
4. Click "Register"
5. You should see a success message and be redirected to login

### Step 2: User Login
1. On the login page, enter:
   - Email: test@example.com
   - Password: testpass123
2. Click "Login"
3. You should be logged in and redirected to the homepage
4. The navbar should now show your username and logout option

### Step 3: Create Categories (Admin Panel)
1. Click "Admin" in the navbar (or go to /admin)
2. In the "Create Category" section:
   - Enter category name: "Electronics"
   - Click "Create Category"
3. Create another category: "Clothing"
4. You should see both categories listed below the form with edit/delete buttons

### Step 4: Create Sub-Categories
1. In the "Create Sub-Category" section:
   - Select "Electronics" from the dropdown
   - Enter sub-category name: "Smartphones"
   - Click "Create Sub-Category"
2. Create another sub-category under Electronics: "Laptops"
3. Create sub-categories under Clothing: "T-Shirts", "Jeans"
4. You can edit/delete sub-categories using the buttons next to each item

### Step 5: Create Products
1. In the "Create Product" section:
   - Product name: "iPhone 15"
   - Description: "Latest iPhone with advanced features"
   - Price: 999.99
   - Stock quantity: 10
   - Category: Electronics
   - Sub-Category: Smartphones
   - Click "Create Product"

2. Create more products:
   - "MacBook Pro" (Electronics > Laptops, $1999.99, stock: 5)
   - "Cotton T-Shirt" (Clothing > T-Shirts, $29.99, stock: 20)
   - "Denim Jeans" (Clothing > Jeans, $79.99, stock: 15)

### Step 6: Browse Products
1. Go to "Products" page
2. You should see all created products
3. Test the search functionality
4. Test category filtering
5. Test price range filtering

### Step 7: Add to Cart
1. Click on a product to view details
2. Click "Add to Cart" button
3. You should see a success toast
4. Add multiple products to cart
5. Click the cart icon in navbar to view cart

### Step 8: Manage Cart
1. In the cart page:
   - Update quantities using +/- buttons
   - Remove items using trash icon
   - View total price calculation

### Step 9: Checkout and Place Order
1. Click "Proceed to Checkout" in cart
2. Review your order summary
3. Click "Place Order" (this is a demo checkout)
4. You should see success message and be redirected to orders

### Step 10: View Orders
1. In the orders page, you should see your placed order
2. Check order status and items
3. Verify order total matches cart total

## Troubleshooting

### If login/register doesn't work:
- Check browser console for errors
- Verify Django server is running
- Check CORS settings in Django

### If GraphQL queries fail:
- Test GraphQL endpoint directly: http://localhost:8000/graphql/
- Check Django logs for errors
- Verify all migrations are applied: `python manage.py migrate`

### If products don't show:
- Make sure you created categories first
- Check that products were created successfully
- Verify GraphQL queries in browser network tab

### Common Issues:
1. **CORS errors**: Make sure CORS settings are correct in Django settings
2. **Authentication errors**: Clear localStorage and try logging in again
3. **GraphQL errors**: Check Django console for detailed error messages
4. **Network errors**: Ensure both servers are running on correct ports

## Expected Results
After completing all steps, you should have:
- ✅ User account created and logged in
- ✅ Categories and sub-categories created (with edit/delete functionality)
- ✅ Products created and visible
- ✅ Products added to cart
- ✅ Order placed successfully
- ✅ Order visible in order history

## Additional Admin Features
The admin panel now includes:
- ✅ **Create/Edit/Delete Categories**: Full CRUD operations for categories
- ✅ **Create/Edit/Delete Sub-Categories**: Full CRUD operations for sub-categories  
- ✅ **Create Products**: Create products with categories and sub-categories
- ✅ **Real-time Updates**: All changes reflect immediately in the UI

This demonstrates the complete e-commerce flow from user registration to order completion with full admin management capabilities!
