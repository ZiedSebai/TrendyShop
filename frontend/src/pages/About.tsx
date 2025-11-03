import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              About Urban Threads
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Curating timeless fashion for the modern urbanite since 2020
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-secondary">
          <div className="container max-w-4xl mx-auto px-4 md:px-6">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Story</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Urban Threads was born from a simple belief: fashion should be timeless, not trendy. 
                  In a world of fast fashion and disposable clothing, we saw a need for something different—pieces 
                  that would last, both in quality and style.
                </p>
                <p>
                  We carefully curate each item in our collection, working with sustainable manufacturers who 
                  share our commitment to quality craftsmanship. Every piece is chosen for its versatility, 
                  durability, and ability to become a staple in your wardrobe for years to come.
                </p>
                <p>
                  Our mission extends beyond selling clothes. We're building a community of conscious consumers 
                  who value quality over quantity, and who understand that true style is about expressing yourself 
                  authentically, not following every passing trend.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl">♻️</span>
                </div>
                <h3 className="text-xl font-semibold">Sustainability</h3>
                <p className="text-muted-foreground">
                  We partner with manufacturers who prioritize sustainable practices and eco-friendly materials.
                </p>
              </div>

              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold">Quality</h3>
                <p className="text-muted-foreground">
                  Every piece is crafted with attention to detail, using premium materials that stand the test of time.
                </p>
              </div>

              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold">Ethics</h3>
                <p className="text-muted-foreground">
                  Fair labor practices and transparent supply chains are non-negotiable in our partnerships.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Join Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover timeless pieces that will become the foundation of your wardrobe. 
              Quality, sustainability, and style—without compromise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Collection
                </Button>
              </Link>
              <Link to="/account">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Create Account
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

export default About;