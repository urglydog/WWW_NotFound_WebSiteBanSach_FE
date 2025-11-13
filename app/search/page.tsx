"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { mockBooks, categories } from "@/lib/mock-data"
import { ProductCard } from "@/components/products/product-card"
import { SearchIcon, Filter, X } from "lucide-react"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ""
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 500000,
    rating: 0,
    category: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  const results = useMemo(() => {
    let filtered = [...mockBooks]

    // Search query
    if (query) {
      const term = query.toLowerCase()
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.category.toLowerCase().includes(term),
      )
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((book) => book.category === filters.category)
    }

    // Filter by price
    filtered = filtered.filter((book) => book.price >= filters.minPrice && book.price <= filters.maxPrice)

    // Filter by rating
    if (filters.rating > 0) {
      filtered = filtered.filter((book) => book.rating >= filters.rating)
    }

    return filtered
  }, [query, filters])

  const handleResetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 500000,
      rating: 0,
      category: "",
    })
  }

  const hasActiveFilters = filters.category || filters.rating > 0 || filters.minPrice > 0 || filters.maxPrice < 500000

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Search Header */}
        <div className="bg-muted/50 border-b border-border py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <SearchIcon size={24} className="text-muted-foreground" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {query ? `Kết quả tìm kiếm: "${query}"` : "Tìm kiếm"}
                </h1>
                <p className="text-muted-foreground mt-1">Tìm thấy {results.length} sách</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Bộ lọc</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      <X size={16} /> Xóa
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Danh mục</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value=""
                          checked={filters.category === ""}
                          onChange={() => setFilters({ ...filters, category: "" })}
                          className="rounded"
                        />
                        <span className="text-sm text-foreground">Tất cả</span>
                      </label>
                      {categories.map((category) => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={filters.category === category}
                            onChange={() => setFilters({ ...filters, category })}
                            className="rounded"
                          />
                          <span className="text-sm text-foreground">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-medium text-foreground mb-3">Giá</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Từ</label>
                        <input
                          type="number"
                          min="0"
                          value={filters.minPrice}
                          onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Đến</label>
                        <input
                          type="number"
                          max="500000"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-medium text-foreground mb-3">Đánh giá</h4>
                    <div className="space-y-2">
                      {[0, 5, 4, 3].map((rating) => (
                        <label key={rating} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            value={rating}
                            checked={filters.rating === rating}
                            onChange={() => setFilters({ ...filters, rating })}
                            className="rounded"
                          />
                          <span className="text-sm text-foreground">
                            {rating === 0 ? "Tất cả" : `${rating} sao trở lên`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted w-full justify-center"
                >
                  <Filter size={18} />
                  Bộ lọc
                </button>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden mb-6 p-4 border border-border rounded-lg bg-card space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Danh mục</h4>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="">Tất cả</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Results */}
              {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((book) => (
                    <ProductCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <SearchIcon size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">Không tìm thấy sách phù hợp</p>
                  <button onClick={handleResetFilters} className="text-primary hover:text-primary/80 underline">
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
