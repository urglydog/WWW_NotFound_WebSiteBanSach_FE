"use client"

import type { FilterOptions } from "@/lib/types"
import { categories } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ProductFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
}

export function ProductFilters({ filters, onFiltersChange, onReset }: ProductFiltersProps) {
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleSortChange = (sortBy: FilterOptions["sortBy"]) => {
    onFiltersChange({ ...filters, sortBy })
  }

  const handlePriceChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: [min, max] })
  }

  const handleRatingToggle = (rating: number) => {
    const newRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter((r) => r !== rating)
      : [...filters.ratings, rating]
    onFiltersChange({ ...filters, ratings: newRatings })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.ratings.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 500000

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Bộ lọc</h3>
        {hasActiveFilters && (
          <Button onClick={onReset} variant="outline" className="flex items-center gap-1 bg-transparent">
            <X size={16} /> Xóa
          </Button>
        )}
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Sắp xếp</h4>
        <div className="space-y-2">
          {[
            { value: "newest" as const, label: "Mới nhất" },
            { value: "popular" as const, label: "Phổ biến" },
            { value: "price-low" as const, label: "Giá: Thấp đến cao" },
            { value: "price-high" as const, label: "Giá: Cao đến thấp" },
            { value: "rating" as const, label: "Đánh giá cao nhất" },
          ].map((sort) => (
            <label key={sort.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={sort.value}
                checked={filters.sortBy === sort.value}
                onChange={() => handleSortChange(sort.value)}
                className="rounded"
              />
              <span className="text-sm text-foreground">{sort.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium text-foreground mb-3">Danh mục</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="rounded"
              />
              <span className="text-sm text-foreground">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium text-foreground mb-3">Giá</h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">Từ</label>
            <input
              type="number"
              min="0"
              max={filters.priceRange[1]}
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
              className="w-full px-3 py-2 border border-border rounded-md text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Đến</label>
            <input
              type="number"
              min={filters.priceRange[0]}
              max="500000"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-md text-sm"
              placeholder="500000"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium text-foreground mb-3">Đánh giá</h4>
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.ratings.includes(rating)}
                onChange={() => handleRatingToggle(rating)}
                className="rounded"
              />
              <span className="text-sm text-foreground">{rating} sao trở lên</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
