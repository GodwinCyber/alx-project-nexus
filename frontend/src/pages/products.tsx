import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GET_ALL_PRODUCTS, GET_CATEGORIES, SEARCH_PRODUCTS } from '@/graphql/products';
import { ProductCard } from '@/components/product-card';
import { Search, Filter } from 'lucide-react';

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Get all products by default
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery(GET_ALL_PRODUCTS, {
    variables: { first: 50 }
  });

  // Get categories for filtering
  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  // Search products when filters are applied
  const { data: searchData, loading: searchLoading } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      filter: {
        name: searchTerm || undefined,
        category: selectedCategory ? parseInt(selectedCategory) : undefined,
        price__gte: priceRange.min ? parseFloat(priceRange.min) : undefined,
        price__lte: priceRange.max ? parseFloat(priceRange.max) : undefined,
      }
    },
    skip: !searchTerm && !selectedCategory && !priceRange.min && !priceRange.max
  });

  const products = (searchData as any)?.products || (productsData as any)?.allProducts?.edges?.map((edge: any) => ({ node: edge.node })) || [];
  const categories = (categoriesData as any)?.allCategories?.edges || [];
  const loading = productsLoading || searchLoading;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled automatically by the query
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground mt-2 md:mt-0">
          {products.length} products found
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">All Categories</option>
                  {categories.map((edge: any) => (
                    <option key={edge.node.id} value={edge.node.id}>
                      {edge.node.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Min Price</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Price</label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
              <Button type="button" variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
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

      {productsError && (
        <div className="text-center text-destructive py-8">
          Failed to load products. Please try again later.
        </div>
      )}

      {!loading && !productsError && products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}

      {!loading && !productsError && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.node?.id || product.id} product={product.node || product} />
          ))}
        </div>
      )}
    </div>
  );
}
