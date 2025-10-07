import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Heart, ZoomIn, Star, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import ProductRating from "@/components/ProductRating";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import type { Product } from "@shared/schema";

// Image imports
import headphonesImage from "@assets/A sleek black pair of premium wireless headphones displayed on a clean white background with soft sh.jpeg";
import chargerImage from "@assets/magicstudio-art (1).jpg";
import investmentImage from "@assets/pexels-alesiakozik-6772024.jpg";
import smartHomeImage from "@assets/f62dd8e7-7056-4c64-9252-8cb45c3210ef (1).mp4";
import cameraKitImage from "@assets/Firefly_Professional Camera Kit 664369.jpg";
import deskLampImage from "@assets/minimalist_expensive_desk_lamp_main_attraction_on.jpg";
import monitorImage from "@assets/minimalist_expensive_desk_with_curved_monitor_that.jpg";

const getProductImage = (imagePath: string, productName: string) => {
  if (productName === "Premium Wireless Headphones") return headphonesImage;
  if (productName === "Wireless Phone Charger") return chargerImage;
  if (productName === "Investment Trends") return investmentImage;
  if (productName === "Smart Home Assistant") return smartHomeImage;
  if (productName === "Professional Camera Kit") return cameraKitImage;
  if (productName === "Minimalist Desk Lamp") return deskLampImage;
  if (productName === "Monitors") return monitorImage;
  return imagePath;
};

export default function ProductDetail() {
  const { id } = useParams();
  const [imageZoomed, setImageZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const addToFavoritesMutation = useMutation({
    mutationFn: () =>
      apiRequest("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ productId: Number(id) }),
      }),
    onSuccess: () => {
      toast({
        title: "Added to favorites",
        description: "Product added to your wishlist.",
      });
    },
  });

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-1/3" />
              <div className="flex space-x-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO 
        title={product.name}
        description={product.description}
        image={getProductImage(product.image, product.name)}
        type="product"
        keywords={`${product.name}, ${product.category}, buy online, premium ${product.category.toLowerCase()}`}
      />
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/">
            <a className="hover:text-blue-600">Home</a>
          </Link>
          <span>/</span>
          <Link href="/shop">
            <a className="hover:text-blue-600">Shop</a>
          </Link>
          <span>/</span>
          <span className="text-blue-600">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/shop">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div 
              className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-zoom-in"
              onClick={() => setImageZoomed(!imageZoomed)}
            >
              <img
                src={getProductImage(product.image, product.name)}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${imageZoomed ? 'scale-150' : 'scale-100'}`}
              />
              <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
                <ZoomIn className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
              <ProductRating productId={product.id} productName={product.name} />
            </div>

            <div className="flex items-baseline space-x-4">
              {product.originalPrice && (
                <span className="text-2xl text-gray-400 line-through">${product.originalPrice}</span>
              )}
              <span className="text-4xl font-bold text-blue-600">${product.price}</span>
              {product.originalPrice && (
                <Badge variant="destructive">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Description</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <Badge variant={product.inStock ? "default" : "destructive"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <div className="flex space-x-4">
              <Button 
                size="lg" 
                className="flex-1" 
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              {isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => addToFavoritesMutation.mutate()}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              )}
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                  <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer">
                    <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={getProductImage(relatedProduct.image, relatedProduct.name)}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{relatedProduct.name}</h3>
                      <p className="text-lg font-bold text-blue-600">${relatedProduct.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
