import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Star, ShoppingCart, Heart, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/hooks/use-toast";
import FavoritesButton from "./FavoritesButton";
import ProductRating from "./ProductRating";
import type { Product, ProductSpec } from "@shared/schema";

interface ProductQuickViewProps {
  product: Product;
  children: React.ReactNode;
}

export default function ProductQuickView({ product, children }: ProductQuickViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: specs = [] } = useQuery<ProductSpec[]>({
    queryKey: ["/api/product-specs", product.id],
    enabled: isOpen,
  });

  const { data: averageRating = 0 } = useQuery<number>({
    queryKey: ["/api/ratings/average", product.id],
    enabled: isOpen,
  });

  const handleAddToCart = () => {
    addToCart(product.id, 1);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Product Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
                {product.featured && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge variant="destructive" className="text-xs">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= averageRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} stars
                </span>
              </div>
              <ProductRating productId={product.id} productName={product.name} />
            </div>

            <Separator />

            {/* Specifications */}
            {specs.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Specifications</h3>
                <div className="grid grid-cols-1 gap-2">
                  {specs.slice(0, 6).map((spec) => (
                    <div key={spec.id} className="flex justify-between text-sm">
                      <span className="font-medium text-gray-600">{spec.specName}:</span>
                      <span>{spec.specValue}</span>
                    </div>
                  ))}
                  {specs.length > 6 && (
                    <p className="text-xs text-gray-500">
                      +{specs.length - 6} more specifications
                    </p>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <FavoritesButton productId={product.id} size="default" variant="outline" />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Compare
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Free shipping on orders over $75</p>
              <p>• 30-day return policy</p>
              <p>• 1-year manufacturer warranty</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}