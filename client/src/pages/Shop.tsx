import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import shopBannerImage from "@assets/images/pexels-n-voitkevich-6214476.jpg";
import headphonesImage from "@assets/A sleek black pair of premium wireless headphones displayed on a clean white background with soft sh.jpeg";
import chargerImage from "@assets/magicstudio-art (1).jpg";
import investmentImage from "@assets/pexels-alesiakozik-6772024.jpg";

// Image resolver to map product images to actual imported assets
const getProductImage = (imagePath: string, productName: string) => {
  if (productName === "Premium Wireless Headphones") {
    return headphonesImage;
  }
  if (productName === "Wireless Phone Charger") {
    return chargerImage;
  }
  if (productName === "Investment Trends") {
    return investmentImage;
  }
  return imagePath; // fallback to original path
};

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const categoryTabs = ["All Products", "Featured", "New Arrivals", "Best Sellers", ...categories.map((cat: any) => cat.name)];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Products" ||
                           (selectedCategory === "Featured" && product.featured) ||
                           product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product.id, 1);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Header */}
      <section 
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${shopBannerImage})` }}
      >
        {/* Translucent overlay with backdrop blur */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold mb-6 drop-shadow-lg text-[#2563eb]">
            Shop
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-md text-[black]">
            Discover our collection of high-quality products designed with care and precision. 
            From essentials to specialty items, we have something for everyone.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button variant="outline" className="h-12 px-6">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categoryTabs.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative overflow-hidden">
                <img 
                  src={getProductImage(product.image, product.name)} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.log('Image failed to load:', product.image);
                    e.currentTarget.src = 'https://via.placeholder.com/500x500/e2e8f0/64748b?text=' + encodeURIComponent(product.name);
                  }}
                  onLoad={() => console.log('Image loaded:', product.image)}
                />
                {product.originalPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    SALE
                  </div>
                )}
                {product.tags?.includes("new") && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    NEW
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <p className="text-sm text-blue-600 font-medium mb-4">{product.category}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-lg">${product.originalPrice}</span>
                    )}
                    <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button onClick={() => { setSearchTerm(""); setSelectedCategory("All Products"); }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        {filteredProducts.length > 0 && (
          <div className="mt-16 text-center bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Can't find what you're looking for?</h3>
            <p className="text-gray-600 mb-6">
              Contact us and we'll help you find the perfect product for your needs.
            </p>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              Contact Support
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}