import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GET_ORDERS } from '@/graphql/orders';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function OrdersPage() {
  const { user } = useAuth();

  const { data, loading, error } = useQuery(GET_ORDERS, {
    variables: { first: 20 },
    skip: !user,
  });

  if (!user) {
    return (
      <div className="text-center py-16">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Please Login</h2>
        <p className="text-muted-foreground mb-4">
          You need to be logged in to view your orders.
        </p>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load orders. Please try again later.</p>
      </div>
    );
  }

  const orders = (data as any)?.orders?.edges || [];

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
        <p className="text-muted-foreground mb-4">
          You haven't placed any orders yet. Start shopping to see your orders here.
        </p>
        <Link to="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'created':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Orders</h1>

      <div className="space-y-4">
        {orders.map((edge: any) => {
          const order = edge.node;
          const orderTotal = order.items?.edges?.reduce((sum: number, itemEdge: any) => {
            return sum + (parseFloat(itemEdge.node.product.price) * itemEdge.node.quantity);
          }, 0) || 0;

          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-lg font-semibold mt-1">
                      {formatPrice(orderTotal)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items?.edges?.map((itemEdge: any) => {
                    const item = itemEdge.node;
                    const product = item.product;
                    const firstImage = product.images?.edges?.[0]?.node?.image;

                    return (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 overflow-hidden rounded bg-muted">
                          {firstImage ? (
                            <img
                              src={firstImage}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/products/${product.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × {formatPrice(product.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(parseFloat(product.price) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {order.payments?.edges?.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Payment Information</h4>
                    {order.payments.edges.map((paymentEdge: any) => {
                      const payment = paymentEdge.node;
                      return (
                        <div key={payment.id} className="text-sm text-muted-foreground">
                          <p>
                            Payment Status: 
                            <span className={`ml-1 ${
                              payment.status === 'successful' ? 'text-green-600' : 
                              payment.status === 'pending' ? 'text-yellow-600' : 
                              'text-red-600'
                            }`}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </p>
                          <p>Amount: {formatPrice(payment.amount)} {payment.currency.toUpperCase()}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
