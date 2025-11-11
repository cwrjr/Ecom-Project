import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Star, Package, Tag } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductHoverCardProps {
  product: Product;
  children: React.ReactNode;
}

export default function ProductHoverCard({ product, children }: ProductHoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only fetch ratings when hover card is actually open
  const { data: averageRating = 0 } = useQuery<number>({
    queryKey: ["/api/ratings/average", product.id],
    enabled: isOpen,
  });

  const { data: ratingCount = 0 } = useQuery<number>({
    queryKey: ["/api/ratings/count", product.id],
    enabled: isOpen,
  });

  return (
    <HoverCard openDelay={200} closeDelay={200} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-blue-500/30" side="top">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {product.name}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Tag className="h-3.5 w-3.5" />
              <span>{product.category}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Package className={`h-3.5 w-3.5 ${product.inStock ? 'text-green-500' : 'text-red-500'}`} />
              <span className={product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
              </span>
              {ratingCount > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
                </span>
              )}
            </div>
            
            <div className="text-right">
              {product.originalPrice && (
                <span className="text-xs text-gray-400 dark:text-gray-500 line-through block">
                  ${product.originalPrice}
                </span>
              )}
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ${product.price}
              </span>
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {product.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
