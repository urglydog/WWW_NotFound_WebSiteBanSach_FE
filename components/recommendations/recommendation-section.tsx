"use client"

import { mockBooks } from "@/lib/mock-data"
import { ProductCard } from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import { Book } from "@/lib/services/books.service"
import Link from "next/link"

interface RecommendationSectionProps {
  title: string
  description?: string
  type: "trending" | "category" | "similar" | "recommendations"
  categoryFilter?: string
  limit?: number
  books?: Book[]
}

export function RecommendationSection({
  title,
  description,
  type,
  categoryFilter,
  limit = 4,
  books,
}: RecommendationSectionProps) {
  const getRecommendations = (): Book[] => {
    if (books && books.length > 0) {
      return books
    }

    // Map mockBooks to Book type (service)
    const mappedMockBooks: Book[] = mockBooks.map(b => ({
      id: b.id,
      title: b.title,
      price: b.price,
      discountPrice: b.price * (1 - (b.discount || 0) / 100),
      mainImageUrl: b.image,
      authorNames: [b.author],
      reviewCount: b.reviews,
      averageRating: b.rating,
      stockQuantity: b.inStock ? 100 : 0,
      // Add other required fields with defaults if necessary
    }))

    let filtered = [...mappedMockBooks]

    switch (type) {
      case "trending":
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        break
      case "category":
        // Note: mock data category is string, mapped is undefined in this simple map unless we add it
        // For now, we skip category filtering on mock data or we need to map it too
        // But since we are replacing with API data, this fallback is less critical
        break
      case "similar":
        filtered.sort(() => Math.random() - 0.5)
        break
      case "recommendations":
        filtered = filtered.filter((b) => (b.averageRating || 0) >= 4.5)
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        break
    }

    return filtered.slice(0, limit)
  }

  const recommendations = getRecommendations()

  if (recommendations.length === 0) return null

  return (
    <section className="py-10 sm:py-12 md:py-16">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
          {description && <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>}
        </div>
        <div className="flex w-full items-center justify-start gap-2 sm:w-auto sm:justify-end">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto cursor-pointer">
              Xem tất cả
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {recommendations.map((book) => (
          <ProductCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}
