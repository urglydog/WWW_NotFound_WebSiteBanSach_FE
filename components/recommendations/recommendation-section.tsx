"use client"

import { mockBooks } from "@/lib/mock-data"
import { ProductCard } from "@/components/products/product-card"
import { Button } from "@/components/ui/button"

interface RecommendationSectionProps {
  title: string
  description?: string
  type: "trending" | "category" | "similar" | "recommendations"
  categoryFilter?: string
  limit?: number
}

export function RecommendationSection({
  title,
  description,
  type,
  categoryFilter,
  limit = 4,
}: RecommendationSectionProps) {
  const getRecommendations = () => {
    let filtered = [...mockBooks]

    switch (type) {
      case "trending":
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      case "category":
        if (categoryFilter) {
          filtered = filtered.filter((b) => b.category === categoryFilter)
        }
        break
      case "similar":
        if (categoryFilter) {
          filtered = filtered.filter((b) => b.category === categoryFilter)
        }
        filtered.sort(() => Math.random() - 0.5)
        break
      case "recommendations":
        filtered = filtered.filter((b) => b.rating >= 4.5)
        filtered.sort((a, b) => b.rating - a.rating)
        break
    }

    return filtered.slice(0, limit)
  }

  const recommendations = getRecommendations()

  if (recommendations.length === 0) return null

  return (
    <section className="py-12 md:py-16">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
        <Button variant="ghost">Xem tất cả</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((book) => (
          <ProductCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}
