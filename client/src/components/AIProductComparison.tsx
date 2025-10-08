import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface AIProductComparisonProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AIProductComparison({ products, isOpen, onClose }: AIProductComparisonProps) {
  const [comparison, setComparison] = useState<string>("");
  const { toast } = useToast();

  const compareMutation = useMutation({
    mutationFn: async (productIds: number[]) => {
      const response = await apiRequest("/api/compare", {
        method: "POST",
        body: JSON.stringify({ productIds }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setComparison(data.comparison);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to compare products. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCompare = () => {
    if (products.length < 2) {
      toast({
        title: "Not enough products",
        description: "Please select at least 2 products to compare.",
        variant: "destructive",
      });
      return;
    }
    compareMutation.mutate(products.map(p => p.id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            AI Product Comparison
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                  {product.name}
                </h4>
                <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Compare Button */}
          {!comparison && (
            <Button
              onClick={handleCompare}
              disabled={compareMutation.isPending || products.length < 2}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
              data-testid="compare-button"
            >
              {compareMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Compare Products with AI
                </>
              )}
            </Button>
          )}

          {/* Comparison Result */}
          {comparison && (
            <ScrollArea className="h-96 w-full rounded-md border p-4" data-testid="comparison-result">
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {comparison}
                </div>
              </div>
              <Button
                onClick={() => setComparison("")}
                variant="outline"
                className="mt-4 w-full"
                data-testid="reset-comparison-button"
              >
                Compare Again
              </Button>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
