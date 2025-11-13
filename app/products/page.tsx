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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <ProductFilters filters={filters} onFiltersChange={setFilters} onReset={handleReset} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted"
                >
                  <Filter size={18} />
                  Bộ lọc
                </button>
              </div>

              {/* Mobile Filters */}
              {mobileFiltersOpen && (
                <div className="lg:hidden mb-6 p-4 border border-border rounded-lg bg-card">
                  <ProductFilters filters={filters} onFiltersChange={setFilters} onReset={handleReset} />
                </div>
              )}

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
