import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Star } from "lucide-react";
import type { Rating } from "@shared/schema";

interface RatingDistributionChartProps {
  productId: number;
}

export default function RatingDistributionChart({ productId }: RatingDistributionChartProps) {
  const { data: ratings = [], isLoading } = useQuery<Rating[]>({
    queryKey: [`/api/ratings/product/${productId}`],
  });

  if (isLoading) {
    return null;
  }

  if (ratings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md" data-testid="rating-distribution-chart">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rating Distribution</h3>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Star className="h-12 w-12 mx-auto mb-2 opacity-20" />
          <p>No reviews yet</p>
          <p className="text-sm mt-1">Be the first to review this product!</p>
        </div>
      </div>
    );
  }

  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  ratings.forEach((rating) => {
    const starRating = Math.round(rating.rating) as 1 | 2 | 3 | 4 | 5;
    if (starRating >= 1 && starRating <= 5) {
      ratingCounts[starRating]++;
    }
  });

  const chartData = [
    { stars: 5, count: ratingCounts[5], label: "5 Stars" },
    { stars: 4, count: ratingCounts[4], label: "4 Stars" },
    { stars: 3, count: ratingCounts[3], label: "3 Stars" },
    { stars: 2, count: ratingCounts[2], label: "2 Stars" },
    { stars: 1, count: ratingCounts[1], label: "1 Star" },
  ].reverse();

  const getBarColor = (stars: number) => {
    if (stars === 5) return "#10b981";
    if (stars === 4) return "#3b82f6";
    if (stars === 3) return "#f59e0b";
    if (stars === 2) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md" data-testid="rating-distribution-chart">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rating Distribution</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
          <XAxis 
            type="number" 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis 
            type="category" 
            dataKey="label" 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--tooltip-bg, rgba(255, 255, 255, 0.95))',
              border: '1px solid var(--tooltip-border, #e5e7eb)',
              borderRadius: '0.5rem',
              padding: '0.5rem',
              color: 'var(--tooltip-text, #111827)'
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.stars)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
        Based on {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
      </div>
    </div>
  );
}
