import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">
              E-Commerce
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/products"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Products
              </Link>
              {user && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/cart">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant="ghost" size="icon">
                    <Package className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {user.username}
                </span>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

