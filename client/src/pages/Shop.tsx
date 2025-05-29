import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Filter, Star, ShoppingCart, Heart, Eye, BarChart3, Grid, List, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import CartTest from "@/components/CartTest";
import Footer from "@/components/Footer";
import ProductRating from "@/components/ProductRating";
import AdvancedSearch from "@/components/AdvancedSearch";
import ProductComparison from "@/components/ProductComparison";
import ProductQuickView from "@/components/ProductQuickView";
import FavoritesButton from "@/components/FavoritesButton";
import type { Product } from "@shared/schema";
import shopBannerImage from "@assets/images/pexels-n-voitkevich-6214476.jpg";
import headphonesImage from "@assets/A sleek black pair of premium wireless headphones displayed on a clean white background with soft sh.jpeg";
import chargerImage from "@assets/magicstudio-art (1).jpg";
import investmentImage from "@assets/pexels-alesiakozik-6772024.jpg";
import smartHomeImage from "@assets/f62dd8e7-7056-4c64-9252-8cb45c3210ef (1).mp4";
import cameraKitImage from "@assets/Firefly_Professional Camera Kit 664369.jpg";
import deskLampImage from "@assets/minimalist_expensive_desk_lamp_main_attraction_on.jpg";
import monitorImage from "@assets/minimalist_expensive_desk_with_curved_monitor_that.jpg";

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
  if (productName === "Smart Home Assistant") {
    return smartHomeImage;
  }
  if (productName === "Professional Camera Kit") {
    return cameraKitImage;
  }
  if (productName === "Minimalist Desk Lamp") {
    return deskLampImage;
  }
  if (productName === "Monitors") {
    return monitorImage;
  }
  return imagePath; // fallback to original path
};

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    priceRange: [0, 1000] as [number, number],
    categories: [] as string[],
    minRating: 0,
    inStockOnly: false,
    sortBy: "relevance",
  });
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: recentlyViewed = [] } = useQuery({
    queryKey: ["/api/recently-viewed"],
  });

  // Track recently viewed products
  const addToRecentlyViewedMutation = useMutation({
    mutationFn: (productId: number) =>
      apiRequest("POST", "/api/recently-viewed", { productId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recently-viewed"] });
    },
  });

  const addToComparisonMutation = useMutation({
    mutationFn: (productIds: number[]) =>
      apiRequest("POST", "/api/comparison", { productIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comparison"] });
    },
  });

  const categoryTabs = ["All Products", "Featured", "New Arrivals", "Best Sellers", ...(categories as any[]).map((cat: any) => cat.name)];

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleProductView = (productId: number) => {
    addToRecentlyViewedMutation.mutate(productId);
  };

  const addToComparison = (productId: number) => {
    // Get current comparison and add product
    addToComparisonMutation.mutate([productId]);
    toast({
      title: "Added to comparison",
      description: "Product added to comparison. Click the comparison button to view.",
    });
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(filters.query.toLowerCase()) ||
                           product.description.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesCategory = selectedCategory === "All Products" ||
                             (selectedCategory === "Featured" && product.featured) ||
                             product.category === selectedCategory ||
                             filters.categories.includes(product.category);
      
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      
      const matchesStock = !filters.inStockOnly || product.inStock;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return 0; // Could implement rating sort
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        case "relevance":
        default:
          return a.name.localeCompare(b.name);
      }
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
        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recently Viewed</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recentlyViewed.slice(0, 5).map((item: any) => (
                <div key={item.id} className="flex-shrink-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  <img src={getImagePath(item.product?.image)} alt={item.product?.name} className="w-full h-32 object-cover rounded mb-2" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.product?.name}</h3>
                  <p className="text-lg font-bold text-blue-600">${item.product?.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-12 px-6">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                        max={1000}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Minimum Rating</h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant={filters.minRating >= rating ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                          className="p-1"
                        >
                          <Star className="h-3 w-3" />
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in-stock"
                      checked={filters.inStockOnly}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, inStockOnly: !!checked }))}
                    />
                    <label htmlFor="in-stock" className="text-sm font-medium">
                      In stock only
                    </label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters({
                        query: "",
                        priceRange: [0, 1000],
                        categories: [],
                        minRating: 0,
                        inStockOnly: false,
                        sortBy: "relevance",
                      })}
                      className="flex-1"
                    >
                      Clear All
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="flex-1"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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

        {/* Sort Dropdown */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
          </p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative overflow-hidden">
                {product.name === "Smart Home Assistant" ? (
                  <video
                    src={getProductImage(product.image, product.name)}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => console.log('Video failed to load:', product.image)}
                    onLoadedData={() => console.log('Video loaded:', product.image)}
                  />
                ) : (
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
                )}
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
                </div>
                
                <div className="mb-4">
                  <ProductRating productId={product.id} productName={product.name} />
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
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button onClick={() => { setSearchTerm(""); setSelectedCategory("All Products"); setSortBy("name"); }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Cart Badge Test */}
        <CartTest />

        {/* Call to Action */}
        {filteredAndSortedProducts.length > 0 && (
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
      
      <Footer />
    </div>
  );
}