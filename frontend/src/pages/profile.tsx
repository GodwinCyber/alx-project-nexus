import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-16">
        <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Please Login</h2>
        <p className="text-muted-foreground mb-4">
          You need to be logged in to view your profile.
        </p>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Account Information</span>
          </CardTitle>
          <CardDescription>
            Your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Username</span>
              </label>
              <p className="text-muted-foreground">{user.username}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </label>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your account and orders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/orders">
              <Button variant="outline" className="w-full">
                View Orders
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" className="w-full">
                View Cart
              </Button>
            </Link>
          </div>
          
          <div className="pt-4 border-t">
            <Button variant="destructive" onClick={logout} className="w-full">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
