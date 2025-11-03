import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productsService } from "@/services/products.service";
import { Product } from "@/types/product";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsService.getAll({ limit: 4 });
        setFeaturedProducts(response.products || []);
      } catch (error) {
        console.error("Failed to load featured products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Urban Threads Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40" />
          </div>

          <div className="relative h-full container max-w-8xl mx-auto px-4 md:px-6 flex items-center">
            <div className="max-w-xl space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Discover Your Style
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Curated pieces for the modern wardrobe. Timeless design meets contemporary comfort.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    View Categories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container max-w-8xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Featured Collection
                </h2>
                <p className="text-muted-foreground">
                  Handpicked pieces for this season
                </p>
              </div>
              <Link to="/shop">
                <Button variant="ghost">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-secondary">
          <div className="container max-w-8xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Thoughtfully Crafted
              </h2>
              <p className="text-lg text-muted-foreground">
                At Urban Threads, we believe in quality over quantity. Each piece is carefully selected
                for its timeless design, superior craftsmanship, and sustainable materials. Our mission
                is to help you build a wardrobe that lasts.
              </p>
              <Link to="/about">
                <Button variant="default" size="lg">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
