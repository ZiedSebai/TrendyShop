import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { productsService } from "@/services/products.service";
import { Product } from "@/types/product";
import { toast } from "sonner";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await productsService.search(query);
        setSearchResults(response.results || []);
      } catch (error) {
        toast.error("Search failed");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container max-w-8xl mx-auto px-4 md:px-6">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Search Results
              </h1>
              {query && (
                <p className="text-lg text-muted-foreground">
                  Showing {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <p className="text-lg text-muted-foreground">
                  {query ? `No products found for "${query}"` : "Enter a search term to find products"}
                </p>
                <Link to="/shop">
                  <Button size="lg">Browse All Products</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
