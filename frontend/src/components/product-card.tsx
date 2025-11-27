import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Star } from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import { ADD_TO_CART } from '@/graphql/cart';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  amountInStock: number;
  images?: {
    edges: Array<{
      node: {
        id: string;
        image: string;
      };
    }>;
  };
  rating?: {
    edges: Array<{
      node: {
        rating: number;
      };
    }>;
  };
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART);

  const firstImage = product.images?.edges?.[0]?.node?.image;
  const averageRating = product.rating?.edges?.length
    ? product.rating.edges.reduce((sum, edge) => sum + edge.node.rating, 0) / product.rating.edges.length
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart({
        variables: {
          input: {
            productId: parseInt(product.id),
            quantity: 1,
          },
        },
      });
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-200">
        <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {averageRating > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {product.amountInStock > 0 ? (
              <span className="text-green-600">In Stock ({product.amountInStock})</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.amountInStock === 0 || addingToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
