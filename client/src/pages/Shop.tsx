import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Filter, Star, ShoppingCart, Heart, Eye, BarChart3, Grid, List, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import CartTest from "@/components/CartTest";
import Footer from "@/components/Footer";
import ProductRating from "@/components/ProductRating";
import ProductQuickView from "@/components/ProductQuickView";
import FavoritesButton from "@/components/FavoritesButton";
import ProductHoverCard from "@/components/ProductHoverCard";
import { SEO } from "@/components/SEO";
import type { Product } from "@shared/schema";
import shopBannerImage from "@assets/images/pexels-n-voitkevich-6214476.jpg";
import headphonesImage from "@assets/A sleek black pair of premium wireless headphones displayed on a clean white background with soft sh.jpeg";
import chargerImage from "@assets/stock_images/wireless_phone_charg_71473ae2.jpg";
import investmentImage from "@assets/stock_images/investment_portfolio_6509782d.jpg";
import smartHomeImage from "@assets/Firefly_realistic and clear glow smart speaker on a Highrise table with Seattle night skyline 787022.jpg";
import smartHomeVideo from "@assets/f62dd8e7-7056-4c64-9252-8cb45c3210ef (1).mp4";
import cameraKitImage from "@assets/Firefly_Professional Camera Kit 664369.jpg";
import deskLampImage from "@assets/minimalist_expensive_desk_lamp_main_attraction_on.jpg";
import monitorImage from "@assets/minimalist_expensive_desk_with_curved_monitor_that.jpg";
import officeChairImage from "@assets/stock_images/ergonomic_office_cha_b30f2022.jpg";
import smartwatchImage from "@assets/pexels-alesiakozik-6772024.jpg";
import luxuryWatchImage from "@assets/pexels-n-voitkevich-6214476.jpg";

// Image resolver to map product images to actual imported assets
const getProductImage = (imagePath: string, productName: string) => {
  if (productName === "Premium Wireless Headphones") return headphonesImage;
  if (productName === "Wireless Phone Charger") return chargerImage;
  if (productName === "Investment Trends") return investmentImage;
  if (productName === "Smart Home Assistant") return smartHomeImage;
  if (productName === "Professional Camera Kit") return cameraKitImage;
  if (productName === "Minimalist Desk Lamp") return deskLampImage;
  if (productName === "Monitors") return monitorImage;
  if (productName === "Ergonomic Office Chair") return officeChairImage;
  if (productName === "Smartwatch Pro") return smartwatchImage;
  if (productName === "Luxury Watch Collection") return luxuryWatchImage;
  return imagePath;
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

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check for search query in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
      setFilters(prev => ({ ...prev, query: searchQuery }));
    }
  }, []);

  const [useSemanticSearch, setUseSemanticSearch] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: searchTerm && useSemanticSearch ? [`/api/search?query=${searchTerm}`] : ["/api/products"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: recentlyViewed = [] } = useQuery<any[]>({
    queryKey: ["/api/recently-viewed"],
  });

  // Track recently viewed products
  const addToRecentlyViewedMutation = useMutation({
    mutationFn: (productId: number) =>
      apiRequest("/api/recently-viewed", { 
        method: "POST", 
        body: JSON.stringify({ productId }) 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recently-viewed"] });
    },
  });

  const addToComparisonMutation = useMutation({
    mutationFn: (productIds: number[]) =>
      apiRequest("/api/comparison", { 
        method: "POST", 
        body: JSON.stringify({ productIds }) 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comparison"] });
    },
  });

  const categoryTabs = Array.from(new Set(["All Products", "Featured", "New Arrivals", "Best Sellers", ...(categories as any[]).map((cat: any) => cat.name)]));

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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <SEO 
        title="Shop - Premium Products"
        description="Browse our curated collection of premium electronics, accessories, and innovative tech solutions. Find quality products with detailed reviews and competitive prices."
        keywords="shop, electronics, gadgets, premium products, tech accessories, online shopping"
      />
      {/* Shop Header */}
      <section 
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${shopBannerImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/50"></div>
        
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
                <div key={item.id} className="flex-shrink-0 w-48 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-lg shadow-md p-4">
                  <img src={getProductImage(item.product?.image, item.product?.name)} alt={item.product?.name} className="w-full h-32 object-cover rounded mb-2" />
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
            <div className="flex-1 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFilters(prev => ({ ...prev, query: e.target.value }));
                  }}
                  className="pl-10 h-12 text-lg"
                  data-testid="search-input"
                />
              </div>
              {searchTerm && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="semantic-search"
                    checked={useSemanticSearch}
                    onCheckedChange={(checked) => setUseSemanticSearch(!!checked)}
                    data-testid="semantic-search-toggle"
                  />
                  <label htmlFor="semantic-search" className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <span className="text-blue-600 dark:text-blue-400">✨</span> Use AI Semantic Search
                  </label>
                </div>
              )}
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
                    ? "bg-blue-600 text-white backdrop-blur-sm"
                    : "bg-white/80 backdrop-blur-sm text-blue-600 hover:bg-blue-50/80 border border-blue-200"
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

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="product-card">
                <Skeleton className="w-full h-64" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProducts.map((product) => (
            <div key={product.id} className="product-card group hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-300">
              <Link href={`/product/${product.id}`}>
                <div className="relative overflow-hidden cursor-pointer">
                  {product.name === "Smart Home Assistant" ? (
                    <video
                      src={smartHomeVideo}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img 
                      src={getProductImage(product.image, product.name)} 
                      alt={product.name}
                      loading="lazy"
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
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-lg">
                        OUT OF STOCK
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <ProductHoverCard product={product}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 cursor-help">{product.name}</h3>
                  </ProductHoverCard>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4">{product.category}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {product.originalPrice && (
                        <span className="text-gray-400 dark:text-gray-500 line-through text-lg">${product.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${product.price}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <ProductRating productId={product.id} productName={product.name} />
                  </div>
                </div>
              </Link>

              <div className="px-6 pb-6">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={!product.inStock}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                  data-testid={`button-add-to-cart-${product.id}`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your search or filter criteria</p>
            <Button onClick={() => { setSearchTerm(""); setSelectedCategory("All Products"); setSortBy("name"); }}>
              Clear Filters
            </Button>
          </div>
        )}





        {/* Call to Action */}
        {filteredAndSortedProducts.length > 0 && (
          <div className="mt-16 text-center bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Can't find what you're looking for?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Contact us and we'll help you find the perfect product for your needs.
            </p>
            <Link href="/contact" onClick={() => window.scrollTo(0, 0)}>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" data-testid="button-contact-support">
                Contact Support
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}