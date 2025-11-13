"use client"

import type React from "react"

import { useCart } from "@/lib/cart-context"
import { useOrder } from "@/lib/order-context"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, CreditCard } from "lucide-react"

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const { addOrder } = useOrder()
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "cod",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = state.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)
  const shipping = 0
  const total = subtotal + shipping

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Giỏ hàng trống. Quay lại để thêm sách.</p>
            <Link href="/products">
              <Button>Quay lại cửa hàng</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate order submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const order = {
      userId: user?.id || "",
      items: state.items.map((item) => ({
        book: item.book,
        quantity: item.quantity,
        price: item.book.price,
      })),
      subtotal,
      shipping,
      total,
      status: "pending" as const,
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        ward: formData.ward,
      },
      paymentMethod: formData.paymentMethod as "cod" | "card",
    }

    addOrder(order)
    dispatch({ type: "CLEAR_CART" })
    setIsSubmitting(false)

    // Redirect to order confirmation
    router.push("/account/orders")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Thanh toán</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Shipping Information */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                    <MapPin size={20} />
                    Thông tin giao hàng
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Họ và tên"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Số điện thoại"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Tỉnh/Thành phố"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Quận/Huyện"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phường/Xã"
                        value={formData.ward}
                        onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                      <textarea
                        placeholder="Địa chỉ chi tiết (Số nhà, đường phố...)"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="resize-none rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                    <CreditCard size={20} />
                    Phương thức thanh toán
                  </h2>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-semibold text-foreground">Thanh toán khi nhận hàng</p>
                        <p className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận đơn hàng</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-semibold text-foreground">Thẻ tín dụng / Chuyển khoản</p>
                        <p className="text-sm text-muted-foreground">Thanh toán an toàn qua cổng thanh toán</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/cart" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      Quay lại giỏ hàng
                    </Button>
                  </Link>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-lg border border-border bg-muted/50 p-6">
                <h2 className="mb-4 text-lg font-bold text-foreground">Đơn hàng của bạn</h2>

                <div className="mb-4 max-h-80 space-y-3 overflow-y-auto pr-1">
                  {state.items.map((item) => (
                    <div key={item.book.id} className="flex items-start justify-between gap-4 text-sm">
                      <span className="flex-1 text-muted-foreground">
                        {item.book.title} x {item.quantity}
                      </span>
                      <span className="whitespace-nowrap font-medium">
                        {(item.book.price * item.quantity).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mb-4 space-y-3 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tạm tính:</span>
                    <span className="font-medium">{subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vận chuyển:</span>
                    <span className="font-medium text-accent">Miễn phí</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="font-bold text-lg text-primary">{total.toLocaleString("vi-VN")}₫</span>
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
