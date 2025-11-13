"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { mockBooks } from "@/lib/mock-data"
import { Star, Heart, Share2 } from "lucide-react"
import { useState } from "react"
import { useParams } from "next/navigation"

export default function ProductDetailPage() {
  const params = useParams<{ id: string | string[] }>()
  const productIdValue = Array.isArray(params?.id) ? params?.id[0] : params?.id
  const productId = productIdValue?.toString().trim()
  const book = mockBooks.find((b) => b.id === productId)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!book) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Sách không tìm thấy</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="aspect-2/3 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              <img src={book.image || "/placeholder.svg"} alt={book.title} className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                  {book.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{book.title}</h1>

              <p className="text-lg text-muted-foreground mb-4">Tác giả: {book.author}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(book.rating) ? "fill-yellow-500 text-yellow-500" : "text-muted"}
                    />
                  ))}
                </div>
                <span className="text-foreground font-medium">{book.rating}</span>
                <span className="text-muted-foreground">({book.reviews} đánh giá)</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6 leading-relaxed">{book.description}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">{book.price.toLocaleString("vi-VN")}₫</span>
                  {book.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {book.originalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  )}
                </div>
                {book.discount && <p className="text-accent font-semibold mt-2">Tiết kiệm {book.discount}%</p>}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <p className={book.inStock ? "text-accent" : "text-destructive"}>
                  {book.inStock ? "✓ Còn hàng" : "✗ Hết hàng"}
                </p>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-muted">
                      −
                    </button>
                    <span className="px-6 py-2 border-l border-r border-border">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-muted">
                      +
                    </button>
                  </div>
                  <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90" disabled={!book.inStock}>
                    {book.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-lg hover:bg-muted transition ${
                      isWishlisted ? "bg-muted text-primary" : ""
                    }`}
                  >
                    <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                    {isWishlisted ? "Đã lưu" : "Lưu sách"}
                  </button>
                  <button className="flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted transition">
                    <Share2 size={18} />
                    Chia sẻ
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="border-t border-border pt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nhà xuất bản:</span>
                  <span className="text-foreground">NXB Thời đại</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Năm xuất bản:</span>
                  <span className="text-foreground">2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại bìa:</span>
                  <span className="text-foreground">Bìa mềm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
