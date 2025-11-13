"use client"

import type { Book } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star } from "lucide-react"

interface ProductCardProps {
  book: Book
}

export function ProductCard({ book }: ProductCardProps) {
  return (
    <Link href={`/products/${book.id}`}>
      <div className="group cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden mb-4">
          <img
            src={book.image || "/placeholder.svg"}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          {book.discount && (
            <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
              -{book.discount}%
            </div>
          )}
          {!book.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold">Hết hàng</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition line-clamp-2 mb-2">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{book.author}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(book.rating) ? "fill-yellow-500 text-yellow-500" : "text-muted"}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({book.reviews})</span>
          </div>

          {/* Price */}
          <div className="mt-auto mb-3 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg text-primary">{book.price.toLocaleString("vi-VN")}₫</span>
              {book.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {book.originalPrice.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            disabled={!book.inStock}
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            {book.inStock ? "Thêm vào giỏ" : "Hết hàng"}
          </Button>
        </div>
      </div>
    </Link>
  )
}
