import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GET_ALL_PRODUCTS } from '@/graphql/products';
import { ProductCard } from '@/components/product-card';
import { ArrowRight, ShoppingBag, Star, Users } from 'lucide-react';

export function HomePage() {
  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS, {
    variables: { first: 8 }
  });

  const featuredProducts = (data as any)?.allProducts?.edges?.slice(0, 4) || [];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Welcome to Our Store
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover amazing products at great prices. Shop from our curated collection
          of high-quality items.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products">
            <Button size="lg" className="w-full sm:w-auto">
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader className="text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Easy Shopping</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Browse and shop from thousands of products with our intuitive interface.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Star className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Quality Products</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              All products are carefully selected and reviewed by our team.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Users className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Customer Support</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              24/7 customer support to help you with any questions or issues.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Featured Products */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground">
            Check out some of our most popular items
          </p>
        </div>

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-t-lg" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center text-destructive">
            Failed to load products. Please try again later.
          </div>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((edge: any) => (
              <ProductCard key={edge.node.id} product={edge.node} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link to="/products">
            <Button variant="outline" size="lg">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
