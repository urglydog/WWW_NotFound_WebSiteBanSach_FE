"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { mockBooks } from "@/lib/mock-data"
import { Star, Heart, Share2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Book, booksService, Review, reviewsService } from "@/lib/services"

export default function ProductDetailPage() {
  const params = useParams<{ id: string | string[] }>()
  const productIdValue = Array.isArray(params?.id) ? params?.id[0] : params?.id
  const productId = productIdValue?.toString().trim()

  const [book, setBook] = useState<Book | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    if (productId) {
      booksService.getBookById(productId).then(setBook)
      
      // Load reviews
      setReviewsLoading(true)
      reviewsService.getBookReviews(productId, { page: 0, pageSize: 5 })
        .then(response => {
          setReviews(response.data)
        })
        .catch(error => {
          console.error("Error loading reviews:", error)
        })
        .finally(() => {
          setReviewsLoading(false)
        })
    }
  }, [productId])

  const handleShare = async () => {
    const shareData = {
      title: book?.title || "Sách hay",
      text: `${book?.title} - ${book?.authorNames?.join(", ")}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert("Đã sao chép link vào clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const truncateDescription = (text: string | undefined, maxLength: number = 50) => {
    if (!text) return ""
    const words = text.split(" ")
    if (words.length <= maxLength) return text
    return words.slice(0, maxLength).join(" ") + "..."
  }

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
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-2/3 items-center justify-center overflow-hidden rounded-lg bg-muted">
                <img 
                  src={book.imageUrls?.[selectedImageIndex] || "/placeholder.svg"} 
                  alt={book.title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="relative">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {book.imageUrls?.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        selectedImageIndex === index 
                          ? "border-primary" 
                          : "border-transparent hover:border-muted-foreground/20"
                      }`}
                    >
                      <img 
                        src={imageUrl} 
                        alt={`${book.title} - ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                  {book.categoryNames}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{book.title}</h1>

              <p className="text-lg text-muted-foreground mb-4">Tác giả: {book.authorNames}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(book.averageRating ?? 0) ? "fill-yellow-500 text-yellow-500" : "text-muted"}
                    />
                  ))}
                </div>
                <span className="text-foreground font-medium">{book.averageRating}</span>
                <span className="text-muted-foreground">({book.reviews} đánh giá)</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6 leading-relaxed">{truncateDescription(book.description, 50)}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">{book.price.toLocaleString("vi-VN")}₫</span>
                  {book.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {book.price.toLocaleString("vi-VN")}₫
                    </span>
                  )}
                </div>
                {book.discountPrice && <p className="text-accent font-semibold mt-2">Tiết kiệm {book.discountPrice}%</p>}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <p className={book.stockQuantity > 0 ? "text-accent" : "text-destructive"}>
                  {book.stockQuantity > 0 ? "✓ Còn hàng" : "✗ Hết hàng"}
                </p>
              </div>

              {/* Quantity & Actions */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex w-full items-center justify-between rounded-lg border border-border sm:w-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-l-lg transition hover:bg-muted"
                      aria-label="Giảm số lượng"
                    >
                      −
                    </button>
                    <span className="flex h-10 flex-1 items-center justify-center border-x border-border text-sm font-semibold sm:w-16 sm:flex-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-r-lg transition hover:bg-muted"
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 sm:flex-1" disabled={!(book.stockQuantity > 0)}>
                    {book.stockQuantity > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                  </Button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-3 transition hover:bg-muted ${
                      isWishlisted ? "bg-muted text-primary" : ""
                    }`}
                  >
                    <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                    {isWishlisted ? "Đã lưu" : "Lưu sách"}
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 transition hover:bg-muted sm:flex-none"
                  >
                    <Share2 size={18} />
                    Chia sẻ
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="space-y-3 border-t border-border pt-6 text-sm">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <span className="text-muted-foreground">Nhà xuất bản:</span>
                  <span className="text-foreground">NXB Thời đại</span>
                </div>
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <span className="text-muted-foreground">Năm xuất bản:</span>
                  <span className="text-foreground">2024</span>
                </div>
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <span className="text-muted-foreground">Loại bìa:</span>
                  <span className="text-foreground">Bìa mềm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Description Section */}
          <div className="mt-16 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Mô tả chi tiết</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Đánh giá sản phẩm</h2>
            
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">Đang tải đánh giá...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.reviewID} className="border-b border-border pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      {/* User Avatar */}
                      <div className="shrink-0">
                        {review.userAvatar ? (
                          <img 
                            src={review.userAvatar} 
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold text-lg">
                              {review.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{review.userName}</h4>
                          {review.isVerifiedPurchase && (
                            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                              Đã mua hàng
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>

                        {/* Comment */}
                        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
