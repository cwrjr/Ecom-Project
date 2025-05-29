import { useState } from "react";
import { Search, Filter, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface SearchFilters {
  query: string;
  priceRange: [number, number];
  categories: string[];
  minRating: number;
  inStockOnly: boolean;
  sortBy: string;
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  categories: Array<{ name: string; id: number }>;
  initialFilters?: Partial<SearchFilters>;
}

export default function AdvancedSearch({ 
  onFiltersChange, 
  categories,
  initialFilters = {}
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    priceRange: [0, 1000],
    categories: [],
    minRating: 0,
    inStockOnly: false,
    sortBy: "relevance",
    ...initialFilters,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: filters.query, // Keep search query
      priceRange: [0, 1000],
      categories: [],
      minRating: 0,
      inStockOnly: false,
      sortBy: "relevance",
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFilterCount = [
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1000,
    filters.categories.length > 0,
    filters.minRating > 0,
    filters.inStockOnly,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search products..."
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="pl-10 h-12 text-lg"
          />
        </div>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-12 px-6 relative">
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                    max={1000}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Categories</Label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={filters.categories.includes(category.name)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({ 
                              categories: [...filters.categories, category.name] 
                            });
                          } else {
                            updateFilters({ 
                              categories: filters.categories.filter(c => c !== category.name) 
                            });
                          }
                        }}
                      />
                      <Label 
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Minimum Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={filters.minRating >= rating ? "default" : "outline"}
                      size="sm"
                      className="p-1"
                      onClick={() => updateFilters({ 
                        minRating: filters.minRating === rating ? 0 : rating 
                      })}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {filters.minRating > 0 
                    ? `${filters.minRating}+ stars` 
                    : "Any rating"
                  }
                </p>
              </div>

              {/* In Stock Only */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.inStockOnly}
                  onCheckedChange={(checked) => updateFilters({ inStockOnly: !!checked })}
                />
                <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                  In stock only
                </Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort By */}
        <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
          <SelectTrigger className="w-40 h-12">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Customer Rating</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ priceRange: [0, 1000] })}
              />
            </Badge>
          ) : null}
          
          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              {category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ 
                  categories: filters.categories.filter(c => c !== category) 
                })}
              />
            </Badge>
          ))}
          
          {filters.minRating > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.minRating}+ stars
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ minRating: 0 })}
              />
            </Badge>
          )}
          
          {filters.inStockOnly && (
            <Badge variant="secondary" className="flex items-center gap-1">
              In stock only
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ inStockOnly: false })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}