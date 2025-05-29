import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product, ProductSpec } from "@shared/schema";

interface ProductComparisonProps {
  children: React.ReactNode;
}

export default function ProductComparison({ children }: ProductComparisonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comparison } = useQuery({
    queryKey: ["/api/comparison"],
    enabled: isOpen,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const updateComparisonMutation = useMutation({
    mutationFn: (productIds: number[]) =>
      apiRequest("POST", "/api/comparison", { productIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comparison"] });
    },
  });

  const comparedProducts = products.filter(p => 
    comparison?.productIds?.includes(p.id)
  );

  const addToComparison = (productId: number) => {
    const currentIds = comparison?.productIds || [];
    if (currentIds.includes(productId)) {
      toast({
        title: "Already in comparison",
        description: "This product is already being compared.",
        variant: "destructive",
      });
      return;
    }
    if (currentIds.length >= 3) {
      toast({
        title: "Comparison limit reached",
        description: "You can compare up to 3 products at once.",
        variant: "destructive",
      });
      return;
    }
    updateComparisonMutation.mutate([...currentIds, productId]);
  };

  const removeFromComparison = (productId: number) => {
    const currentIds = comparison?.productIds || [];
    updateComparisonMutation.mutate(currentIds.filter(id => id !== productId));
  };

  const ProductSpecs = ({ productId }: { productId: number }) => {
    const { data: specs = [] } = useQuery<ProductSpec[]>({
      queryKey: ["/api/product-specs", productId],
    });

    return (
      <div className="space-y-2">
        {specs.map((spec) => (
          <div key={spec.id} className="flex justify-between text-sm">
            <span className="font-medium">{spec.specName}:</span>
            <span>{spec.specValue}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Comparison</DialogTitle>
        </DialogHeader>
        
        {comparedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products selected for comparison</p>
            <p className="text-sm text-gray-400">Browse products and click "Compare" to add them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparedProducts.map((product) => (
              <Card key={product.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => removeFromComparison(product.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <CardHeader>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.5/5</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Category</h4>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Specifications</h4>
                      <ProductSpecs productId={product.id} />
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Availability</h4>
                      <Badge variant={product.inStock ? "default" : "destructive"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {comparedProducts.length < 3 && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center">
                    <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Add another product to compare</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Compare up to 3 products side by side
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { addToComparison } from "./ProductComparison";