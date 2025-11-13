"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductCard } from "@/components/products/product-card"
import { mockBooks } from "@/lib/mock-data"
import type { FilterOptions } from "@/lib/types"
import { Filter } from "lucide-react"

const defaultFilters: FilterOptions = {
  categories: [],
  priceRange: [0, 500000],
  ratings: [],
  sortBy: "popular",
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...mockBooks]

    // Filter by category
    if (filters.categories.length > 0) {
      result = result.filter((book) => filters.categories.includes(book.category))
    }

    // Filter by price range
    result = result.filter((book) => book.price >= filters.priceRange[0] && book.price <= filters.priceRange[1])

    // Filter by rating
    if (filters.ratings.length > 0) {
      result = result.filter((book) => filters.ratings.some((rating) => book.rating >= rating))
    }

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.reverse()
        break
      case "popular":
      default:
        result.sort((a, b) => b.reviews - a.reviews)
    }

    return result
  }, [filters])

  const handleReset = () => {
    setFilters(defaultFilters)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="border-b border-border bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Cửa hàng sách</h1>
            <p className="text-muted-foreground">{filteredProducts.length} sách tìm thấy</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden w-full max-w-xs shrink-0 lg:block">
              <ProductFilters filters={filters} onFiltersChange={setFilters} onReset={handleReset} />
            </aside>

            {/* Main Content */}
            <div className="min-w-0 flex-1">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  <Filter size={18} />
                  Bộ lọc
                </button>
              </div>

              {/* Mobile Filters */}
              {mobileFiltersOpen && (
                <div className="mb-6 rounded-lg border border-border bg-card p-4 lg:hidden">
                  <ProductFilters filters={filters} onFiltersChange={setFilters} onReset={handleReset} />
                </div>
              )}

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {filteredProducts.map((book) => (
                    <ProductCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Không tìm thấy sách phù hợp</p>
                  <button onClick={handleReset} className="text-primary hover:text-primary/80 underline">
                    Xóa các bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
