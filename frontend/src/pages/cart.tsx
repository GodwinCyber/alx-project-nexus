import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GET_CART_ITEMS, UPDATE_CART_ITEM, REMOVE_CART_ITEM } from '@/graphql/cart';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

export function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(GET_CART_ITEMS, {
    skip: !user,
  });

  const [updateCartItem] = useMutation(UPDATE_CART_ITEM, {
    onCompleted: () => {
      refetch();
    },
    onError: (error: any) => {
      console.error('Error updating cart item:', error);
      toast.error('Failed to update cart item');
    },
  });

  const [removeCartItem] = useMutation(REMOVE_CART_ITEM, {
    onCompleted: () => {
      refetch();
      toast.success('Item removed from cart');
    },
    onError: (error: any) => {
      console.error('Error removing cart item:', error);
      toast.error('Failed to remove cart item');
    },
  });

  if (!user) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Please Login</h2>
        <p className="text-muted-foreground mb-4">
          You need to be logged in to view your cart.
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
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-muted rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </div>
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
        <p className="text-destructive">Failed to load cart. Please try again later.</p>
      </div>
    );
  }

  const cartItems = (data as any)?.cartItems?.edges || [];
  const total = cartItems.reduce((sum: number, edge: any) => {
    return sum + (parseFloat(edge.node.product.price) * edge.node.quantity);
  }, 0);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    await updateCartItem({
      variables: {
        id: parseInt(itemId),
        quantity: newQuantity,
      },
    });
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeCartItem({
      variables: {
        id: parseInt(itemId),
      },
    });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link to="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((edge: any) => {
            const item = edge.node;
            const product = item.product;
            const firstImage = product.images?.edges?.[0]?.node?.image;

            return (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 overflow-hidden rounded bg-muted">
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
                        className="font-semibold hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="text-muted-foreground">
                        {formatPrice(product.price)} each
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product.amountInStock}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= product.amountInStock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(parseFloat(product.price) * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
