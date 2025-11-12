import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

interface FavoritesButtonProps {
  productId: number;
  size?: "sm" | "default" | "lg";
  variant?: "ghost" | "outline" | "default";
}

export default function FavoritesButton({ 
  productId, 
  size = "default", 
  variant = "ghost" 
}: FavoritesButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery<Array<{ id: number; productId: number }>>({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
  });

  const isFavorited = favorites.some((fav) => fav.productId === productId);

  const addToFavoritesMutation = useMutation({
    mutationFn: () => apiRequest("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ productId })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Added to wishlist",
        description: "Product saved to your favorites!",
      });
    },
    onError: () => {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to save favorites.",
        variant: "destructive",
      });
    },
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: () => apiRequest(`/api/favorites/${productId}`, {
      method: "DELETE"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from wishlist",
        description: "Product removed from your favorites.",
      });
    },
  });

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to save favorites.",
        variant: "destructive",
      });
      return;
    }

    if (isFavorited) {
      removeFromFavoritesMutation.mutate();
    } else {
      addToFavoritesMutation.mutate();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
      className="group"
    >
      <Heart 
        className={`h-4 w-4 transition-colors ${
          isFavorited 
            ? "fill-red-500 text-red-500" 
            : "group-hover:text-red-500"
        }`} 
      />
    </Button>
  );
}