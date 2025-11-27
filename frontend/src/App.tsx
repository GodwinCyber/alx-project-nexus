import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { AuthProvider } from '@/contexts/auth-context';
import { apolloClient } from '@/lib/apollo-client';
import { Navbar } from '@/components/navbar';
import { HomePage } from '@/pages/home';
import { ProductsPage } from '@/pages/products';
import { ProductDetailPage } from '@/pages/product-detail';
import { CartPage } from '@/pages/cart';
import { CheckoutPage } from '@/pages/checkout';
import { OrdersPage } from '@/pages/orders';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { ProfilePage } from '@/pages/profile';
import { AdminPage } from '@/pages/admin';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;