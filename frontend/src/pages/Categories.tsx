import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { productsService } from "@/services/products.service";
import { toast } from "sonner";

interface CategoryInfo {
  name: string;
  slug: string;
  count: number;
  description: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await productsService.getAll();
        const products = response.products || [];

        const categoryMap = new Map<string, number>();
        products.forEach((product) => {
          if (product.category) {
            categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1);
          }
        });

        const categoryDescriptions: Record<string, string> = {
          "Outerwear": "Premium coats, blazers, and jackets for every season",
          "Tops": "Essential shirts, blouses, and tops for your wardrobe",
          "Bottoms": "Tailored trousers, jeans, and skirts",
          "Knitwear": "Luxurious sweaters and cardigans",
          "Dresses": "Elegant dresses for any occasion",
          "Accessories": "Complete your look with curated accessories",
        };

        const categoriesData: CategoryInfo[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          count,
          description: categoryDescriptions[name] || `Explore our ${name.toLowerCase()} collection`,
        }));

        setCategories(categoriesData);
      } catch (error) {
        toast.error("Failed to load categories");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container max-w-8xl mx-auto px-4 md:px-6">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Shop by Category
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Explore our curated collections organized by category. Each piece is carefully selected
                  for its timeless design and superior quality.
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading categories...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/shop?category=${encodeURIComponent(category.name)}`}
                      className="group"
                    >
                      <div className="border rounded-lg p-6 hover:shadow-lg transition-all hover:-translate-y-1 space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {category.count} {category.count === 1 ? "product" : "products"}
                          </p>
                        </div>
                        <p className="text-muted-foreground">{category.description}</p>
                        <div className="flex items-center text-sm font-medium text-primary">
                          Browse {category.name}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!isLoading && categories.length === 0 && (
                <div className="text-center py-12 space-y-4">
                  <p className="text-lg text-muted-foreground">No categories available yet.</p>
                  <Link to="/shop">
                    <Button size="lg">Browse All Products</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-secondary">
          <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-muted-foreground">
              Browse our complete collection or search for specific items.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" className="w-full sm:w-auto">
                  View All Products
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

export default Categories;
