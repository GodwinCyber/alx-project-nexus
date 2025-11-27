import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GET_PRODUCT_BY_ID } from '@/graphql/products';
import { ADD_TO_CART } from '@/graphql/cart';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: parseInt(id!) },
    skip: !id,
  });

  const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART);

  const product = (data as any)?.productById;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart({
        variables: {
          input: {
            productId: parseInt(id!),
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

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted animate-pulse rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
            <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Product not found or failed to load.</p>
      </div>
    );
  }

  const firstImage = product.images?.edges?.[0]?.node?.image;
  const averageRating = product.rating?.edges?.length
    ? product.rating.edges.reduce((sum: number, edge: any) => sum + edge.node.rating, 0) / product.rating.edges.length
    : 0;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-2">{product.description}</p>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>
            {averageRating > 0 && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({averageRating.toFixed(1)}) • {product.rating.edges.length} reviews
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Category</p>
            <p className="text-muted-foreground">
              {product.category.name}
              {product.subCategory && ` > ${product.subCategory.name}`}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Availability</p>
            <p className={product.amountInStock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.amountInStock > 0
                ? `In Stock (${product.amountInStock} available)`
                : 'Out of Stock'
              }
            </p>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.amountInStock === 0 || addingToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      {product.rating?.edges?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.rating.edges.map((edge: any) => (
              <div key={edge.node.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{edge.node.ratingFrom.username}</span>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < edge.node.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(edge.node.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {edge.node.comment && (
                  <p className="text-muted-foreground">{edge.node.comment}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      {product.comments?.edges?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.comments.edges.map((edge: any) => (
              <div key={edge.node.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{edge.node.commentFrom.username}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(edge.node.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground">{edge.node.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
