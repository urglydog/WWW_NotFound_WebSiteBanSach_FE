"use client"

import { useCart } from "@/lib/cart-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"

export default function CartPage() {
  const { state, dispatch } = useCart()

  const subtotal = state.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)
  const shipping = 0
  const total = subtotal + shipping

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <span className="text-6xl block">🛒</span>
            <h1 className="text-2xl font-bold text-foreground">Giỏ hàng trống</h1>
            <p className="text-muted-foreground">Hãy thêm sách vào giỏ hàng của bạn</p>
            <Link href="/products">
              <Button className="mt-4">Tiếp tục mua sắm</Button>
            </Link>
          </div>
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
          <h1 className="text-3xl font-bold text-foreground mb-8">Giỏ hàng của bạn</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.book.id}
                    className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 transition hover:shadow-md sm:flex-row"
                  >
                    {/* Image */}
                    <div className="flex h-40 w-full shrink-0 items-center justify-center rounded bg-muted sm:h-32 sm:w-24">
                      <img
                        src={item.book.image || "/placeholder.svg"}
                        alt={item.book.title}
                        className="h-full w-full rounded object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col gap-4">
                      <Link
                        href={`/products/${item.book.id}`}
                        className="font-semibold text-foreground hover:text-primary transition"
                      >
                        {item.book.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.book.author}</p>

                      {/* Price & Quantity */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-1 flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                          <div className="flex items-center overflow-hidden rounded-lg border border-border">
                            <button
                              onClick={() =>
                                dispatch({
                                  type: "UPDATE_QUANTITY",
                                  payload: { id: item.book.id, quantity: item.quantity - 1 },
                                })
                              }
                              className="flex h-10 w-10 items-center justify-center transition hover:bg-muted"
                              aria-label="Giảm số lượng"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="flex h-10 w-12 items-center justify-center border-x border-border text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                dispatch({
                                  type: "UPDATE_QUANTITY",
                                  payload: { id: item.book.id, quantity: item.quantity + 1 },
                                })
                              }
                              className="flex h-10 w-10 items-center justify-center transition hover:bg-muted"
                              aria-label="Tăng số lượng"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-lg font-bold text-primary">
                              {(item.book.price * item.quantity).toLocaleString("vi-VN")}₫
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.book.price.toLocaleString("vi-VN")}₫ x {item.quantity}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.book.id })}
                          className="self-start rounded-lg p-2 transition hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                          aria-label="Xóa khỏi giỏ"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="mt-6 bg-transparent"
                onClick={() => dispatch({ type: "CLEAR_CART" })}
              >
                Xóa tất cả
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-lg border border-border bg-muted/50 p-6">
                <h2 className="mb-4 text-lg font-bold text-foreground">Tóm tắt đơn hàng</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tạm tính:</span>
                    <span className="font-medium">{subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vận chuyển:</span>
                    <span className="font-medium text-accent">Miễn phí</span>
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="text-lg font-bold text-primary">{total.toLocaleString("vi-VN")}₫</span>
                </div>

                <Link href="/checkout" className="block">
                  <Button className="mb-2 w-full bg-primary hover:bg-primary/90">Thanh toán ngay</Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="w-full bg-transparent">
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
