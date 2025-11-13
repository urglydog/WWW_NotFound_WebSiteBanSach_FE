"use client"

import { useAuth } from "@/lib/auth-context"
import { useOrder } from "@/lib/order-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Printer, Download } from "lucide-react"
import { useRouter } from "next/navigation"

const statusSteps = [
  { key: "pending", label: "Chờ xác nhận" },
  { key: "processing", label: "Đang chuẩn bị" },
  { key: "shipped", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
]

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth()
  const { getOrderById } = useOrder()
  const router = useRouter()

  const order = getOrderById(params.id)

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Đang tải...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user || !order || order.userId !== user.id) {
    router.push("/login")
    return null
  }

  const currentStepIndex = statusSteps.findIndex((step) => step.key === order.status)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/account/orders">
                <button className="p-2 hover:bg-muted rounded-lg transition">
                  <ChevronLeft size={20} />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{order.id}</h1>
                <p className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer size={18} className="mr-2" />
                In
              </Button>
              <Button variant="outline" size="sm">
                <Download size={18} className="mr-2" />
                Tải xuống
              </Button>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="font-bold text-foreground mb-6">Trạng thái đơn hàng</h2>
            <div className="flex justify-between">
              {statusSteps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition ${
                      index <= currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p
                    className={`text-xs text-center font-medium ${
                      index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  {index < statusSteps.length - 1 && (
                    <div className={`w-full h-1 mt-3 ${index < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              {/* Shipping Address */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h2 className="font-bold text-foreground mb-4">Địa chỉ giao hàng</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p className="font-semibold text-foreground">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}
                  </p>
                  <p>Điện thoại: {order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h2 className="font-bold text-foreground mb-4">Chi tiết đơn hàng</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-border last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.book.title}</p>
                        <p className="text-sm text-muted-foreground">{item.book.author}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{item.quantity}x</p>
                        <p className="text-primary font-semibold">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking */}
              {order.trackingNumber && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-bold text-foreground mb-4">Theo dõi giao hàng</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mã vận đơn:</span>
                      <span className="font-semibold text-foreground">{order.trackingNumber}</span>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dự kiến giao:</span>
                        <span className="font-semibold text-foreground">
                          {new Date(order.estimatedDelivery).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-muted/50 border border-border rounded-lg p-6 sticky top-20">
                <h2 className="font-bold text-foreground mb-4">Tóm tắt thanh toán</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính:</span>
                    <span className="font-medium">{order.subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vận chuyển:</span>
                    <span className="font-medium text-accent">Miễn phí</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex justify-between mb-6">
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="font-bold text-lg text-primary">{order.total.toLocaleString("vi-VN")}₫</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-background rounded-lg">
                    <p className="text-xs text-muted-foreground">Trạng thái thanh toán</p>
                    <p className="font-semibold text-foreground">
                      {order.paymentMethod === "cod" ? "Thanh toán khi nhận" : "Đã thanh toán"}
                    </p>
                  </div>
                  {order.status === "delivered" && (
                    <Button className="w-full bg-primary hover:bg-primary/90">Tìm sách khác</Button>
                  )}
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
