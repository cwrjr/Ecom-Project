import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Star, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Rating } from "@shared/schema";

interface ProductRatingProps {
  productId: number;
  productName: string;
}

export default function ProductRating({ productId, productName }: ProductRatingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [review, setReview] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const { toast } = useToast();

  // Fetch ratings for this product
  const { data: ratings = [], isLoading } = useQuery<Rating[]>({
    queryKey: [`/api/products/${productId}/ratings`],
  });

  // Fetch average rating
  const { data: averageData } = useQuery<{ averageRating: number }>({
    queryKey: [`/api/products/${productId}/average-rating`],
  });

  const averageRating = averageData?.averageRating || 0;
  const totalRatings = ratings.length;

  // Submit rating mutation
  const submitRatingMutation = useMutation({
    mutationFn: async (ratingData: { userName: string; rating: number; review?: string }) => {
      return apiRequest(`/api/products/${productId}/ratings`, {
        method: "POST",
        body: JSON.stringify(ratingData),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/ratings`] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/average-rating`] });
      setUserRating(0);
      setUserName("");
      setReview("");
      setIsSubmitting(false);
      toast({
        title: "Rating submitted!",
        description: "Thank you for your feedback.",
      });
    },
    onError: () => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitRating = async () => {
    if (!userName.trim() || userRating === 0) {
      toast({
        title: "Missing information",
        description: "Please provide your name and a rating.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    submitRatingMutation.mutate({
      userName: userName.trim(),
      rating: userRating,
      review: review.trim() || undefined,
    });
  };

  const renderStars = (rating: number, interactive = false, size = "h-5 w-5") => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      const isFilled = interactive ? 
        (hoveredStar > 0 ? starValue <= hoveredStar : starValue <= userRating) : 
        starValue <= rating;

      return (
        <Star
          key={i}
          className={`${size} cursor-pointer transition-colors ${
            isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
          onClick={interactive ? () => setUserRating(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoveredStar(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
        />
      );
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Average Rating Display */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {renderStars(averageRating)}
        </div>
        <span className="text-sm text-gray-600">
          {averageRating > 0 ? averageRating.toFixed(1) : "No ratings"} 
          {totalRatings > 0 && ` (${totalRatings} review${totalRatings !== 1 ? 's' : ''})`}
        </span>
      </div>

      {/* Submit Rating Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Star className="h-4 w-4" />
            Write a Review
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate {productName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {renderStars(userRating, true)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Review (Optional)</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <Button 
              onClick={handleSubmitRating}
              disabled={isSubmitting || !userName.trim() || userRating === 0}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recent Reviews */}
      {ratings.length > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-blue-600">
              <MessageSquare className="h-4 w-4" />
              View Reviews ({totalRatings})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customer Reviews for {productName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {ratings.map((rating) => (
                <Card key={rating.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{rating.userName}</span>
                          <div className="text-xs text-gray-500">
                            {rating.createdAt ? new Date(rating.createdAt).toLocaleDateString() : 'Recently'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(rating.rating, false, "h-4 w-4")}
                        <span className="text-sm text-gray-600 ml-1">({rating.rating}/5)</span>
                      </div>
                    </div>
                  </CardHeader>
                  {rating.review && (
                    <CardContent className="pt-0">
                      <p className="text-gray-700 leading-relaxed">{rating.review}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}