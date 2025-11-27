import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GET_CART_ITEMS } from '@/graphql/cart';
import { CREATE_ORDER } from '@/graphql/orders';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cartData, loading: cartLoading } = useQuery(GET_CART_ITEMS, {
    skip: !user,
  });

  const [createOrder] = useMutation(CREATE_ORDER, {
    onCompleted: (data: any) => {
      if (data.createOrder.ok) {
        toast.success('Order placed successfully!');
        navigate('/orders');
      }
    },
    onError: (error: any) => {
      console.error('Error creating order:', error);
      toast.error('Failed to place order');
      setIsProcessing(false);
    },
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const cartItems = (cartData as any)?.cartItems?.edges || [];
  
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const total = cartItems.reduce((sum: number, edge: any) => {
    return sum + (parseFloat(edge.node.product.price) * edge.node.quantity);
  }, 0);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      await createOrder({
        variables: {
          status: 'created',
        },
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((edge: any) => {
                const item = edge.node;
                const product = item.product;
                
                return (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatPrice(parseFloat(product.price) * item.quantity)}
                    </p>
                  </div>
                );
              })}
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This is a demo checkout. In a real application, you would integrate
                with a payment processor like Stripe.
              </p>
              
              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
